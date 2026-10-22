import type { VideoSource } from "@/content/schema";

export function getInstagramPostParts(
  postUrl: string,
): { kind: string; shortcode: string } | null {
  try {
    const url = new URL(postUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname !== "instagram.com") return null;

    const match = url.pathname.match(
      /^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/,
    );
    if (!match) return null;

    return {
      kind: match[1] === "reels" ? "reel" : match[1],
      shortcode: match[2],
    };
  } catch {
    return null;
  }
}

export function getLinkedInActivityUrn(postUrl: string): string | null {
  try {
    const url = new URL(postUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname !== "linkedin.com") return null;
  } catch {
    return null;
  }

  const activity = postUrl.match(/activity[-:](\d+)/);
  if (activity) return `urn:li:activity:${activity[1]}`;

  const urn = postUrl.match(/urn:li:(activity|ugcPost|share):(\d+)/);
  if (!urn) return null;
  return `urn:li:${urn[1]}:${urn[2]}`;
}

export function getInstagramEmbedUrl(postUrl: string): string | null {
  const parts = getInstagramPostParts(postUrl);
  if (!parts) return null;
  return `https://www.instagram.com/${parts.kind}/${parts.shortcode}/embed/`;
}

export function getLinkedInEmbedUrl(postUrl: string): string | null {
  const urn = getLinkedInActivityUrn(postUrl);
  if (!urn) return null;
  return `https://www.linkedin.com/embed/feed/update/${urn}`;
}

export function getVideoEmbedUrl(video: {
  source: VideoSource;
  postUrl?: string;
}): string | null {
  if (!video.postUrl) return null;
  if (video.source === "instagram") return getInstagramEmbedUrl(video.postUrl);
  if (video.source === "linkedin") return getLinkedInEmbedUrl(video.postUrl);
  return null;
}

export function getVideoThumbnailUrl(video: {
  source: VideoSource;
  postUrl?: string;
}): string | null {
  if (!video.postUrl) return null;
  if (video.source !== "instagram" && video.source !== "linkedin") return null;

  const params = new URLSearchParams({
    source: video.source,
    url: video.postUrl,
  });
  return `/api/video-thumbnail?${params.toString()}`;
}
