import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { CampaignGrid } from "@/components/sections/campaign-grid";
import { Experience } from "@/components/sections/experience";
import { ContentReels } from "@/components/sections/content-reels";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import type { SiteContent } from "@/content/schema";

export function SiteShell({ content }: { content: SiteContent }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader content={content} />
      <main className="pb-24 md:pb-0">
        <Hero content={content} />
        <MetricsBar content={content} />
        <LogoCloud content={content} />
        <CampaignGrid content={content} />
        <Experience content={content} />
        <ContentReels content={content} />
        <Testimonials content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
