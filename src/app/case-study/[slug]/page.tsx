import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { VideoSamplePlayer } from "@/components/video-sample-player";
import { getCampaignBySlug, getCategoryName } from "@/content/helpers";
import { siteContent } from "@/content/site";

const campaigns = siteContent.sections.campaigns.campaigns;
const copy = siteContent.sections.campaigns.caseStudy;

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const campaign = getCampaignBySlug(campaigns, params.slug);

  if (!campaign) {
    return { title: "Case study not found" };
  }

  return {
    title: `${campaign.clientName} — ${copy.pageTitleSuffix}`,
    description: campaign.summary,
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = getCampaignBySlug(campaigns, params.slug);

  if (!campaign) {
    notFound();
  }

  const blocks = [
    { heading: copy.challengeHeading, body: campaign.fullStrategyBreakdown.theChallenge },
    { heading: copy.strategyHeading, body: campaign.fullStrategyBreakdown.theStrategy },
    { heading: copy.resultsHeading, body: campaign.fullStrategyBreakdown.theResults },
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
            {copy.backLabel}
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
            {campaign.clientLogo}
          </span>
          <Badge variant="secondary">
            {getCategoryName(siteContent.categories, campaign.categoryId)}
          </Badge>
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
              key={metric.id}
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
            {/* TODO: Add playback for hosted video URLs. */}
            <h2 className="mb-4 text-xl font-semibold tracking-tight">
              {copy.videoShowcaseHeading}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {campaign.videoSamples.map((video) => (
                <div key={video.id} className="space-y-2">
                  <VideoSamplePlayer
                    video={video}
                    sizes="(max-width: 768px) 45vw, 380px"
                  />
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
              {copy.contentSamplesHeading}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {campaign.imageSamples.map((image) => (
                <figure key={image.id} className="space-y-2">
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
          {campaign.deliverables.map((item, index) => (
            <Badge
              key={`${campaign.id}-deliverable-${index}`}
              variant="muted"
              className="py-1"
            >
              {item}
            </Badge>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">{copy.ctaHeading}</p>
          <Button asChild className="mt-4">
            <Link href="/#contact">
              {copy.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
