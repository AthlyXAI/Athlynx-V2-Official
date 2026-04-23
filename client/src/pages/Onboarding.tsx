/**
 * ATHLYNX — Onboarding Page
 * New users land here after Okta login to select their role.
 * Uses the full AIOnboarding component with all 19 roles.
 */
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AIOnboarding from "@/components/AIOnboarding";

export default function Onboarding() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    document.title = "Welcome to ATHLYNX — Set Up Your Profile";
  }, []);

  // If not authenticated, send back to sign in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: "/onboarding" } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#00c2ff]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-[#00c2ff] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050c1a]">
      <AIOnboarding
        onComplete={(_data: Record<string, string>) => {
          window.location.href = "/feed";
        }}
        onDismiss={() => {
          window.location.href = "/feed";
        }}
      />
    </div>
  );
}
