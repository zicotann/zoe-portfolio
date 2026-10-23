"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { CaseStudySheet } from "@/components/case-study-sheet";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { getCategoryName } from "@/content/helpers";
import type { Campaign, SiteContent } from "@/content/schema";
import { cn } from "@/lib/utils";

const spans = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2", ""];

function formatMetric(value: number, prefix?: string, suffix?: string) {
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

interface CampaignCardProps {
  campaign: Campaign;
  categoryName: string;
  featuredLabel: string;
  viewLabel: string;
  big: boolean;
  onOpen: (campaign: Campaign) => void;
}

function CampaignCard({
  campaign,
  categoryName,
  featuredLabel,
  viewLabel,
  big,
  onOpen,
}: CampaignCardProps) {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--mx",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${event.clientY - rect.top}px`,
    );
  };

  return (
    <BentoCard
      className="h-full justify-end border-border hover:-translate-y-1 hover:shadow-xl"
      onMouseMove={handleMouseMove}
    >
      <Image
        src={campaign.coverImage}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/45 to-foreground/5" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx) var(--my), hsl(var(--brand-violet) / 0.45), transparent 62%)",
        }}
      />

      <button
        type="button"
        onClick={() => onOpen(campaign)}
        className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`${viewLabel} — ${campaign.clientName}`}
      />

      <div className="relative z-10 mt-auto flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-transparent bg-white/15 text-white backdrop-blur-sm">
            {categoryName}
          </Badge>
          {campaign.featured ? <Badge>{featuredLabel}</Badge> : null}
        </div>

        <div className="space-y-2">
          <h3
            className={cn(
              "font-semibold tracking-tight text-white",
              big ? "text-3xl sm:text-4xl" : "text-2xl",
            )}
          >
            {campaign.clientName}
          </h3>
          <p
            className={cn(
              "text-pretty text-sm leading-relaxed text-white/75",
              big ? "line-clamp-3" : "line-clamp-2",
            )}
          >
            {campaign.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
          {campaign.keyMetrics.slice(0, big ? 3 : 2).map((metric) => (
            <div key={metric.id}>
              <p className="font-display text-xl font-semibold tracking-tight text-brand-amber">
                {formatMetric(metric.value, metric.prefix, metric.suffix)}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-white/60">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          {viewLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </BentoCard>
  );
}

export function CampaignGrid({ content }: { content: SiteContent }) {
  const { categories } = content;
  const campaignsContent = content.sections.campaigns;
  const campaigns = campaignsContent.campaigns;

  const [active, setActive] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (filter !== "all" && !categories.some((category) => category.id === filter)) {
      setFilter("all");
    }
  }, [categories, filter]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? campaigns
        : campaigns.filter((campaign) => campaign.categoryId === filter),
    [campaigns, filter],
  );

  const handleOpen = (campaign: Campaign) => {
    setActive(campaign);
    setOpen(true);
  };

  return (
    <section id="work" className="py-16 sm:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {campaignsContent.eyebrow}
            </p>
            <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              {campaignsContent.headingLead}{" "}
              <span className="text-gradient animate-gradient-x">
                {campaignsContent.headingAccent}
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {campaignsContent.description}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
              filter === "all"
                ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
            )}
          >
            {campaignsContent.allLabel}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              aria-pressed={filter === category.id}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
                filter === category.id
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <BentoGrid key={filter}>
          {filtered.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn("h-full", spans[index % spans.length])}
            >
              <CampaignCard
                campaign={campaign}
                categoryName={getCategoryName(categories, campaign.categoryId)}
                featuredLabel={campaignsContent.featuredLabel}
                viewLabel={campaignsContent.viewLabel}
                big={index === 0}
                onOpen={handleOpen}
              />
            </motion.div>
          ))}
        </BentoGrid>
      </div>

      <CaseStudySheet
        campaign={active}
        categories={categories}
        copy={campaignsContent.caseStudy}
        open={open}
        onOpenChange={setOpen}
      />
    </section>
  );
}
