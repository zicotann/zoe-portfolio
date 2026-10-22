"use client";

import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  RefreshCw,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/schema";
import { cn } from "@/lib/utils";
import { VIEW_ANCHORS, type AdminView } from "./types";

export function PreviewPanel({
  content,
  view,
}: {
  content: SiteContent;
  view: AdminView;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentRef = useRef(content);
  const [ready, setReady] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  contentRef.current = content;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "preview:ready") return;
      setReady(true);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "preview:content", content: contentRef.current },
        window.location.origin,
      );
      iframeRef.current?.contentWindow?.postMessage(
        { type: "preview:scroll", anchor: VIEW_ANCHORS[view] },
        window.location.origin,
      );
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [view]);

  useEffect(() => {
    if (!ready) return;
    const frame = window.requestAnimationFrame(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "preview:content", content },
        window.location.origin,
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, [content, ready]);

  useEffect(() => {
    if (!ready) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "preview:scroll", anchor: VIEW_ANCHORS[view] },
      window.location.origin,
    );
  }, [view, ready]);

  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Live preview
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Entire site
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-full border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              aria-pressed={device === "desktop"}
              aria-label="Desktop preview"
              className={cn(
                "rounded-full p-1.5 transition-colors",
                device === "desktop"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              aria-pressed={device === "mobile"}
              aria-label="Mobile preview"
              className={cn(
                "rounded-full p-1.5 transition-colors",
                device === "mobile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setReady(false);
              setReloadKey((key) => key + 1);
            }}
            aria-label="Reload preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex h-[42vh] min-h-[320px] max-h-[560px] justify-center overflow-hidden px-3 pb-3 sm:px-6 sm:pb-5">
        <div
          className={cn(
            "h-full overflow-hidden rounded-t-xl border border-border bg-background shadow-lg transition-all duration-300",
            device === "mobile" ? "w-[390px] max-w-full" : "w-full",
          )}
        >
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src="/admin/preview"
            title="Live site preview"
            className="h-full w-full"
            onLoad={() => {
              setReady(true);
              iframeRef.current?.contentWindow?.postMessage(
                { type: "preview:content", content },
                window.location.origin,
              );
              iframeRef.current?.contentWindow?.postMessage(
                { type: "preview:scroll", anchor: VIEW_ANCHORS[view] },
                window.location.origin,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
