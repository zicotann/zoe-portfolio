import { NextResponse } from "next/server";

import { siteContentSchema } from "@/content/schema";
import { isSameOrigin, requireAdminApi } from "@/lib/admin-auth";
import { GitHubError, writeContentToGitHub } from "@/lib/github-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PAYLOAD_BYTES = 1024 * 1024;

export async function POST(request: Request) {
  const auth = requireAdminApi();
  if (!auth.ok) return auth.response;

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = body as { content?: unknown; baseSha?: unknown };
  const parsed = siteContentSchema.safeParse(payload.content);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: `Content validation failed${
          firstIssue
            ? ` at ${firstIssue.path.join(".") || "root"}: ${firstIssue.message}`
            : "."
        }`,
        issues: parsed.error.issues,
      },
      { status: 422 },
    );
  }

  const serialized = JSON.stringify(parsed.data);
  if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: "Content is larger than the 1 MB publish limit." },
      { status: 413 },
    );
  }

  const baseSha =
    typeof payload.baseSha === "string" && payload.baseSha.length > 0
      ? payload.baseSha
      : null;

  try {
    const result = await writeContentToGitHub(parsed.data, baseSha);
    return NextResponse.json(
      {
        ok: true,
        sha: result.sha,
        commitUrl: result.commitUrl,
        content: parsed.data,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publish failed." },
      { status: 500 },
    );
  }
}
