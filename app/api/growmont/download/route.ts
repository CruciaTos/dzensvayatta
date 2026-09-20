import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/growmont/access";
import { DEFAULT_PLATFORM, isPlatform, resolveReleaseAsset } from "@/lib/growmont/release";

const MESSAGES: Record<string, { status: number; text: string }> = {
  "not-configured": { status: 503, text: "Downloads are not configured yet." },
  malformed: { status: 400, text: "This download link is not valid." },
  invalid: { status: 403, text: "This download link is not valid." },
  expired: { status: 410, text: "This download link has expired. Please request a new one." },
};

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const token = params.get("token");
  const result = verifyAccessToken(token);

  if (!result.ok) {
    const { status, text } = MESSAGES[result.reason];
    return new NextResponse(text, {
      status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Absent means Windows, so links mailed out before Android shipped still
  // resolve. Present but unrecognised is a typo or a probe, not a default.
  const rawPlatform = params.get("platform");
  if (rawPlatform !== null && !isPlatform(rawPlatform)) {
    return new NextResponse("Unknown download platform.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const platform = rawPlatform ?? DEFAULT_PLATFORM;

  const githubToken = process.env.GROWMONT_GITHUB_TOKEN;

  const asset = await resolveReleaseAsset(platform);
  if (!asset) {
    console.error(
      githubToken
        ? `Growmont ${platform} release could not be resolved; check the token has Contents:Read on the release repo.`
        : `Growmont ${platform} release could not be resolved and no GROWMONT_GITHUB_TOKEN is set — a private repo needs one.`,
    );
    return new NextResponse("This download is temporarily unavailable.", { status: 503 });
  }

  // Whether to proxy is about the RELEASE being private, not about a token
  // being present: the token is also what buys an authenticated API lookup
  // (5000/hour instead of 60/hour on a shared serverless IP), so the two
  // decisions are kept apart.
  //
  // Public release: hand the browser straight to GitHub. The bytes never
  // touch this server, so the download costs no bandwidth and — crucially —
  // is not bounded by the function's maxDuration. A 66 MB APK proxied
  // through a serverless function has to finish inside that window or the
  // user gets a truncated file; a redirect has no such limit.
  if (process.env.GROWMONT_RELEASE_PRIVATE !== "true") {
    return NextResponse.redirect(asset.downloadUrl, 302);
  }

  if (!githubToken) {
    console.error(
      "GROWMONT_RELEASE_PRIVATE is true but GROWMONT_GITHUB_TOKEN is unset; a private release cannot be served.",
    );
    return new NextResponse("This download is temporarily unavailable.", { status: 503 });
  }

  // Private release: GitHub will not serve the asset to an unauthenticated
  // browser, so the bytes are proxied with the token attached — which also
  // means the real asset URL is never exposed to the client.
  //
  // The redirect is followed by hand rather than with `redirect: "follow"`.
  // GitHub answers the asset API with a 302 to a pre-signed S3 URL, and S3
  // rejects that request with 400 ("only one auth mechanism allowed") if an
  // Authorization header rides along. The fetch spec says to drop that header
  // on a cross-origin redirect, but leaning on every runtime to implement
  // that correctly is not worth a broken download: fetch the location
  // explicitly, with no credentials attached.
  let upstream = await fetch(asset.apiUrl, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/octet-stream",
      "User-Agent": "svayatta-growmont-download",
    },
    redirect: "manual",
  });

  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location");
    if (!location) {
      console.error("Growmont asset redirect had no location header");
      return new NextResponse("This download is temporarily unavailable.", { status: 502 });
    }
    upstream = await fetch(location, { redirect: "follow" });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Growmont asset fetch failed:", upstream.status, upstream.statusText);
    return new NextResponse("This download is temporarily unavailable.", { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
      ...(upstream.headers.get("content-length")
        ? { "content-length": upstream.headers.get("content-length") as string }
        : {}),
      "content-disposition": `attachment; filename="${asset.name}"`,
      // Never let a proxy or the browser keep a copy of a gated artifact.
      "cache-control": "private, no-store",
    },
  });
}
