import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { trpc } from "@/lib/trpc";

/**
 * Clear all stale Auth0 state from localStorage/sessionStorage.
 * Fixes "Invalid state" errors from leftover state after failed logins.
 */
function clearStaleAuth0State() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("@@auth0spajs@@") || key.startsWith("a0.spajs"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    const sKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith("@@auth0spajs@@") || key.startsWith("a0.spajs"))) {
        sKeysToRemove.push(key);
      }
    }
    sKeysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) { /* ignore */ }
}

/**
 * Auth0 redirects here after login (Google, Apple, Email).
 * CRITICAL: handleRedirectCallback() must be called to process the OAuth
 * authorization code in the URL before Auth0 sets isAuthenticated = true.
 *
 * Flow:
 *   1. Auth0 redirects to /callback?code=...&state=...
 *   2. We call handleRedirectCallback() to exchange the code for tokens
 *   3. Auth0 sets isAuthenticated = true and populates user
 *   4. We sync the user to our backend DB (sets a session cookie)
 *   5. New users  → /onboarding
 *      Returning  → /feed (or original destination)
 */
export default function AuthCallback() {
  const {
    isAuthenticated,
    isLoading,
    user,
    getIdTokenClaims,
    handleRedirectCallback,
    error: auth0Error,
  } = useAuth0();

  const syncUser = trpc.auth.syncAuth0User.useMutation();
  const hasSynced = useRef(false);
  const hasHandledCallback = useRef(false);
  const hardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hard timeout: if stuck for more than 12 seconds, clear state and redirect
  useEffect(() => {
    hardTimeoutRef.current = setTimeout(() => {
      console.warn("[AuthCallback] Hard timeout reached — clearing state and redirecting");
      clearStaleAuth0State();
      window.location.href = "/signin?error=timeout";
    }, 12000);
    return () => {
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    };
  }, []);

  // Step 1: Process the OAuth callback (exchange authorization code for tokens)
  useEffect(() => {
    if (hasHandledCallback.current) return;

    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has("code");
    const hasState = params.has("state");
    const hasError = params.has("error");

    if (hasError) {
      const errorDesc = params.get("error_description") ?? "Authentication failed";
      console.error("[AuthCallback] Auth0 error in URL:", errorDesc);
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
      window.location.href = `/signin?error=${encodeURIComponent(errorDesc)}`;
      return;
    }

    if (hasCode && hasState) {
      hasHandledCallback.current = true;
      handleRedirectCallback()
        .then((result) => {
          console.log("[AuthCallback] handleRedirectCallback success", result);
          if (result?.appState?.returnTo) {
            sessionStorage.setItem("auth_return_to", result.appState.returnTo);
          }
          // Auth0 will update isAuthenticated — the second useEffect handles sync
        })
        .catch((err) => {
          console.error("[AuthCallback] handleRedirectCallback failed:", err);
          if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
          clearStaleAuth0State();
          window.location.href = "/signin";
        });
    } else if (!isLoading && !isAuthenticated) {
      // No code in URL and not authenticated — redirect to sign in
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
      window.location.href = "/signin";
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2: Once Auth0 has processed the callback and user is available, sync to backend
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) return;
    if (hasSynced.current) return;

    hasSynced.current = true;
    if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);

    const doSync = async () => {
      let isNewUser = false;
      try {
        const claims = await getIdTokenClaims();
        const token = claims?.__raw ?? user.sub ?? "auth0_session";
        const result = await syncUser.mutateAsync({
          token,
          name: user.name ?? user.nickname ?? user.email ?? "",
          email: user.email ?? "",
          picture: user.picture ?? "",
          sub: user.sub ?? "",
        });
        isNewUser = result?.isNewUser ?? false;
      } catch (err) {
        console.error("[AuthCallback] Backend sync failed:", err);
        // Sync failure is non-fatal — still redirect so user isn't stuck
      } finally {
        const returnTo = sessionStorage.getItem("auth_return_to") || null;
        sessionStorage.removeItem("auth_return_to");
        window.location.href = isNewUser ? "/onboarding" : (returnTo || "/feed");
      }
    };

    doSync();
  }, [isAuthenticated, isLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show Auth0 error if present
  if (auth0Error) {
    // For Invalid state errors, clear stale state and auto-redirect
    if (auth0Error.message?.includes("Invalid state") || (auth0Error as any)?.error === "invalid_state") {
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
      clearStaleAuth0State();
      setTimeout(() => { window.location.href = "/signin"; }, 500);
      return (
        <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-[#00c2ff]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-[#00c2ff] border-t-transparent animate-spin" />
            </div>
            <p className="text-white font-black text-xl mb-2 tracking-widest">REFRESHING SESSION</p>
            <p className="text-[#00c2ff]/60 text-sm">Redirecting you back to sign in...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-bold text-xl mb-4">Login Error</p>
          <p className="text-white/60 text-sm mb-6">{auth0Error.message}</p>
          <a href="/signin" className="text-[#00c2ff] underline">Return to Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#00c2ff]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-[#00c2ff] border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/logos/athlynx-main-logo.png" alt="ATHLYNX" className="w-10 h-10 rounded-lg" />
          </div>
        </div>
        <p className="text-white font-black text-xl mb-2 tracking-widest">ENTERING THE PORTAL</p>
        <p className="text-[#00c2ff]/60 text-sm">Setting up your ATHLYNX account...</p>
      </div>
    </div>
  );
}
