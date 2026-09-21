import { NextResponse } from "next/server";
import {
  ALLOWED_DOMAIN,
  createAccessToken,
  hasSigningSecret,
  isAllowedEmail,
  normalizeEmail,
} from "@/lib/growmont/access";
import { sendDownloadLink } from "@/lib/growmont/mail";
import { type Platform, resolveReleaseAsset } from "@/lib/growmont/release";

// Tighter than the discovery form: this endpoint puts mail into someone
// else's inbox, so the limit is about not letting a stranger use us to spam
// a growmont.com address.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 4;

// Static page on the separate growmont-downloads Vercel project. It hands the
// token on to this site's /api/growmont/download, which still does the check.
const ANDROID_HANDOFF_URL = "https://downloads.svayatta.in/android";

const ipMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) return true;

  record.count += 1;
  return false;
}

// In development the link must point back at the server that issued it —
// otherwise a local test mails a production URL, which lands on a route that
// may not be deployed yet (404) or is signed with a different secret (403).
// In production the configured domain wins, so the link can never be steered
// somewhere else by a forged Host header.
function baseUrl(request: Request): string {
  if (process.env.NODE_ENV !== "production") return new URL(request.url).origin;
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429 },
      );
    }

    // The release itself needs no config — it resolves from the repo's latest
    // release — so only mail and signing have to be present here.
    if (!process.env.RESEND_API_KEY || !hasSigningSecret()) {
      return NextResponse.json(
        {
          error:
            "Downloads are not configured yet. Set RESEND_API_KEY and GROWMONT_DOWNLOAD_SECRET on the server.",
        },
        { status: 503 },
      );
    }

    const payload = await request.json().catch(() => null);
    const email = normalizeEmail((payload as { email?: unknown } | null)?.email);

    // The domain rule is stated plainly in the UI, so saying which address
    // was rejected leaks nothing and saves someone staring at an inbox that
    // is never going to receive anything because of a typo.
    if (!isAllowedEmail(email)) {
      return NextResponse.json(
        { error: `This download is limited to @${ALLOWED_DOMAIN} email addresses.` },
        { status: 403 },
      );
    }

    // Resolved before sending so a misconfigured token surfaces here rather
    // than as a dead link in someone's inbox. Both platforms share one cached
    // release lookup, so this still costs a GitHub call at most once every
    // few minutes.
    //
    // Every release publishes both artifacts, so a missing one means the
    // release is broken rather than that this recipient should get a
    // half-working email.
    const [windowsAsset, androidAsset] = await Promise.all([
      resolveReleaseAsset("windows"),
      resolveReleaseAsset("android"),
    ]);
    if (!windowsAsset || !androidAsset) {
      return NextResponse.json(
        { error: "The download is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    const token = createAccessToken(email);
    if (!token) {
      return NextResponse.json(
        { error: "Downloads are not configured yet. GROWMONT_DOWNLOAD_SECRET is missing." },
        { status: 503 },
      );
    }

    // One token covers both buttons; the platform only selects which asset
    // the gate hands back, so it does not need to be signed.
    const base = baseUrl(request);
    const link = (platform: Platform) =>
      `${base}/api/growmont/download?token=${encodeURIComponent(token)}&platform=${platform}`;

    await sendDownloadLink(email, {
      version: windowsAsset.version,
      windows: { url: link("windows"), size: windowsAsset.size },
      // Android goes through the hand-off page, which re-opens the download
      // in Chrome instead of the mail app's in-app browser.
      android: {
        url: `${ANDROID_HANDOFF_URL}?token=${encodeURIComponent(token)}`,
        size: androidAsset.size,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Growmont download request failed:", error);
    return NextResponse.json(
      { error: "Could not send the download link. Please try again." },
      { status: 500 },
    );
  }
}
