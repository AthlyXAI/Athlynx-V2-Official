import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(
  req: Request
): { domain?: string; httpOnly: boolean; path: string; sameSite: string; secure: boolean } {
  // On Vercel (production), x-forwarded-proto is always "https".
  // We also check req.protocol as a fallback for local dev.
  const fwd = req.headers["x-forwarded-proto"];
  const fwdList = fwd
    ? (Array.isArray(fwd) ? fwd : fwd.split(","))
    : [];
  const isSecure =
    req.protocol === "https" ||
    fwdList.some((p: string) => p.trim().toLowerCase() === "https") ||
    process.env.NODE_ENV === "production";

  return {
    domain: undefined,
    httpOnly: true,
    path: "/",
    // Use "lax" so the cookie is sent on same-site navigations (including
    // the redirect back from Auth0 to /callback). "none" requires secure=true
    // and can be dropped by some mobile browsers.
    sameSite: isSecure ? "lax" : "lax",
    secure: isSecure,
  };
}
