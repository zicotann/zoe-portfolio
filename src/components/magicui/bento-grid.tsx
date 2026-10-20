import * as React from "react";

import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
}

export function BentoCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}
