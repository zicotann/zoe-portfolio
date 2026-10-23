This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Content Studio

The site content is stored and edited in admin dashboard.

### Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (any long random string).
3. For publishing, create a GitHub fine-grained token with **Contents: Read and write** access to this repository and set `GITHUB_TOKEN`.
4. Run the dev server and visit `/login`.

```bash
npm run dev
```

### How editing works

- **Save** keeps the draft in the current browser tab (`sessionStorage`). Closing the tab/browser discards it.
- **Publish** opens a confirmation dialog, commits and triggers the Netlify rebuild.
- Category records are managed in Global → Categories. Campaigns select a category from a dropdown.
- The resume is a PDF stored in `public/resumes` and uploaded from Global → Profile & Identity. Uploads are committed to `GITHUB_BRANCH` through the GitHub Contents API and appear in the admin's existing-PDF picker.
- Image fields accept a public URL, an upload to Cloudflare R2, or a selection from existing R2 images. Images can be replaced or deleted from the field. Campaign content-showcase images can also link to an Instagram or LinkedIn post.

Publishing uses the GitHub Contents API from a server route; the token is never sent to the browser. The studio loads the latest published JSON from GitHub on open so a refresh immediately after publishing does not restore stale content.

### Cloudflare R2 assets

Set `R2_PUBLIC_HOSTNAME` to the public R2 hostname (without `https://`) so `next/image` can optimize R2-hosted media. For uploads and the R2 image picker, also set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, and `R2_PUBLIC_URL`. Uploads are written to the `images/` folder in the bucket. The admin preview uses plain `<img>` tags, so URL previews work before this is configured.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
