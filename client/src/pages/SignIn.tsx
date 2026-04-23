import { Link } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663028706780/qUknrdlyPrUZJQYo.png";

const FEATURES = [
  { icon: `${CDN}/nil_portal_app_icon_n_final_0993a3be.png`, title: "NIL Deals", desc: "Connect with brands & earn" },
  { icon: `${CDN}/ai-recruiter_4cfda0f2.png`, title: "AI Recruiter", desc: "Get discovered by coaches" },
  { icon: `${CDN}/transfer-portal_509bd0ba.png`, title: "Transfer Portal", desc: "Find your next opportunity" },
  { icon: `${CDN}/nil-vault_e80ffa38.png`, title: "NIL Vault", desc: "Track every dollar you earn" },
  { icon: `${CDN}/athlynx-main-icon_7b5e9ca6.png`, title: "LYNX AI", desc: "Your personal AI companion" },
  { icon: `${CDN}/diamond-grind_890f28f2.png`, title: "Diamond Grind", desc: "Train like a champion" },
];

export default function SignIn() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (connection?: string) => {
    loginWithRedirect({
      authorizationParams: connection ? { connection } : undefined,
      appState: { returnTo: "/feed" },
    });
  };

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
              <span className="text-[#00c2ff] text-xs font-semibold tracking-wide uppercase">Live Platform — 7-Day Free Trial</span>
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
                Sign up or log in — takes 5 seconds
              </p>

              {/* Google */}
              <button
                onClick={() => handleLogin("google-oauth2")}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-bold py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 shadow-lg mb-3"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Apple */}
              <button
                onClick={() => handleLogin("apple")}
                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-150 shadow-lg mb-3"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.4.83 3.23.87 1.23-.25 2.41-1.03 3.73-.88 1.58.19 2.77.89 3.54 2.23-3.26 1.96-2.49 6.27.5 7.48-.57 1.5-1.33 2.99-3 3.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email */}
              <button
                onClick={() => handleLogin()}
                className="w-full flex items-center justify-center gap-3 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] font-semibold py-3.5 px-6 rounded-xl hover:bg-[#00c2ff]/20 active:scale-[0.98] transition-all duration-150"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Continue with Email
              </button>

              {/* Terms */}
              <p className="text-center text-white/25 text-xs mt-5 leading-relaxed">
                By continuing you agree to our{" "}
                <Link href="/terms-of-service"><span className="text-white/40 hover:text-white/70 underline cursor-pointer">Terms</span></Link>
                {" "}&amp;{" "}
                <Link href="/privacy-policy"><span className="text-white/40 hover:text-white/70 underline cursor-pointer">Privacy Policy</span></Link>.
                <br />7-day free trial — no credit card required.
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
              Secured by Auth0 · A Dozier Holdings Group Company · Houston, TX
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
