import type { SiteContent } from "@/content/schema";

export type AdminView =
  | "profile"
  | "navigation"
  | "socials"
  | "contact-details"
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
  navigation: "Navigation",
  socials: "Social Links",
  "contact-details": "Contact & Booking",
  seo: "SEO",
  hero: "Hero",
  metrics: "Metrics",
  clients: "Clients",
  campaigns: "Campaigns",
  categories: "Categories",
  experience: "Experience",
  reels: "Reels",
  testimonials: "Testimonials",
  contact: "Contact",
  footer: "Footer",
};


