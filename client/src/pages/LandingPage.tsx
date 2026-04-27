import { Link } from "wouter";
const BetaBanner = () => (
  <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,background:"#ff6600",color:"white",textAlign:"center",padding:"12px",fontWeight:"700",fontSize:"14px"}}>
    🚧 BETA TEST MODE — Full Public Launch July 2026 · Updating Daily 🚧
  </div>
);

export default function LandingPage() {
  const apps = [
    { name: "Portal", icon: "/portal-icon.png", badge: "LIVE", color: "bg-cyan-500", link: "/portal" },
    { name: "Messenger", icon: "/messenger-icon.png", badge: "LIVE", color: "bg-blue-500", link: "/comms" },
    { name: "Diamond Grind", icon: "/images/logos/mobile-app-icon.png", badge: "NEW", color: "bg-blue-600", link: "/diamond-grind" },
    { name: "Warriors Playbook", icon: "/warriors-playbook-icon.png", badge: "HOT", color: "bg-red-500", link: "/warriors-playbook" },
    { name: "Transfer Portal", icon: "/transfer-portal-icon.png", badge: "ELITE", color: "bg-red-500", link: "/transfer-portal" },
    { name: "NIL Vault", icon: "/nil-portal-icon.png", badge: "$$$", color: "bg-green-500", link: "/nil-vault" },
    { name: "AI Sales", icon: "/images/logos/athlynx-main-logo.png", badge: "AI", color: "bg-red-500", link: "/ai-sales" },
    { name: "Faith", icon: "/faith-app-icon.png", badge: "BLESSED", color: "bg-red-500", link: "/faith" },
    { name: "AI Recruiter", icon: "/images/logos/athlynx-main-logo.png", badge: "AI", color: "bg-indigo-500", link: "/ai-recruiter" },
    { name: "AI Content", icon: "/images/logos/athlynx-main-logo.png", badge: "AI", color: "bg-teal-500", link: "/ai-content" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* SECTION 1: STATUS BAR */}
      <div className="bg-teal-600 text-white text-center py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span>PLATFORM</span>
          <span className="text-teal-300">•</span>
          <span>compliant</span>
          <span className="text-teal-300">•</span>
          <span>precious cargo</span>
        </div>
      </div>

      {/* SECTION 2: UPDATE BANNER */}
      <div className="bg-red-400 text-slate-900 text-center py-3 px-4">
        <p className="text-sm font-bold">
          🚧 SITE UPDATING LIVE DAILY - Please be patient with us while we add future updates and apps!
        </p>
      </div>

      {/* SECTION 3: APP GRID */}
      <div className="px-4 py-6">
        <h2 className="text-white text-xl font-bold mb-4 text-center">THE ATHLETE'S PLAYBOOK</h2>
        <div className="grid grid-cols-2 gap-4">
          {apps.map((app) => (
            <Link key={app.name} href={app.link}>
              <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors">
                <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center`}>
                  <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <span className="text-white text-sm font-semibold text-center">{app.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${app.color} text-white font-bold`}>{app.badge}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SECTION 4: CTA */}
      <div className="px-4 pb-8 text-center">
        <Link href="/signin">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors">
            ENTER THE PORTAL →
          </button>
        </Link>
      </div>
    </div>
  );
}
