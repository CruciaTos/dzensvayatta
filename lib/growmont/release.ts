/**
 * Resolves which file the download route should hand back, per platform.
 *
 * Points at the repository rather than a versioned asset URL on purpose: the
 * latest release is looked up at request time, so publishing v1.0.1 makes the
 * site serve it with no redeploy and no env change. That matters more now
 * that two artifacts ship per release — the APK filename carries the version,
 * so any hardcoded URL would break on every publish.
 */

const DEFAULT_REPO = "CruciaTos/GrowmontCRM_Release";

/**
 * Unauthenticated GitHub API allows 60 requests/hour per IP, and on a
 * serverless host that IP is shared with every other outbound call. Caching
 * the lookup keeps a busy download page from exhausting it.
 */
const CACHE_MS = 5 * 60 * 1000;

export type Platform = "windows" | "android";

export const PLATFORMS: readonly Platform[] = ["windows", "android"];

/** Windows is the default so links issued before Android existed still work. */
export const DEFAULT_PLATFORM: Platform = "windows";

export function isPlatform(value: unknown): value is Platform {
  return PLATFORMS.includes(value as Platform);
}

interface PlatformSpec {
  /** Release asset name prefix, lowercased. */
  prefix: string;
  /** Release asset extension, lowercased. */
  extension: string;
  /** Env var that pins this platform to one URL forever. */
  pinnedEnv: string;
  /** Used only when a pinned URL has no filename to borrow. */
  fallbackName: string;
}

const SPECS: Record<Platform, PlatformSpec> = {
  windows: {
    prefix: "growmont-setup-",
    extension: ".exe",
    pinnedEnv: "GROWMONT_RELEASE_URL",
    fallbackName: "growmont-setup.exe",
  },
  android: {
    prefix: "growmont-crm-",
    extension: ".apk",
    pinnedEnv: "GROWMONT_RELEASE_URL_ANDROID",
    fallbackName: "growmont-crm.apk",
  },
};

export interface ReleaseAsset {
  /** Public URL a browser can follow directly. */
  downloadUrl: string;
  /** API URL, required to fetch an asset from a private repo. */
  apiUrl: string;
  name: string;
  size: number;
  version: string;
}

interface Release {
  tag: string;
  assets: Array<Record<string, unknown>>;
}

/**
 * One release payload serves every platform, so the cache holds the release
 * rather than a resolved asset — two buttons in one email cost one API call,
 * not two.
 */
let cache: { release: Release; at: number } | null = null;

/**
 * Resolving two platforms at once must not mean two GitHub calls. Concurrent
 * callers that miss the cache share one in-flight request, which keeps the
 * 60/hour unauthenticated budget tied to elapsed time rather than traffic.
 */
let inflight: Promise<Release | null> | null = null;

function assetName(asset: Record<string, unknown>): string {
  return String(asset.name ?? "").toLowerCase();
}

function pickAsset(
  assets: Array<Record<string, unknown>>,
  spec: PlatformSpec,
): Record<string, unknown> | null {
  // The checksum file sits beside each artifact and must never be served as
  // the artifact itself.
  const artifacts = assets.filter((a) => !assetName(a).endsWith(".sha256"));

  return (
    artifacts.find(
      (a) => assetName(a).startsWith(spec.prefix) && assetName(a).endsWith(spec.extension),
    ) ??
    // Prefix is a convention, extension is the contract — a rename upstream
    // should not take the download offline.
    artifacts.find((a) => assetName(a).endsWith(spec.extension)) ??
    null
  );
}

async function fetchRelease(): Promise<Release | null> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.release;
  if (inflight) return inflight;

  inflight = loadRelease().finally(() => {
    inflight = null;
  });

  return inflight;
}

async function loadRelease(): Promise<Release | null> {
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
      return cache?.release ?? null;
    }

    const data = (await response.json()) as {
      tag_name?: string;
      assets?: Array<Record<string, unknown>>;
    };

    const release: Release = {
      tag: String(data.tag_name ?? ""),
      assets: data.assets ?? [],
    };

    cache = { release, at: Date.now() };
    return release;
  } catch (error) {
    console.error("GitHub release lookup threw:", error);
    return cache?.release ?? null;
  }
}

export async function resolveReleaseAsset(platform: Platform): Promise<ReleaseAsset | null> {
  const spec = SPECS[platform];

  const pinned = process.env[spec.pinnedEnv];
  if (pinned) {
    const name = pinned.split("/").pop() || spec.fallbackName;
    return { downloadUrl: pinned, apiUrl: pinned, name, size: 0, version: "pinned" };
  }

  const release = await fetchRelease();
  if (!release) return null;

  const asset = pickAsset(release.assets, spec);
  // Deliberately no "just take the first asset" fallback: handing an .exe to
  // someone who asked for the APK is worse than a clean failure.
  if (!asset) {
    console.error(`No ${platform} asset (${spec.extension}) in release ${release.tag || "latest"}`);
    return null;
  }

  const resolved: ReleaseAsset = {
    downloadUrl: String(asset.browser_download_url ?? ""),
    apiUrl: String(asset.url ?? ""),
    name: String(asset.name ?? spec.fallbackName),
    size: Number(asset.size ?? 0),
    version: release.tag,
  };

  if (!resolved.downloadUrl && !resolved.apiUrl) return null;

  return resolved;
}
