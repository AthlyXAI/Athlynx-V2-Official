/**
 * BrowseAthletes — /browse-athletes
 * Searchable, filterable grid of athlete profile cards.
 * Athletes, scouts, coaches, and brands discover and connect here.
 * AthlynXAI — The global athlete social network.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav';
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import PlatformLayout from "@/components/PlatformLayout";
import MeetAthletes from "@/components/MeetAthletes";

const SPORTS = [
  "All", "Football", "Basketball", "Baseball", "Soccer", "Track & Field",
  "Swimming", "Tennis", "Volleyball", "Wrestling", "Golf", "Lacrosse", "Hockey",
  "Softball", "Cross Country", "Gymnastics", "Rugby", "Cricket", "Rowing",
  "Water Polo", "Field Hockey", "Cheerleading", "Multi-Sport",
];

const SPORT_ICONS: Record<string, string> = {
  Football: "🏈", Basketball: "🏀", Baseball: "⚾", Soccer: "⚽",
  "Track & Field": "🏃", Swimming: "🏊", Tennis: "🎾", Volleyball: "🏐",
  Wrestling: "🤼", Golf: "⛳", Lacrosse: "🥍", Hockey: "🏒",
  Softball: "🥎", "Cross Country": "🏃‍♂️", Gymnastics: "🤸", Rugby: "🏉",
  Cricket: "🏏", Rowing: "🚣", "Water Polo": "🤽", "Field Hockey": "🏑",
  Cheerleading: "📣", "Multi-Sport": "🏆",
};

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  committed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  signed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  transferred: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

function AthleteCard({ athlete }: { athlete: any }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const sendConnection = trpc.connections.sendConnectionRequest.useMutation({
    onSuccess: () => setConnected(true),
  });
  const initials = (athlete.name || "A").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const sportIcon = SPORT_ICONS[athlete.sport || ""] || "🏆";
  const statusColor = STATUS_COLORS[athlete.recruitingStatus || "available"] || STATUS_COLORS.available;

  return (
    <div className="bg-[#0d1b3e] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00c2ff]/40 hover:shadow-lg hover:shadow-[#00c2ff]/10 transition-all group">
      <Link href={`/athlete/${athlete.userId}`}>
        <div className="cursor-pointer">
          {/* Card header */}
          <div className="h-20 bg-gradient-to-r from-blue-900 via-[#0d1b3e] to-blue-900 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e] to-transparent" />
            <div className="absolute top-2 right-2 text-xl">{sportIcon}</div>
          </div>
          {/* Avatar */}
          <div className="px-4 -mt-8 pb-3">
            <div className="w-16 h-16 rounded-full border-3 border-[#0d1b3e] overflow-hidden bg-gradient-to-br from-[#00c2ff] to-blue-700 flex items-center justify-center mb-3 group-hover:border-[#00c2ff]/50 transition-all">
              {athlete.avatarUrl ? (
                <img src={athlete.avatarUrl} alt={athlete.name || "Athlete"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-xl">{initials}</span>
              )}
            </div>
            <h3 className="text-white font-black text-base leading-tight mb-0.5 group-hover:text-[#00c2ff] transition-colors">
              {athlete.name || "Athlete"}
            </h3>
            <p className="text-white/40 text-xs mb-1 truncate">
              {[athlete.position, athlete.sport].filter(Boolean).join(" · ") || "Athlete"}
            </p>
            {athlete.school && (
              <p className="text-white/30 text-xs truncate mb-2">{athlete.school}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                {athlete.recruitingStatus === "available" ? "Available" :
                 athlete.recruitingStatus === "committed" ? "Committed" :
                 athlete.recruitingStatus === "signed" ? "Signed" : "Transfer Portal"}
              </span>
              {athlete.nilValue && Number(athlete.nilValue) > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  NIL
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5 border-t border-white/5 pt-2">
              {[
                { label: "Class", value: athlete.classYear || "—" },
                { label: "State", value: athlete.state || "—" },
                { label: "⚡", value: athlete.recruitingScore ? `${athlete.recruitingScore}` : "—" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-bold text-xs">{s.value}</div>
                  <div className="text-white/30 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
      {/* Connect Button */}
      <div className="px-4 pb-4">
        {user ? (
          <button
            onClick={() => sendConnection.mutate({ targetUserId: athlete.userId })}
            disabled={connected || sendConnection.isPending}
            className={`w-full text-xs font-black py-2 rounded-full transition-all ${
              connected
                ? "bg-green-900/40 text-green-400 border border-green-800/40"
                : "bg-[#00c2ff]/10 hover:bg-[#00c2ff]/20 border border-[#00c2ff]/30 text-[#00c2ff]"
            }`}
          >
            {connected ? "✓ Connected" : sendConnection.isPending ? "Connecting..." : "👥 Connect"}
          </button>
        ) : (
          <Link href="/signup">
            <button className="w-full text-xs font-black py-2 rounded-full bg-[#00c2ff]/10 hover:bg-[#00c2ff]/20 border border-[#00c2ff]/30 text-[#00c2ff] transition-all">
              Sign Up to Connect
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

function BrowseAthletesInner() {
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [view, setView] = useState<"athletes" | "coaches">("athletes");

  const { data: athletes = [], isLoading } = trpc.profile.browseAthletes.useQuery({
    sport: selectedSport !== "All" ? selectedSport : undefined,
    limit: 50,
  });

  const filtered = athletes.filter((a: any) => {
    const matchSearch = !search ||
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.school || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.position || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "all" || a.recruitingStatus === selectedStatus;
    return matchSearch && matchStatus;
  });

  return (
    <PlatformLayout title="Browse Athletes">
      <div className="min-h-screen bg-[#040c1a] pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#040c1a] via-blue-950/40 to-[#040c1a] border-b border-white/10 px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🏆</div>
              <div>
                <h1 className="text-2xl font-black text-white">Browse Athletes</h1>
                <p className="text-white/40 text-sm">Discover and connect with athletes across every sport worldwide</p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-4">
              {[{ id: "athletes", label: "👥 Athletes" }, { id: "coaches", label: "📋 Coaches & Scouts" }].map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id as typeof view)}
                  className={`text-sm font-bold px-4 py-2 rounded-full border transition-all ${
                    view === v.id
                      ? "bg-[#00c2ff] text-black border-[#00c2ff]"
                      : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {view === "athletes" && (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <svg className="absolute left-4 top-3.5 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, school, sport, or position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#00c2ff]/50 transition-colors"
                  />
                </div>
                {/* Sport filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {SPORTS.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedSport === sport
                          ? "bg-[#00c2ff] text-black border-[#00c2ff]"
                          : "bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {sport !== "All" && (SPORT_ICONS[sport] || "")} {sport}
                    </button>
                  ))}
                </div>
                {/* Status filter */}
                <div className="flex gap-2 mt-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "available", label: "Available" },
                    { id: "committed", label: "Committed" },
                    { id: "transferred", label: "Transfer Portal" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStatus(s.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                        selectedStatus === s.id
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-transparent text-white/40 border-white/10 hover:text-white/70"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {view === "coaches" ? (
            /* Coaches & Scouts View */
            <MeetAthletes variant="full" showCoaches={true} title="Coaches & Scouts" />
          ) : (
            /* Athletes Grid */
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/40 text-sm">
                  {isLoading ? "Loading..." : `${filtered.length} athlete${filtered.length !== 1 ? "s" : ""} found`}
                </p>
                <Link href="/profile">
                  <button className="text-xs bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] font-bold px-3 py-1.5 rounded-full">
                    + Add Your Profile
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-[#0d1b3e] border border-white/10 rounded-2xl h-52 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-white font-black text-lg mb-2">No Athletes Found</h3>
                  <p className="text-white/40 text-sm mb-6">
                    {search ? `No results for "${search}"` : "No athletes in this category yet."}
                  </p>
                  <Link href="/profile">
                    <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl">
                      Be the First — Set Up Your Profile
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((athlete: any) => (
                    <AthleteCard key={athlete.userId} athlete={athlete} />
                  ))}
                </div>
              )}

              {/* Suggested Athletes (Meet New Athletes) */}
              <div className="mt-10">
                <MeetAthletes variant="full" title="Suggested Athletes — People You May Know" showCoaches={false} />
              </div>

              {/* CTA for scouts/coaches */}
              <div className="mt-10 bg-gradient-to-r from-blue-950/60 to-[#040c1a] border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="text-white font-black text-lg mb-1">Are You a Scout or Coach?</h3>
                <p className="text-white/40 text-sm mb-4">
                  AthlynXAI connects you directly with athletes across every sport and level. NIL deals, recruiting, and more.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/signup">
                    <button className="bg-[#00c2ff] text-black font-black px-6 py-3 rounded-xl text-sm">
                      Join AthlynXAI Free
                    </button>
                  </Link>
                  <a href="mailto:cdozier14@athlynx.ai?subject=Scout/Coach Access Request">
                    <button className="bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm">
                      Contact Us
                    </button>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        <MobileBottomNav />
      </div>
    </PlatformLayout>
  );
}

export default function BrowseAthletes() {
  return <RouteErrorBoundary><BrowseAthletesInner /></RouteErrorBoundary>;
}
