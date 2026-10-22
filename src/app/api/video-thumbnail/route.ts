import { NextResponse, type NextRequest } from "next/server";

import {
  getInstagramPostParts,
  getLinkedInActivityUrn,
} from "@/lib/video-embed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

async function proxyImage(imageUrl: string) {
  const response = await fetch(imageUrl, {
    headers: BROWSER_HEADERS,
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
    },
  });
}

function getLinkedInThumbnail(html: string): string | null {
  const match =
    html.match(
      /https:\/\/media\.licdn\.com\/[^"'\\\s]*feedshare-thumbnail[^"'\\\s]*/,
    ) ??
    html.match(
      /https:\/\/media\.licdn\.com\/[^"'\\\s]*videocover[^"'\\\s]*/,
    );
  if (!match) return null;

  return match[0].replaceAll("&amp;", "&");
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const postUrl = request.nextUrl.searchParams.get("url");
  if (!postUrl) {
    return new NextResponse(null, { status: 400 });
  }

  if (source === "instagram") {
    const parts = getInstagramPostParts(postUrl);
    if (!parts) return new NextResponse(null, { status: 400 });
    return proxyImage(
      `https://www.instagram.com/p/${parts.shortcode}/media/?size=l`,
    );
  }

  if (source === "linkedin") {
    const urn = getLinkedInActivityUrn(postUrl);
    if (!urn) return new NextResponse(null, { status: 400 });

    const response = await fetch(
      `https://www.linkedin.com/embed/feed/update/${urn}`,
      {
        headers: BROWSER_HEADERS,
        next: { revalidate: 86400 },
      },
    );
    if (!response.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const thumbnail = getLinkedInThumbnail(await response.text());
    if (!thumbnail) {
      return new NextResponse(null, { status: 404 });
    }

    const thumbnailUrl = new URL(thumbnail);
    if (thumbnailUrl.hostname !== "media.licdn.com") {
      return new NextResponse(null, { status: 404 });
    }

    return proxyImage(thumbnailUrl.toString());
  }

  return new NextResponse(null, { status: 400 });
}
