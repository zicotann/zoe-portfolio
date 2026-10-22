# Social Post Embeds in Content Showcase

## Goal

Render Instagram and LinkedIn image samples as their official embeds in the Content Showcase. Instagram embeds provide native carousel arrows/dots for multi-image posts; LinkedIn embeds remove the brittle thumbnail-scraping path that currently fails for many non-video posts. Add a known-good LinkedIn sample so the path can be checked end to end.

## Decisions

- Use official embeds for both social sources:
  - Instagram: `https://www.instagram.com/{kind}/{shortcode}/embed/` via `getInstagramEmbedUrl`.
  - LinkedIn: `https://www.linkedin.com/embed/feed/update/{urn}` via `getLinkedInEmbedUrl`.
- Do **not** scrape Instagram or LinkedIn media for the main render. Scraping is brittle and LinkedIn image/carousel markup differs from the `feedshare-thumbnail`/`videocover` patterns the current thumbnail API expects.
- Keep the compact thumbnail/link card only as a fallback for invalid URLs or tiny viewports.
- Keep the aspect-ratio control limited to hosted images. Social embeds use their own responsive layout.
- Official embeds include platform chrome and captions. Suppress the duplicate `figcaption` for social embeds; use the admin caption as the iframe title and fallback text.
- Make social cards span two grid columns on `sm+` so embeds have enough width: full width in the 2-column sheet and two-thirds width in the 3-column case-study page.
- On very narrow viewports where the embed cannot meet its minimum width, fall back to the existing thumbnail link card. Instagram/LinkedIn embeds need roughly 326px; use a `min-[380px]` viewport rule or equivalent responsive check.
- Add a temporary LinkedIn sample to `content/site.json` using an already-confirmed public post. Remove it after verification unless the user wants to keep it.

## Implementation Tasks

1. Update `src/components/image-sample-card.tsx`.
   - Import both `getInstagramEmbedUrl` and `getLinkedInEmbedUrl`.
   - Replace the normal social thumbnail branch with a shared `SocialEmbed` branch:
     - Choose the embed URL from `image.source`.
     - `figure` gets `sm:col-span-2` for social sources.
     - Use an approximate portrait container such as `aspect-[4/5] min-h-[480px]`.
     - `iframe` fills the container with `h-full w-full`, `loading="lazy"`, a descriptive `title`, `allow="encrypted-media; picture-in-picture"`, `allowFullScreen`, and `scrolling="no"`.
   - Keep the existing thumbnail/link `SocialPostImage` as a fallback when the embed URL is invalid or for narrow screens.
   - Keep hosted-image aspect-ratio rendering unchanged.
   - Do not render the outer `figcaption` for official social embeds because the embeds include their own caption.
   - Ensure embeds do not get wrapped in the current external-link overlay; the official embed supplies its own links.

2. Add the narrow-screen fallback.
   - For social sources, show the inline embed at normal widths.
   - Below the minimum usable width, show the compact thumbnail link using the existing `/api/video-thumbnail` path if available, otherwise the current placeholder.
   - Avoid loading both versions simultaneously where practical.

3. Update admin guidance in `src/components/admin/views/campaigns.tsx`.
   - Instagram hint: explain that Instagram posts render as an official embed, including carousel arrows for multi-image posts.
   - LinkedIn hint: explain that LinkedIn posts render as an official embed.
   - Add a hint to the aspect-ratio selector: "Applies to hosted images only."
   - Keep the existing `SocialImagePreview` as a URL/media sanity check, but do not describe it as the final site rendering.

4. Add the LinkedIn sample fixture.
   - Add a temporary `imageSamples` entry to the `lumen-skincare-launch` campaign:
     ```json
     {
       "id": "image_linkedin_sample",
       "caption": "LinkedIn post sample",
       "source": "linkedin",
       "aspectRatio": "1:1",
       "postUrl": "https://www.linkedin.com/posts/rovan-media_brandedcontent-promotionalcontent-promotionalvideography-activity-7111056956370407424-E_Aj"
     }
     ```
   - This URL already exists in that campaign's video samples and was confirmed to return LinkedIn's public embed HTML and media poster.
   - If the user provides the exact LinkedIn image/carousel URL that failed, use that URL for the fixture instead so the reproduction covers the failing post type.
   - Remove the temporary entry after validation unless the user asks to keep it.

5. No schema, API, or R2 changes are required.
   - `ImageSample.source`, `postUrl`, and `imageUrl` already support this flow.
   - No new Instagram/LinkedIn API token or data migration is needed.

## Validation

- Run `npx tsc --noEmit` and `npm run lint`.
- Run `npm run build`.
- In the admin studio, confirm the temporary LinkedIn sample appears under Content showcase images.
- Preview the Content Showcase in the campaign sheet and standalone case-study page:
  - LinkedIn sample renders the official LinkedIn embed, not the fallback gradient.
  - Instagram sample renders the official Instagram embed.
  - An Instagram carousel post shows arrows/dots and navigates between photos.
  - A single-image Instagram post renders without arrows.
  - Invalid or missing social URLs fall back gracefully.
- Verify hosted-image aspect ratios still work: square, 4:5, 16:9, 9:16.
- Verify existing LinkedIn video samples still open in `VideoSamplePlayer` and are unaffected.
- Check mobile widths around 320-390px, including the narrow-screen fallback.
- Remove the temporary LinkedIn sample after verification.

## Risks and Out of Scope

- Instagram and LinkedIn control embed appearance, availability, and minimum width. Private/removed posts or privacy blockers may show the platform's own error state.
- Exact iframe height varies with caption and media length; adjust the aspect/min-height if clipping is observed during manual validation.
- LinkedIn carousels may not expose the same arrow behavior as Instagram; the official embed is still the reliable baseline.
- Custom-scraped carousels and re-hosting social media are out of scope.
