"use client";

import {
  CloudUpload,
  Eye,
  Info,
  Loader2,
  Menu,
  Save,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VIEW_LABELS, type AdminView } from "./types";

export function AdminTopbar({
  view,
  dirty,
  changeCount,
  saving,
  publishing,
  onSave,
  onViewChanges,
  onPublish,
  onOpenSidebar,
}: {
  view: AdminView;
  dirty: boolean;
  changeCount: number;
  saving: boolean;
  publishing: boolean;
  onSave: () => void;
  onViewChanges: () => void;
  onPublish: () => void;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-0.5 h-8 w-8 shrink-0 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sections"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-lg font-semibold tracking-tight">
              {VIEW_LABELS[view]}
            </h1>
            <Badge variant={dirty ? "default" : "muted"}>
              {dirty ? "Unpublished changes" : "Published"}
            </Badge>
          </div>
          <p className="mt-1 flex max-w-2xl items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            <span>
              Saved changes are kept only in this browser tab session. They are&nbsp;
              <b>lost</b> when you <i>refresh, close tab, log out, clear the browser cache, or the session expires &#40;12hrs&#41;.</i>
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {dirty ? (
          <Button type="button" variant="outline" size="sm" onClick={onViewChanges}>
            <Eye className="h-4 w-4" />
            View Changes
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
              {changeCount}
            </span>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving || publishing}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onPublish}
          disabled={publishing || saving || !dirty}
        >
          {publishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CloudUpload className="h-4 w-4" />
          )}
          Publish
        </Button>
      </div>
    </header>
  );
}
