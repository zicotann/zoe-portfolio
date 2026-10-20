export interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
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
  coverImage: string;
  featured: boolean;
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

const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const poster = (id: string) => img(id, 900, 1600);
const photo = (id: string) => img(id, 1200, 900);
const squareImg = (id: string) => img(id, 1200, 1200);
const wideImg = (id: string) => img(id, 1600, 900);

export const campaigns: Campaign[] = [
  {
    id: "camp_lumen",
    slug: "lumen-skincare-launch",
    clientName: "Lumen Skincare",
    clientLogo: "LS",
    industry: "Beauty & Skincare",
    role: "Social Media Manager",
    period: "Q2 2023 — Q4 2023",
    summary:
      "A creator-led short-form launch that took a niche skincare line from 0 to 420K TikTok followers in 14 months.",
    heroImage: poster("1522335789203-aabd1fc54bc9"),
    coverImage: photo("1596462502278-27bfdc403348"),
    featured: true,
    keyMetrics: [
      { label: "Organic Video Views", value: 2.4, suffix: "M", decimals: 1 },
      { label: "Follower Growth", value: 180, prefix: "+", suffix: "%" },
      { label: "Engagement Rate", value: 8.2, suffix: "%", decimals: 1 },
      { label: "Videos Produced", value: 46, suffix: "" },
    ],
    deliverables: [
      "Short-form video system",
      "Creator/UGC pipeline",
      "Launch content calendar",
      "Community management playbook",
    ],
    videoSamples: [
      {
        title: "3-second hook: 'Your serum is lying to you'",
        aspectRatio: "9:16",
        thumbnail: poster("1571781926291-c477ebfd024b"),
      },
      {
        title: "Founder POV: behind the formulation",
        aspectRatio: "9:16",
        thumbnail: poster("1522335789203-aabd1fc54bc9"),
      },
      {
        title: "Before/after 30-day skin diary",
        aspectRatio: "9:16",
        thumbnail: poster("1523275335684-37898b6baf30"),
      },
      {
        title: "Trend-jack: 'Get ready with me'",
        aspectRatio: "9:16",
        thumbnail: poster("1596462502278-27bfdc403348"),
      },
    ],
    imageSamples: [
      { caption: "Product launch carousel", imageUrl: photo("1596462502278-27bfdc403348") },
      { caption: "Ingredient education series", imageUrl: photo("1522335789203-aabd1fc54bc9") },
      { caption: "Paid social creative set", imageUrl: photo("1523275335684-37898b6baf30") },
    ],
    fullStrategyBreakdown: {
      theChallenge:
        "Lumen had a strong product but an invisible social presence — under 2K followers, an engagement rate of 1.4%, and no repeatable content system before a major retail launch.",
      theStrategy:
        "I built a hook-first vertical video engine: three content pillars (education, transformation, behind-the-scenes), a creator/UGC pipeline, and a weekly test cadence where every top-performing hook was re-cut into five variants.",
      theResults:
        "TikTok grew from 0 to 420K followers in 14 months, a single launch video hit 2.4M organic views, and engagement rate climbed to 8.2% — without a dollar of paid amplification on the organic side.",
    },
  },
  {
    id: "camp_harbor",
    slug: "harbor-hotels-summer",
    clientName: "Harbor Hotels",
    clientLogo: "HH",
    industry: "Hospitality",
    role: "Content Strategist",
    period: "Q1 2024 — Q3 2024",
    summary:
      "A destination storytelling program that filled low-season weekends and turned the property into a social-first brand.",
    heroImage: poster("1445019980597-93fa8acb246c"),
    coverImage: photo("1571896349842-33c89424de2d"),
    featured: true,
    keyMetrics: [
      { label: "Impressions", value: 12.6, suffix: "M", decimals: 1 },
      { label: "Direct Bookings Lift", value: 64, prefix: "+", suffix: "%" },
      { label: "Saves + Shares", value: 310, suffix: "K" },
      { label: "Posts Published", value: 210, suffix: "" },
    ],
    deliverables: [
      "Destination content strategy",
      "Reels & TikTok production",
      "Influencer stay program",
      "Paid social creative",
    ],
    videoSamples: [
      {
        title: "Room tour: the cliffside suite",
        aspectRatio: "9:16",
        thumbnail: poster("1552674605-db6ffd4facb5"),
      },
      {
        title: "48 hours at the property",
        aspectRatio: "9:16",
        thumbnail: poster("1571896349842-33c89424de2d"),
      },
      {
        title: "Sunrise timelapse from the deck",
        aspectRatio: "16:9",
        thumbnail: wideImg("1445019980597-93fa8acb246c"),
      },
      {
        title: "Chef's table teaser",
        aspectRatio: "9:16",
        thumbnail: poster("1517248135467-4c7edcad34c4"),
      },
    ],
    imageSamples: [
      { caption: "Weekend getaway carousel", imageUrl: photo("1552674605-db6ffd4facb5") },
      { caption: "Seasonal dining feature", imageUrl: photo("1546069901-ba9599a7e63c") },
      { caption: "Amenity highlight set", imageUrl: photo("1571896349842-33c89424de2d") },
    ],
    fullStrategyBreakdown: {
      theChallenge:
        "Harbor had premium photography but no social-native storytelling. Bookings dipped every off-season and awareness was limited to return guests.",
      theStrategy:
        "I reframed the property as a destination, not a hotel: a slow-travel video series, an influencer stay program timed to shoulder season, and paid creative cut directly from top organic Reels.",
      theResults:
        "12.6M impressions across the season, a 64% lift in direct bookings, and 310K saves and shares — turning off-season weekends into sell-out dates.",
    },
  },
  {
    id: "camp_verde",
    slug: "verde-wellness-community",
    clientName: "Verde Wellness",
    clientLogo: "VW",
    industry: "Health & Wellness",
    role: "Community & Growth Lead",
    period: "Q4 2023 — Q2 2024",
    summary:
      "Community-first social that turned a quiet comment section into the brand's highest-converting acquisition channel.",
    heroImage: poster("1512496015851-a90fb38ba796"),
    coverImage: photo("1546069901-ba9599a7e63c"),
    featured: false,
    keyMetrics: [
      { label: "Engagement Rate", value: 9.4, suffix: "%", decimals: 1 },
      { label: "Community Replies", value: 84, suffix: "K" },
      { label: "Saves", value: 120, suffix: "K" },
      { label: "Avg. Watch Time", value: 22, suffix: "s" },
    ],
    deliverables: [
      "Community management playbook",
      "Comment-to-content pipeline",
      "Instagram & TikTok growth",
    ],
    videoSamples: [
      {
        title: "Answering the top comment (series)",
        aspectRatio: "9:16",
        thumbnail: poster("1512496015851-a90fb38ba796"),
      },
      {
        title: "5-minute morning routine",
        aspectRatio: "9:16",
        thumbnail: poster("1546069901-ba9599a7e63c"),
      },
      {
        title: "Myth-busting with our nutritionist",
        aspectRatio: "9:16",
        thumbnail: poster("1552674605-db6ffd4facb5"),
      },
    ],
    imageSamples: [
      { caption: "Habit-building carousel", imageUrl: photo("1512496015851-a90fb38ba796") },
      { caption: "Founder Q&A recap", imageUrl: photo("1546069901-ba9599a7e63c") },
    ],
    fullStrategyBreakdown: {
      theChallenge:
        "Verde published consistently but never responded to its audience. Comments were piling up unanswered and reach was flatlining at a 2.1% engagement rate.",
      theStrategy:
        "I treated comments as a content brief. Every week I mined the top questions and turned them into a recurring 'answering the top comment' video series, paired with a same-day community response SLA.",
      theResults:
        "Engagement rate nearly quadrupled to 9.4%, community replies hit 84K, and the recurring series became the brand's most-watched content format.",
    },
  },
  {
    id: "camp_atlas",
    slug: "atlas-apparel-viral",
    clientName: "Atlas Apparel",
    clientLogo: "AA",
    industry: "Fashion & Apparel",
    role: "Social Media Manager",
    period: "Q3 2024 — Q1 2025",
    summary:
      "A single founder-led video that went viral and became a repeatable format, driving a sold-out drop.",
    heroImage: poster("1483985988355-763728e1935b"),
    coverImage: photo("1503342217505-b0a15ec3261c"),
    featured: true,
    keyMetrics: [
      { label: "Views on Hero Video", value: 1.2, suffix: "M", decimals: 1 },
      { label: "Drop Sell-Through", value: 100, suffix: "%" },
      { label: "New Followers", value: 96, suffix: "K" },
      { label: "UGC Assets", value: 340, suffix: "" },
    ],
    deliverables: [
      "Founder-led content format",
      "Drop campaign calendar",
      "UGC harvesting program",
    ],
    videoSamples: [
      {
        title: "Founder: 'We almost didn't make this'",
        aspectRatio: "9:16",
        thumbnail: poster("1503342217505-b0a15ec3261c"),
      },
      {
        title: "How the jacket is actually made",
        aspectRatio: "9:16",
        thumbnail: poster("1441986300917-64674bd600d8"),
      },
      {
        title: "Customer review reaction",
        aspectRatio: "9:16",
        thumbnail: poster("1483985988355-763728e1935b"),
      },
      {
        title: "Lookbook in motion",
        aspectRatio: "1:1",
        thumbnail: squareImg("1523275335684-37898b6baf30"),
      },
    ],
    imageSamples: [
      { caption: "Drop teaser carousel", imageUrl: photo("1483985988355-763728e1935b") },
      { caption: "Fit guide graphics", imageUrl: photo("1503342217505-b0a15ec3261c") },
      { caption: "UGC repost grid", imageUrl: photo("1441986300917-64674bd600d8") },
    ],
    fullStrategyBreakdown: {
      theChallenge:
        "Atlas relied entirely on paid ads. Product drops consistently under-performed and the brand had no organic audience to launch into.",
      theStrategy:
        "I built a founder-led format: unpolished, honest, story-driven videos shot on a phone. We doubled down on the one that broke out and re-cut it into a repeatable pre-drop series leading into launch day.",
      theResults:
        "The hero video passed 1.2M views, the following drop sold through 100%, and Atlas gained 96K followers plus 340 pieces of customer UGC in a single quarter.",
    },
  },
  {
    id: "camp_pulse",
    slug: "pulse-fitness-challenge",
    clientName: "Pulse Fitness",
    clientLogo: "PF",
    industry: "Fitness",
    role: "Campaign Lead",
    period: "Q2 2024",
    summary:
      "A 30-day community challenge that turned members into creators and tripled brand-owned reach.",
    heroImage: poster("1517836357463-d25dfeac3438"),
    coverImage: photo("1571019613454-1cb2f99b2d8b"),
    featured: false,
    keyMetrics: [
      { label: "Challenge Participants", value: 18, suffix: "K" },
      { label: "UGC Submissions", value: 4.1, suffix: "K", decimals: 1 },
      { label: "Reach Lift", value: 210, prefix: "+", suffix: "%" },
      { label: "App Signups", value: 6.4, suffix: "K", decimals: 1 },
    ],
    deliverables: [
      "Challenge campaign concept",
      "Creator incentive design",
      "Daily social calendar",
    ],
    videoSamples: [
      {
        title: "Day 1 challenge kickoff",
        aspectRatio: "9:16",
        thumbnail: poster("1517836357463-d25dfeac3438"),
      },
      {
        title: "Coach tip: form fix",
        aspectRatio: "9:16",
        thumbnail: poster("1571019613454-1cb2f99b2d8b"),
      },
      {
        title: "Winner announcement",
        aspectRatio: "9:16",
        thumbnail: poster("1571781926291-c477ebfd024b"),
      },
    ],
    imageSamples: [
      { caption: "Challenge rules carousel", imageUrl: photo("1517836357463-d25dfeac3438") },
      { caption: "Progress tracker template", imageUrl: photo("1571019613454-1cb2f99b2d8b") },
    ],
    fullStrategyBreakdown: {
      theChallenge:
        "Pulse had an engaged member base but almost no public social presence. Content was gym-generic and never featured real people.",
      theStrategy:
        "I designed a 30-day challenge with a low-friction participation mechanic: members posted a daily clip with a branded hashtag for a prize draw. Brand content shifted to amplifying member submissions instead of polished ads.",
      theResults:
        "18K participants, 4.1K UGC submissions, a 210% lift in brand reach, and 6.4K app signups driven entirely by community-created content.",
    },
  },
];

export const featuredCampaigns = campaigns.filter((c) => c.featured);

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}
