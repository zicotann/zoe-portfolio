"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { PreviewPanel } from "@/components/admin/preview-panel";
import { PreviewLocateProvider } from "@/components/admin/preview-locate";
import { PublishDialog } from "@/components/admin/publish-dialog";
import { ViewChangesDialog } from "@/components/admin/view-changes-dialog";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VIEW_LABELS, type AdminView } from "@/components/admin/types";
import {
  ClientsView,
  ContactView,
  ExperienceView,
  FooterView,
  HeroView,
  MetricsView,
  ReelsView,
  TestimonialsView,
} from "@/components/admin/views/content-sections";
import { CampaignsView, CategoriesView } from "@/components/admin/views/campaigns";
import {
  NavigationView,
  ProfileView,
  SeoView,
  SocialsView,
} from "@/components/admin/views/singletons";
import { siteContentSchema, type SiteContent } from "@/content/schema";
import {
  contentEquals,
  getChangedAreas,
  getDetailedChanges,
  type ContentChange,
} from "@/lib/diff";
import {
  clearDraft,
  loadDraft,
  persistDraft,
} from "@/lib/draft-storage";
import type { PreviewHighlightTarget } from "@/lib/preview-fields";
import { cn } from "@/lib/utils";

type StatusMessage = {
  kind: "success" | "error" | "info";
  text: string;
};

export function AdminDashboard({
  initialContent,
}: {
  initialContent: SiteContent;
}) {
  const router = useRouter();
  const [view, setView] = useState<AdminView>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseline, setBaseline] = useState<SiteContent>(initialContent);
  const [draft, setDraft] = useState<SiteContent>(initialContent);
  const [baseSha, setBaseSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [viewChangesOpen, setViewChangesOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [commitUrl, setCommitUrl] = useState<string | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [highlight, setHighlight] = useState<PreviewHighlightTarget | null>(
    null,
  );
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const editedRef = useRef(false);

  const dirty = !contentEquals(baseline, draft);
  const changedAreas = useMemo(
    () => getChangedAreas(baseline, draft),
    [baseline, draft],
  );
  const detailedChanges = useMemo(
    () => getDetailedChanges(baseline, draft),
    [baseline, draft],
  );
  const showPreview = view !== "profile" && view !== "seo";

  useEffect(() => {
    const stored = loadDraft();
    if (stored) {
      setDraft(stored.content);
      setBaseSha(stored.baseSha);
      setStatus({
        kind: "info",
        text: "Restored the draft saved in this browser tab.",
      });
    }

    let cancelled = false;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/login");
          return null;
        }
        if (!response.ok) {
          throw new Error("Content request failed.");
        }
        return (await response.json()) as {
          content: SiteContent;
          sha: string | null;
          warning?: string;
        };
      })
      .then((data) => {
        if (cancelled || !data?.content) return;
        setBaseline(data.content);
        setBaseSha((current) => current ?? data.sha);
        if (!stored && !editedRef.current) setDraft(data.content);
        if (data.warning) {
          setWarning(data.warning);
        } else if (stored?.baseSha && data.sha && stored.baseSha !== data.sha) {
          setWarning(
            "The published content changed on GitHub after this draft was saved. Publishing will be blocked to protect newer changes. Discard this draft to reload the latest content.",
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWarning(
            "Could not load the latest published content from GitHub. Using the content bundled with this deployment.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    if (!previewFullscreen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [previewFullscreen]);

  useEffect(() => {
    if (!showPreview) setPreviewFullscreen(false);
  }, [showPreview]);

  useEffect(() => {
    if (!highlight) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHighlight(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [highlight]);

  useEffect(() => {
    if (!highlight) return;
    const handler = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-preview-locate-button]")) return;
      setHighlight(null);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [highlight]);

  function locateInPreview(target: PreviewHighlightTarget) {
    if (highlight?.field === target.field) {
      setHighlight(null);
      return;
    }

    setHighlight(target);

    if (
      !previewFullscreen &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      previewAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleContentChange(next: SiteContent) {
    editedRef.current = true;
    setDraft(next);
  }

  function saveDraft(showMessage = true) {
    setSaving(true);
    persistDraft({ content: draft, baseSha, savedAt: Date.now() });
    window.setTimeout(() => {
      setSaving(false);
      if (showMessage) {
        setStatus({
          kind: "success",
          text: "Saved to this browser tab. Close the tab and the draft is gone.",
        });
      }
    }, 250);
  }

  function openPublish() {
    const parsed = siteContentSchema.safeParse(draft);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setStatus({
        kind: "error",
        text: `Fix this before publishing: ${
          first ? `${first.path.join(".") || "content"} — ${first.message}` : "content is invalid."
        }`,
      });
      return;
    }
    setPublishError(null);
    setPublishOpen(true);
  }

  async function publish() {
    setPublishing(true);
    setPublishError(null);

    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft, baseSha }),
      });
      const data = (await response.json()) as {
        error?: string;
        sha?: string;
        commitUrl?: string;
        content?: SiteContent;
      };

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setPublishError(data.error ?? "Publish failed.");
        return;
      }

      const published = data.content ?? draft;
      setBaseline(published);
      setDraft(published);
      setBaseSha(data.sha ?? baseSha);
      setCommitUrl(data.commitUrl ?? null);
      clearDraft();
      setPublishOpen(false);
      setStatus({
        kind: "success",
        text: "Published. Netlify will rebuild the live site.",
      });
    } catch {
      setPublishError("Could not reach the publish endpoint.");
    } finally {
      setPublishing(false);
    }
  }

  async function logout() {
    clearDraft();
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function discardDraft(): Promise<boolean> {
    if (
      !window.confirm(
        "Discard all unpublished changes and restore the last published content?",
      )
    ) {
      return false;
    }
    clearDraft();
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as {
          content: SiteContent;
          sha: string | null;
        };
        setBaseline(data.content);
        setDraft(data.content);
        setBaseSha(data.sha);
      } else {
        setDraft(baseline);
      }
    } catch {
      setDraft(baseline);
    }
    setWarning(null);
    setStatus({ kind: "info", text: "Draft discarded." });
    return true;
  }

  function undoChange(change: ContentChange) {
    editedRef.current = true;
    setDraft((current) => change.revert(current));
    setStatus({ kind: "info", text: "Change undone." });
  }

  async function discardAllChanges() {
    const discarded = await discardDraft();
    if (discarded) setViewChangesOpen(false);
  }

  function handleNavigate(next: AdminView) {
    setView(next);
    setSidebarOpen(false);
    setStatus(null);
    setHighlight(null);
  }

  return (
    <PreviewLocateProvider
      value={
        showPreview
          ? { activeField: highlight?.field ?? null, locate: locateInPreview }
          : null
      }
    >
      <TooltipProvider delayDuration={200}>
        <div className="flex h-screen overflow-hidden bg-secondary/20">
      <div className="hidden w-60 shrink-0 lg:block">
        <AdminSidebar
          view={view}
          onSelect={handleNavigate}
          onLogout={logout}
          dirty={dirty}
        />
      </div>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close sections"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-72 shadow-2xl">
            <AdminSidebar
              view={view}
              onSelect={handleNavigate}
              onLogout={logout}
              dirty={dirty}
            />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              aria-label="Close sections"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          view={view}
          dirty={dirty}
          changeCount={detailedChanges.length}
          saving={saving}
          publishing={publishing}
          onSave={() => saveDraft()}
          onViewChanges={() => setViewChangesOpen(true)}
          onPublish={openPublish}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            showPreview && "lg:flex-row",
          )}
        >
          {!previewFullscreen || !showPreview ? (
            <div
              className={cn(
                "order-2 min-h-0 flex-1 overflow-y-auto",
                showPreview && "lg:order-1",
              )}
            >
              <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6 sm:px-6">
                {loading ? (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading the latest published content…
                  </p>
                ) : null}

                {warning ? (
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-brand-amber/40 bg-brand-amber/10 px-4 py-3 text-xs leading-relaxed">
                    <p className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-amber" />
                      {warning}
                    </p>
                    <button
                      type="button"
                      onClick={() => setWarning(null)}
                      className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-background"
                      aria-label="Dismiss warning"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}

                <ViewRenderer
                  view={view}
                  content={draft}
                  onChange={handleContentChange}
                  onNavigate={handleNavigate}
                />

                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Save changes means saving changes for this section. The
                    draft stays in this tab until you publish everything from
                    the top bar.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={discardDraft}
                      disabled={!dirty || saving || publishing}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Discard
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => saveDraft()}
                      disabled={saving || publishing}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save {VIEW_LABELS[view]} changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showPreview ? (
            <div
              ref={previewAreaRef}
              className={cn(
                "order-1 flex min-h-0 flex-col overflow-hidden bg-secondary/20",
                "border-b border-border lg:order-2 lg:border-b-0 lg:border-l",
                previewFullscreen
                  ? "flex-1"
                  : "h-[38vh] min-h-[280px] shrink-0 lg:h-auto lg:w-[46%] xl:w-[50%]",
              )}
            >
              <PreviewPanel
                content={draft}
                view={view}
                highlight={highlight}
                onHighlightCleared={() => setHighlight(null)}
                fullscreen={previewFullscreen}
                onToggleFullscreen={() =>
                  setPreviewFullscreen((current) => !current)
                }
              />
            </div>
          ) : null}
        </div>
      </div>

      <ViewChangesDialog
        open={viewChangesOpen}
        onOpenChange={setViewChangesOpen}
        changes={detailedChanges}
        onUndo={undoChange}
        onDiscardAll={discardAllChanges}
      />

      <PublishDialog
        open={publishOpen}
        onOpenChange={(next) => {
          if (!publishing) setPublishOpen(next);
        }}
        changedAreas={changedAreas}
        publishing={publishing}
        error={publishError}
        onConfirm={publish}
      />

      {status ? (
        <div
          className={`fixed bottom-4 right-4 z-[60] flex max-w-sm items-start justify-between gap-3 rounded-xl border px-4 py-3 text-xs leading-relaxed shadow-xl backdrop-blur ${
            status.kind === "success"
              ? "border-emerald-500/30 bg-emerald-50/95 text-emerald-800"
              : status.kind === "error"
                ? "border-destructive/30 bg-red-50/95 text-destructive"
                : "border-border bg-card/95 text-muted-foreground"
          }`}
        >
          <p className="flex items-start gap-2">
            {status.kind === "success" ? (
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            ) : status.kind === "error" ? (
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            ) : null}
            <span>
              {status.text}
              {commitUrl ? (
                <>
                  {" "}
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    View commit
                  </a>
                </>
              ) : null}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-background"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
        </div>
      </TooltipProvider>
    </PreviewLocateProvider>
  );
}

function ViewRenderer({
  view,
  content,
  onChange,
  onNavigate,
}: {
  view: AdminView;
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  onNavigate: (view: AdminView) => void;
}) {
  const props = { content, onChange, onNavigate };

  switch (view) {
    case "profile":
      return <ProfileView {...props} />;
    case "navigation":
      return <NavigationView {...props} />;
    case "socials":
      return <SocialsView {...props} />;
    case "seo":
      return <SeoView {...props} />;
    case "hero":
      return <HeroView {...props} />;
    case "metrics":
      return <MetricsView {...props} />;
    case "clients":
      return <ClientsView {...props} />;
    case "campaigns":
      return <CampaignsView {...props} />;
    case "categories":
      return <CategoriesView {...props} />;
    case "experience":
      return <ExperienceView {...props} />;
    case "reels":
      return <ReelsView {...props} />;
    case "testimonials":
      return <TestimonialsView {...props} />;
    case "contact":
      return <ContactView {...props} />;
    case "footer":
      return <FooterView {...props} />;
    default:
      return null;
  }
}
