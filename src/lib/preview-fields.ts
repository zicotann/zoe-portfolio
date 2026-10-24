export type PreviewField =
  | "sections.hero.visible"
  | "profile.role"
  | "profile.availability"
  | "profile.availabilityColor"
  | "profile.headlineLead"
  | "profile.headlineAccent"
  | "profile.subheadline"
  | "profile.portraitImage"
  | "sections.hero.primaryCtaLabel"
  | "sections.hero.primaryCtaHref"
  | "sections.hero.secondaryCtaLabel"
  | "sections.hero.secondaryCtaHref"
  | "sections.hero.followLabel"
  | "sections.hero.portraitAlt"
  | "sections.hero.floatingStatValue"
  | "sections.hero.floatingStatLabel"
  | "sections.hero.floatingBadge"
  | "navigation.ctaLabel"
  | "navigation.ctaHref"
  | `navigation.links.${string}.label`
  | `navigation.links.${string}.href`
  | `navigation.links.${string}.icon`
  | `socials.${string}.platform`
  | `socials.${string}.label`
  | `socials.${string}.handle`
  | `socials.${string}.href`
  | "sections.footer.rightsLabel"
  | "sections.metrics.visible"
  | `sections.metrics.stats.${string}.label`
  | `sections.metrics.stats.${string}.value`
  | `sections.metrics.stats.${string}.prefix`
  | `sections.metrics.stats.${string}.suffix`
  | `sections.metrics.stats.${string}.decimals`
  | `sections.metrics.stats.${string}.description`
  | "sections.clients.visible"
  | "sections.clients.eyebrow"
  | `sections.clients.clients.${string}.name`
  | `sections.clients.clients.${string}.category`
  | "sections.campaigns.visible"
  | "sections.campaigns.eyebrow"
  | "sections.campaigns.headingLead"
  | "sections.campaigns.headingAccent"
  | "sections.campaigns.description"
  | "sections.campaigns.allLabel"
  | "sections.campaigns.featuredLabel"
  | "sections.campaigns.viewLabel"
  | `sections.campaigns.campaigns.${string}.clientName`
  | `sections.campaigns.campaigns.${string}.summary`
  | `sections.campaigns.campaigns.${string}.coverImage`
  | `sections.campaigns.campaigns.${string}.featured`
  | `sections.campaigns.campaigns.${string}.categoryId`
  | `sections.campaigns.campaigns.${string}.keyMetrics.${string}.label`
  | `sections.campaigns.campaigns.${string}.keyMetrics.${string}.value`
  | `sections.campaigns.campaigns.${string}.keyMetrics.${string}.prefix`
  | `sections.campaigns.campaigns.${string}.keyMetrics.${string}.suffix`
  | `sections.campaigns.campaigns.${string}.keyMetrics.${string}.decimals`
  | `categories.${string}.name`
  | "sections.experience.visible"
  | "sections.experience.eyebrow"
  | "sections.experience.heading"
  | "sections.experience.description"
  | "sections.experience.resumeLabel"
  | `sections.experience.services.${string}.title`
  | `sections.experience.services.${string}.description`
  | `sections.experience.services.${string}.icon`
  | `sections.experience.experience.${string}.role`
  | `sections.experience.experience.${string}.company`
  | `sections.experience.experience.${string}.period`
  | `sections.experience.experience.${string}.location`
  | `sections.experience.experience.${string}.type`
  | `sections.experience.experience.${string}.description`
  | `sections.experience.experience.${string}.highlights.${number}`
  | "sections.reels.visible"
  | "sections.reels.eyebrow"
  | "sections.reels.headingLead"
  | "sections.reels.headingAccent"
  | "sections.reels.description"
  | "sections.reels.limit"
  | "sections.testimonials.visible"
  | "sections.testimonials.eyebrow"
  | "sections.testimonials.heading"
  | `sections.testimonials.testimonials.${string}.quote`
  | `sections.testimonials.testimonials.${string}.name`
  | `sections.testimonials.testimonials.${string}.initials`
  | `sections.testimonials.testimonials.${string}.title`
  | `sections.testimonials.testimonials.${string}.company`
  | "sections.contact.visible"
  | "sections.contact.eyebrow"
  | "sections.contact.headingLead"
  | "sections.contact.headingAccent"
  | "sections.contact.description"
  | "sections.contact.bookingLabel"
  | "sections.contact.basedInLabel"
  | "sections.contact.form.nameLabel"
  | "sections.contact.form.namePlaceholder"
  | "sections.contact.form.emailLabel"
  | "sections.contact.form.emailPlaceholder"
  | "sections.contact.form.companyLabel"
  | "sections.contact.form.companyPlaceholder"
  | "sections.contact.form.messageLabel"
  | "sections.contact.form.messagePlaceholder"
  | "sections.contact.form.submitLabel"
  | "sections.contact.form.sentLabel"
  | "sections.contact.form.errorName"
  | "sections.contact.form.errorEmail"
  | "sections.contact.form.errorMessage";

export type PreviewAnchor = string;

export interface PreviewHighlightTarget {
  field: PreviewField;
  label: string;
  fallbackAnchors?: PreviewAnchor[];
}

const SECTION_FALLBACKS: Array<[prefix: string, anchor: PreviewAnchor]> = [
  ["profile", "hero.section"],
  ["sections.hero", "hero.section"],
  ["sections.metrics", "metrics.section"],
  ["sections.clients", "clients.section"],
  ["sections.campaigns", "campaigns.section"],
  ["categories", "campaigns.section"],
  ["sections.experience", "experience.section"],
  ["sections.reels", "reels.section"],
  ["sections.testimonials", "testimonials.section"],
  ["sections.contact", "contact.section"],
];

export function getPreviewFallbacks(field: PreviewField): PreviewAnchor[] {
  const anchors: PreviewAnchor[] = [];

  if (
    field === "profile.availability" ||
    field === "profile.availabilityColor"
  ) {
    anchors.push("hero.identity");
  }

  const campaign = /^sections\.campaigns\.campaigns\.([^.]+)\./.exec(field);
  if (campaign) anchors.push(`campaign.${campaign[1]}`);

  const service = /^sections\.experience\.services\.([^.]+)\./.exec(field);
  if (service) anchors.push(`service.${service[1]}`);

  for (const [prefix, anchor] of SECTION_FALLBACKS) {
    if (field === prefix || field.startsWith(`${prefix}.`)) {
      anchors.push(anchor);
      break;
    }
  }

  return Array.from(new Set(anchors));
}

export function previewFields(...fields: Array<PreviewField | string>) {
  return { "data-preview-field": fields.join(" ") };
}

export function previewAnchor(anchor: PreviewAnchor) {
  return { "data-preview-anchor": anchor };
}
