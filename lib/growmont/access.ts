import { createHmac, timingSafeEqual } from "crypto";

/**
 * Access control for the Growmont setup download.
 *
 * The gate is deliberately server-side and mail-based. A browser-side check
 * that reveals a release URL protects nothing — the URL ships inside the JS
 * bundle and can be read straight out of it. Requiring the link to arrive by
 * email is what actually proves the requester controls an @growmont.com
 * mailbox, since that is the only place the token is ever sent.
 *
 * Tokens are HMAC-signed and short-lived, so a forwarded link stops working
 * on its own rather than becoming a permanent public download.
 */

/** The domain shown to users in the UI and in error messages. */
export const ALLOWED_DOMAIN = "growmont.com";

/**
 * Every domain that is actually accepted. svayatta.in is here so the team can
 * test the flow end to end with their own inboxes; it is deliberately not
 * mentioned anywhere user-facing. Remove it to lock the download to Growmont.
 */
const ACCEPTED_DOMAINS = new Set([ALLOWED_DOMAIN, "svayatta.in"]);

/** How long an emailed link stays usable. */
export const TOKEN_TTL_MS = 30 * 60 * 1000;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string {
  return String(raw ?? "").trim().toLowerCase();
}

/**
 * Exact-domain match, never `endsWith`. `endsWith("growmont.com")` would also
 * accept `attacker@notgrowmont.com`, and matching on the bare domain without
 * anchoring to the final "@" would accept `growmont.com@evil.tld`.
 */
export function isAllowedEmail(email: string): boolean {
  if (!EMAIL_RX.test(email)) return false;
  const at = email.lastIndexOf("@");
  if (at < 1) return false;
  return ACCEPTED_DOMAINS.has(email.slice(at + 1));
}

function secret(): string | null {
  const value = process.env.GROWMONT_DOWNLOAD_SECRET;
  return value && value.length >= 16 ? value : null;
}

/** Whether a signing secret is present; the release itself resolves separately. */
export function hasSigningSecret(): boolean {
  return secret() !== null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

/** Returns null when no signing secret is configured. */
export function createAccessToken(email: string, now = Date.now()): string | null {
  const key = secret();
  if (!key) return null;

  const payload = Buffer.from(
    JSON.stringify({ e: email, x: now + TOKEN_TTL_MS }),
  ).toString("base64url");

  return `${payload}.${sign(payload, key)}`;
}

export type TokenResult =
  | { ok: true; email: string }
  | { ok: false; reason: "not-configured" | "malformed" | "invalid" | "expired" };

export function verifyAccessToken(raw: unknown): TokenResult {
  const key = secret();
  if (!key) return { ok: false, reason: "not-configured" };

  const [payload, signature] = String(raw ?? "").split(".");
  if (!payload || !signature) return { ok: false, reason: "malformed" };

  // Length is compared first: timingSafeEqual throws on a length mismatch
  // rather than returning false.
  const provided = Buffer.from(signature);
  const expected = Buffer.from(sign(payload, key));
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "invalid" };
  }

  let parsed: { e?: unknown; x?: unknown };
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (typeof parsed.x !== "number") return { ok: false, reason: "malformed" };
  if (Date.now() > parsed.x) return { ok: false, reason: "expired" };

  const email = normalizeEmail(parsed.e);
  // Re-checked on redeem, not just on issue, so tightening ACCEPTED_DOMAINS
  // immediately invalidates tokens that are still inside their TTL.
  if (!isAllowedEmail(email)) return { ok: false, reason: "invalid" };

  return { ok: true, email };
}
