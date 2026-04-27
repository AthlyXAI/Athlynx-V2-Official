/**
 * ATHLYNX — Unified Auth Hook
 * Uses session cookie (set by server after Firebase sign-in) as the auth source.
 * Calls trpc.auth.me to get the current user from the DB.
 * Replaces Auth0/Okta completely.
 */
import { useCallback } from "react";
import { trpc } from "@/lib/trpc";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } = options ?? {};

  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { window.location.href = "/signin"; },
  });

  const logout = useCallback(() => { logoutMutation.mutate(); }, [logoutMutation]);

  const login = useCallback((returnTo?: string) => {
    const target = returnTo ?? window.location.pathname;
    sessionStorage.setItem("auth_return_to", target);
    window.location.href = "/signin";
  }, []);

  const isAuthenticated = !!user;

  if (
    redirectOnUnauthenticated &&
    !isLoading &&
    !isAuthenticated &&
    typeof window !== "undefined" &&
    window.location.pathname !== redirectPath
  ) {
    window.location.href = redirectPath;
  }

  return {
    user: user ?? null,
    loading: isLoading,
    isAuthenticated,
    error: null,
    login,
    logout,
    refresh: refetch,
    // Legacy compatibility stubs
    getAccessTokenSilently: async () => "",
    getIdTokenClaims: async () => null,
  };
}
