export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "youtube"
  | "email";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  handle: string;
  href: string;
}

export interface SummaryStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  type: "Full-time" | "Contract" | "Freelance" | "In-house" | "Agency";
  description: string;
  highlights: string[];
}

export interface ClientLogo {
  name: string;
  category: "Client" | "Media" | "Award";
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  initials: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: "video" | "strategy" | "growth" | "creative";
}

export interface Profile {
  name: string;
  firstName: string;
  role: string;
  headline: string;
  subheadline: string;
  portraitImage: string;
  location: string;
  timezone: string;
  available: boolean;
  availabilityLabel: string;
  email: string;
  calendlyUrl: string;
  resumeUrl: string;
  socials: SocialLink[];
  summaryStats: SummaryStat[];
  clients: ClientLogo[];
  services: ServiceItem[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
}

export const profile: Profile = {
  name: "Zoe Alvarez",
  firstName: "Zoe",
  role: "Social Media Manager & Short-Form Video Strategist",
  headline:
    "Scaling brands through short-form video & visual storytelling.",
  subheadline:
    "I turn scroll-stopping creative into measurable growth — 50M+ organic impressions and counting for DTC, lifestyle, and hospitality brands.",
  portraitImage:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=1100&q=80",
  location: "Kuala Lumpur, Malaysia",
  timezone: "MYT (UTC+8)",
  available: true,
  availabilityLabel: "Available for projects",
  email: "hello@zoealvarez.co",
  calendlyUrl: "https://calendly.com/zoealvarez/intro",
  resumeUrl: "/zoe-alvarez-resume.pdf",
  socials: [
    {
      platform: "instagram",
      label: "Instagram",
      handle: "@zoecreates",
      href: "https://instagram.com",
    },
    {
      platform: "tiktok",
      label: "TikTok",
      handle: "@zoecreates",
      href: "https://tiktok.com",
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      handle: "in/zoealvarez",
      href: "https://linkedin.com",
    },
    {
      platform: "youtube",
      label: "YouTube",
      handle: "@zoecreates",
      href: "https://youtube.com",
    },
    {
      platform: "email",
      label: "Email",
      handle: "hello@zoealvarez.co",
      href: "mailto:hello@zoealvarez.co",
    },
  ],
  summaryStats: [
    {
      label: "Total Impressions",
      value: 50,
      suffix: "M+",
      description: "Organic reach generated across managed accounts",
    },
    {
      label: "Avg. Engagement Lift",
      value: 3.5,
      suffix: "x",
      decimals: 1,
      description: "Median increase within the first 90 days",
    },
    {
      label: "Short-Form Videos",
      value: 120,
      suffix: "+",
      description: "Concept, shoot, edit, and publish end to end",
    },
    {
      label: "Brand Campaigns",
      value: 10,
      suffix: "+",
      description: "Full-funnel launches across paid and organic",
    },
  ],
  clients: [
    { name: "Lumen Skincare", category: "Client" },
    { name: "Northwind Coffee", category: "Client" },
    { name: "Atlas Apparel", category: "Client" },
    { name: "Verde Wellness", category: "Client" },
    { name: "Harbor Hotels", category: "Client" },
    { name: "Tide & Timber", category: "Client" },
    { name: "Studio Marlow", category: "Client" },
    { name: "Pulse Fitness", category: "Client" },
    { name: "AdWeek", category: "Media" },
    { name: "Vogue Business", category: "Media" },
    { name: "Social Media Today", category: "Media" },
    { name: "Shorty Awards", category: "Award" },
  ],
  services: [
    {
      title: "Short-Form Video",
      description:
        "Hook-first scripts, vertical edits, and platform-native pacing built to hold attention past the 3-second mark.",
      icon: "video",
    },
    {
      title: "Content Strategy",
      description:
        "Channel audits, content pillars, and 90-day calendars mapped to real business goals — not vanity metrics.",
      icon: "strategy",
    },
    {
      title: "Growth & Community",
      description:
        "Daily community management, trend-jacking, and comment strategy that compounds organic reach.",
      icon: "growth",
    },
    {
      title: "Creative Direction",
      description:
        "Feed aesthetics, carousel systems, and paid creative that keeps the brand visually consistent everywhere.",
      icon: "creative",
    },
  ],
  experience: [
    {
      role: "Lead Social Media Manager",
      company: "Studio Marlow",
      period: "2023 — Present",
      location: "Los Angeles, CA",
      type: "Agency",
      description:
        "Own social strategy and short-form production for a roster of DTC and hospitality brands.",
      highlights: [
        "Grew managed accounts from 1.2M to 6.8M combined followers",
        "Built a repeatable vertical video system adopted by the whole team",
        "Lifted average engagement rate from 1.8% to 6.2% across the roster",
      ],
    },
    {
      role: "Social Media Manager",
      company: "Lumen Skincare",
      period: "2021 — 2023",
      location: "Remote",
      type: "In-house",
      description:
        "Ran organic and creator-led social for a fast-scaling skincare brand through two product launches.",
      highlights: [
        "Took TikTok from 0 to 420K followers in 14 months",
        "Drove 2.4M organic video views on a single launch campaign",
        "Cut cost-per-engagement by 38% with UGC-first creative",
      ],
    },
    {
      role: "Content Producer",
      company: "Northwind Coffee",
      period: "2019 — 2021",
      location: "Portland, OR",
      type: "Freelance",
      description:
        "Produced photo and video content for retail openings and seasonal menu launches.",
      highlights: [
        "Produced 200+ assets across 12 store openings",
        "Built the brand's first evergreen content library",
      ],
    },
    {
      role: "Marketing Coordinator",
      company: "Atlas Apparel",
      period: "2017 — 2019",
      location: "Austin, TX",
      type: "Full-time",
      description:
        "Supported campaign planning, influencer outreach, and community management.",
      highlights: [
        "Managed a 40-creator ambassador program",
        "Doubled email-to-social cross-promotion revenue",
      ],
    },
  ],
  testimonials: [
    {
      quote:
        "Zoe rebuilt our entire short-form playbook. Within a quarter our organic reach tripled and launch videos were outperforming paid.",
      name: "Priya Raman",
      title: "Founder & CEO",
      company: "Lumen Skincare",
      initials: "PR",
    },
    {
      quote:
        "The rare strategist who can also shoot, edit, and ship. She moves faster than our full agency did — and the work lands better.",
      name: "Daniel Okafor",
      title: "Marketing Director",
      company: "Harbor Hotels",
      initials: "DO",
    },
    {
      quote:
        "Our engagement rate went from forgettable to top-of-category in 90 days. Zoe's content system is the reason.",
      name: "Mika Tanaka",
      title: "Head of Brand",
      company: "Verde Wellness",
      initials: "MT",
    },
    {
      quote:
        "She treats community management like a growth channel, not a chore. Comments became our best-performing content brief.",
      name: "Sofia Lindqvist",
      title: "Co-founder",
      company: "Tide & Timber",
      initials: "SL",
    },
    {
      quote:
        "Zoe understood our brand voice on day one. Every deliverable felt native to the platform and unmistakably ours.",
      name: "Marcus Bell",
      title: "Agency Partner",
      company: "Studio Marlow",
      initials: "MB",
    },
    {
      quote:
        "Our launch video hit 1.2M views with zero paid spend. That single campaign changed how the whole company thinks about social.",
      name: "Ava Chen",
      title: "VP Growth",
      company: "Pulse Fitness",
      initials: "AC",
    },
  ],
};
