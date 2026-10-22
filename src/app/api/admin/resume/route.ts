import { NextResponse } from "next/server";

import { isSameOrigin, requireAdminApi } from "@/lib/admin-auth";
import {
  deletePdfAsset,
  isManageableResumePath,
  listPdfAssets,
  savePdfAsset,
} from "@/lib/resume-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PDF_BYTES = 5 * 1024 * 1024;

export async function GET() {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const files = await listPdfAssets();
    return NextResponse.json(
      { files },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not list the PDFs in the codebase.",
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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload a PDF file using multipart form data." },
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
  const isPdf =
    upload.type === "application/pdf" ||
    upload.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return NextResponse.json(
      { error: "Choose a PDF file." },
      { status: 415 },
    );
  }

  if (upload.size === 0) {
    return NextResponse.json(
      { error: "The PDF file is empty." },
      { status: 400 },
    );
  }

  if (upload.size > MAX_PDF_BYTES) {
    return NextResponse.json(
      { error: "PDFs must be 5 MB or smaller." },
      { status: 413 },
    );
  }

  try {
    const data = Buffer.from(await upload.arrayBuffer());
    const asset = await savePdfAsset(data, upload.name);
    return NextResponse.json(
      { asset },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not upload the PDF.",
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

  const publicPath = (body as { path?: unknown }).path;
  if (typeof publicPath !== "string" || !isManageableResumePath(publicPath)) {
    return NextResponse.json(
      { error: "Choose a resume PDF stored in /resumes." },
      { status: 400 },
    );
  }

  try {
    await deletePdfAsset(publicPath);
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete the PDF.",
      },
      { status: 500 },
    );
  }
}
