"use client";

import { useEffect, useState, type ReactNode } from "react";

import type { AdminView } from "@/components/admin/types";
import { VIEW_LABELS } from "@/components/admin/types";
import { CampaignGrid } from "@/components/sections/campaign-grid";
import { Contact } from "@/components/sections/contact";
import { ContentReels } from "@/components/sections/content-reels";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { SiteHeader } from "@/components/sections/site-header";
import { Testimonials } from "@/components/sections/testimonials";
import type { SiteContent } from "@/content/schema";
import { siteContent } from "@/content/site";
import { loadDraft } from "@/lib/draft-storage";

function isAdminView(value: unknown): value is AdminView {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(VIEW_LABELS, value)
  );
}

function SectionFrame({
  visible,
  label,
  children,
}: {
  visible: boolean;
  label: string;
  children: ReactNode;
}) {
  if (visible) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm font-semibold">{label} is hidden</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          This section is hidden on the live site. Check “Show this section on
          the website” in the Content tab to make it visible again.
        </p>
      </div>
    </div>
  );
}

function ViewPreview({
  view,
  content,
}: {
  view: AdminView;
  content: SiteContent;
}) {
  switch (view) {
    case "navigation":
      return <SiteHeader content={content} />;
    case "socials":
      return <Footer content={content} />;
    case "hero":
      return (
        <SectionFrame visible={content.sections.hero.visible} label="Hero">
          <Hero content={content} />
        </SectionFrame>
      );
    case "metrics":
      return (
        <SectionFrame visible={content.sections.metrics.visible} label="Metrics">
          <MetricsBar content={content} />
        </SectionFrame>
      );
    case "clients":
      return (
        <SectionFrame visible={content.sections.clients.visible} label="Clients">
          <LogoCloud content={content} />
        </SectionFrame>
      );
    case "campaigns":
      return (
        <SectionFrame
          visible={content.sections.campaigns.visible}
          label="Campaigns"
        >
          <CampaignGrid content={content} />
        </SectionFrame>
      );
    case "categories":
      return (
        <SectionFrame
          visible={content.sections.campaigns.visible}
          label="Campaigns"
        >
          <CampaignGrid content={content} />
        </SectionFrame>
      );
    case "experience":
      return (
        <SectionFrame
          visible={content.sections.experience.visible}
          label="Experience"
        >
          <Experience content={content} />
        </SectionFrame>
      );
    case "reels":
      return (
        <SectionFrame visible={content.sections.reels.visible} label="Reels">
          <ContentReels content={content} />
        </SectionFrame>
      );
    case "testimonials":
      return (
        <SectionFrame
          visible={content.sections.testimonials.visible}
          label="Testimonials"
        >
          <Testimonials content={content} />
        </SectionFrame>
      );
    case "contact":
      return (
        <SectionFrame visible={content.sections.contact.visible} label="Contact">
          <Contact content={content} />
        </SectionFrame>
      );
    case "footer":
      return <Footer content={content} />;
    default:
      return null;
  }
}

export default function PreviewPage() {
  const [content, setContent] = useState<SiteContent>(siteContent);
  const [view, setView] = useState<AdminView>("hero");

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setContent(draft.content);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as
        | { type?: string; content?: SiteContent; view?: unknown }
        | undefined;

      if (data?.type === "preview:content" && data.content) {
        setContent(data.content);
      }

      if (data?.type === "preview:view" && isAdminView(data.view)) {
        setView(data.view);
      }
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: "preview:ready" },
      window.location.origin,
    );

    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="min-h-screen bg-background">
      <ViewPreview view={view} content={content} />
    </div>
  );
}
