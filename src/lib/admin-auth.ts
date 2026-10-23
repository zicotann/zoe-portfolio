import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "zoe_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? null;
}

function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD is not configured.");
  }
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const signature = createHmac("sha256", secret)
    .update(`admin:${expiresAt}`)
    .digest("hex");
  return `${expiresAt}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = sessionSecret();
  if (!secret) return false;

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`admin:${expiresAt}`)
    .digest("hex");
  return safeEqual(signature, expected);
}

export function isAdminSession(): boolean {
  return verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

export function requireAdminPage(): void {
  if (!isAdminSession()) {
    redirect("/login?next=/admin");
  }
}

export function requireAdminApi(): { ok: true } | { ok: false; response: Response } {
  if (!isAdminSession()) {
    return {
      ok: false,
      response: Response.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }
  return { ok: true };
}

export function isSameOrigin(request: NextRequest | Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? requestUrl.protocol.replace(":", "");
  const allowed = new Set([requestUrl.origin]);

  if (forwardedHost) {
    allowed.add(`${forwardedProto}://${forwardedHost}`);
  }

  return allowed.has(origin);
}

export { SESSION_TTL_SECONDS };
