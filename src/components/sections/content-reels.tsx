import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/magicui/reveal";
import { VideoSamplePlayer } from "@/components/video-sample-player";
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
                <div className="relative transition-all duration-300 group-hover:-translate-y-1.5">
                  <VideoSamplePlayer
                    video={reel}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  />
                  <Badge className="pointer-events-none absolute left-3 top-3 border-transparent bg-card/90 text-foreground backdrop-blur">
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
