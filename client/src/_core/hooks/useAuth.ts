/**
 * ATHLYNX — Unified Auth Hook
 * Uses Supabase session as the auth source.
 * No server-side cookie required.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } = options ?? {};

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }, []);

  const login = useCallback((returnTo?: string) => {
    const target = returnTo ?? window.location.pathname;
    sessionStorage.setItem("auth_return_to", target);
    window.location.href = "/signin";
  }, []);

  const isAuthenticated = !!user;

  if (
    redirectOnUnauthenticated &&
    !loading &&
    !isAuthenticated &&
    typeof window !== "undefined" &&
    window.location.pathname !== redirectPath
  ) {
    window.location.href = redirectPath;
  }

  return {
    user: user ?? null,
    loading,
    isAuthenticated,
    error: null,
    login,
    logout,
    refresh: async () => {},
    // Legacy compatibility stubs
    getAccessTokenSilently: async () => "",
    getIdTokenClaims: async () => null,
  };
}
