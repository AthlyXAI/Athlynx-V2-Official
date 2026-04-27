import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { signInWithGoogle, signInWithApple, signInWithFacebook } from "@/lib/firebase";

const FEATURES = [
  { icon: "/icons/nil_portal_app_icon_n_final_0993a3be.png", title: "NIL Deals", desc: "Connect with brands & earn" },
  { icon: "/icons/ai-recruiter_4cfda0f2.png", title: "AI Recruiter", desc: "Get discovered by coaches" },
  { icon: "/icons/transfer-portal_509bd0ba.png", title: "Transfer Portal", desc: "Find your next opportunity" },
  { icon: "/icons/nil-vault_e80ffa38.png", title: "NIL Vault", desc: "Track every dollar you earn" },
  { icon: "/athlynx-icon.png", title: "LYNX AI", desc: "Your personal AI companion" },
  { icon: "/icons/diamond-grind_890f28f2.png", title: "Diamond Grind", desc: "Train like a champion" },
];

export default function SignIn() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const syncFirebase = trpc.auth.syncFirebaseUser.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const handleGoogle = async () => {
    setError(null); setLoading("google");
    try {
      const { idToken } = await signInWithGoogle();
      const result = await syncFirebase.mutateAsync({ idToken });
      navigate(result.isNewUser ? "/onboarding" : "/feed");
    } catch (err: any) {
      if (!err?.message?.includes("popup-closed")) setError("Google sign-in failed. Please try again.");
    } finally { setLoading(null); }
  };

  const handleApple = async () => {
    setError(null); setLoading("apple");
    try {
      const { idToken } = await signInWithApple();
      const result = await syncFirebase.mutateAsync({ idToken });
      navigate(result.isNewUser ? "/onboarding" : "/feed");
    } catch (err: any) {
      if (!err?.message?.includes("popup-closed")) setError("Apple sign-in failed. Please try again.");
    } finally { setLoading(null); }
  };

  const handleFacebook = async () => {
    setError(null); setLoading("facebook");
    try {
      const { idToken } = await signInWithFacebook();
      const result = await syncFirebase.mutateAsync({ idToken });
      navigate(result.isNewUser ? "/onboarding" : "/feed");
    } catch (err: any) {
      if (!err?.message?.includes("popup-closed")) setError("Facebook sign-in failed. Please try again.");
    } finally { setLoading(null); }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading("email");
    try {
      if (emailMode === "signin") {
        await loginMutation.mutateAsync({ email, password });
        navigate("/feed");
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(null); return; }
        await registerMutation.mutateAsync({ name, email, password });
        navigate("/onboarding");
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Please check your credentials.");
    } finally { setLoading(null); }
  };

  const isLoading = loading !== null;

  return (
    <div className="min-h-screen bg-[#050c1a] flex flex-col overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a3e] via-[#050c1a] to-[#0a0520]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c2ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0066ff]/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,194,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logos/athlynx-main-logo.png" alt="ATHLYNX" className="w-9 h-9 rounded-lg" />
            <div>
              <div className="text-white font-black text-lg tracking-tight leading-none">ATHLYNX</div>
              <div className="text-[#00c2ff] text-[10px] font-semibold tracking-widest uppercase">The Athlete's Playbook</div>
            </div>
          </div>
        </Link>
        <div className="text-white/40 text-sm">
          By <span className="text-white/70">Dozier Holdings Group</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1">
        {/* Left — login card */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-xs font-semibold tracking-wide uppercase">Live Platform</span>
            </div>

            <h1 className="text-white text-3xl font-black leading-tight mb-2">
              Your Athletic<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c2ff] to-[#0066ff]">
                Career Starts Here
              </span>
            </h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              Join thousands of athletes building their brand, securing NIL deals, and getting recruited — all in one place.
            </p>

            {/* Login card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
              <p className="text-center text-white/50 text-sm mb-5 font-medium">
                Sign up or sign in to get started
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {!showEmailForm ? (
                <>
                  {/* Google */}
                  <button onClick={handleGoogle} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 shadow-lg mb-3 disabled:opacity-60">
                    {loading === "google" ? <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                    Continue with Google
                  </button>

                  {/* Apple */}
                  <button onClick={handleApple} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 border border-white/20 text-white font-bold py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 shadow-lg mb-3 disabled:opacity-60">
                    {loading === "apple" ? <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                    Continue with Apple
                  </button>

                  {/* Facebook */}
                  <button onClick={handleFacebook} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 shadow-lg mb-4 disabled:opacity-60">
                    {loading === "facebook" ? <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                    Continue with Facebook
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/30 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <button onClick={() => { setShowEmailForm(true); setEmailMode("signup"); }} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 text-sm">
                    Sign up with Email
                  </button>
                  <button onClick={() => { setShowEmailForm(true); setEmailMode("signin"); }} className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white/60 text-sm py-2 transition-colors mt-1">
                    Already have an account? Sign in
                  </button>
                </>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold text-sm">{emailMode === "signup" ? "Create Account" : "Sign In"}</span>
                    <button type="button" onClick={() => { setShowEmailForm(false); setError(null); }} className="text-white/40 hover:text-white/70 text-xs">← Back</button>
                  </div>
                  {emailMode === "signup" && (
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00c2ff]/50" />
                  )}
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00c2ff]/50" />
                  <input type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00c2ff]/50" />
                  <button type="submit" disabled={isLoading} className="w-full bg-[#00c2ff] hover:bg-[#00a8e0] text-white font-bold py-3.5 rounded-xl transition-all duration-150 disabled:opacity-60">
                    {loading === "email" ? <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin mx-auto" /> : (emailMode === "signup" ? "Create Account" : "Sign In")}
                  </button>
                  <button type="button" onClick={() => setEmailMode(emailMode === "signin" ? "signup" : "signin")} className="w-full text-white/40 hover:text-white/60 text-xs py-1 transition-colors">
                    {emailMode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </form>
              )}

              {/* Terms */}
              <p className="text-center text-white/25 text-xs mt-5 leading-relaxed">
                By continuing you agree to our{" "}
                <Link href="/terms-of-service"><span className="text-white/40 hover:text-white/70 underline cursor-pointer">Terms</span></Link>
                {" "}&amp;{" "}
                <Link href="/privacy-policy"><span className="text-white/40 hover:text-white/70 underline cursor-pointer">Privacy Policy</span></Link>.
                <br />7-day free trial — credit card required — not charged for 7 days.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 flex items-center justify-center gap-6 text-center">
              <div>
                <div className="text-white font-bold text-lg">10K+</div>
                <div className="text-white/40 text-xs">Athletes</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-white font-bold text-lg">$2M+</div>
                <div className="text-white/40 text-xs">NIL Earned</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-white font-bold text-lg">500+</div>
                <div className="text-white/40 text-xs">Schools</div>
              </div>
            </div>

            <p className="text-white/20 text-[10px] text-center mt-4">
              A Dozier Holdings Group Company · Houston, TX
            </p>
          </div>
        </div>

        {/* Right — features panel (desktop only) */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-12 border-l border-white/5">
          <div className="max-w-sm w-full">
            <div className="text-white/30 text-xs uppercase tracking-widest mb-4">Everything in one platform</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="bg-white/5 border border-white/10 hover:border-[#00c2ff]/30 rounded-xl p-4 transition-all duration-200 group"
                >
                  <img src={f.icon} alt={f.title} className="w-10 h-10 rounded-xl object-cover mb-2" />
                  <div className="text-white font-bold text-sm mb-0.5 group-hover:text-[#00c2ff] transition-colors">{f.title}</div>
                  <div className="text-white/40 text-xs">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-[#00c2ff]/10 to-[#0066ff]/10 border border-[#00c2ff]/20 rounded-xl p-4">
              <div className="text-[#00c2ff] text-xs font-bold uppercase tracking-widest mb-1">NIL Earnings Potential</div>
              <div className="text-white font-black text-2xl mb-1">$500 – $50,000+</div>
              <div className="text-white/50 text-xs">per deal, tracked and managed in your NIL Vault</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
