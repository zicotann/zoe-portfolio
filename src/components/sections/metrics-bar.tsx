import { NumberTicker } from "@/components/magicui/number-ticker";
import { Reveal } from "@/components/magicui/reveal";
import type { SiteContent } from "@/content/schema";
import { previewFields } from "@/lib/preview-fields";

const accents = ["bg-brand-violet", "bg-brand-coral", "bg-brand-amber"];

export function MetricsBar({ content }: { content: SiteContent }) {
  return (
    <section id="metrics" className="py-16 sm:py-24">
      <div
        {...previewFields("sections.metrics.visible")}
        className="container"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.sections.metrics.stats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg sm:p-7">
                <span
                  className={`mb-5 block h-1.5 w-10 rounded-full ${accents[index % accents.length]} transition-all duration-300 group-hover:w-16`}
                />
                <div
                  {...previewFields(
                    `sections.metrics.stats.${stat.id}.value`,
                    `sections.metrics.stats.${stat.id}.prefix`,
                    `sections.metrics.stats.${stat.id}.suffix`,
                    `sections.metrics.stats.${stat.id}.decimals`,
                  )}
                  className="font-display text-5xl font-semibold tracking-tight sm:text-6xl"
                >
                  <NumberTicker
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimalPlaces={stat.decimals ?? 0}
                  />
                </div>
                <p
                  {...previewFields(
                    `sections.metrics.stats.${stat.id}.label`,
                  )}
                  className="mt-3 text-sm font-semibold"
                >
                  {stat.label}
                </p>
                <p
                  {...previewFields(
                    `sections.metrics.stats.${stat.id}.description`,
                  )}
                  className="mt-1 text-xs leading-snug text-muted-foreground"
                >
                  {stat.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
