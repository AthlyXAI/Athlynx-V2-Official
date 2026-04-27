import { useEffect } from "react";



/**
 * Auth Callback — Legacy page.
 * Firebase handles sign-in inline (popup) — no redirect callback needed.
 * This page just redirects to the stored return URL or /feed.
 */
export default function AuthCallback() {
  useEffect(() => {
    const returnTo = sessionStorage.getItem("auth_return_to") || "/feed";
    sessionStorage.removeItem("auth_return_to");
    window.location.href = returnTo;
  }, []);

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
