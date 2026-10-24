import type { SiteContent } from "@/content/schema";

const labels: Record<string, string> = {
  profile: "Profile & identity",
  socials: "Social links",
  navigation: "Header",
  seo: "SEO",
  categories: "Campaign Categories",
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

const sectionLabels: Record<string, string> = {
  profile: "Profile & Identity",
  socials: "Social Links",
  navigation: "Header",
  seo: "SEO",
  categories: "Campaign Categories",
  hero: "Hero",
  metrics: "Metrics",
  clients: "Clients",
  campaigns: "Campaigns",
  experience: "Experience",
  reels: "Reels",
  testimonials: "Testimonials",
  contact: "Contact",
  footer: "Footer",
};

const sectionPaths = [
  "profile",
  "socials",
  "navigation",
  "seo",
  "categories",
  "sections.hero",
  "sections.metrics",
  "sections.clients",
  "sections.campaigns",
  "sections.experience",
  "sections.reels",
  "sections.testimonials",
  "sections.contact",
  "sections.footer",
];

const fieldLabels: Record<string, string> = {
  visible: "Section visible",
  availabilityColor: "Availability color",
  headlineLead: "Headline — lead",
  headlineAccent: "Headline — gradient accent",
  portraitImage: "Portrait image",
  portraitAlt: "Portrait alt text",
  calendlyUrl: "Booking URL",
  resumeUrl: "Résumé URL",
  primaryCtaLabel: "Primary CTA label",
  primaryCtaHref: "Primary CTA URL",
  secondaryCtaLabel: "Secondary CTA label",
  secondaryCtaHref: "Secondary CTA URL",
  followLabel: "Follow label",
  floatingStatValue: "Floating stat value",
  floatingStatLabel: "Floating stat label",
  floatingBadge: "Floating badge",
  ctaLabel: "Booking CTA label",
  ctaHref: "Booking CTA URL",
  siteUrl: "Site URL",
  titleTemplate: "Title template",
  ogImage: "Open Graph image",
  href: "URL",
  handle: "Handle",
  platform: "Platform",
  icon: "Icon",
  allLabel: "All filter label",
  featuredLabel: "Featured badge label",
  viewLabel: "Card link label",
  pageTitleSuffix: "Page title suffix",
  keyAchievementsLabel: "Key achievements label",
  strategyLabel: "Strategy section",
  videoShowcaseHeading: "Video showcase heading",
  contentSamplesHeading: "Content showcase heading",
  deliverablesLabel: "Deliverables label",
  closeLabel: "Close button label",
  backLabel: "Back link label",
  ctaHeading: "Bottom CTA heading",
  clientLogo: "Client logo initials",
  categoryId: "Category",
  coverImage: "Cover image",
  heroImage: "Hero image",
  featured: "Featured campaign",
  theChallenge: "The challenge",
  theStrategy: "The strategy",
  theResults: "The results",
  aspectRatio: "Aspect ratio",
  source: "Source",
  postUrl: "Post URL",
  videoUrl: "Video URL",
  imageUrl: "Image URL",
  embedUrl: "Embed URL",
  bookingLabel: "Booking button label",
  basedInLabel: "Location prefix",
  sentLabel: "Sent label",
  errorName: "Name error",
  errorEmail: "Email error",
  errorMessage: "Message error",
  rightsLabel: "Rights label",
  limit: "Maximum reels",
  decimals: "Decimal places",
  resumeLabel: "Résumé button label",
};

const containerLabels: Record<string, string> = {
  caseStudy: "Case study",
  form: "Contact form",
  fullStrategyBreakdown: "Strategy breakdown",
};

type Entity = { id: string } & Record<string, unknown>;

type ArrayMeta = {
  singular: string;
  plural: string;
  label: (item: Entity) => string;
};

const arrayMeta: Record<string, ArrayMeta> = {
  socials: {
    singular: "social link",
    plural: "social links",
    label: (item) => text(item.label) || text(item.handle) || "Untitled",
  },
  links: {
    singular: "navigation link",
    plural: "navigation links",
    label: (item) => text(item.label) || text(item.href) || "Untitled",
  },
  categories: {
    singular: "category",
    plural: "categories",
    label: (item) => text(item.name) || "Untitled",
  },
  stats: {
    singular: "metric",
    plural: "metrics",
    label: (item) => text(item.label) || "Untitled",
  },
  clients: {
    singular: "client",
    plural: "clients",
    label: (item) => text(item.name) || "Untitled",
  },
  campaigns: {
    singular: "campaign",
    plural: "campaigns",
    label: (item) => text(item.clientName) || text(item.slug) || "Untitled",
  },
  keyMetrics: {
    singular: "key metric",
    plural: "key metrics",
    label: (item) => text(item.label) || "Untitled",
  },
  videoSamples: {
    singular: "video sample",
    plural: "video samples",
    label: (item) => text(item.title) || "Untitled",
  },
  imageSamples: {
    singular: "image sample",
    plural: "image samples",
    label: (item) => text(item.caption) || "Untitled",
  },
  services: {
    singular: "service",
    plural: "services",
    label: (item) => text(item.title) || "Untitled",
  },
  experience: {
    singular: "experience entry",
    plural: "experience entries",
    label: (item) =>
      [text(item.role), text(item.company)].filter(Boolean).join(" · ") ||
      "Untitled",
  },
  testimonials: {
    singular: "testimonial",
    plural: "testimonials",
    label: (item) => text(item.name) || "Untitled",
  },
};

export type ChangeKind = "added" | "removed" | "changed" | "moved";

export type ContentChange = {
  id: string;
  sectionKey: string;
  sectionLabel: string;
  label: string;
  before?: unknown;
  after?: unknown;
  kind: ChangeKind;
  revert: (content: SiteContent) => SiteContent;
};

type PathStep = string | { id: string };

type Section = {
  key: string;
  label: string;
};

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function equal(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function humanize(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (lower === "cta") return "CTA";
      if (lower === "url") return "URL";
      if (lower === "seo") return "SEO";
      if (lower === "og") return "OG";
      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      return lower;
    })
    .join(" ");
}

function fieldLabel(key: string): string {
  return fieldLabels[key] ?? humanize(key);
}

function stepInto(current: unknown, step: PathStep): unknown {
  if (typeof step === "string") {
    if (!isObject(current)) return undefined;
    return current[step];
  }
  if (!Array.isArray(current)) return undefined;
  return current.find(
    (item) => isObject(item) && item.id === step.id,
  );
}

function getByPath(root: unknown, path: PathStep[]): unknown {
  let current: unknown = root;
  for (const step of path) {
    current = stepInto(current, step);
    if (current === undefined) return undefined;
  }
  return current;
}

function setByPath(
  content: SiteContent,
  path: PathStep[],
  value: unknown,
): SiteContent {
  if (!path.length) return clone(value) as SiteContent;
  const copy = clone(content);
  let parent = copy as unknown;
  for (let index = 0; index < path.length - 1; index += 1) {
    parent = stepInto(parent, path[index]);
    if (parent === undefined) return copy;
  }

  const last = path[path.length - 1];
  if (typeof last === "string") {
    if (isObject(parent)) parent[last] = clone(value);
    return copy;
  }

  if (Array.isArray(parent)) {
    const index = parent.findIndex(
      (item) => isObject(item) && item.id === last.id,
    );
    if (index >= 0) parent[index] = clone(value);
  }
  return copy;
}

function pathKey(path: PathStep[]): string {
  return path
    .map((step) => (typeof step === "string" ? step : `[id=${step.id}]`))
    .join(".");
}

function asEntities(value: unknown): Entity[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length === 0) return [];
  if (!value.every((item) => isObject(item) && typeof item.id === "string")) {
    return null;
  }
  return value as Entity[];
}

function compose(context: string | undefined, next: string): string {
  return context ? `${context} › ${next}` : next;
}

function diffValue(
  previous: unknown,
  next: unknown,
  path: PathStep[],
  section: Section,
  changes: ContentChange[],
  context?: string,
): void {
  if (equal(previous, next)) return;

  if (Array.isArray(previous) && Array.isArray(next)) {
    const previousEntities = asEntities(previous);
    const nextEntities = asEntities(next);
    if (previousEntities && nextEntities) {
      diffEntityArray(
        previousEntities,
        nextEntities,
        path,
        section,
        changes,
        context,
      );
      return;
    }
  }

  if (isObject(previous) && isObject(next)) {
    const key = String(path[path.length - 1] ?? "");
    const container = containerLabels[key];
    const nestedContext = container
      ? compose(context, container)
      : context;
    const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
    keys.forEach((childKey) => {
      diffValue(
        previous[childKey],
        next[childKey],
        [...path, childKey],
        section,
        changes,
        nestedContext,
      );
    });
    return;
  }

  const key = String(path[path.length - 1] ?? "");
  const label = compose(context, fieldLabel(key));
  changes.push({
    id: pathKey(path),
    sectionKey: section.key,
    sectionLabel: section.label,
    label,
    before: previous,
    after: next,
    kind: "changed",
    revert: (content) => setByPath(content, path, previous),
  });
}

function diffEntityArray(
  previous: Entity[],
  next: Entity[],
  path: PathStep[],
  section: Section,
  changes: ContentChange[],
  context?: string,
): void {
  const key = String(path[path.length - 1] ?? "");
  const meta = arrayMeta[key] ?? {
    singular: "item",
    plural: `${humanize(key).toLowerCase()} items`,
    label: (item: Entity) => text(item.name) || text(item.label) || "Untitled",
  };

  const previousById = new Map(previous.map((item) => [item.id, item]));
  const nextById = new Map(next.map((item) => [item.id, item]));

  previous.forEach((item, index) => {
    if (nextById.has(item.id)) return;
    changes.push({
      id: `${pathKey(path)}#remove:${item.id}`,
      sectionKey: section.key,
      sectionLabel: section.label,
      label: compose(context, `Removed ${meta.singular} “${meta.label(item)}”`),
      before: item,
      kind: "removed",
      revert: (content) => {
        const list = getByPath(content, path);
        if (!Array.isArray(list)) return content;
        const nextList = [...list];
        nextList.splice(Math.min(index, nextList.length), 0, item);
        return setByPath(content, path, nextList);
      },
    });
  });

  next.forEach((item) => {
    if (previousById.has(item.id)) return;
    changes.push({
      id: `${pathKey(path)}#add:${item.id}`,
      sectionKey: section.key,
      sectionLabel: section.label,
      label: compose(context, `Added ${meta.singular} “${meta.label(item)}”`),
      after: item,
      kind: "added",
      revert: (content) => {
        const list = getByPath(content, path);
        if (!Array.isArray(list)) return content;
        return setByPath(
          content,
          path,
          list.filter(
            (entry) => !(isObject(entry) && entry.id === item.id),
          ),
        );
      },
    });
  });

  next.forEach((item) => {
    const before = previousById.get(item.id);
    if (!before) return;
    const itemContext = compose(
      context,
      meta.label(before) || meta.label(item),
    );
    diffValue(
      before,
      item,
      [...path, { id: item.id }],
      section,
      changes,
      itemContext,
    );
  });

  const previousOrder = previous
    .filter((item) => nextById.has(item.id))
    .map((item) => item.id);
  const nextOrder = next
    .filter((item) => previousById.has(item.id))
    .map((item) => item.id);

  if (!equal(previousOrder, nextOrder)) {
    changes.push({
      id: `${pathKey(path)}#order`,
      sectionKey: section.key,
      sectionLabel: section.label,
      label: compose(context, `Reordered ${meta.plural}`),
      kind: "moved",
      before: previousOrder,
      after: nextOrder,
      revert: (content) => {
        const list = getByPath(content, path);
        if (!Array.isArray(list)) return content;
        const byId = new Map(
          list
            .filter(isObject)
            .map((item) => [item.id, item] as const),
        );
        const ordered = previousOrder
          .map((id) => byId.get(id))
          .filter((item): item is Record<string, unknown> => Boolean(item));
        const extras = list.filter(
          (item) =>
            !isObject(item) || !previousOrder.includes(String(item.id)),
        );
        return setByPath(content, path, [...ordered, ...extras]);
      },
    });
  }
}

export function getDetailedChanges(
  published: SiteContent,
  draft: SiteContent,
): ContentChange[] {
  const changes: ContentChange[] = [];

  sectionPaths.forEach((sectionPath) => {
    const path = sectionPath.split(".");
    const section: Section = {
      key: sectionPath,
      label:
        sectionLabels[path[path.length - 1]] ??
        labels[sectionPath] ??
        humanize(path[path.length - 1]),
    };
    diffValue(
      getByPath(published, path),
      getByPath(draft, path),
      path,
      section,
      changes,
    );
  });

  return changes;
}

export function formatChangeValue(value: unknown): string {
  if (value === undefined) return "Not set";
  if (value === null) return "None";
  if (typeof value === "string") {
    return value.trim() === "" ? "Empty" : value;
  }
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return "Empty";
    return value
      .map((entry) =>
        typeof entry === "string" ? entry : formatChangeValue(entry),
      )
      .join(", ");
  }
  if (isObject(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return "Empty";
    return entries
      .map(([entryKey, entryValue]) => `${fieldLabel(entryKey)}: ${formatChangeValue(entryValue)}`)
      .join(" · ");
  }
  return String(value);
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
