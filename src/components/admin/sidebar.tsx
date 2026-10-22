"use client";

import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Contact,
  Film,
  FolderKanban,
  Globe2,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareQuote,
  Navigation as NavigationIcon,
  Search,
  Share2,
  Tags,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VIEW_LABELS, type AdminView } from "./types";

const singletonViews: AdminView[] = [
  "profile",
  "navigation",
  "socials",
  "contact-details",
  "seo",
];

const contentViews: AdminView[] = [
  "hero",
  "metrics",
  "clients",
  "campaigns",
  "categories",
  "experience",
  "reels",
  "testimonials",
  "contact",
  "footer",
];

const icons: Record<AdminView, React.ReactNode> = {
  profile: <UserRound className="h-4 w-4" />,
  navigation: <NavigationIcon className="h-4 w-4" />,
  socials: <Share2 className="h-4 w-4" />,
  "contact-details": <Contact className="h-4 w-4" />,
  seo: <Search className="h-4 w-4" />,
  hero: <Home className="h-4 w-4" />,
  metrics: <LayoutGrid className="h-4 w-4" />,
  clients: <Globe2 className="h-4 w-4" />,
  campaigns: <FolderKanban className="h-4 w-4" />,
  categories: <Tags className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  reels: <Film className="h-4 w-4" />,
  testimonials: <MessageSquareQuote className="h-4 w-4" />,
  contact: <BookOpen className="h-4 w-4" />,
  footer: <ChevronRight className="h-4 w-4" />,
};

export function AdminSidebar({
  view,
  onSelect,
  onLogout,
  dirty,
}: {
  view: AdminView;
  onSelect: (view: AdminView) => void;
  onLogout: () => void;
  dirty: boolean;
}) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-card/70">
      <div className="border-b border-border px-5 py-5">
        <p className="font-display text-lg font-semibold tracking-tight">
          Content Studio<span className="text-brand-coral">.</span>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {dirty ? "Unpublished changes" : "Everything is up to date"}
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <SidebarGroup
          label="Singletons"
          views={singletonViews}
          active={view}
          onSelect={onSelect}
        />
        <SidebarGroup
          label="Content"
          views={contentViews}
          active={view}
          onSelect={onSelect}
        />
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <Button asChild variant="ghost" size="sm" className="w-full justify-start">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Globe2 className="h-4 w-4" />
            View live site
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

function SidebarGroup({
  label,
  views,
  active,
  onSelect,
}: {
  label: string;
  views: AdminView[];
  active: AdminView;
  onSelect: (view: AdminView) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      {views.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => onSelect(view)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
            active === view
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {icons[view]}
          <span className="truncate">{VIEW_LABELS[view]}</span>
        </button>
      ))}
    </div>
  );
}
