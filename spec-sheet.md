# AI Specification Sheet: Social Media Manager Portfolio Website

## 1. Project Overview & Objective

Build a blazingly fast, high-impact, single-page portfolio website for a Social Media Manager. The website must prioritize visual proof, campaign metrics, short-form video previews, and zero-friction navigation.

### Core Architecture & Strategy

- **Single-Page Continuous Scroll:** All key sections (Hero, Impact Metrics, Logo Cloud, Campaign Highlights, Resume & Experience, Content Reels, Testimonials, Contact) live on one seamless page to prevent drop-off.
- **Deep-Dive Drawers:** Detailed case study breakdowns open in side sheets/drawers (`shadcn/ui` Sheet component) directly on the page, keeping the user in the continuous scroll context without loading new pages.
- **Scalable Route Architecture:** Structured using Next.js App Router so standalone pages (e.g., `/case-study/[slug]` or `/about`) can easily be added later without refactoring.
- **Data-Driven:** All text, metrics, campaign assets, and resume details must be loaded from external TypeScript/JSON files (`profile.ts` and `campaigns.ts`) for easy content updates.

---

## 2. Tech Stack Requirements

- **Framework:** Next.js (App Router, React, Static Site Generation enabled for instant load times).
- **Styling:** Tailwind CSS (v3+).
- **Base Primitives:** `shadcn/ui` (Sheet, Dialog, Button, Card, Badge, Tooltip, Form).
- **Motion & Visual Polish:** `Magic UI` / `Framer Motion` (Number Ticker / Animated Counter, Bento Grid, Marquee / Logo Cloud, Shimmer Button, Dock Navigation).
- **Icons:** `lucide-react` + Simple Icons (for Instagram, TikTok, LinkedIn, YouTube SVGs).

---

## 3. Directory & Data Structure

```text
src/
├── data/
│   ├── profile.ts           # Bio, headline, summary stats, experience timeline, social links
│   └── campaigns.ts         # Array of campaign objects and case study data
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── magicui/             # Magic UI components (Bento Grid, Marquee, Number Ticker, Dock)
│   ├── sections/            # Page sections (Hero, MetricsBar, LogoCloud, CampaignGrid, Experience, ContentReels, Testimonials, Contact)
│   └── case-study-sheet.tsx # Deep-dive drawer component
└── app/
    ├── page.tsx             # Main single-page application
    └── layout.tsx           # Root layout
```

### Data Schema (`src/data/campaigns.ts`)

```ts
export interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export interface VideoSample {
  title: string;
  aspectRatio: "9:16" | "16:9" | "1:1";
  thumbnail: string;
  videoUrl?: string;
  embedUrl?: string;
}

export interface ImageSample {
  caption: string;
  imageUrl: string;
}

export interface Campaign {
  id: string;
  slug: string;
  clientName: string;
  clientLogo: string;
  industry: string;
  role: string;
  period: string;
  summary: string;
  heroImage: string;
  keyMetrics: Metric[];
  deliverables: string[];
  videoSamples?: VideoSample[];
  imageSamples?: ImageSample[];
  fullStrategyBreakdown: {
    theChallenge: string;
    theStrategy: string;
    theResults: string;
  };
}
```

---

## 4. Layout & Component Specification

### 1. Header / Navigation

- **Component:** Fixed top navigation bar or floating bottom Magic UI Dock.
- **Items:** Brand/Name logo, smooth-scroll anchor links (`#work`, `#metrics`, `#experience`, `#contact`), and a high-visibility CTA button (Magic UI Shimmer Button) linking to Calendly or the contact form.

### 2. Minimalist Hero Section

- **Aesthetic:** Clean, uncluttered, high-contrast, bold typography.
- **Elements:**
  - **Headline:** High-impact value proposition (e.g., "Scaling Brands Through Short-Form Video & Visual Storytelling").
  - **Subheadline:** Concise 2-line summary highlighting total audience reach or growth specialty.
  - **Quick Badges:** "Available for Projects" indicator dot + social media icons (Instagram, TikTok, LinkedIn).

### 3. Animated Impact Metrics Bar

- **Component:** Magic UI Number Ticker / Animated Counter.
- **Items:**
  - 50M+ Total Impressions
  - 3.5x Avg. Engagement Rate Boost
  - 120+ Short-Form Videos Produced
  - 10+ Brand Campaigns Managed

### 4. Client / Media Logo Cloud

- **Component:** Magic UI Marquee.
- **Content:** Infinite, smooth horizontal scroll showing client brand logos and media mentions.

### 5. Campaign Highlights Grid (Core Section)

- **Component:** Magic UI Bento Grid.
- **Card Elements:**
  - High-quality cover photo or thumbnail.
  - Client Name + Industry Badge.
  - Prominent metric callouts (e.g., +180% Follower Growth, 1.2M Views).
- **CTA Trigger:** "View Case Study" button opening the `CaseStudySheet` drawer.

### 6. Case Study Side Drawer (shadcn Sheet)

Opens smoothly from the right when a campaign card is clicked.

**Contents:**

- Client logo, campaign dates, and role badge.
- **Key Achievements:** Stat row powered by animated number counters.
- **Strategy & Execution:** Brief writeup covering The Challenge, The Strategy, and The Results.
- **Video Showcase:** Responsive grid of 9:16 vertical short-form video previews (TikTok / Instagram Reels style).
- **Content Samples:** Grid of feed posts, carousels, and ad creative graphics.
- **Footer Action:** "Close & View More Results" button.

### 7. Resume & Experience Section

- **Aesthetic:** Clean vertical timeline or minimalist accordion.
- **Content:** Past roles, agency/in-house achievements, key client management highlights, and a "Download PDF Resume" button.

### 8. Creative Asset Showcase (Reels & Graphics)

Interactive gallery highlighting top-performing individual TikToks, Instagram Reels, and viral carousels with video previews on hover/click.

### 9. Testimonials & Social Proof

- **Component:** Grid cards or Magic UI Marquee.
- **Content:** Quote cards from past brand founders, marketing directors, or agency leads praising ROI, creativity, and speed.

### 10. Contact & CTA Section

Simple contact form built with `shadcn/ui` form primitives paired with direct email, direct social DM buttons, and an embedded Calendly scheduling button.

---

## 5. Performance & Mobile Constraints

- **Zero Heavy Assets on Initial Load:** All vertical video previews must lazy-load or use optimized poster thumbnails before playback.
- **Fast Image Formats:** Use Next.js `<Image />` component with WebP format, explicit aspect ratios, and blur placeholder loading.
- **Mobile Touch Targets:** All interactive elements (buttons, drawer triggers, tabs) must have a minimum touch target height of 44px.
- **Strict Design Aesthetics:** Clean, spacious, and modern. Avoid chaotic graphics, excessive gradients, or crowded text.
