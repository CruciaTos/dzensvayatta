/**
 * Resolves which file the download route should hand back.
 *
 * Points at the repository rather than a versioned asset URL on purpose: the
 * latest release is looked up at request time, so publishing v1.0.1 makes the
 * site serve it with no redeploy and no env change. Pin GROWMONT_RELEASE_URL
 * only when a specific build has to be served indefinitely.
 */

const DEFAULT_REPO = "CruciaTos/GrowmontCRM_Release";

/**
 * Unauthenticated GitHub API allows 60 requests/hour per IP, and on a
 * serverless host that IP is shared with every other outbound call. Caching
 * the lookup keeps a busy download page from exhausting it.
 */
const CACHE_MS = 5 * 60 * 1000;

export interface ReleaseAsset {
  /** Public URL a browser can follow directly. */
  downloadUrl: string;
  /** API URL, required to fetch an asset from a private repo. */
  apiUrl: string;
  name: string;
  size: number;
  version: string;
}

let cache: { asset: ReleaseAsset; at: number } | null = null;

function pickAsset(assets: Array<Record<string, unknown>>) {
  // Prefer the installer over the checksum file that sits beside it.
  return (
    assets.find((a) => String(a.name ?? "").toLowerCase().endsWith(".exe")) ??
    assets.find((a) => !String(a.name ?? "").toLowerCase().endsWith(".sha256")) ??
    assets[0]
  );
}

export async function resolveReleaseAsset(): Promise<ReleaseAsset | null> {
  const pinned = process.env.GROWMONT_RELEASE_URL;
  if (pinned) {
    const name = pinned.split("/").pop() || "growmont-setup";
    return { downloadUrl: pinned, apiUrl: pinned, name, size: 0, version: "pinned" };
  }

  if (cache && Date.now() - cache.at < CACHE_MS) return cache.asset;

  const repo = process.env.GROWMONT_RELEASE_REPO || DEFAULT_REPO;
  const token = process.env.GROWMONT_GITHUB_TOKEN;

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "svayatta-growmont-download",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("GitHub release lookup failed:", response.status);
      // Stale beats broken — a rate-limited lookup should not take the
      // download offline when we already know where the file lives.
      return cache?.asset ?? null;
    }

    const data = (await response.json()) as {
      tag_name?: string;
      assets?: Array<Record<string, unknown>>;
    };

    const asset = pickAsset(data.assets ?? []);
    if (!asset) return cache?.asset ?? null;

    const resolved: ReleaseAsset = {
      downloadUrl: String(asset.browser_download_url ?? ""),
      apiUrl: String(asset.url ?? ""),
      name: String(asset.name ?? "growmont-setup"),
      size: Number(asset.size ?? 0),
      version: String(data.tag_name ?? ""),
    };

    if (!resolved.downloadUrl && !resolved.apiUrl) return cache?.asset ?? null;

    cache = { asset: resolved, at: Date.now() };
    return resolved;
  } catch (error) {
    console.error("GitHub release lookup threw:", error);
    return cache?.asset ?? null;
  }
}
