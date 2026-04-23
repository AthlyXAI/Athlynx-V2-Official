/**
 * ATHLYNX — Unified Auth Hook
 * Uses Okta/Auth0 as the single source of truth for authentication.
 * Fetches DB user data (trial, subscription) and merges into user object.
 * Works on Vercel static deployment — no backend session cookie required.
 */
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

type DbUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: string | null;
  trialEndsAt: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePlanId: string | null;
  avatarUrl: string | null;
} | null;

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } =
    options ?? {};

  const {
    isAuthenticated,
    isLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  const login = useCallback(
    (returnTo?: string) => {
      const target = returnTo ?? window.location.pathname;
      sessionStorage.setItem("auth_return_to", target);
      loginWithRedirect({
        appState: { returnTo: target },
      });
    },
    [loginWithRedirect]
  );

  const logout = useCallback(() => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [auth0Logout]);

  // Fetch DB user data for trial/subscription info
  const { data: dbUser } = trpc.auth.getDbUser.useQuery(
    { openIdSub: auth0User?.sub ?? "" },
    { enabled: isAuthenticated && !!auth0User?.sub }
  );

  // Redirect unauthenticated users if requested
  if (
    redirectOnUnauthenticated &&
    !isLoading &&
    !isAuthenticated &&
    typeof window !== "undefined" &&
    window.location.pathname !== redirectPath
  ) {
    window.location.href = redirectPath;
  }

  const user = isAuthenticated && auth0User
    ? {
        id: auth0User.sub ?? "",
        dbId: dbUser?.id ?? null,
        name: dbUser?.name || auth0User.name || auth0User.nickname || auth0User.email || "",
        email: dbUser?.email || auth0User.email || "",
        avatarUrl: dbUser?.avatarUrl || auth0User.picture || "",
        openId: auth0User.sub ?? "",
        role: dbUser?.role ?? "user",
        // Trial & subscription data from DB
        trialEndsAt: dbUser?.trialEndsAt ? new Date(dbUser.trialEndsAt) : null,
        stripeCustomerId: dbUser?.stripeCustomerId ?? null,
        stripeSubscriptionId: dbUser?.stripeSubscriptionId ?? null,
        stripePlanId: dbUser?.stripePlanId ?? null,
        raw: auth0User,
      }
    : null;

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    error: null,
    login,
    logout,
    refresh: () => {},
    getAccessTokenSilently,
    getIdTokenClaims,
  };
}
