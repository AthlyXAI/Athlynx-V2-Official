/**
 * ATHLYNX — Gravatar Service
 * Fetches verified avatar URLs from Gravatar using the REST API.
 * Falls back to the standard Gravatar CDN URL if the API call fails.
 *
 * Credentials (set in Vercel env):
 *   GRAVATAR_API_KEY       — secret key for server-side API calls
 *   GRAVATAR_CLIENT_ID     — OAuth client ID (138479)
 *   GRAVATAR_CLIENT_SECRET — OAuth client secret
 */
import crypto from "crypto";

const GRAVATAR_API_KEY = process.env.GRAVATAR_API_KEY ?? "";

/**
 * Returns an MD5 hash of a lowercase, trimmed email — used by Gravatar.
 */
function emailHash(email: string): string {
  return crypto
    .createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

/**
 * Fetches the Gravatar profile avatar URL for a given email.
 * Returns the URL string if a Gravatar exists, or null if not found.
 */
export async function getGravatarUrl(email: string): Promise<string | null> {
  if (!email) return null;

  const hash = emailHash(email);

  // Try the Gravatar REST API first (requires API key)
  if (GRAVATAR_API_KEY) {
    try {
      const res = await fetch(`https://api.gravatar.com/v3/profiles/${hash}`, {
        headers: {
          Authorization: `Bearer ${GRAVATAR_API_KEY}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        const avatarUrl =
          data?.avatar_url ||
          data?.entry?.[0]?.thumbnailUrl ||
          null;
        if (avatarUrl) return avatarUrl;
      }
    } catch (err) {
      console.warn("[Gravatar] API call failed, falling back to CDN:", err);
    }
  }

  // Fallback: use the standard Gravatar CDN URL with 404 check
  // d=404 means return 404 if no Gravatar exists (so we don't show default icons)
  const cdnUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=404`;
  try {
    const check = await fetch(cdnUrl, { method: "HEAD" });
    if (check.ok) return `https://www.gravatar.com/avatar/${hash}?s=200`;
  } catch {
    // Network error — skip
  }

  return null;
}
