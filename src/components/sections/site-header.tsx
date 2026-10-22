"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Film,
  LayoutGrid,
  Link as LinkIcon,
  Mail,
  MessageSquareQuote,
  TrendingUp,
} from "lucide-react";

import { Dock, type DockItem } from "@/components/magicui/dock";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import type { NavIcon, SiteContent } from "@/content/schema";
import { cn } from "@/lib/utils";

const dockIcons: Record<NavIcon, React.ReactNode> = {
  work: <LayoutGrid className="h-5 w-5" />,
  metrics: <TrendingUp className="h-5 w-5" />,
  experience: <Briefcase className="h-5 w-5" />,
  reels: <Film className="h-5 w-5" />,
  testimonials: <MessageSquareQuote className="h-5 w-5" />,
  contact: <Mail className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
};

export function SiteHeader({ content }: { content: SiteContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const navLinks = content.navigation.links;
  const anchorIds = useMemo(
    () =>
      Array.from(
        new Set([
          "top",
          ...navLinks
            .filter((link) => link.href.startsWith("#"))
            .map((link) => link.href.slice(1)),
        ]),
      ),
    [navLinks],
  );

  const dockItems: DockItem[] = navLinks.map((link) => ({
    label: link.label,
    href: link.href,
    icon: dockIcons[link.icon],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = anchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [anchorIds]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4">
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto relative flex items-center gap-1 overflow-hidden rounded-full border border-border px-2 py-2 transition-all duration-300",
            scrolled
              ? "bg-background/80 shadow-lg backdrop-blur-xl"
              : "bg-background/60 shadow-md backdrop-blur-md",
          )}
        >
          <a
            href="#top"
            className="px-3 font-display text-base font-semibold tracking-tight transition-opacity hover:opacity-80 sm:px-4"
          >
            {content.profile.name}
            <span className="text-brand-coral">.</span>
          </a>

          <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                aria-current={active === link.href ? "location" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />

          <ShimmerButton
            href={content.navigation.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 h-9 px-4 text-xs sm:px-5 sm:text-sm"
          >
            {content.navigation.ctaLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </ShimmerButton>

          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-6 bottom-0 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-violet via-brand-coral to-brand-amber"
          />
        </nav>
      </header>

      <Dock items={dockItems} className="lg:hidden" />
    </>
  );
}
