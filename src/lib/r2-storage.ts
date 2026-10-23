import { createHash, createHmac } from "node:crypto";

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp)$/i;

export interface R2ImageAsset {
  name: string;
  key: string;
  url: string;
  size?: number;
  lastModified?: string;
}

interface R2Config {
  accessKeyId: string;
  bucket: string;
  endpoint: string;
  publicBase: string;
  secretAccessKey: string;
}

function sha256Hex(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Buffer | string, value: string): Buffer {
  return createHmac("sha256", key).update(value).digest();
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodeKey(key: string): string {
  return key.split("/").map(encodePathSegment).join("/");
}

function canonicalQuery(query: Record<string, string>): string {
  return Object.keys(query)
    .sort()
    .map((key) => `${encodePathSegment(key)}=${encodePathSegment(query[key])}`)
    .join("&");
}

function publicBaseUrl(): string {
  const configuredUrl = process.env.R2_PUBLIC_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  const hostname = process.env.R2_PUBLIC_HOSTNAME?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  return hostname ? `https://${hostname}` : "";
}

function r2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicBase = publicBaseUrl();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return null;
  }

  return {
    accessKeyId,
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    publicBase,
    secretAccessKey,
  };
}

export function isR2Configured(): boolean {
  return r2Config() !== null;
}

function requireConfig(): R2Config {
  const config = r2Config();
  if (!config) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_URL (or R2_PUBLIC_HOSTNAME).",
    );
  }
  return config;
}

async function signedRequest(
  config: R2Config,
  method: "GET" | "PUT" | "DELETE",
  key: string,
  options: {
    body?: Buffer;
    contentType?: string;
    query?: Record<string, string>;
  } = {},
): Promise<Response> {
  const body = options.body;
  const query = options.query ? canonicalQuery(options.query) : "";
  const url = new URL(config.endpoint);
  const canonicalUri = key
    ? `/${config.bucket}/${encodeKey(key)}`
    : `/${config.bucket}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body ?? "");
  const contentType = options.contentType;

  const headers: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) headers["content-type"] = contentType;

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames
    .map((name) => `${name}:${headers[name].trim()}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    query,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(
      hmac(hmac(`AWS4${config.secretAccessKey}`, dateStamp), "auto"),
      "s3",
    ),
    "aws4_request",
  );
  const signature = hmac(signingKey, stringToSign).toString("hex");

  const requestHeaders: Record<string, string> = {
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) requestHeaders["content-type"] = contentType;
  requestHeaders.authorization =
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const requestUrl = `${config.endpoint}${canonicalUri}${query ? `?${query}` : ""}`;
  return fetch(requestUrl, {
    method,
    headers: requestHeaders,
    body: body ? new Uint8Array(body) : undefined,
    cache: "no-store",
  });
}

async function failure(response: Response): Promise<Error> {
  const detail = await response.text().catch(() => "");
  return new Error(
    `Cloudflare R2 returned ${response.status}${
      detail ? `: ${detail.slice(0, 240)}` : "."
    }`,
  );
}

function assetFromKey(
  config: R2Config,
  key: string,
  details: { size?: number; lastModified?: string } = {},
): R2ImageAsset {
  return {
    name: key.split("/").pop() ?? key,
    key,
    url: `${config.publicBase}/${encodeKey(key)}`,
    ...details,
  };
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export async function listR2Images(): Promise<R2ImageAsset[]> {
  const config = requireConfig();
  const response = await signedRequest(config, "GET", "", {
    query: { "list-type": "2", "max-keys": "200" },
  });
  if (!response.ok) throw await failure(response);

  const xml = await response.text();
  const assets: R2ImageAsset[] = [];

  for (const match of Array.from(
    xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g),
  )) {
    const block = match[1];
    const key = decodeXml(block.match(/<Key>([\s\S]*?)<\/Key>/)?.[1] ?? "");
    if (!key || !IMAGE_EXTENSIONS.test(key)) continue;

    const size = Number(block.match(/<Size>(\d+)<\/Size>/)?.[1] ?? "");
    const lastModified = block.match(
      /<LastModified>([\s\S]*?)<\/LastModified>/,
    )?.[1];

    assets.push(
      assetFromKey(config, key, {
        size: Number.isFinite(size) ? size : undefined,
        lastModified,
      }),
    );
  }

  return assets.sort((a, b) =>
    (b.lastModified ?? "").localeCompare(a.lastModified ?? ""),
  );
}

function safeFileName(originalName: string, contentType: string): string {
  const base = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const extensions: Record<string, string> = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  const extension =
    extensions[contentType] ??
    originalName.match(/\.(avif|gif|jpe?g|png|webp)$/i)?.[0] ??
    ".jpg";

  return `${base || "image"}-${Date.now().toString(36)}${extension.toLowerCase()}`;
}

export async function uploadR2Image(
  data: Buffer,
  originalName: string,
  contentType: string,
): Promise<R2ImageAsset> {
  const config = requireConfig();
  const key = `images/${safeFileName(originalName, contentType)}`;
  const response = await signedRequest(config, "PUT", key, {
    body: data,
    contentType,
  });
  if (!response.ok) throw await failure(response);

  return assetFromKey(config, key, { size: data.length });
}

function keyFromPublicUrl(config: R2Config, url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const base = new URL(config.publicBase);
  if (parsed.hostname !== base.hostname) return null;

  const basePath = base.pathname.replace(/\/+$/, "");
  let pathname = parsed.pathname;
  if (basePath) {
    if (!pathname.startsWith(`${basePath}/`)) return null;
    pathname = pathname.slice(basePath.length);
  }

  let key: string;
  try {
    key = decodeURIComponent(pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
  return key && !key.includes("..") ? key : null;
}

export async function deleteR2Image(url: string): Promise<boolean> {
  const config = requireConfig();
  const key = keyFromPublicUrl(config, url);
  if (!key) return false;

  const response = await signedRequest(config, "DELETE", key);
  if (!response.ok && response.status !== 404) throw await failure(response);
  return true;
}
