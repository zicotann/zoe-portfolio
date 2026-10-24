"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
import type { PreviewAnchor } from "@/lib/preview-fields";
import {
  applyPreviewHighlight,
  clearPreviewHighlight,
  type ActiveHighlight,
} from "@/lib/preview-highlight";

function isAdminView(value: unknown): value is AdminView {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(VIEW_LABELS, value)
  );
}

function SectionFrame({
  visible,
  label,
  previewAnchor,
  children,
}: {
  visible: boolean;
  label: string;
  previewAnchor?: PreviewAnchor;
  children: ReactNode;
}) {
  if (visible) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        data-preview-anchor={previewAnchor}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
      >
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
        <SectionFrame
          visible={content.sections.hero.visible}
          label="Hero"
          previewAnchor="hero.section"
        >
          <Hero content={content} />
        </SectionFrame>
      );
    case "metrics":
      return (
        <SectionFrame
          visible={content.sections.metrics.visible}
          label="Metrics"
          previewAnchor="metrics.section"
        >
          <MetricsBar content={content} />
        </SectionFrame>
      );
    case "clients":
      return (
        <SectionFrame
          visible={content.sections.clients.visible}
          label="Clients"
          previewAnchor="clients.section"
        >
          <LogoCloud content={content} />
        </SectionFrame>
      );
    case "campaigns":
      return (
        <SectionFrame
          visible={content.sections.campaigns.visible}
          label="Campaigns"
          previewAnchor="campaigns.section"
        >
          <CampaignGrid content={content} />
        </SectionFrame>
      );
    case "categories":
      return (
        <SectionFrame
          visible={content.sections.campaigns.visible}
          label="Campaigns"
          previewAnchor="campaigns.section"
        >
          <CampaignGrid content={content} />
        </SectionFrame>
      );
    case "experience":
      return (
        <SectionFrame
          visible={content.sections.experience.visible}
          label="Experience"
          previewAnchor="experience.section"
        >
          <Experience content={content} />
        </SectionFrame>
      );
    case "reels":
      return (
        <SectionFrame
          visible={content.sections.reels.visible}
          label="Reels"
          previewAnchor="reels.section"
        >
          <ContentReels content={content} />
        </SectionFrame>
      );
    case "testimonials":
      return (
        <SectionFrame
          visible={content.sections.testimonials.visible}
          label="Testimonials"
          previewAnchor="testimonials.section"
        >
          <Testimonials content={content} />
        </SectionFrame>
      );
    case "contact":
      return (
        <SectionFrame
          visible={content.sections.contact.visible}
          label="Contact"
          previewAnchor="contact.section"
        >
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
  const highlightRef = useRef<ActiveHighlight | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setContent(draft.content);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as
        | {
            type?: string;
            content?: SiteContent;
            view?: unknown;
            target?: ActiveHighlight;
          }
        | undefined;

      if (data?.type === "preview:content" && data.content) {
        setContent(data.content);
      }

      if (data?.type === "preview:view" && isAdminView(data.view)) {
        highlightRef.current = null;
        clearPreviewHighlight();
        setView(data.view);
      }

      if (data?.type === "preview:highlight" && data.target) {
        highlightRef.current = data.target;
        applyPreviewHighlight(data.target, { scroll: true });
      }

      if (data?.type === "preview:highlight-clear") {
        highlightRef.current = null;
        clearPreviewHighlight();
      }
    };

    window.addEventListener("message", onMessage);

    const onDocumentClick = () => {
      if (!highlightRef.current) return;
      highlightRef.current = null;
      clearPreviewHighlight();
      window.parent.postMessage(
        { type: "preview:highlight-dismissed" },
        window.location.origin,
      );
    };
    document.addEventListener("click", onDocumentClick);

    window.parent.postMessage(
      { type: "preview:ready" },
      window.location.origin,
    );

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onDocumentClick);
      clearPreviewHighlight();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    if (highlightRef.current) {
      applyPreviewHighlight(highlightRef.current, { scroll: false });
    }
  }, [content]);

  return (
    <div className="min-h-screen bg-background">
      <ViewPreview view={view} content={content} />
    </div>
  );
}
