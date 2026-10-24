"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatChangeValue,
  type ContentChange,
} from "@/lib/diff";
import { cn } from "@/lib/utils";

export function ViewChangesDialog({
  open,
  onOpenChange,
  changes,
  onUndo,
  onDiscardAll,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: ContentChange[];
  onUndo: (change: ContentChange) => void;
  onDiscardAll: () => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const map = new Map<
      string,
      { key: string; label: string; changes: ContentChange[] }
    >();

    changes.forEach((change) => {
      const existing = map.get(change.sectionKey);
      if (existing) {
        existing.changes.push(change);
      } else {
        map.set(change.sectionKey, {
          key: change.sectionKey,
          label: change.sectionLabel,
          changes: [change],
        });
      }
    });

    return Array.from(map.values());
  }, [changes]);

  function toggle(key: string) {
    setCollapsed((current) => ({ ...current, [key]: !current[key] }));
  }

  function undo(change: ContentChange) {
    const confirmed = window.confirm(
      `Undo this change?\n\n${change.label}\n\nThis only removes that change; everything else stays as it is.`,
    );
    if (confirmed) onUndo(change);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto]">
        <DialogHeader>
          <DialogTitle>Unpublished changes</DialogTitle>
          <DialogDescription>
            Review every change made since the last publish, grouped by
            section. Undo a single change with its delete button, or discard
            everything.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto pr-1">
          {groups.length ? (
            <div className="space-y-3">
              {groups.map((group) => {
                const isOpen = !collapsed[group.key];
                const panelId = `changes-panel-${group.key}`;

                return (
                  <section
                    key={group.key}
                    className="overflow-hidden rounded-xl border border-border bg-background/60"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(group.key)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                    >
                      <span className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                          {group.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {group.changes.length}{" "}
                          {group.changes.length === 1 ? "change" : "changes"}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <ul
                      id={panelId}
                      hidden={!isOpen}
                      className="animate-in divide-y divide-border border-t border-border fade-in-0 slide-in-from-top-1 duration-200"
                    >
                      {group.changes.map((change) => (
                        <li
                          key={change.id}
                          className="flex items-start justify-between gap-3 px-3 py-2.5"
                        >
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-medium leading-relaxed">
                              {change.label}
                            </p>
                            {change.kind === "changed" ? (
                              <p className="flex flex-wrap items-center gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                <span className="max-w-full break-words rounded bg-red-500/15 px-1.5 py-0.5 line-through decoration-destructive/50">
                                  {formatChangeValue(change.before)}
                                </span>
                                <span aria-hidden="true">→</span>
                                <span className="max-w-full break-words rounded bg-emerald-500/15 px-1.5 py-0.5 text-foreground">
                                  {formatChangeValue(change.after)}
                                </span>
                              </p>
                            ) : change.kind === "moved" ? (
                              <p className="text-[11px] text-muted-foreground">
                                Order changed. Undo restores the previous order.
                              </p>
                            ) : (
                              <p className="text-[11px] text-muted-foreground">
                                {change.kind === "added"
                                  ? "New entry added in this draft."
                                  : "Entry removed in this draft."}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => undo(change)}
                            title="Undo this change"
                            aria-label={`Undo ${change.label}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-10 text-center">
              <p className="text-sm font-medium">No unpublished changes</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Everything here matches the last published content.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onDiscardAll}
            disabled={!changes.length}
            className="text-muted-foreground hover:text-destructive sm:mr-auto"
          >
            <Trash2 className="h-4 w-4" />
            Discard all changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
