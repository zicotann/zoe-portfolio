"use client";

import { createContext, useContext } from "react";
import {
  SquareDashedMousePointer,
  SquareMousePointer,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getPreviewFallbacks,
  type PreviewField,
  type PreviewHighlightTarget,
} from "@/lib/preview-fields";
import { cn } from "@/lib/utils";

interface PreviewLocateValue {
  activeField: PreviewField | null;
  locate: (target: PreviewHighlightTarget) => void;
}

const PreviewLocateContext = createContext<PreviewLocateValue | null>(null);

export function PreviewLocateProvider({
  value,
  children,
}: {
  value: PreviewLocateValue | null;
  children: React.ReactNode;
}) {
  return (
    <PreviewLocateContext.Provider value={value}>
      {children}
    </PreviewLocateContext.Provider>
  );
}

export function usePreviewLocate() {
  return useContext(PreviewLocateContext);
}

export function PreviewLocateButton({
  field,
  label,
}: {
  field: PreviewField;
  label: string;
}) {
  const locate = usePreviewLocate();
  if (!locate) return null;

  const active = locate.activeField === field;
  const Icon = active ? SquareMousePointer : SquareDashedMousePointer;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-preview-locate-button
          aria-pressed={active}
          aria-label={
            active
              ? `Clear the preview highlight for ${label}`
              : `Show ${label} in the preview`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            locate.locate({
              field,
              label,
              fallbackAnchors: getPreviewFallbacks(field),
            });
          }}
          className={cn(
            "shrink-0 rounded-md p-1 text-muted-foreground/70 transition-colors",
            "hover:bg-secondary hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active && "bg-primary/10 text-primary hover:text-primary",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {active ? "Clear highlight" : "Show in preview"}
      </TooltipContent>
    </Tooltip>
  );
}
