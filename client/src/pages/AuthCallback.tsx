import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { trpc } from "@/lib/trpc";

/**
 * Auth0 redirects here after login.
 * We sync the Auth0 user to our backend DB (which sets a session cookie),
 * then do a HARD redirect:
 *   - New users  → /onboarding  (AI bot collects profile info)
 *   - Returning  → /feed        (straight into the platform)
 */
export default function AuthCallback() {
  const { isAuthenticated, isLoading, user, getIdTokenClaims } = useAuth0();
  const syncUser = trpc.auth.syncAuth0User.useMutation();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasSynced.current) return;

    if (!isAuthenticated || !user) {
      // Not authenticated — go back to sign in
      window.location.href = "/signin";
      return;
    }

    hasSynced.current = true;

    const doSync = async () => {
      let isNewUser = false;
      try {
        // Use ID token claims — works without an audience configured
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
        console.error("[AuthCallback] Sync failed:", err);
        // Even if sync fails, redirect so user isn't stuck
      } finally {
        const returnTo = sessionStorage.getItem('auth_return_to') || null;
        sessionStorage.removeItem('auth_return_to');
        // New users → onboarding; returning users → intended destination or feed
        window.location.href = isNewUser ? "/onboarding" : (returnTo || "/feed");
      }
    };

    doSync();
  }, [isAuthenticated, isLoading, user]);

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
