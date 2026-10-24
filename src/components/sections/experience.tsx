import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/magicui/reveal";
import type { SiteContent } from "@/content/schema";
import { previewAnchor, previewFields } from "@/lib/preview-fields";

const dotColors = ["bg-brand-violet", "bg-brand-coral", "bg-brand-amber"];

export function Experience({ content }: { content: SiteContent }) {
  const { profile, sections } = content;
  const experience = sections.experience;

  return (
    <section id="experience" className="py-16 sm:py-24">
      <div
        {...previewFields("sections.experience.visible")}
        className="container"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <p
              {...previewFields("sections.experience.eyebrow")}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-primary"
            >
              {experience.eyebrow}
            </p>
            <h2
              {...previewFields("sections.experience.heading")}
              className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl"
            >
              {experience.heading}
            </h2>
            <p
              {...previewFields("sections.experience.description")}
              className="text-pretty text-sm leading-relaxed text-muted-foreground"
            >
              {experience.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {experience.services.map((service) => (
                <div
                  key={service.id}
                  {...previewAnchor(`service.${service.id}`)}
                  {...previewFields(
                    `sections.experience.services.${service.id}.icon`,
                  )}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <h3
                    {...previewFields(
                      `sections.experience.services.${service.id}.title`,
                    )}
                    className="text-base font-semibold"
                  >
                    {service.title}
                  </h3>
                  <p
                    {...previewFields(
                      `sections.experience.services.${service.id}.description`,
                    )}
                    className="mt-1 text-xs leading-relaxed text-muted-foreground"
                  >
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            {profile.resumeUrl ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <a
                  {...previewFields("sections.experience.resumeLabel")}
                  href={profile.resumeUrl}
                  download
                >
                  <Download className="h-4 w-4" />
                  {experience.resumeLabel}
                </a>
              </Button>
            ) : null}
          </Reveal>

          <ol className="relative space-y-8 border-l-2 border-dashed border-border pl-6">
            {experience.experience.map((job, index) => (
              <li key={job.id} className="relative">
                <span
                  className={`absolute -left-[31px] top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background ${dotColors[index % dotColors.length]}`}
                />
                <Reveal delay={index * 0.05}>
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        {...previewFields(
                          `sections.experience.experience.${job.id}.role`,
                        )}
                        className="text-lg font-semibold"
                      >
                        {job.role}
                      </h3>
                      <Badge
                        {...previewFields(
                          `sections.experience.experience.${job.id}.type`,
                        )}
                        variant="secondary"
                      >
                        {job.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm">
                      <span
                        {...previewFields(
                          `sections.experience.experience.${job.id}.company`,
                        )}
                        className="font-medium"
                      >
                        {job.company}
                      </span>
                      <span
                        {...previewFields(
                          `sections.experience.experience.${job.id}.period`,
                          `sections.experience.experience.${job.id}.location`,
                        )}
                        className="text-muted-foreground"
                      >
                        {" "}
                        · {job.period} · {job.location}
                      </span>
                    </p>
                    <p
                      {...previewFields(
                        `sections.experience.experience.${job.id}.description`,
                      )}
                      className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground"
                    >
                      {job.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {job.highlights.map((highlight, highlightIndex) => (
                        <li
                          {...previewFields(
                            `sections.experience.experience.${job.id}.highlights.${highlightIndex}`,
                          )}
                          key={`${job.id}-highlight-${highlightIndex}`}
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
