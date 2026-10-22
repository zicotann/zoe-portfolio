"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";

import { BrandIcon } from "@/components/brand-icons";
import type { ImageAspectRatio, ImageSample } from "@/content/schema";
import {
  getInstagramEmbedUrl,
  getLinkedInEmbedUrl,
  getSocialThumbnailUrl,
} from "@/lib/video-embed";
import { cn } from "@/lib/utils";

const aspectClasses: Record<ImageAspectRatio, string> = {
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
};

const SOCIAL_EMBED_MEDIA_QUERY = "(min-width: 380px)";

function HostedImage({ image, sizes }: { image: ImageSample; sizes: string }) {
  const [failed, setFailed] = useState(false);

  if (!image.imageUrl || failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
        <ImageOff className="h-5 w-5" aria-hidden />
        <p className="text-[11px] leading-relaxed">Image unavailable</p>
      </div>
    );
  }

  return (
    <Image
      src={image.imageUrl}
      alt={image.caption}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function SocialPostPreview({
  image,
  sizes,
}: {
  image: ImageSample;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const source =
    image.source === "instagram" || image.source === "linkedin"
      ? image.source
      : null;
  const thumbnail = source
    ? getSocialThumbnailUrl(source, image.postUrl)
    : null;

  const content =
    thumbnail && !failed ? (
      <Image
        src={thumbnail}
        alt={image.caption}
        fill
        sizes={sizes}
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/25 via-secondary to-brand-amber/20 p-4 text-center">
        {source ? <BrandIcon platform={source} className="h-5 w-5" /> : null}
        <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
          {image.postUrl ? "Open the original post" : "Post URL unavailable"}
        </p>
      </div>
    );

  const badge =
    source === "instagram"
      ? "Instagram"
      : source === "linkedin"
        ? "LinkedIn"
        : "Post";

  if (!image.postUrl) {
    return <div className="relative h-full">{content}</div>;
  }

  return (
    <a
      href={image.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {content}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent opacity-80" />
      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
        {source ? <BrandIcon platform={source} className="h-3 w-3" /> : null}
        {badge}
      </span>
      <span className="absolute bottom-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

function SocialEmbed({ image, sizes }: { image: ImageSample; sizes: string }) {
  const [canEmbed, setCanEmbed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SOCIAL_EMBED_MEDIA_QUERY);
    const update = () => setCanEmbed(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const embedUrl =
    image.source === "instagram"
      ? getInstagramEmbedUrl(image.postUrl ?? "")
      : image.source === "linkedin"
        ? getLinkedInEmbedUrl(image.postUrl ?? "")
        : null;

  if (!embedUrl) {
    return <SocialPostPreview image={image} sizes={sizes} />;
  }

  if (!canEmbed) {
    return <SocialPostPreview image={image} sizes={sizes} />;
  }

  return (
    <iframe
      src={embedUrl}
      title={image.caption || `${image.source} post`}
      loading="lazy"
      allow="encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      scrolling="no"
      className="h-full w-full border-0"
    />
  );
}

export function ImageSampleCard({
  image,
  sizes,
  className,
}: {
  image: ImageSample;
  sizes: string;
  className?: string;
}) {
  const isSocial = image.source === "instagram" || image.source === "linkedin";

  return (
    <figure
      className={cn(
        "space-y-2",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border border-border bg-secondary w-full",
          isSocial
            ? "aspect-[4/5] min-h-[480px]"
            : aspectClasses[image.aspectRatio ?? "1:1"],
          className ?? "rounded-xl",
        )}
      >
        {isSocial ? (
          <SocialEmbed image={image} sizes={sizes} />
        ) : (
          <HostedImage image={image} sizes={sizes} />
        )}
      </div>
      {image.caption ? (
        <figcaption className="text-xs text-muted-foreground">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
