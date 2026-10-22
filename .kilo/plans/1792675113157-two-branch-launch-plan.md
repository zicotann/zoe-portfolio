# Two-branch launch plan (preview/dev = staging, main = production)

## Current state (verified in git)

- `main` (`d7a44a7`): old 3-commit site. No admin, no R2, no `content/site.json`, no `public/resumes/`. Netlify production currently builds this.
- `preview/dev` (`be613f2`): `main` + 14 commits. Contains `content/site.json` and `public/resumes/zoe-alvarez-resume.pdf`. Fast-forward from `main` is possible.
- `fix/ui` (`10580c0`, local checkout, pushed): `preview/dev` + 1 commit (`fix: nav function and hide testimonials`). Not yet on `preview/dev`.
- Netlify site: `https://zoetan.netlify.app`.

## Decisions

1. **R2 bucket: shared.** Staging and production use the same bucket and env values. Known risk: deleting an image from staging deletes it from production (`src/components/admin/fields.tsx:378`). Staging admin must not delete R2 images.
2. **Content ownership: production owns content.** The client publishes on `main` through the production admin. Staging content is disposable and is overwritten from `main` before each promotion.
3. **Code promotion: `preview/dev` -> `main` via PR.** Done only after the sync step below.
4. **Admin credentials: separate per environment** (recommended, not yet confirmed). Staging and production get different `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
5. **Production URL at launch: `https://zoetan.netlify.app`.** `seo.siteUrl` in `content/site.json:99` is currently `https://zoealvarez.co`, which conflicts with this. Set it to `https://zoetan.netlify.app` before release 1. `zoealvarez.co` is attached later, when DNS is ready, and `siteUrl` is updated at that time. Staging URL: `https://preview-dev--zoetan.netlify.app` (verify on the `preview/dev` deploy page). The `hello@zoealvarez.co` email is unchanged.

## Checklist

### A. Git
1. Merge the `fix/ui` commit into `preview/dev`:
   ```
   git fetch origin
   git switch preview/dev
   git pull --ff-only
   git merge fix/ui
   git push origin preview/dev
   ```
2. Set local `.env.local` to `GITHUB_BRANCH=preview/dev`. Local admin publishes must not write to `main`. Leave `.env.example` as-is or change its default to `preview/dev`.
3. Add `.env` to `.gitignore` (currently only `.env*.local` is ignored).
4. Set `seo.siteUrl` to `https://zoetan.netlify.app`. Either edit `content/site.json:99` on `preview/dev` before release 1, or use staging admin Global -> SEO and publish to `preview/dev`.

### B. Cloudflare R2 (shared bucket)
5. In Cloudflare, create an R2 API token with Object Read & Write on the bucket. Note the Account ID, Access Key ID, and Secret.
6. Decide the public URL: the `r2.dev` URL or a custom domain. Note the hostname for `R2_PUBLIC_HOSTNAME` and the full URL for `R2_PUBLIC_URL`. `next.config.mjs` reads both at build time, so they must be set before the Netlify build.

### C. GitHub token
7. Create one fine-grained PAT for `zicotann/zoe-portfolio` with Contents: Read and write. Set an expiry and add a calendar reminder. Use the same token for both environments.

### D. Netlify
8. Confirm the site (`zoetan`) is linked to `zicotann/zoe-portfolio`. Production branch = `main`.
9. Build & deploy -> Branch deploys: enable only `preview/dev`. Do not enable "All", so feature branches do not deploy with staging settings.
10. Environment variables (Site configuration -> Environment variables). Generate secrets with `openssl rand -base64 48`.
    - Same value for all contexts: `GITHUB_TOKEN`, `GITHUB_REPO=zicotann/zoe-portfolio`, `GITHUB_CONTENT_PATH=content/site.json`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_HOSTNAME`, `R2_PUBLIC_URL`.
    - Production scope: `GITHUB_BRANCH=main`, production `ADMIN_PASSWORD`, production `ADMIN_SESSION_SECRET`.
    - Branch deploy scope (`preview/dev` only): `GITHUB_BRANCH=preview/dev`, staging `ADMIN_PASSWORD`, staging `ADMIN_SESSION_SECRET`.
    - If the Netlify UI does not offer a branch-specific scope, use the branch-deploy scope, which is safe because only `preview/dev` deploys from a branch.
11. Keep `netlify.toml` as-is. If the first deploy log warns about the publish directory, clear that field in the Netlify UI.
12. Staging is publicly reachable. Do not share its URL.
13. Custom domain `zoealvarez.co`: out of scope for launch. Attach it later in Netlify, set DNS as Netlify shows, then update `seo.siteUrl`.

### E. Local verification
14. With `.env.local` set, run `npm run lint` and `npm run build`. Both must pass.

## Promotion runbook (every release)

Release 1 is a seed: `main` has no `content/site.json` or `public/resumes/`. Skip runbook step 2 for release 1; the merge adds them.

1. Test on staging (`preview/dev` Netlify branch deploy): login, publish, resume upload, image upload.
2. Sync content from `main` into `preview/dev` (skip for release 1):
   ```
   git fetch origin
   git switch preview/dev
   git pull --ff-only
   git merge origin/main -X theirs -m "sync content from main"
   git diff --quiet origin/main -- content/site.json public/resumes || echo MISMATCH
   git push origin preview/dev
   ```
   If `MISMATCH` prints, run `git checkout origin/main -- content/site.json public/resumes`, commit, and push again.
3. Confirm `main` has not moved since step 2: `git rev-parse origin/main` must equal the SHA you merged. If it changed, repeat step 2.
4. Open a PR `preview/dev` -> `main` (`gh pr create --base main --head preview/dev`) and merge it. Merging triggers the Netlify production build from `main`.
5. Verify production at `https://zoetan.netlify.app`: the site loads, `/admin` login works with the production password, and the content matches what the client expects.

## Rollback

- Netlify: Deploys -> select the previous good deploy -> Publish deploy. This is instant and needs no git change.
- Git: `git revert -m 1 <merge-sha>` on `main`, then push. Do not force-push `main`.

## Validation

- Staging (`preview-dev--zoetan.netlify.app`): `preview/dev` deploy builds; admin reads `preview/dev` content; a publish lands on `preview/dev`.
- Production (`zoetan.netlify.app`): `main` deploy builds; admin reads `main` content; a publish lands on `main` and Netlify rebuilds.
- Canonical and OG URLs on production point at `https://zoetan.netlify.app`.
- Images: R2 uploads from either admin appear in the picker; `next/image` loads them on the live site.
- Resume: upload and list work on both (`GITHUB_TOKEN` set in both scopes).

## Risks and constraints

- Shared R2 bucket: staging deletes hit production (decision 1).
- Do not enable branch protection on `main` that blocks the GitHub Contents API. The client's publishes commit directly to `main`.
- Staging content edits are lost on the next sync from `main`. This is intended.
- Staging is public and may be indexed; its OG URLs point at production. Acceptable for a private test site.
- The login rate limiter is per instance and weak on Netlify; keep the production password long.

## Open items

- Confirm decision 4 (separate admin credentials). Default: separate.
- Confirm the R2 public hostname: `r2.dev` or custom domain (step 6).
