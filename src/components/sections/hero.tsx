import Image from "next/image";
import { ArrowDownRight, MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandIcon } from "@/components/brand-icons";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import type { AvailabilityColor, SiteContent } from "@/content/schema";
import { cn } from "@/lib/utils";

const availabilityStyles: Record<
  AvailabilityColor,
  { badge: string; dot: string }
> = {
  green: {
    badge: "bg-emerald-500/15 text-emerald-600",
    dot: "bg-emerald-500",
  },
  yellow: {
    badge: "bg-amber-400/20 text-amber-600",
    dot: "bg-amber-400",
  },
  red: {
    badge: "bg-red-500/15 text-red-600",
    dot: "bg-red-500",
  },
};

export function Hero({ content }: { content: SiteContent }) {
  const { profile, socials, sections } = content;
  const hero = sections.hero;
  const availability = profile.availability.trim();
  const availabilityStyle = availabilityStyles[profile.availabilityColor];

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-28 -top-32 h-[26rem] w-[26rem] animate-blob rounded-full bg-brand-violet/25 blur-3xl" />
        <div className="absolute -right-16 top-16 h-80 w-80 animate-blob rounded-full bg-brand-coral/25 blur-3xl [animation-delay:3s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-brand-amber/20 blur-3xl [animation-delay:6s]" />
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <div className="container relative">
        <div className="grid items-center lg:grid-cols-[1.35fr_0.65fr]">
          <div className="animate-fade-up space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              {availability ? (
                <Badge
                  className={cn(
                    "gap-2 border-transparent py-1.5",
                    availabilityStyle.badge,
                  )}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                        availabilityStyle.dot,
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        availabilityStyle.dot,
                      )}
                    />
                  </span>
                  {availability}
                </Badge>
              ) : null}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location} · {profile.timezone}
              </span>
            </div>

            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {profile.role}
              </p>
              <h1 className="max-w-3xl text-balance text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                {profile.headlineLead}{" "}
                <span className="text-gradient animate-gradient-x">
                  &amp; {profile.headlineAccent}
                </span>
              </h1>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {profile.subheadline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ShimmerButton
                href={hero.primaryCtaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hero.primaryCtaLabel}
                <ArrowDownRight className="h-4 w-4" />
              </ShimmerButton>
              <Button asChild variant="outline" size="lg">
                <a href={hero.secondaryCtaHref}>{hero.secondaryCtaLabel}</a>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {hero.followLabel}
              </span>
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} — ${social.handle}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
                  >
                    <BrandIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-10 lg:mt-0 lg:mr-auto w-60 sm:w-64 lg:w-80">
            <div className="rounded-t-full rounded-b-[2rem] bg-gradient-to-br from-brand-violet via-brand-coral to-brand-amber p-[3px] shadow-xl transition-transform duration-500 hover:-rotate-2">
              <div className="overflow-hidden rounded-t-full rounded-b-[2rem] border-2 border-background">
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={profile.portraitImage}
                    alt={hero.portraitAlt}
                    fill
                    priority
                    sizes="(max-width: 640px) 13rem, (max-width: 1024px) 15rem, 16rem"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-8 w-40 animate-float rounded-2xl border border-border bg-card p-3 shadow-lg">
              <p className="font-display text-2xl font-semibold tracking-tight text-primary">
                {hero.floatingStatValue}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {hero.floatingStatLabel}
              </p>
            </div>

            <div className="absolute -right-4 -top-3 rotate-6 rounded-full bg-brand-amber/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-amber shadow-sm">
              {hero.floatingBadge}
            </div>

            <div
              aria-hidden
              className="absolute -bottom-10 -right-8 -z-10 h-28 w-28 rounded-full border-2 border-dashed border-brand-coral/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
