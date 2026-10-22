import { NextResponse } from "next/server";

import { siteContent } from "@/content/site";
import { requireAdminApi } from "@/lib/admin-auth";
import { readContentFromGitHub } from "@/lib/github-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { content, sha } = await readContentFromGitHub();
    return NextResponse.json(
      { content, sha, source: "github" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        content: siteContent,
        sha: null,
        source: "bundled",
        warning:
          error instanceof Error
            ? `${error.message} Using the content bundled with this deployment instead.`
            : "GitHub content was unavailable. Using the bundled content instead.",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
