import { promises as fs } from "node:fs";
import path from "node:path";

import {
  deleteFileFromGitHub,
  listPdfAssetsFromGitHub,
  writeBinaryFileToGitHub,
} from "./github-content";

export interface PdfAsset {
  name: string;
  path: string;
  size?: number;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");
const RESUME_DIR = path.join(PUBLIC_DIR, "resumes");
const MANAGEABLE_PREFIX = "/resumes/";

function safeFileName(originalName: string): string {
  const base = originalName
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "resume"}-${Date.now().toString(36)}.pdf`;
}

async function listLocalPdfs(): Promise<PdfAsset[]> {
  const results: PdfAsset[] = [];

  async function walk(directory: string, urlPrefix: string) {
    let entries;
    try {
      entries = await fs.readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, `${urlPrefix}${entry.name}/`);
        continue;
      }
      if (!entry.name.toLowerCase().endsWith(".pdf")) continue;

      let size: number | undefined;
      try {
        size = (await fs.stat(fullPath)).size;
      } catch {
        size = undefined;
      }

      results.push({
        name: entry.name,
        path: `/${urlPrefix}${entry.name}`,
        size,
      });
    }
  }

  await walk(PUBLIC_DIR, "");
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

export async function listPdfAssets(): Promise<PdfAsset[]> {
  if (process.env.GITHUB_TOKEN) {
    try {
      return await listPdfAssetsFromGitHub();
    } catch {
      // Fall back to the local public directory when GitHub is unavailable.
    }
  }

  return listLocalPdfs();
}

export async function savePdfAsset(
  data: Buffer,
  originalName: string,
): Promise<PdfAsset> {
  const fileName = safeFileName(originalName);
  const repositoryPath = `public/resumes/${fileName}`;
  const publicPath = `${MANAGEABLE_PREFIX}${fileName}`;

  if (process.env.GITHUB_TOKEN) {
    await writeBinaryFileToGitHub(
      repositoryPath,
      data.toString("base64"),
      "content: upload resume PDF",
    );
    // Keep a local copy for development previews. Ignore failures in read-only
    // serverless environments; the published file comes from GitHub.
    try {
      await fs.mkdir(RESUME_DIR, { recursive: true });
      await fs.writeFile(path.join(RESUME_DIR, fileName), data);
    } catch {
      // No local write access; the GitHub commit is the source of truth.
    }
  } else {
    await fs.mkdir(RESUME_DIR, { recursive: true });
    await fs.writeFile(path.join(RESUME_DIR, fileName), data);
  }

  return { name: fileName, path: publicPath, size: data.length };
}

export function isManageableResumePath(publicPath: string): boolean {
  return /^\/resumes\/[a-z0-9._-]+\.pdf$/i.test(publicPath);
}

export async function deletePdfAsset(publicPath: string): Promise<void> {
  if (!isManageableResumePath(publicPath)) {
    throw new Error("Only PDFs uploaded to /resumes can be deleted.");
  }

  const repositoryPath = `public${publicPath}`;

  if (process.env.GITHUB_TOKEN) {
    await deleteFileFromGitHub(repositoryPath, "content: delete resume PDF");
  }

  try {
    await fs.unlink(path.join(PUBLIC_DIR, publicPath.replace(/^\//, "")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
