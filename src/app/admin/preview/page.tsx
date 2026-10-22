"use client";

import { useEffect, useState } from "react";

import { SiteShell } from "@/components/site-shell";
import type { SiteContent } from "@/content/schema";
import { siteContent } from "@/content/site";
import { loadDraft } from "@/lib/draft-storage";

export default function PreviewPage() {
  const [content, setContent] = useState<SiteContent>(siteContent);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setContent(draft.content);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as
        | { type?: string; content?: SiteContent; anchor?: string }
        | undefined;

      if (data?.type === "preview:content" && data.content) {
        setContent(data.content);
      }

      if (data?.type === "preview:scroll" && typeof data.anchor === "string") {
        const target = document.querySelector(data.anchor);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage(
      { type: "preview:ready" },
      window.location.origin,
    );

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteShell content={content} />
    </div>
  );
}
