import type { SiteContent } from "@/content/schema";

const labels: Record<string, string> = {
  profile: "Profile & identity",
  socials: "Social links",
  navigation: "Navigation",
  seo: "SEO",
  categories: "Campaign categories",
  "sections.hero": "Hero",
  "sections.metrics": "Metrics",
  "sections.clients": "Clients",
  "sections.campaigns": "Campaigns",
  "sections.experience": "Experience",
  "sections.reels": "Reels",
  "sections.testimonials": "Testimonials",
  "sections.contact": "Contact",
  "sections.footer": "Footer",
};

function equal(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getChangedAreas(
  published: SiteContent,
  draft: SiteContent,
): string[] {
  const changed: string[] = [];

  if (!equal(published.profile, draft.profile)) changed.push(labels.profile);
  if (!equal(published.socials, draft.socials)) changed.push(labels.socials);
  if (!equal(published.navigation, draft.navigation)) changed.push(labels.navigation);
  if (!equal(published.seo, draft.seo)) changed.push(labels.seo);
  if (!equal(published.categories, draft.categories)) changed.push(labels.categories);

  (Object.keys(draft.sections) as Array<keyof SiteContent["sections"]>).forEach(
    (key) => {
      if (!equal(published.sections[key], draft.sections[key])) {
        changed.push(labels[`sections.${key}`] ?? key);
      }
    },
  );

  return changed;
}

export function contentEquals(a: SiteContent, b: SiteContent): boolean {
  return equal(a, b);
}
