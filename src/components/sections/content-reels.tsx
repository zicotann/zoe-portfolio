import Image from "next/image";
import { Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/magicui/reveal";
import { getReels } from "@/content/helpers";
import type { SiteContent } from "@/content/schema";

export function ContentReels({ content }: { content: SiteContent }) {
  const reelsContent = content.sections.reels;
  const reels = getReels(
    content.sections.campaigns.campaigns,
    reelsContent.limit,
  );

  return (
    <section id="reels" className="py-16 sm:py-24">
      <div className="container">
        <Reveal className="mb-10 max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {reelsContent.eyebrow}
          </p>
          <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl">
            {reelsContent.headingLead}{" "}
            <span className="text-gradient animate-gradient-x">
              {reelsContent.headingAccent}
            </span>
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {reelsContent.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {reels.map((reel, index) => (
            <Reveal key={reel.id} delay={index * 0.05}>
              <figure className="group space-y-2">
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
                  <Image
                    src={reel.thumbnail}
                    alt={reel.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-lg">
                      <Play className="h-5 w-5 translate-x-px fill-current" />
                    </span>
                  </div>
                  <Badge className="absolute left-3 top-3 border-transparent bg-card/90 text-foreground backdrop-blur">
                    {reel.client}
                  </Badge>
                </div>
                <figcaption className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {reel.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
