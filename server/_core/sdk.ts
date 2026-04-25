/**
 * SDK Server — ATHLYNX
 * Auth0 JWT-based authentication. NO Manus OAuth server. NO WebDevAuthPublicService.
 * Maintains the same public interface so no other files need to change.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify, createRemoteJWKSet, decodeJwt } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// ─── Types (previously from manusTypes) ──────────────────────────────────────

export type ExchangeTokenResponse = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
};

export type GetUserInfoResponse = {
  openId: string;
  name?: string;
  email?: string;
  platform?: string | null;
  loginMethod?: string | null;
  avatar?: string;
};

export type GetUserInfoWithJwtResponse = GetUserInfoResponse;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

// ─── Utility ─────────────────────────────────────────────────────────────────

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

// ─── Auth0 Token Exchange ─────────────────────────────────────────────────────

async function exchangeAuth0Code(code: string, redirectUri: string): Promise<ExchangeTokenResponse> {
  const domain = ENV.auth0Domain;
  const clientId = ENV.auth0ClientId;
  const clientSecret = ENV.auth0ClientSecret;

  if (!domain || !clientId || !clientSecret) {
    throw new Error("Auth0 credentials not configured (AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET)");
  }

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Auth0 token exchange failed: ${response.status} — ${err}`);
  }

  const data = await response.json() as {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

async function getAuth0UserInfo(accessToken: string): Promise<GetUserInfoResponse> {
  const domain = ENV.auth0Domain;
  if (!domain) throw new Error("AUTH0_DOMAIN not configured");

  const response = await fetch(`https://${domain}/userinfo`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Auth0 userinfo failed: ${response.status} — ${err}`);
  }

  const data = await response.json() as {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
    "https://athlynx.ai/loginMethod"?: string;
  };

  // Derive login method from Auth0 sub (e.g. "google-oauth2|...", "auth0|...", "apple|...")
  const loginMethod = deriveLoginMethodFromSub(data.sub);

  return {
    openId: data.sub,
    name: data.name,
    email: data.email,
    avatar: data.picture,
    platform: loginMethod,
    loginMethod,
  };
}

function deriveLoginMethodFromSub(sub: string): string {
  if (sub.startsWith("google-oauth2|")) return "google";
  if (sub.startsWith("apple|")) return "apple";
  if (sub.startsWith("github|")) return "github";
  if (sub.startsWith("windowslive|")) return "microsoft";
  if (sub.startsWith("auth0|")) return "email";
  if (sub.startsWith("sms|")) return "sms";
  return "oauth";
}

// ─── SDKServer ────────────────────────────────────────────────────────────────

class SDKServer {
  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) throw new Error("JWT_SECRET not configured");
    return new TextEncoder().encode(secret);
  }

  /**
   * Exchange OAuth authorization code for access token (Auth0)
   */
  async exchangeCodeForToken(code: string, state: string): Promise<ExchangeTokenResponse> {
    // state is base64-encoded redirect URI (same convention as before)
    let redirectUri: string;
    try {
      redirectUri = atob(state);
    } catch {
      redirectUri = state;
    }
    return exchangeAuth0Code(code, redirectUri);
  }

  /**
   * Get user information using access token (Auth0 /userinfo)
   */
  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    return getAuth0UserInfo(accessToken);
  }

  /**
   * Create a signed JWT session token for a user
   */
  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      { openId, appId: ENV.appId, name: options.name || "athlete" },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();
    return new SignJWT({ openId: payload.openId, appId: payload.appId, name: payload.name })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(cookieValue: string | undefined): Promise<SessionPayload | null> {
    if (!cookieValue) return null;
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, { algorithms: ["HS256"] });
      const { openId, appId, name } = payload as Record<string, unknown>;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId)) {
        console.warn("[Auth] Session payload missing required fields (openId or appId)");
        return null;
      }
      return { openId, appId, name: typeof name === "string" ? name : "" };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  /**
   * Authenticate an incoming Express request via session cookie.
   * Returns the User from DB or throws ForbiddenError.
   */
  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const signedInAt = new Date();
    let user = await db.getUserByOpenId(session.openId);

    // If user not in DB, try to sync from Auth0 using the session JWT
    if (!user) {
      try {
        // The session cookie is our own JWT — decode it to get openId
        // Then look up the user by openId (they should exist from OAuth callback)
        console.warn(`[Auth] User ${session.openId} not found in DB — may need to re-authenticate`);
        throw ForbiddenError("User not found — please sign in again");
      } catch (error) {
        if ((error as any)?.code === "FORBIDDEN") throw error;
        console.error("[Auth] Failed to sync user:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }

    await db.upsertUser({ openId: user.openId, lastSignedIn: signedInAt });
    return user;
  }

  /**
   * Get user info from a JWT token (Auth0 ID token or our session token)
   */
  async getUserInfoWithJwt(jwtToken: string): Promise<GetUserInfoWithJwtResponse> {
    try {
      // Try to decode as our own session JWT first
      const decoded = decodeJwt(jwtToken);
      const openId = decoded.openId as string;
      if (openId) {
        const user = await db.getUserByOpenId(openId);
        if (user) {
          return {
            openId: user.openId,
            name: user.name ?? undefined,
            email: user.email ?? undefined,
            loginMethod: user.loginMethod ?? null,
            platform: user.loginMethod ?? null,
          };
        }
      }
    } catch {
      // Not our JWT — ignore
    }
    throw new Error("Unable to resolve user from JWT token");
  }
}

export const sdk = new SDKServer();
