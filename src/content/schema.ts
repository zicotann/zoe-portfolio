import { z } from "zod";

export const socialPlatformSchema = z.enum([
  "instagram",
  "tiktok",
  "linkedin",
  "youtube",
  "x",
  "facebook",
  "threads",
  "pinterest",
  "snapchat",
  "twitch",
  "whatsapp",
  "telegram",
  "discord",
  "spotify",
  "soundcloud",
  "reddit",
  "tumblr",
  "vimeo",
  "behance",
  "dribbble",
  "github",
  "medium",
  "substack",
  "bluesky",
  "mastodon",
  "linktree",
  "signal",
  "viber",
  "email",
  "phone",
  "link",
]);

export const socialLinkSchema = z.object({
  id: z.string().min(1),
  platform: socialPlatformSchema,
  label: z.string(),
  handle: z.string(),
  href: z.string(),
});

export const summaryStatSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  decimals: z.number().int().min(0).max(6).optional(),
  description: z.string(),
});

export const clientCategorySchema = z.enum(["Client", "Media", "Award"]);

export const clientLogoSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  category: clientCategorySchema,
});

export const experienceTypeSchema = z.enum([
  "Full-time",
  "Contract",
  "Freelance",
  "In-house",
  "Agency",
]);

export const experienceItemSchema = z.object({
  id: z.string().min(1),
  role: z.string(),
  company: z.string(),
  period: z.string(),
  location: z.string(),
  type: experienceTypeSchema,
  description: z.string(),
  highlights: z.array(z.string()),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string(),
  name: z.string(),
  title: z.string(),
  company: z.string(),
  initials: z.string(),
});

export const serviceIconSchema = z.enum([
  "video",
  "strategy",
  "growth",
  "creative",
]);

export const serviceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
  icon: serviceIconSchema,
});

export const navIconSchema = z.enum([
  "work",
  "metrics",
  "experience",
  "reels",
  "testimonials",
  "contact",
  "mail",
  "link",
]);

export const navLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  href: z.string(),
  icon: navIconSchema,
});

export const availabilityColorSchema = z.enum(["green", "yellow", "red"]);

const profileShape = z.object({
  name: z.string(),
  firstName: z.string(),
  role: z.string(),
  headlineLead: z.string(),
  headlineAccent: z.string(),
  subheadline: z.string(),
  portraitImage: z.string().min(1),
  location: z.string(),
  timezone: z.string(),
  availability: z.string(),
  availabilityColor: availabilityColorSchema,
  email: z.string(),
  calendlyUrl: z.string(),
  resumeUrl: z.string(),
});

export const profileSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const availability =
    typeof record.availability === "string"
      ? record.availability
      : record.available === false
        ? ""
        : typeof record.availabilityLabel === "string"
          ? record.availabilityLabel
          : "";

  return {
    ...record,
    availability,
    availabilityColor: record.availabilityColor ?? "green",
  };
}, profileShape);

export const navigationSchema = z.object({
  links: z.array(navLinkSchema),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export const seoSchema = z.object({
  siteUrl: z.string().url(),
  titleTemplate: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
});

export const campaignCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const metricSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  value: z.number(),
  suffix: z.string(),
  prefix: z.string().optional(),
  decimals: z.number().int().min(0).max(6).optional(),
});

export const videoAspectRatioSchema = z.enum(["9:16", "16:9", "1:1"]);

export const videoSourceSchema = z.enum(["instagram", "linkedin", "url"]);

export const videoSampleSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  aspectRatio: videoAspectRatioSchema,
  thumbnail: z.string().min(1),
  source: videoSourceSchema.default("url"),
  postUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  embedUrl: z.string().optional(),
});

export const imageSampleSchema = z.object({
  id: z.string().min(1),
  caption: z.string(),
  imageUrl: z.string().min(1),
});

export const strategyBreakdownSchema = z.object({
  theChallenge: z.string(),
  theStrategy: z.string(),
  theResults: z.string(),
});

export const campaignSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  clientName: z.string(),
  clientLogo: z.string(),
  categoryId: z.string(),
  role: z.string(),
  period: z.string(),
  summary: z.string(),
  heroImage: z.string().min(1),
  coverImage: z.string().min(1),
  featured: z.boolean(),
  keyMetrics: z.array(metricSchema),
  deliverables: z.array(z.string()),
  videoSamples: z.array(videoSampleSchema).optional(),
  imageSamples: z.array(imageSampleSchema).optional(),
  fullStrategyBreakdown: strategyBreakdownSchema,
});

export const heroContentSchema = z.object({
  visible: z.boolean().default(true),
  primaryCtaLabel: z.string(),
  primaryCtaHref: z.string(),
  secondaryCtaLabel: z.string(),
  secondaryCtaHref: z.string(),
  followLabel: z.string(),
  portraitAlt: z.string(),
  floatingStatValue: z.string(),
  floatingStatLabel: z.string(),
  floatingBadge: z.string(),
});

export const metricsContentSchema = z.object({
  visible: z.boolean().default(true),
  stats: z.array(summaryStatSchema),
});

export const clientsContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  clients: z.array(clientLogoSchema),
});

export const caseStudyCopySchema = z.object({
  pageTitleSuffix: z.string(),
  keyAchievementsLabel: z.string(),
  strategyLabel: z.string(),
  challengeHeading: z.string(),
  strategyHeading: z.string(),
  resultsHeading: z.string(),
  videoShowcaseHeading: z.string(),
  contentSamplesHeading: z.string(),
  deliverablesLabel: z.string(),
  closeLabel: z.string(),
  backLabel: z.string(),
  ctaHeading: z.string(),
  ctaLabel: z.string(),
});

export const campaignsContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  headingLead: z.string(),
  headingAccent: z.string(),
  description: z.string(),
  allLabel: z.string(),
  featuredLabel: z.string(),
  viewLabel: z.string(),
  caseStudy: caseStudyCopySchema,
  campaigns: z.array(campaignSchema),
});

export const experienceContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  heading: z.string(),
  description: z.string(),
  resumeLabel: z.string(),
  services: z.array(serviceItemSchema),
  experience: z.array(experienceItemSchema),
});

export const reelsContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  headingLead: z.string(),
  headingAccent: z.string(),
  description: z.string(),
  limit: z.number().int().min(1).max(24),
});

export const testimonialsContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  heading: z.string(),
  testimonials: z.array(testimonialSchema),
});

export const contactFormCopySchema = z.object({
  nameLabel: z.string(),
  namePlaceholder: z.string(),
  emailLabel: z.string(),
  emailPlaceholder: z.string(),
  companyLabel: z.string(),
  companyPlaceholder: z.string(),
  messageLabel: z.string(),
  messagePlaceholder: z.string(),
  submitLabel: z.string(),
  sentLabel: z.string(),
  errorName: z.string(),
  errorEmail: z.string(),
  errorMessage: z.string(),
});

export const contactContentSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string(),
  headingLead: z.string(),
  headingAccent: z.string(),
  description: z.string(),
  bookingLabel: z.string(),
  basedInLabel: z.string(),
  form: contactFormCopySchema,
});

export const footerContentSchema = z.object({
  rightsLabel: z.string(),
});

export const siteSectionsSchema = z.object({
  hero: heroContentSchema,
  metrics: metricsContentSchema,
  clients: clientsContentSchema,
  campaigns: campaignsContentSchema,
  experience: experienceContentSchema,
  reels: reelsContentSchema,
  testimonials: testimonialsContentSchema,
  contact: contactContentSchema,
  footer: footerContentSchema,
});

export const siteContentSchema = z
  .object({
    version: z.literal(1),
    profile: profileSchema,
    socials: z.array(socialLinkSchema),
    navigation: navigationSchema,
    seo: seoSchema,
    categories: z.array(campaignCategorySchema),
    sections: siteSectionsSchema,
  })
  .superRefine((value, ctx) => {
    const categoryIds = new Set<string>();
    value.categories.forEach((category, index) => {
      if (categoryIds.has(category.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Category ids must be unique.",
          path: ["categories", index, "id"],
        });
      }
      categoryIds.add(category.id);
    });

    const slugs = new Set<string>();
    const campaignIds = new Set<string>();
    value.sections.campaigns.campaigns.forEach((campaign, index) => {
      if (!categoryIds.has(campaign.categoryId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Choose a valid campaign category.",
          path: ["sections", "campaigns", "campaigns", index, "categoryId"],
        });
      }
      if (slugs.has(campaign.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campaign slugs must be unique.",
          path: ["sections", "campaigns", "campaigns", index, "slug"],
        });
      }
      slugs.add(campaign.slug);

      if (campaignIds.has(campaign.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campaign ids must be unique.",
          path: ["sections", "campaigns", "campaigns", index, "id"],
        });
      }
      campaignIds.add(campaign.id);
    });

    const navIds = new Set<string>();
    value.navigation.links.forEach((link, index) => {
      if (navIds.has(link.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Navigation link ids must be unique.",
          path: ["navigation", "links", index, "id"],
        });
      }
      navIds.add(link.id);
    });

    const socialIds = new Set<string>();
    value.socials.forEach((social, index) => {
      if (socialIds.has(social.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Social link ids must be unique.",
          path: ["socials", index, "id"],
        });
      }
      socialIds.add(social.id);
    });
  });

export type SocialPlatform = z.infer<typeof socialPlatformSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type SummaryStat = z.infer<typeof summaryStatSchema>;
export type ClientCategory = z.infer<typeof clientCategorySchema>;
export type ClientLogo = z.infer<typeof clientLogoSchema>;
export type ExperienceType = z.infer<typeof experienceTypeSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ServiceIcon = z.infer<typeof serviceIconSchema>;
export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type NavIcon = z.infer<typeof navIconSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type AvailabilityColor = z.infer<typeof availabilityColorSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Navigation = z.infer<typeof navigationSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type CampaignCategory = z.infer<typeof campaignCategorySchema>;
export type Metric = z.infer<typeof metricSchema>;
export type VideoAspectRatio = z.infer<typeof videoAspectRatioSchema>;
export type VideoSource = z.infer<typeof videoSourceSchema>;
export type VideoSample = z.infer<typeof videoSampleSchema>;
export type ImageSample = z.infer<typeof imageSampleSchema>;
export type StrategyBreakdown = z.infer<typeof strategyBreakdownSchema>;
export type Campaign = z.infer<typeof campaignSchema>;
export type HeroContent = z.infer<typeof heroContentSchema>;
export type MetricsContent = z.infer<typeof metricsContentSchema>;
export type ClientsContent = z.infer<typeof clientsContentSchema>;
export type CaseStudyCopy = z.infer<typeof caseStudyCopySchema>;
export type CampaignsContent = z.infer<typeof campaignsContentSchema>;
export type ExperienceContent = z.infer<typeof experienceContentSchema>;
export type ReelsContent = z.infer<typeof reelsContentSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsContentSchema>;
export type ContactFormCopy = z.infer<typeof contactFormCopySchema>;
export type ContactContent = z.infer<typeof contactContentSchema>;
export type FooterContent = z.infer<typeof footerContentSchema>;
export type SiteSections = z.infer<typeof siteSectionsSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
