import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/growmont/access";
import { resolveReleaseAsset } from "@/lib/growmont/release";

const MESSAGES: Record<string, { status: number; text: string }> = {
  "not-configured": { status: 503, text: "Downloads are not configured yet." },
  malformed: { status: 400, text: "This download link is not valid." },
  invalid: { status: 403, text: "This download link is not valid." },
  expired: { status: 410, text: "This download link has expired. Please request a new one." },
};

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const result = verifyAccessToken(token);

  if (!result.ok) {
    const { status, text } = MESSAGES[result.reason];
    return new NextResponse(text, {
      status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const githubToken = process.env.GROWMONT_GITHUB_TOKEN;

  const asset = await resolveReleaseAsset();
  if (!asset) {
    console.error(
      githubToken
        ? "Growmont release could not be resolved; check the token has Contents:Read on the release repo."
        : "Growmont release could not be resolved and no GROWMONT_GITHUB_TOKEN is set — a private repo needs one.",
    );
    return new NextResponse("The setup file is temporarily unavailable.", { status: 503 });
  }

  // Public release: hand the browser straight to GitHub. A 17 MB installer
  // never touches this server, so it costs no bandwidth or execution time.
  if (!githubToken) {
    return NextResponse.redirect(asset.downloadUrl, 302);
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
      return new NextResponse("The setup file is temporarily unavailable.", { status: 502 });
    }
    upstream = await fetch(location, { redirect: "follow" });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Growmont asset fetch failed:", upstream.status, upstream.statusText);
    return new NextResponse("The setup file is temporarily unavailable.", { status: 502 });
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
