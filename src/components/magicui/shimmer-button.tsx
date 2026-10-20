import * as React from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  target?: string;
  rel?: string;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(({ className, children, href, ...props }, ref) => {
  const Comp = (href ? "a" : "button") as React.ElementType;

  return (
    <Comp
      ref={ref}
      href={href}
      className={cn(
        "group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-300 ease-in-out active:translate-y-px",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Comp>
  );
});
ShimmerButton.displayName = "ShimmerButton";
