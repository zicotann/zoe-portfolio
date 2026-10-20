import { Quote } from "lucide-react";

import { Marquee } from "@/components/magicui/marquee";
import { Reveal } from "@/components/magicui/reveal";
import { profile, type Testimonial } from "@/data/profile";

const accentBorders = [
  "border-t-brand-violet",
  "border-t-brand-coral",
  "border-t-brand-amber",
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <figure
      className={`flex w-[20rem] shrink-0 flex-col justify-between rounded-2xl border border-t-4 border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:w-[24rem] ${accentBorders[index % accentBorders.length]}`}
    >
      <Quote className="h-6 w-6 text-primary" />
      <blockquote className="mt-4 text-pretty text-sm leading-relaxed text-foreground/90">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-semibold text-primary">
          {testimonial.initials}
        </span>
        <span className="text-sm">
          <span className="block font-semibold">{testimonial.name}</span>
          <span className="block text-xs text-muted-foreground">
            {testimonial.title}, {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(profile.testimonials.length / 2);
  const firstRow = profile.testimonials.slice(0, half);
  const secondRow = profile.testimonials.slice(half);

  return (
    <section id="testimonials" className="overflow-hidden py-16 sm:py-24">
      <Reveal className="container mb-10 max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Social proof
        </p>
        <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl">
          What founders and marketing leads say.
        </h2>
      </Reveal>

      <div className="relative flex flex-col gap-4">
        <Marquee pauseOnHover className="mask-fade-x [--duration:44s]">
          {firstRow.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="mask-fade-x [--duration:52s]">
          {secondRow.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index + 2}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
