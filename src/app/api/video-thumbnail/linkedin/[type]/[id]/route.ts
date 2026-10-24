import { NextResponse } from "next/server";

import { getLinkedInThumbnailUrl, proxyImage } from "@/lib/thumbnail-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const URN_TYPES = new Set(["activity", "ugcPost", "share"]);
const ACTIVITY_ID_PATTERN = /^\d+$/;

export async function GET(
  _request: Request,
  { params }: { params: { type: string; id: string } },
) {
  if (!URN_TYPES.has(params.type) || !ACTIVITY_ID_PATTERN.test(params.id)) {
    return new NextResponse(null, { status: 404 });
  }

  const thumbnailUrl = await getLinkedInThumbnailUrl(
    `urn:li:${params.type}:${params.id}`,
  );
  if (!thumbnailUrl) {
    return new NextResponse(null, { status: 404 });
  }

  return proxyImage(thumbnailUrl);
}
