import { NumberTicker } from "@/components/magicui/number-ticker";
import { Reveal } from "@/components/magicui/reveal";
import { profile } from "@/data/profile";

const accents = [
  "bg-brand-violet",
  "bg-brand-coral",
  "bg-brand-teal",
  "bg-brand-amber",
];

export function MetricsBar() {
  return (
    <section id="metrics" className="py-16 sm:py-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.summaryStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg sm:p-7">
                <span
                  className={`mb-5 block h-1.5 w-10 rounded-full ${accents[index % accents.length]} transition-all duration-300 group-hover:w-16`}
                />
                <div className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">
                  <NumberTicker
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimalPlaces={stat.decimals ?? 0}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold">{stat.label}</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
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
