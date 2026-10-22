"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VideoSample } from "@/content/schema";
import { cn } from "@/lib/utils";

const aspectClass: Record<VideoSample["aspectRatio"], string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

function getInstagramEmbedUrl(postUrl: string): string | null {
  try {
    const url = new URL(postUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname !== "instagram.com") return null;

    const match = url.pathname.match(
      /^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/,
    );
    if (!match) return null;

    const kind = match[1] === "reels" ? "reel" : match[1];
    return `https://www.instagram.com/${kind}/${match[2]}/embed/`;
  } catch {
    return null;
  }
}

function getLinkedInEmbedUrl(postUrl: string): string | null {
  const activity = postUrl.match(/activity[-:](\d+)/);
  if (activity) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activity[1]}`;
  }

  const urn = postUrl.match(/urn:li:(activity|ugcPost|share):(\d+)/);
  if (!urn) return null;
  return `https://www.linkedin.com/embed/feed/update/urn:li:${urn[1]}:${urn[2]}`;
}

export function getVideoEmbedUrl(video: VideoSample): string | null {
  if (!video.postUrl) return null;
  if (video.source === "instagram") return getInstagramEmbedUrl(video.postUrl);
  if (video.source === "linkedin") return getLinkedInEmbedUrl(video.postUrl);
  return null;
}

export function VideoSamplePlayer({
  video,
  sizes,
  className,
}: {
  video: VideoSample;
  sizes: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const embedUrl = getVideoEmbedUrl(video);
  const canPlay = Boolean(embedUrl);

  return (
    <>
      <button
        type="button"
        disabled={!canPlay}
        onClick={() => setOpen(true)}
        aria-label={canPlay ? `Play ${video.title}` : video.title}
        title={canPlay ? undefined : "Playback coming soon"}
        className={cn(
          "group relative block w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          canPlay
            ? "cursor-pointer hover:shadow-lg"
            : "cursor-default disabled:opacity-100",
          aspectClass[video.aspectRatio],
          className,
        )}
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-80" />

        {canPlay ? (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-lg">
              <Play className="h-5 w-5 translate-x-px fill-current" />
            </span>
          </span>
        ) : (
          <span className="absolute bottom-2 left-2 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
            Playback soon
          </span>
        )}
      </button>

      {embedUrl ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[380px] gap-0 overflow-hidden p-0 sm:max-w-[420px]">
            <div className="border-b border-border bg-card px-4 py-3 pr-12">
              <DialogTitle className="truncate text-sm font-semibold">
                {video.title}
              </DialogTitle>
            </div>
            <div className="h-[78vh] max-h-[720px] w-full bg-black">
              <iframe
                src={embedUrl}
                title={video.title}
                className="h-full w-full"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
