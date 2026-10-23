import { NextResponse } from "next/server";

import { isSameOrigin, requireAdminApi } from "@/lib/admin-auth";
import {
  deleteR2Image,
  isR2Configured,
  listR2Images,
  uploadR2Image,
} from "@/lib/r2-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function GET() {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  if (!isR2Configured()) {
    return NextResponse.json(
      { files: [], configured: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const files = await listR2Images();
    return NextResponse.json(
      { files, configured: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not list the images in Cloudflare R2.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          "Cloudflare R2 is not configured. Add the R2 environment variables before uploading images.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload an image file using multipart form data." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (
    !file ||
    typeof file === "string" ||
    typeof (file as File).arrayBuffer !== "function"
  ) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  const upload = file as File;
  const contentType = upload.type || "";

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Choose a JPG, PNG, WebP, AVIF, or GIF image." },
      { status: 415 },
    );
  }

  if (upload.size === 0) {
    return NextResponse.json(
      { error: "The image file is empty." },
      { status: 400 },
    );
  }

  if (upload.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Images must be 10 MB or smaller." },
      { status: 413 },
    );
  }

  try {
    const data = Buffer.from(await upload.arrayBuffer());
    const asset = await uploadR2Image(data, upload.name, contentType);
    return NextResponse.json(
      { asset },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not upload the image.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = (body as { url?: unknown }).url;
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json(
      { error: "Choose an image stored in Cloudflare R2." },
      { status: 400 },
    );
  }

  try {
    const deleted = await deleteR2Image(url.trim());
    return NextResponse.json(
      { ok: true, deleted },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete the image.",
      },
      { status: 500 },
    );
  }
}
