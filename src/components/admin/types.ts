import type { SiteContent } from "@/content/schema";

export type AdminView =
  | "profile"
  | "navigation"
  | "socials"
  | "seo"
  | "hero"
  | "metrics"
  | "clients"
  | "campaigns"
  | "categories"
  | "experience"
  | "reels"
  | "testimonials"
  | "contact"
  | "footer";

export interface AdminViewProps {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  onNavigate: (view: AdminView) => void;
}

export const VIEW_LABELS: Record<AdminView, string> = {
  profile: "Profile & Identity",
  navigation: "Header",
  socials: "Social Links",
  seo: "SEO",
  hero: "Hero",
  metrics: "Metrics",
  clients: "Clients",
  campaigns: "Campaigns",
  categories: "Campaign Categories",
  experience: "Experience",
  reels: "Reels",
  testimonials: "Testimonials",
  contact: "Contact",
  footer: "Footer",
};
