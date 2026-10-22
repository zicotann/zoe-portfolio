"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VideoSample } from "@/content/schema";
import { getVideoEmbedUrl, getVideoThumbnailUrl } from "@/lib/video-embed";
import { cn } from "@/lib/utils";

const aspectClass: Record<VideoSample["aspectRatio"], string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

function VideoStill({
  video,
  sizes,
}: {
  video: VideoSample;
  sizes: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailUrl = getVideoThumbnailUrl(video);
  const hostedVideoUrl = video.source === "url" ? video.videoUrl : undefined;

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const seekToFrame = () => {
      if (!Number.isFinite(element.duration)) return;
      element.currentTime = Math.min(
        3,
        Math.max(0.5, element.duration * 0.1),
      );
    };

    if (element.readyState >= 1 && element.currentTime === 0) {
      seekToFrame();
      return;
    }

    element.addEventListener("loadedmetadata", seekToFrame);
    return () => element.removeEventListener("loadedmetadata", seekToFrame);
  }, [hostedVideoUrl]);

  if (thumbnailUrl && !imageFailed) {
    return (
      <Image
        src={thumbnailUrl}
        alt=""
        fill
        sizes={sizes}
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (hostedVideoUrl && !videoFailed) {
    return (
      <video
        ref={videoRef}
        src={hostedVideoUrl}
        muted
        playsInline
        preload="metadata"
        aria-hidden
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setVideoFailed(true)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary to-brand-amber/30"
    />
  );
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
        <VideoStill video={video} sizes={sizes} />
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
