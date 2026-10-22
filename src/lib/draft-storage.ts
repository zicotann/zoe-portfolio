import { siteContentSchema, type SiteContent } from "@/content/schema";

export const DRAFT_KEY = "zoe-content-draft:v1";

export type DraftState = {
  content: SiteContent;
  baseSha: string | null;
  savedAt: number | null;
};

export function loadDraft(): DraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      content?: unknown;
      baseSha?: unknown;
      savedAt?: unknown;
    };
    const content = siteContentSchema.safeParse(parsed.content);
    if (!content.success) {
      window.sessionStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return {
      content: content.data,
      baseSha: typeof parsed.baseSha === "string" ? parsed.baseSha : null,
      savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : null,
    };
  } catch {
    window.sessionStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

export function persistDraft(draft: DraftState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DRAFT_KEY);
}
