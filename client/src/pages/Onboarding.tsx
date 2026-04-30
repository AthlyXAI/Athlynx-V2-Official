/**
 * ATHLYNX — Onboarding Page
 * New users land here after Firebase login to select their role.
 * Uses the full AIOnboarding component with all 19 roles.
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import AIOnboarding from "@/components/AIOnboarding";

export default function Onboarding() {
  const { isAuthenticated, loading: isLoading } = useAuth();

  useEffect(() => {
    document.title = "Welcome to ATHLYNX — Set Up Your Profile";
  }, []);

  // If not authenticated, send back to sign in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem("auth_return_to", "/onboarding");
      window.location.href = "/signin";
    }
  }, [isLoading, isAuthenticated]);

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
          window.location.href = "/portal";
        }}
        onDismiss={() => {
          window.location.href = "/portal";
        }}
      />
    </div>
  );
}
