"use client";

import { CloudUpload, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PublishDialog({
  open,
  onOpenChange,
  changedAreas,
  publishing,
  error,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changedAreas: string[];
  publishing: boolean;
  error: string | null;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish these changes?</DialogTitle>
          <DialogDescription>
            This commits <code className="text-xs">content/site.json</code> to
            the configured GitHub branch and triggers a Netlify rebuild.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-secondary/50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Changes in this publish
          </p>
          {changedAreas.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {changedAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs"
                >
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No changes detected.
            </p>
          )}
        </div>

        <p className="rounded-xl border border-brand-amber/30 bg-brand-amber/10 px-4 py-3 text-xs leading-relaxed text-foreground/80">
          Tip: batch your edits into one publish. Every publish starts a fresh
          build, so publishing several small changes means several rebuilds.
        </p>

        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={publishing}
          >
            Keep editing
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={publishing || changedAreas.length === 0}
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudUpload className="h-4 w-4" />
            )}
            Publish to live
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
