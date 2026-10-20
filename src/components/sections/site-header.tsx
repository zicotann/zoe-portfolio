"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Briefcase,
  Film,
  LayoutGrid,
  Mail,
  MessageSquareQuote,
  TrendingUp,
} from "lucide-react";

import { Dock, type DockItem } from "@/components/magicui/dock";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Metrics", href: "#metrics" },
  { label: "Experience", href: "#experience" },
  { label: "Reels", href: "#reels" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = [
  "top",
  "work",
  "metrics",
  "experience",
  "reels",
  "testimonials",
  "contact",
];

const dockItems: DockItem[] = [
  { label: "Work", href: "#work", icon: <LayoutGrid className="h-5 w-5" /> },
  { label: "Metrics", href: "#metrics", icon: <TrendingUp className="h-5 w-5" /> },
  {
    label: "Experience",
    href: "#experience",
    icon: <Briefcase className="h-5 w-5" />,
  },
  { label: "Reels", href: "#reels", icon: <Film className="h-5 w-5" /> },
  {
    label: "Testimonials",
    href: "#testimonials",
    icon: <MessageSquareQuote className="h-5 w-5" />,
  },
  { label: "Contact", href: "#contact", icon: <Mail className="h-5 w-5" /> },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
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
  }, []);

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
            {profile.name}
            <span className="text-brand-coral">.</span>
          </a>

          <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
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
            href={profile.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 h-9 px-4 text-xs sm:px-5 sm:text-sm"
          >
            Book a call
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
