"use client";

import { CloudUpload, Loader2, Menu, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VIEW_LABELS, type AdminView } from "./types";

export function AdminTopbar({
  view,
  dirty,
  saving,
  publishing,
  onSave,
  onPublish,
  onOpenSidebar,
}: {
  view: AdminView;
  dirty: boolean;
  saving: boolean;
  publishing: boolean;
  onSave: () => void;
  onPublish: () => void;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sections"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="font-display text-lg font-semibold tracking-tight">
          {VIEW_LABELS[view]}
        </h1>
        <Badge variant={dirty ? "default" : "muted"}>
          {dirty ? "Unpublished changes" : "Published"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
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
          Save
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
