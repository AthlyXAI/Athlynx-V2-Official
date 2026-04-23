/**
 * ATHLYNX — Unified Auth Hook
 * Uses Okta/Auth0 as the single source of truth for authentication.
 * Works on Vercel static deployment — no backend session cookie required.
 */
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

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
        name: auth0User.name ?? auth0User.nickname ?? auth0User.email ?? "",
        email: auth0User.email ?? "",
        avatarUrl: auth0User.picture ?? "",
        openId: auth0User.sub ?? "",
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
