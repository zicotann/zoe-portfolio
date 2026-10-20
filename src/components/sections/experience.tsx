import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/magicui/reveal";
import { profile } from "@/data/profile";

const dotColors = [
  "bg-brand-violet",
  "bg-brand-coral",
  "bg-brand-amber",
];

export function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Résumé &amp; experience
            </p>
            <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl">
              Eight years turning content into growth.
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              From in-house skincare launches to full agency rosters — strategy,
              production, and community under one roof.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {profile.services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold">{service.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <a href={profile.resumeUrl} download>
                <Download className="h-4 w-4" />
                Download PDF résumé
              </a>
            </Button>
          </Reveal>

          <ol className="relative space-y-8 border-l-2 border-dashed border-border pl-6">
            {profile.experience.map((job, index) => (
              <li key={`${job.company}-${job.period}`} className="relative">
                <span
                  className={`absolute -left-[31px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background ${dotColors[index % dotColors.length]}`}
                />
                <Reveal delay={index * 0.05}>
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{job.role}</h3>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm">
                      <span className="font-medium">{job.company}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {job.period} · {job.location}
                      </span>
                    </p>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {job.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {job.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                        >
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
