"use client";

import { useEffect, useState } from "react";

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

function ViewPreview({
  view,
  content,
}: {
  view: AdminView;
  content: SiteContent;
}) {
  switch (view) {
    case "profile":
      return <Hero content={content} />;
    case "navigation":
      return <SiteHeader content={content} />;
    case "socials":
      return <Footer content={content} />;
    case "contact-details":
      return <Contact content={content} />;
    case "seo":
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              SEO
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Metadata only
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              These settings change the page title, description, and social
              preview. They don’t alter the visible layout.
            </p>
            <div className="mt-5 space-y-2 rounded-xl border border-border bg-secondary/50 p-4">
              <p className="text-sm font-semibold">
                {content.seo.titleTemplate}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {content.seo.description}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {content.seo.siteUrl}
              </p>
            </div>
          </div>
        </div>
      );
    case "hero":
      return <Hero content={content} />;
    case "metrics":
      return <MetricsBar content={content} />;
    case "clients":
      return <LogoCloud content={content} />;
    case "campaigns":
      return <CampaignGrid content={content} />;
    case "categories":
      return <CampaignGrid content={content} />;
    case "experience":
      return <Experience content={content} />;
    case "reels":
      return <ContentReels content={content} />;
    case "testimonials":
      return <Testimonials content={content} />;
    case "contact":
      return <Contact content={content} />;
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
