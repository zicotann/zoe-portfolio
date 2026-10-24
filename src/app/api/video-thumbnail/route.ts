import { NextResponse, type NextRequest } from "next/server";

import {
  getInstagramPostParts,
  getLinkedInActivityUrn,
} from "@/lib/video-embed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const postUrl = request.nextUrl.searchParams.get("url");
  if (!postUrl) {
    return new NextResponse(null, { status: 400, headers: NO_STORE });
  }

  if (source === "instagram") {
    const parts = getInstagramPostParts(postUrl);
    if (!parts) {
      return new NextResponse(null, { status: 400, headers: NO_STORE });
    }

    const url = request.nextUrl.clone();
    url.pathname = `/api/video-thumbnail/instagram/${parts.shortcode}`;
    url.search = "";
    return NextResponse.redirect(url, { status: 308, headers: NO_STORE });
  }

  if (source === "linkedin") {
    const urn = getLinkedInActivityUrn(postUrl);
    if (!urn) {
      return new NextResponse(null, { status: 400, headers: NO_STORE });
    }

    const [, , type, id] = urn.split(":");
    const url = request.nextUrl.clone();
    url.pathname = `/api/video-thumbnail/linkedin/${type}/${id}`;
    url.search = "";
    return NextResponse.redirect(url, { status: 308, headers: NO_STORE });
  }

  return new NextResponse(null, { status: 400, headers: NO_STORE });
}
