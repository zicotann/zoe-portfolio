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

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main className="pb-24 md:pb-0">
        <Hero />
        <MetricsBar />
        <LogoCloud />
        <CampaignGrid />
        <Experience />
        <ContentReels />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
