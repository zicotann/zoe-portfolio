import { NextResponse } from "next/server";

import { proxyImage } from "@/lib/thumbnail-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHORTCODE_PATTERN = /^[A-Za-z0-9_-]+$/;

export async function GET(
  _request: Request,
  { params }: { params: { shortcode: string } },
) {
  if (!SHORTCODE_PATTERN.test(params.shortcode)) {
    return new NextResponse(null, { status: 404 });
  }

  return proxyImage(
    `https://www.instagram.com/p/${params.shortcode}/media/?size=l`,
  );
}
