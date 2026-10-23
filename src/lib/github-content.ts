import { siteContentSchema, type SiteContent } from "@/content/schema";

const GITHUB_API = "https://api.github.com";

export class GitHubError extends Error {
  status: number;
  kind: "config" | "conflict" | "auth" | "not-found" | "api";

  constructor(
    message: string,
    options: {
      status?: number;
      kind?: "config" | "conflict" | "auth" | "not-found" | "api";
    } = {},
  ) {
    super(message);
    this.name = "GitHubError";
    this.status = options.status ?? 500;
    this.kind = options.kind ?? "api";
  }
}

function config() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new GitHubError(
      "GITHUB_TOKEN is not configured. Add a fine-grained token with Contents read/write access.",
      { status: 500, kind: "config" },
    );
  }
  return {
    token,
    repo: process.env.GITHUB_REPO ?? "zicotann/zoe-portfolio",
    branch: process.env.GITHUB_BRANCH ?? "main",
    path: process.env.GITHUB_CONTENT_PATH ?? "content/site.json",
  };
}

async function githubRequest(
  url: string,
  token: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "zoe-content-studio",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

function encodedPath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function readFileMetadata(
  token: string,
  repo: string,
  path: string,
  branch: string,
): Promise<{ content: SiteContent | null; sha: string | null; raw: string | null }> {
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodedPath(path)}?ref=${encodeURIComponent(branch)}`;
  const response = await githubRequest(url, token);

  if (response.status === 404) {
    return { content: null, sha: null, raw: null };
  }

  if (response.status === 401 || response.status === 403) {
    throw new GitHubError(
      "GitHub rejected the request. Check the token scope and repository access.",
      { status: response.status, kind: "auth" },
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new GitHubError(
      `GitHub error ${response.status}: ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }

  const data = (await response.json()) as {
    content?: string;
    encoding?: string;
    sha?: string;
  };

  if (!data.content || !data.sha) {
    throw new GitHubError("GitHub returned an empty content response.", {
      status: 502,
      kind: "api",
    });
  }

  const raw = Buffer.from(data.content, data.encoding === "base64" ? "base64" : "utf8").toString("utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new GitHubError(
      "The published content file is not valid JSON. Fix content/site.json on GitHub before publishing.",
      { status: 422, kind: "api" },
    );
  }

  const result = siteContentSchema.safeParse(parsed);
  if (!result.success) {
    throw new GitHubError(
      "The published content file does not match the current content schema. Reload the studio or fix the file on GitHub.",
      { status: 422, kind: "api" },
    );
  }

  return { content: result.data, sha: data.sha, raw };
}

export async function readContentFromGitHub(): Promise<{
  content: SiteContent;
  sha: string;
}> {
  const { token, repo, branch, path } = config();
  const file = await readFileMetadata(token, repo, path, branch);

  if (!file.content || !file.sha) {
    throw new GitHubError(
      "content/site.json does not exist on the configured branch yet.",
      { status: 404, kind: "not-found" },
    );
  }

  return { content: file.content, sha: file.sha };
}

export async function writeContentToGitHub(
  content: SiteContent,
  baseSha: string | null,
): Promise<{ sha: string; commitUrl: string }> {
  const { token, repo, branch, path } = config();
  const current = await readFileMetadata(token, repo, path, branch);

  if (baseSha && current.sha && baseSha !== current.sha) {
    throw new GitHubError(
      "Content changed on GitHub after this studio was loaded. Reload the studio before publishing so you do not overwrite newer changes.",
      { status: 409, kind: "conflict" },
    );
  }

  const serialized = `${JSON.stringify(content, null, 2)}\n`;
  const body = {
    message: "content: publish dashboard updates",
    content: Buffer.from(serialized, "utf8").toString("base64"),
    branch,
    ...(current.sha ? { sha: current.sha } : {}),
  };

  const url = `${GITHUB_API}/repos/${repo}/contents/${encodedPath(path)}`;
  const response = await githubRequest(url, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 409) {
    throw new GitHubError(
      "GitHub reported a conflict. Reload the studio and try again.",
      { status: 409, kind: "conflict" },
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new GitHubError(
      "GitHub rejected the commit. The token needs Contents read/write access to this repository.",
      { status: response.status, kind: "auth" },
    );
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new GitHubError(
      `Could not commit content (${response.status}): ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }

  const data = (await response.json()) as {
    content?: { sha?: string };
    commit?: { html_url?: string; sha?: string };
  };

  return {
    sha: data.content?.sha ?? data.commit?.sha ?? "",
    commitUrl: data.commit?.html_url ?? `https://github.com/${repo}/commits/${branch}`,
  };
}

export interface RepoPdfAsset {
  name: string;
  path: string;
  size?: number;
}

async function getRepoFileSha(
  token: string,
  repo: string,
  branch: string,
  filePath: string,
): Promise<string | null> {
  const url = `${GITHUB_API}/repos/${repo}/contents/${encodedPath(filePath)}?ref=${encodeURIComponent(branch)}`;
  const response = await githubRequest(url, token);

  if (response.status === 404) return null;
  if (response.status === 401 || response.status === 403) {
    throw new GitHubError(
      "GitHub rejected the request. Check the token scope and repository access.",
      { status: response.status, kind: "auth" },
    );
  }
  if (!response.ok) {
    const detail = await response.text();
    throw new GitHubError(
      `GitHub error ${response.status}: ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }

  const data = (await response.json()) as { sha?: string };
  return data.sha ?? null;
}

export async function listPdfAssetsFromGitHub(): Promise<RepoPdfAsset[]> {
  const { token, repo, branch } = config();
  const url = `${GITHUB_API}/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  const response = await githubRequest(url, token);

  if (!response.ok) {
    const detail = await response.text();
    throw new GitHubError(
      `GitHub error ${response.status}: ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }

  const data = (await response.json()) as {
    tree?: Array<{ path?: string; type?: string; size?: number }>;
  };

  return (data.tree ?? [])
    .filter(
      (entry) =>
        entry.type === "blob" &&
        typeof entry.path === "string" &&
        entry.path.startsWith("public/") &&
        entry.path.toLowerCase().endsWith(".pdf"),
    )
    .map((entry) => ({
      name: entry.path?.split("/").pop() ?? "resume.pdf",
      path: `/${entry.path?.replace(/^public\//, "") ?? ""}`,
      size: entry.size,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export async function writeBinaryFileToGitHub(
  filePath: string,
  contentBase64: string,
  message: string,
): Promise<void> {
  const { token, repo, branch } = config();
  const sha = await getRepoFileSha(token, repo, branch, filePath);
  const body = {
    message,
    content: contentBase64,
    branch,
    ...(sha ? { sha } : {}),
  };

  const response = await githubRequest(
    `${GITHUB_API}/repos/${repo}/contents/${encodedPath(filePath)}`,
    token,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (response.status === 401 || response.status === 403) {
    throw new GitHubError(
      "GitHub rejected the upload. The token needs Contents read/write access to this repository.",
      { status: response.status, kind: "auth" },
    );
  }
  if (!response.ok) {
    const detail = await response.text();
    throw new GitHubError(
      `Could not upload the file (${response.status}): ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }
}

export async function deleteFileFromGitHub(
  filePath: string,
  message: string,
): Promise<void> {
  const { token, repo, branch } = config();
  const sha = await getRepoFileSha(token, repo, branch, filePath);
  if (!sha) return;

  const response = await githubRequest(
    `${GITHUB_API}/repos/${repo}/contents/${encodedPath(filePath)}`,
    token,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha, branch }),
    },
  );

  if (response.status === 401 || response.status === 403) {
    throw new GitHubError(
      "GitHub rejected the delete. The token needs Contents read/write access to this repository.",
      { status: response.status, kind: "auth" },
    );
  }
  if (!response.ok && response.status !== 404) {
    const detail = await response.text();
    throw new GitHubError(
      `Could not delete the file (${response.status}): ${detail.slice(0, 240)}`,
      { status: 502, kind: "api" },
    );
  }
}
