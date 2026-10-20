import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { campaigns, getCampaignBySlug, type VideoSample } from "@/data/campaigns";

const aspectClass: Record<VideoSample["aspectRatio"], string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const campaign = getCampaignBySlug(params.slug);

  if (!campaign) {
    return { title: "Case study not found" };
  }

  return {
    title: `${campaign.clientName} — Case Study`,
    description: campaign.summary,
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = getCampaignBySlug(params.slug);

  if (!campaign) {
    notFound();
  }

  const blocks = [
    { heading: "The Challenge", body: campaign.fullStrategyBreakdown.theChallenge },
    { heading: "The Strategy", body: campaign.fullStrategyBreakdown.theStrategy },
    { heading: "The Results", body: campaign.fullStrategyBreakdown.theResults },
  ];

  return (
    <article className="pb-24">
      <div className="relative h-[45vh] min-h-72 w-full">
        <Image
          src={campaign.heroImage}
          alt={`${campaign.clientName} campaign`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container -mt-24 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/#work">
            <ArrowLeft className="h-4 w-4" />
            Back to work
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
            {campaign.clientLogo}
          </span>
          <Badge variant="secondary">{campaign.industry}</Badge>
          <Badge variant="outline">{campaign.role}</Badge>
          <span className="text-sm text-muted-foreground">
            {campaign.period}
          </span>
        </div>

        <h1 className="mt-4 text-balance text-5xl leading-[1.02] tracking-tight sm:text-6xl">
          {campaign.clientName}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {campaign.summary}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {campaign.keyMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                <NumberTicker
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  decimalPlaces={metric.decimals ?? 0}
                />
              </div>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          {blocks.map((block) => (
            <section
              key={block.heading}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{block.heading}</h2>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </section>
          ))}
        </div>

        {campaign.videoSamples?.length ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Video showcase
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {campaign.videoSamples.map((video) => (
                <div key={video.title} className="space-y-2">
                  <div
                    className={`group relative overflow-hidden rounded-2xl border border-border bg-secondary ${aspectClass[video.aspectRatio]}`}
                  >
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/25 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary">
                        <Play className="h-4 w-4 translate-x-px fill-current" />
                      </span>
                    </div>
                  </div>
                  <p className="text-xs leading-snug text-muted-foreground">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {campaign.imageSamples?.length ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              Content samples
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {campaign.imageSamples.map((image) => (
                <figure key={image.caption} className="space-y-2">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                    <Image
                      src={image.imageUrl}
                      alt={image.caption}
                      fill
                      sizes="(max-width: 768px) 45vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-xs text-muted-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3">
          {campaign.deliverables.map((item) => (
            <Badge key={item} variant="muted" className="py-1">
              {item}
            </Badge>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">
            Want results like this for your brand?
          </p>
          <Button asChild className="mt-4">
            <Link href="/#contact">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
