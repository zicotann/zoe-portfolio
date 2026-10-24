import { NextResponse } from "next/server";

const CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function proxyImage(imageUrl: string) {
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

function extractLinkedInThumbnail(html: string): string | null {
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

export async function getLinkedInThumbnailUrl(
  urn: string,
): Promise<string | null> {
  const response = await fetch(
    `https://www.linkedin.com/embed/feed/update/${urn}`,
    {
      headers: BROWSER_HEADERS,
      next: { revalidate: 86400 },
    },
  );
  if (!response.ok) return null;

  const thumbnail = extractLinkedInThumbnail(await response.text());
  if (!thumbnail) return null;

  const thumbnailUrl = new URL(thumbnail);
  if (thumbnailUrl.hostname !== "media.licdn.com") return null;

  return thumbnailUrl.toString();
}
