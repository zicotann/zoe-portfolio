# Admin Content Dashboard — Implementation Plan

## Goal

Add an authenticated `/admin` content studio that edits every visible text and image on the site, supports draft/preview/publish workflows, and publishes by committing a single JSON content file to the `main` branch of `zicotann/zoe-portfolio`. The GitHub push triggers the existing Netlify rebuild.

## Confirmed decisions

- Publish target: GitHub Contents API → `content/site.json` on `main`.
- Auth: password gate with `ADMIN_PASSWORD`, signed httpOnly session cookie.
- Image editing: URL field + thumbnail preview. Empty state shows a dropzone UI, but R2 uploads are deferred.
- Draft persistence: React state + `sessionStorage`; closing the tab/browser discards the draft.
- Preview: full site in an iframe, updated on every keystroke.
- Campaign categories: editable records; campaigns reference a category by id and choose it from a dropdown.
- Single content commit per publish.

## Current state

- Content sources: `src/data/profile.ts`, `src/data/campaigns.ts`.
- Hardcoded copy/images live in `src/components/sections/*`, `src/app/case-study/[slug]/page.tsx`, `src/app/layout.tsx`, and `src/components/case-study-sheet.tsx`.
- Site is Next.js 14 App Router, statically rendered. Netlify builds on push.
- Existing UI primitives: button, input, textarea, label, badge, card, sheet, form. No dialog, select, switch, or toast component.
- `zod`, `react-hook-form`, `@hookform/resolvers`, and `@radix-ui/react-dialog` are installed.
- Git remote is `https://github.com/zicotann/zoe-portfolio.git`; production branch is `main`.

## Architecture

### 1. Content source of truth

Move all editable data into one repo-tracked file:

```text
content/site.json
```

Add `src/content/schema.ts` with Zod schemas as the single source of truth for types:

- `siteContentSchema`
- `profileSchema`, `socialLinkSchema`
- `campaignCategorySchema`, `campaignSchema`, `metricSchema`, `videoSampleSchema`, `imageSampleSchema`
- `siteContentSchema` containing `version`, `profile`, `socials`, `navigation`, `seo`, `categories`, and `sections`.

Add `src/content/site.ts`:

```ts
import rawContent from "../../content/site.json";

export const siteContent = siteContentSchema.parse(rawContent);
```

This makes invalid content fail at build time. Keep type-only imports (`import type`) in client components so no server code leaks into the browser bundle.

Delete `src/data/profile.ts` and `src/data/campaigns.ts` after migration. Recreate `getCampaignBySlug`, `getCategoryName`, and featured-campaign helpers in `src/content/helpers.ts`.

### 2. Site rendering

Introduce `src/components/site-shell.tsx`:

```tsx
export function SiteShell({ content }: { content: SiteContent }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader content={content} />
      <main className="pb-24 md:pb-0">
        <Hero content={content} />
        <MetricsBar content={content} />
        <LogoCloud content={content} />
        <CampaignGrid content={content} />
        <Experience content={content} />
        <ContentReels content={content} />
        <Testimonials content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
```

- `app/page.tsx` becomes a server component rendering `<SiteShell content={siteContent} />`.
- Every section component accepts `content: SiteContent` (or a narrower section type) instead of importing `profile`/`campaigns`.
- Move module-scope derived values inside components:
  - `CampaignGrid` filter list from `content.categories`.
  - `ContentReels` reel list from `content.sections.campaigns.campaigns`.
  - `SiteHeader` nav/dock from `content.navigation.links`.
- Replace campaign `industry` with `categoryId`; render category names through `getCategoryName`.
- `case-study/[slug]/page.tsx` imports `siteContent`, keeps `generateStaticParams`, and looks up campaigns/categories from it. Case-study copy comes from the content schema, not literals.
- `app/layout.tsx` metadata comes from `content.seo` and `content.profile`.

### 3. Draft lifecycle

`useContentDraft` hook (`src/components/admin/use-content-draft.ts`):

```ts
type DraftState = {
  content: SiteContent;
  baseSha: string | null;
  savedAt: number | null;
};
```

- Key: `zoe-content-draft:v1`.
- On admin mount, fetch published baseline from `GET /api/admin/content`.
- If a valid sessionStorage draft exists, load it; otherwise start from the baseline.
- Validate restored drafts with `siteContentSchema.safeParse`; discard invalid drafts.
- Every form change updates in-memory draft state and posts the new content to the preview iframe.
- Section Save/top Save writes the draft to `sessionStorage`.
- Closing the tab loses unsaved session data. Warn with `beforeunload` if draft differs from the published baseline.
- After successful publish, replace baseline with the published draft and clear the draft key.

Note: the deployed admin bundle contains the last-built JSON. `/api/admin/content` must fetch the current `content/site.json` from GitHub so a refresh immediately after publishing (before Netlify finishes) does not resurrect stale content. Fall back to bundled `siteContent` if GitHub is unavailable.

### 4. Live preview

- Preview route: `src/app/admin/preview/page.tsx`, renders `<SiteShell content={draft} />` only (no admin chrome), protected by the admin layout.
- Admin renders it in an iframe, full width, heights around 45–55vh with desktop/mobile width toggle and refresh.
- Handshake:
  - Preview posts `{ type: "preview:ready" }` to parent.
  - Parent posts `{ type: "preview:content", content }` on every draft change.
  - Parent posts `{ type: "preview:scroll", anchor: "#work" }` when switching sections.
- Validate `event.origin === window.location.origin` and message shape on both sides.
- Throttle content messages with `requestAnimationFrame`; send plain JSON-safe objects.
- Campaign case study sheet is previewed via the homepage. Standalone `/case-study/[slug]` pages update after publish and are not part of live preview.

## Content model

Top-level shape:

```ts
{
  version: 1;
  profile: { name, firstName, role, headlineLead, headlineAccent,
             subheadline, portraitImage, location, timezone,
             available, availabilityLabel, email, calendlyUrl, resumeUrl };
  socials: SocialLink[];
  navigation: { links: NavLink[], ctaLabel: string, ctaHref: string };
  seo: { siteUrl, titleTemplate, description, ogImage? };
  categories: CampaignCategory[];
  sections: {
    hero: HeroContent;
    metrics: MetricsContent;
    clients: ClientsContent;
    campaigns: CampaignsContent;
    experience: ExperienceContent;
    reels: ReelsContent;
    testimonials: TestimonialsContent;
    contact: ContactContent;
    footer: FooterContent;
  };
}
```

Every repeatable object gets a stable `id` (`socials`, stats, clients, services, experience, testimonials, nav links, metrics, video/image samples, categories). Campaigns already have `id`. Generate ids in the admin with `crypto.randomUUID()` or a short `cat_...` helper.

### Content/section inventory

- `hero`
  - `headlineLead` + `headlineAccent` (replaces fragile `profile.headline.split("&")`)
  - primary/secondary CTA labels and hrefs
  - `followLabel`
  - floating stat value/label, floating badge
  - portrait alt text
  - Global fields shown read-only: name, role, subheadline, portrait, availability, location/timezone, socials, booking URL.
- `metrics`: optional eyebrow/heading, `summaryStats[]` (label, value, prefix, suffix, decimals, description).
- `clients`: banner text, `clients[]` (name, category enum: Client/Media/Award).
- `campaigns`:
  - eyebrow, heading lead/accent, description, “All” label, “Featured” label, “View case study” label
  - `categories` manager lives here
  - case-study copy shared by sheet and detail page: key achievements, strategy & execution, The Challenge/Strategy/Results headings, Video showcase, Content samples, Deliverables, close button, back link, page CTA.
  - `campaigns[]`: id, slug, clientName, clientLogo, categoryId, role, period, summary, heroImage, coverImage, featured, metrics[], deliverables[], videoSamples[], imageSamples[], strategy breakdown.
- `experience`: eyebrow, heading, description, resume button label; services[]; experience[] with role/company/period/location/type/description/highlights[].
- `reels`: eyebrow, heading lead/accent, description, max count. Reels remain derived from campaign 9:16 video samples and are shown read-only in this form with “Edit in Campaigns” links.
- `testimonials`: eyebrow, heading, testimonials[].
- `contact`: eyebrow, heading lead/accent, description, booking button, section socials behavior, location line template, form labels/placeholders/button/sent/error text.
- `footer`: rights text; profile/name/socials are global read-only references.
- `seo`: site URL, title template (`{name}`, `{role}`), description, optional OG image.

### Singleton sidebar

- Profile & Identity
- Navigation
- Social Links
- Contact & Booking
- SEO

Content sidebar (in order): Hero, Metrics, Clients, Campaigns, Experience, Reels, Testimonials, Contact, Footer.

Global values are edited only in singletons. Section forms render them in a highlighted read-only “Used globally” card with an “Edit in …” button.

## Dashboard UX

### Layout

- Left sidebar: brand/“Content Studio”, SINGLETONS group, CONTENT group, footer with “View site”, “Logout”, draft status.
- Main header: selected view title, dirty indicator, then right-aligned `Save` (outline) and `Publish` (primary). Publish is rightmost.
- Main body: sticky preview panel above a scrollable form.
- Mobile: sidebar becomes a drawer/dropdown; preview collapses to an expandable block.
- Admin routes are `noindex`.

### Editing forms

Build reusable admin controls under `src/components/admin/fields/`:

- `TextField`, `TextareaField`, `NumberField`, `ToggleField`, `SelectField`
- `ImageField`: URL input, thumbnail preview, clear/replace, empty-state dropzone placeholder. Dropzone shows “R2 uploads are not enabled yet — paste a public URL.” Uses plain `<img>` with the ESLint rule disabled so arbitrary hosts preview without `next.config` changes.
- `VideoField`: URL/embed URL inputs plus thumbnail image field.
- `RepeaterField`: add/remove/reorder with up/down buttons, collapse/expand, and delete confirmation for substantial items.
- `StringListField`: for highlights/deliverables.

Use `react-hook-form` + `zodResolver` per section. Watch values and push them into the draft on change. `Save` validates the section, persists `sessionStorage`, and resets the form’s clean state. `Publish` first validates the whole draft with `siteContentSchema`.

### Campaigns and categories

- Campaigns view has “Campaigns” and “Categories” tabs.
- Category records: `{ id, name }`. Rename is free; id is stable.
- Campaign editor includes a category `<select>` by id.
- Block category deletion while any campaign references it; show usage count and instruct reassignment.
- Campaign add generates a unique id and slug from the client name; slug is editable and must be unique.
- Campaign delete requires confirmation.
- Reorder campaigns and categories with up/down controls.

### Save/Publish behavior

- Draft updates live on type; preview reflects it immediately.
- Section Save: validate current form → write draft to `sessionStorage` → toast/banner “Saved to this browser session.”
- Top Save: same for the current draft.
- Publish: validate full content; open confirmation dialog:
  - Lists changed areas.
  - Message: publish all edits in one go to avoid multiple rebuilds.
  - If no changes, disable with “Nothing to publish.”
  - Buttons: Cancel, Publish to live.
- On success: show commit link, update baseline from the returned content, clear session draft.
- On failure: keep the draft, show the API error.

Add a shadcn-style `src/components/ui/dialog.tsx` using the installed Radix dialog package. Use native `<select>` and checkbox controls to avoid new dependencies. Use inline status banners instead of adding a toast library.

## Auth

- `/login`: password form.
- `POST /api/admin/login`: constant-time compare against `ADMIN_PASSWORD`; set signed httpOnly cookie (SameSite=Lax, Secure in production, 12h expiry).
- Cookie format: `${expiresAt}.${HMAC-SHA256(secret, admin:${expiresAt})}`.
- `src/lib/admin-auth.ts`: sign/verify with `node:crypto`, `requireAdmin()` helper for server comps/routes.
- `app/admin/layout.tsx`: verify cookie; redirect to `/login?next=/admin`; set admin metadata and noindex.
- `POST /api/admin/logout`: clear cookie.
- Protect every `/api/admin/*` route with the same helper.
- Check `Origin` on mutating routes, return 405/403 on mismatch.
- Add a small in-memory login rate limit (e.g. 5 attempts/minute/IP).
- Do not add middleware; Node runtime route handlers/server layout are sufficient.

## API contracts

### `GET /api/admin/content`

- Auth required.
- Fetch `content/site.json` from GitHub at `GITHUB_BRANCH`.
- Return `{ content, sha }`.
- If GitHub is unavailable/unconfigured, return bundled `siteContent` with `sha: null` and a `warning`.
- `Cache-Control: no-store`.

### `POST /api/admin/publish`

Request:

```ts
{ content: SiteContent, baseSha: string | null }
```

Flow:

1. Auth + origin check.
2. `siteContentSchema.safeParse(content)`; reject with field errors.
3. Reject payloads over ~1 MB.
4. GET current file metadata/sha from GitHub.
5. If `baseSha` is provided and differs from current SHA, return `409` with “Content changed on GitHub. Reload before publishing.”
6. PUT base64-encoded pretty JSON with a commit message such as `content: publish dashboard updates (Hero, Campaigns)`.
7. If the file does not exist, create it without `sha`.
8. Return `{ sha, commitUrl, content }`.
9. Map GitHub auth/permission/rate-limit errors to readable messages.

Use env:

- `GITHUB_TOKEN` (fine-grained, Contents: Read & Write on this repo)
- `GITHUB_REPO` (default `zicotann/zoe-portfolio`)
- `GITHUB_BRANCH` (default `main`)
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

### `POST /api/admin/upload` (deferred scaffold)

Not implemented in this phase. Leave the dropzone disabled with a clear tooltip. Later add a presigned PUT route using R2 S3 credentials, store the returned public URL, and enable the dropzone. No schema changes will be needed.

Future R2 config: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`/`R2_PUBLIC_HOSTNAME`.

## File map

### New

- `content/site.json`
- `src/content/schema.ts`
- `src/content/site.ts`
- `src/content/helpers.ts`
- `src/components/site-shell.tsx`
- `src/app/login/page.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/preview/page.tsx`
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/content/route.ts`
- `src/app/api/admin/publish/route.ts`
- `src/lib/admin-auth.ts`
- `src/lib/github-content.ts`
- `src/components/admin/admin-dashboard.tsx`
- `src/components/admin/sidebar.tsx`
- `src/components/admin/topbar.tsx`
- `src/components/admin/preview-panel.tsx`
- `src/components/admin/publish-dialog.tsx`
- `src/components/admin/use-content-draft.ts`
- `src/components/admin/diff.ts`
- `src/components/admin/fields/*`
- `src/components/admin/views/{hero,metrics,clients,campaigns,categories,experience,reels,testimonials,contact,footer,profile,navigation,socials,contact-details,seo}.tsx`
- `src/components/ui/dialog.tsx`

### Modified

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/case-study/[slug]/page.tsx`
- `src/components/brand-icons.tsx`
- `src/components/case-study-sheet.tsx`
- all `src/components/sections/*`
- `next.config.mjs` (optional R2 public hostname in `images.remotePatterns`)
- `README.md` (env/setup documentation)
- `.gitignore` only if new local env files are introduced (existing `.env*.local` already covers them)

### Deleted

- `src/data/profile.ts`
- `src/data/campaigns.ts`

## Ordered implementation tasks

1. **Create the content schema and migrate data.**
   - Build `src/content/schema.ts` and `content/site.json` preserving every current profile/campaign value and image URL.
   - Create categories from current industries: Beauty & Skincare, Hospitality, Health & Wellness, Fashion & Apparel, Fitness.
   - Split gradient headings into lead/accent fields.
   - Add stable ids to repeatable objects.
   - Parse JSON at module load.

2. **Refactor the public site to be content-driven.**
   - Add `SiteShell`.
   - Pass `content` props through all sections, header/footer, campaign sheet, and case-study page.
   - Replace `profile.*` / `campaigns` imports and `industry` lookups.
   - Move derived reel/filter lists inside components.
   - Update layout metadata.
   - Verify visual parity before building admin UI.

3. **Add auth.**
   - Session helper, login/logout routes, login page, admin layout, route guards.
   - Add env documentation.

4. **Add draft state and diff helpers.**
   - `useContentDraft`, sessionStorage validation, baseline fetch, dirty detection, beforeunload guard.

5. **Build admin shell.**
   - Sidebar groups/views, topbar Save/Publish, responsive layout, logout, view switching, draft status.

6. **Build reusable fields and repeater controls.**
   - Include the image URL/preview/dropzone placeholder and read-only “Used globally” card.

7. **Build singleton editors.**
   - Profile, Navigation, Socials, Contact & Booking, SEO.

8. **Build content editors.**
   - Hero, Metrics, Clients, Experience, Reels, Testimonials, Contact, Footer.
   - Add global-field reference cards where required.

9. **Build campaign/category management.**
   - Full campaign CRUD, category CRUD, dropdown assignment, validation, reordering, case-study copy editor.

10. **Build live preview.**
    - Protected preview route, iframe panel, postMessage handshake, live content updates, scroll-to-section, device toggle.

11. **Build publish flow.**
    - Publish dialog, changed-area diff, validation, GitHub API route, SHA conflict handling, commit link, baseline reset.
    - Add a `GET /api/admin/content` route for fresh baseline loading.

12. **R2 placeholder and image host config.**
    - Dropzone UI disabled with explanation.
    - Optionally read `R2_PUBLIC_HOSTNAME` in `next.config.mjs` and append it to `images.remotePatterns` when set.

13. **Documentation and cleanup.**
    - README env vars, GitHub token scope, Netlify auto-deploy note, R2 follow-up.
    - Remove unused data modules/imports.

## Validation

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual checks:

- `/` renders identically to the current site after migration.
- `/admin` redirects to `/login` when unauthenticated; wrong password fails; correct password enters.
- Edit Hero text and confirm the iframe preview updates on each keystroke.
- Save, refresh the tab, and confirm edits persist; open a new tab and confirm the draft is gone.
- Add/edit/delete campaigns and categories; deleting an in-use category is blocked; dropdown assignment updates filter chips and badges.
- Add/remove social links, testimonials, experience entries, metrics, and images; preview reflects changes.
- Publish with no changes is disabled.
- Publish with changes opens the confirmation dialog and lists changed areas.
- Test the publish API against a non-production branch (`GITHUB_BRANCH=preview/dev`) with a scoped token before using `main`; confirm one commit and a Netlify build.
- Simulate a GitHub 409 by changing the file remotely after loading admin; confirm the dashboard asks to reload instead of overwriting.
- Confirm no `@/data/profile` or `@/data/campaigns` imports remain.
- Confirm `content/site.json` passes `siteContentSchema`.

## Risks and edge cases

- **Stale admin baseline:** solved by fetching current content from GitHub at admin load, not only the deployed bundle.
- **Concurrent publish/manual edit:** SHA check returns 409; draft is preserved.
- **Campaign slug changes:** old case-study URLs 404 after rebuild. Acceptable; call out in UI helper text.
- **Category deletion:** blocked while referenced.
- **Image hosts:** site uses `next/image`; arbitrary R2 hostnames require `R2_PUBLIC_HOSTNAME` in `images.remotePatterns`. Admin preview uses `<img>` so it still works before that config exists.
- **sessionStorage scope:** per-tab; a new tab starts from published content.
- **Large content:** enforce a 1 MB publish payload limit.
- **No rollback UI:** GitHub commit history is the rollback path; mention in README.
- **Netlify production branch:** if it is not `main`, set `GITHUB_BRANCH` to the branch Netlify deploys.

## Out of scope

- Cloudflare R2 upload implementation (UI placeholder only).
- Media library, image cropping, or drag-and-drop file persistence.
- Multi-user roles, audit log, or publish history UI.
- Draft preview of standalone `/case-study/[slug]` pages.
- Adding/removing whole sections or changing section order.
- Rich text/HTML/markdown editing (plain text only).
