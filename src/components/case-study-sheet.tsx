"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, Play, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { getCategoryName } from "@/content/helpers";
import type {
  Campaign,
  CampaignCategory,
  CaseStudyCopy,
  VideoSample,
} from "@/content/schema";
import { cn } from "@/lib/utils";

interface CaseStudySheetProps {
  campaign: Campaign | null;
  categories: CampaignCategory[];
  copy: CaseStudyCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const aspectClass: Record<VideoSample["aspectRatio"], string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
  "1:1": "aspect-square",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      {children}
    </p>
  );
}

export function CaseStudySheet({
  campaign,
  categories,
  copy,
  open,
  onOpenChange,
}: CaseStudySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl md:max-w-2xl"
      >
        {campaign ? (
          <>
            <div className="relative h-56 w-full shrink-0 sm:h-72">
              <Image
                src={campaign.heroImage}
                alt={`${campaign.clientName} campaign`}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            <SheetHeader className="space-y-4 px-6 pb-2 pt-0 text-left sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                  {campaign.clientLogo}
                </span>
                <Badge variant="secondary">
                  {getCategoryName(categories, campaign.categoryId)}
                </Badge>
                <Badge variant="outline">{campaign.role}</Badge>
              </div>

              <SheetTitle className="text-3xl leading-tight tracking-tight sm:text-4xl">
                {campaign.clientName}
              </SheetTitle>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {campaign.period}
              </p>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {campaign.summary}
              </p>
            </SheetHeader>

            <div className="space-y-10 px-6 pb-10 pt-6 sm:px-8">
              <section>
                <Eyebrow>{copy.keyAchievementsLabel}</Eyebrow>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {campaign.keyMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="rounded-xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="font-display text-2xl font-semibold tracking-tight">
                        <NumberTicker
                          value={metric.value}
                          prefix={metric.prefix}
                          suffix={metric.suffix}
                          decimalPlaces={metric.decimals ?? 0}
                        />
                      </div>
                      <p className="mt-1 text-xs leading-tight text-muted-foreground">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <Eyebrow>{copy.strategyLabel}</Eyebrow>
                {[
                  {
                    heading: copy.challengeHeading,
                    body: campaign.fullStrategyBreakdown.theChallenge,
                  },
                  {
                    heading: copy.strategyHeading,
                    body: campaign.fullStrategyBreakdown.theStrategy,
                  },
                  {
                    heading: copy.resultsHeading,
                    body: campaign.fullStrategyBreakdown.theResults,
                  },
                ].map((block) => (
                  <div
                    key={block.heading}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <h4 className="text-lg font-semibold">{block.heading}</h4>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {block.body}
                    </p>
                  </div>
                ))}
              </section>

              {campaign.videoSamples?.length ? (
                <section>
                  <Eyebrow>{copy.videoShowcaseHeading}</Eyebrow>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {campaign.videoSamples.map((video) => (
                      <div key={video.id} className="space-y-2">
                        <div
                          className={cn(
                            "group relative overflow-hidden rounded-xl border border-border bg-secondary",
                            aspectClass[video.aspectRatio],
                          )}
                        >
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 768px) 40vw, 200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-foreground/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary">
                              <Play className="h-4 w-4 translate-x-px fill-current" />
                            </span>
                          </div>
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {video.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {campaign.imageSamples?.length ? (
                <section>
                  <Eyebrow>{copy.contentSamplesHeading}</Eyebrow>
                  <div className="grid grid-cols-2 gap-3">
                    {campaign.imageSamples.map((image) => (
                      <figure key={image.id} className="space-y-2">
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-border">
                          <Image
                            src={image.imageUrl}
                            alt={image.caption}
                            fill
                            sizes="(max-width: 768px) 40vw, 240px"
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

              <section>
                <Eyebrow>{copy.deliverablesLabel}</Eyebrow>
                <ul className="flex flex-wrap gap-2">
                  {campaign.deliverables.map((item, index) => (
                    <li key={`${campaign.id}-deliverable-${index}`}>
                      <Badge variant="secondary" className="py-1">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {item}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="sticky bottom-0 -mx-6 border-t border-border bg-background/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full"
                  size="lg"
                >
                  {copy.closeLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
