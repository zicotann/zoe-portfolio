"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface DockItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DockProps {
  items: DockItem[];
  activeHref?: string;
  className?: string;
}

export function Dock({ items, activeHref, className }: DockProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <nav
        aria-label="Quick navigation"
        className={cn(
          "fixed bottom-4 left-1/2 z-40 -translate-x-1/2",
          className,
        )}
      >
        <ul className="flex items-end gap-1 rounded-2xl border border-border bg-card/90 px-2 py-2 shadow-lg backdrop-blur-xl">
          {items.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={item.href}
                      aria-label={item.label}
                      aria-current={isActive ? "location" : undefined}
                      animate={{ scale: isActive ? 1.18 : 1, y: isActive ? -6 : 0 }}
                      whileHover={{ scale: 1.18, y: -6 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {item.icon}
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent>{item.label}</TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>
    </TooltipProvider>
  );
}
