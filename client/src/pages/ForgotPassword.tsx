/**
 * ForgotPassword — redirects to Auth0 Universal Login for password reset.
 * Auth0 handles password reset natively via the "Forgot Password" link
 * on the Universal Login page. This page simply sends users there.
 */
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ForgotPassword() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    // Redirect to Auth0 login — the "Forgot Password" link is on the Auth0 page
    loginWithRedirect({
      appState: { returnTo: "/feed" },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#050c1a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[#00c2ff]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-[#00c2ff] border-t-transparent animate-spin" />
        </div>
        <p className="text-white font-bold text-lg mb-1">Redirecting...</p>
        <p className="text-[#00c2ff]/60 text-sm">Taking you to the login page</p>
      </div>
    </div>
  );
}
