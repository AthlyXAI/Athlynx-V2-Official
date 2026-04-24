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
 * Auth0 redirects here after login.
 *
 * Flow:
 *   1. Auth0 redirects to /callback?code=...&state=...
 *   2. We call handleRedirectCallback() to exchange the code for tokens
 *   3. Auth0 sets isAuthenticated = true and populates user
 *   4. We sync the user to our backend DB (sets a session cookie)
 *   5. New users  → /onboarding
 *      Returning  → /feed
 *
 * "Invalid state" fix:
 *   When the email link opens in a different browser/tab, Auth0 throws
 *   "Invalid state". We clear stale state and call loginWithRedirect()
 *   to restart a fresh login — no looping.
 */
export default function AuthCallback() {
  const {
    isAuthenticated,
    isLoading,
    user,
    getIdTokenClaims,
    handleRedirectCallback,
    loginWithRedirect,
    error: auth0Error,
  } = useAuth0();

  const syncUser = trpc.auth.syncAuth0User.useMutation();
  const hasSynced = useRef(false);
  const hasHandledCallback = useRef(false);
  const hardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRestarted = useRef(false);

  const restartLogin = () => {
    if (hasRestarted.current) return;
    hasRestarted.current = true;
    if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    clearStaleAuth0State();
    // Use loginWithRedirect to start a fresh session — not window.location
    loginWithRedirect({ appState: { returnTo: "/feed" } });
  };

  // Hard timeout: if stuck for more than 20 seconds, restart login
  useEffect(() => {
    hardTimeoutRef.current = setTimeout(() => {
      console.warn("[AuthCallback] Hard timeout — restarting login");
      restartLogin();
    }, 20000);
    return () => {
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        })
        .catch((err) => {
          console.error("[AuthCallback] handleRedirectCallback failed:", err);
          const isInvalidState =
            err?.message?.includes("Invalid state") ||
            err?.error === "invalid_state" ||
            err?.message?.includes("invalid_state");

          if (isInvalidState) {
            // Restart login cleanly — don't redirect to /signin (that loops)
            restartLogin();
          } else {
            if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
            window.location.href = "/signin";
          }
        });
    } else if (!isLoading && !isAuthenticated) {
      // No code in URL and not authenticated — restart login
      restartLogin();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Auth0 hook-level errors (e.g. "Invalid state" from useAuth0)
  useEffect(() => {
    if (!auth0Error) return;
    const isInvalidState =
      auth0Error.message?.includes("Invalid state") ||
      (auth0Error as any)?.error === "invalid_state" ||
      auth0Error.message?.includes("invalid_state");

    if (isInvalidState) {
      console.warn("[AuthCallback] Auth0 hook error: Invalid state — restarting login");
      restartLogin();
    } else {
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
      window.location.href = `/signin?error=${encodeURIComponent(auth0Error.message)}`;
    }
  }, [auth0Error]); // eslint-disable-line react-hooks/exhaustive-deps

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
        console.error("[AuthCallback] Backend sync failed (non-fatal):", err);
        // Sync failure is non-fatal — still redirect so user isn't stuck
      } finally {
        const returnTo = sessionStorage.getItem("auth_return_to") || null;
        sessionStorage.removeItem("auth_return_to");
        window.location.href = isNewUser ? "/onboarding" : (returnTo || "/feed");
      }
    };

    doSync();
  }, [isAuthenticated, isLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

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
