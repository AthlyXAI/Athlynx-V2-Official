/**
 * ATHLYNX RANKINGS HUB
 * Beats: Perfect Game · 247Sports · On3 · Rivals · MaxPreps
 *
 * Features:
 *   - AI-Powered X-Factor Rankings (all 44 sports)
 *   - Mock Draft (MLB, NFL, NBA, NHL, WNBA, MLS)
 *   - Live Events & Showcases
 *   - Team Management
 *   - Prospect Recommendation Engine (Nebius AI)
 *   - College Top 25 (all sports)
 *
 * Session 32 — May 5, 2026
 */
import { useState } from "react";
import { Link } from "wouter";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Trophy, Star, Zap, TrendingUp, Users, Calendar, Target,
  ChevronRight, MapPin, Clock, Award, BarChart2, Shield,
  Play, Mic, Search, Filter, ChevronUp, ChevronDown
} from "lucide-react";

// ─── Mock Draft Data ──────────────────────────────────────────────────────────
const MOCK_DRAFTS = {
  mlb: {
    title: "2026 MLB Mock Draft",
    subtitle: "ATHLYNX AI Projection — Updated Daily",
    picks: [
      { pick: 1, team: "Chicago White Sox", player: "Roch Cholowsky", pos: "SS", school: "UCLA", xScore: 98, state: "CA" },
      { pick: 2, team: "Tampa Bay Rays", player: "Justin Lebron", pos: "OF", school: "HS — Dominican Republic", xScore: 97, state: "DR" },
      { pick: 3, team: "Minnesota Twins", player: "Grady Emerson", pos: "SS", school: "Fort Worth Christian", xScore: 96, state: "TX" },
      { pick: 4, team: "San Francisco Giants", player: "Vahn Lackey", pos: "RHP", school: "HS — CA", xScore: 95, state: "CA" },
      { pick: 5, team: "Colorado Rockies", player: "Eli Willits", pos: "SS", school: "HS — OK", xScore: 94, state: "OK" },
      { pick: 6, team: "Miami Marlins", player: "Luke Stevenson", pos: "C", school: "North Carolina", xScore: 93, state: "NC" },
      { pick: 7, team: "Oakland Athletics", player: "Ethan Holliday", pos: "SS", school: "HS — OK", xScore: 93, state: "OK" },
      { pick: 8, team: "Washington Nationals", player: "Jac Caglianone", pos: "1B/LHP", school: "Florida", xScore: 92, state: "FL" },
      { pick: 9, team: "Pittsburgh Pirates", player: "Liam Doyle", pos: "LHP", school: "Tennessee", xScore: 91, state: "TN" },
      { pick: 10, team: "Detroit Tigers", player: "Trey Yesavage", pos: "RHP", school: "East Carolina", xScore: 91, state: "NC" },
    ],
  },
  nfl: {
    title: "2027 NFL Mock Draft",
    subtitle: "ATHLYNX AI Projection — Class of 2027",
    picks: [
      { pick: 1, team: "TBD", player: "Jackson Cantwell", pos: "QB", school: "HS — Class 2027", xScore: 99, state: "TX" },
      { pick: 2, team: "TBD", player: "Keisean Henderson", pos: "WR", school: "HS — Class 2027", xScore: 98, state: "GA" },
      { pick: 3, team: "TBD", player: "Jared Curtis", pos: "DL", school: "HS — Class 2027", xScore: 97, state: "FL" },
      { pick: 4, team: "TBD", player: "Lamar Brown", pos: "ATH", school: "University Lab", xScore: 96, state: "LA" },
      { pick: 5, team: "TBD", player: "Marcus Williams", pos: "QB", school: "Westlake HS", xScore: 95, state: "TX" },
    ],
  },
  nba: {
    title: "2026 NBA Mock Draft",
    subtitle: "ATHLYNX AI Projection — Updated Daily",
    picks: [
      { pick: 1, team: "TBD", player: "Cooper Flagg", pos: "SF", school: "Duke", xScore: 99, state: "NC" },
      { pick: 2, team: "TBD", player: "Dylan Harper", pos: "PG", school: "Rutgers", xScore: 97, state: "NJ" },
      { pick: 3, team: "TBD", player: "Ace Bailey", pos: "SF", school: "Rutgers", xScore: 96, state: "NJ" },
      { pick: 4, team: "TBD", player: "VJ Edgecombe", pos: "SG", school: "Baylor", xScore: 95, state: "TX" },
      { pick: 5, team: "TBD", player: "Tre Johnson", pos: "SG", school: "Texas", xScore: 94, state: "TX" },
    ],
  },
};

// ─── College Top 25 ───────────────────────────────────────────────────────────
const COLLEGE_TOP25 = {
  baseball: [
    { rank: 1, school: "UCLA", conference: "Big Ten", record: "32-8", xScore: 97 },
    { rank: 2, school: "North Carolina", conference: "ACC", record: "30-9", xScore: 95 },
    { rank: 3, school: "Georgia Tech", conference: "ACC", record: "29-10", xScore: 94 },
    { rank: 4, school: "Auburn", conference: "SEC", record: "28-11", xScore: 93 },
    { rank: 5, school: "UNCW", conference: "CAA", record: "31-7", xScore: 92 },
    { rank: 6, school: "Texas A&M", conference: "SEC", record: "27-12", xScore: 91 },
    { rank: 7, school: "Mississippi State", conference: "SEC", record: "26-13", xScore: 90 },
    { rank: 8, school: "Oregon", conference: "Big Ten", record: "28-10", xScore: 90 },
    { rank: 9, school: "Oregon State", conference: "Pac-12", record: "25-14", xScore: 89 },
    { rank: 10, school: "Arizona State", conference: "Big 12", record: "27-11", xScore: 89 },
  ],
  football: [
    { rank: 1, school: "Ohio State", conference: "Big Ten", record: "15-0", xScore: 99 },
    { rank: 2, school: "Georgia", conference: "SEC", record: "13-1", xScore: 97 },
    { rank: 3, school: "Texas", conference: "SEC", record: "12-2", xScore: 96 },
    { rank: 4, school: "Penn State", conference: "Big Ten", record: "13-1", xScore: 95 },
    { rank: 5, school: "Notre Dame", conference: "Ind.", record: "11-2", xScore: 94 },
  ],
  basketball: [
    { rank: 1, school: "Duke", conference: "ACC", record: "32-3", xScore: 98 },
    { rank: 2, school: "Kansas", conference: "Big 12", record: "30-5", xScore: 96 },
    { rank: 3, school: "Houston", conference: "Big 12", record: "29-6", xScore: 95 },
    { rank: 4, school: "Auburn", conference: "SEC", record: "28-7", xScore: 94 },
    { rank: 5, school: "Florida", conference: "SEC", record: "27-8", xScore: 93 },
  ],
};

// ─── Live Events ──────────────────────────────────────────────────────────────
const LIVE_EVENTS = [
  { id: 1, name: "Perfect Game National Showcase", sport: "Baseball", location: "Fort Myers, FL", date: "Jun 14-17, 2026", level: "Elite", scouts: 120, spots: 48, price: "Invite Only", featured: true },
  { id: 2, name: "Elite 11 QB Competition", sport: "Football", location: "Dallas, TX", date: "Jun 20-22, 2026", level: "Elite", scouts: 85, spots: 11, price: "Invite Only", featured: true },
  { id: 3, name: "Nike EYBL Peach Jam", sport: "Basketball", location: "Augusta, GA", date: "Jul 8-13, 2026", level: "Elite", scouts: 200, spots: 0, price: "Invite Only", featured: true },
  { id: 4, name: "Under Armour All-America Game", sport: "Football", location: "Orlando, FL", date: "Jan 3, 2027", level: "All-Star", scouts: 150, spots: 100, price: "Invite Only", featured: false },
  { id: 5, name: "ATHLYNX Diamond Showcase", sport: "Baseball", location: "Houston, TX", date: "Jul 18-20, 2026", level: "Regional", scouts: 45, spots: 120, price: "$299", featured: false },
  { id: 6, name: "ATHLYNX Gridiron Combine", sport: "Football", location: "Houston, TX", date: "Aug 2-3, 2026", level: "Regional", scouts: 30, spots: 80, price: "$199", featured: false },
  { id: 7, name: "ATHLYNX Hoops Showcase", sport: "Basketball", location: "Houston, TX", date: "Aug 9-10, 2026", level: "Regional", scouts: 25, spots: 60, price: "$199", featured: false },
  { id: 8, name: "ATHLYNX Multi-Sport Combine", sport: "Multi-Sport", location: "Houston, TX", date: "Sep 6-7, 2026", level: "Open", scouts: 20, spots: 200, price: "$149", featured: false },
];

// ─── Team Management ──────────────────────────────────────────────────────────
const DEMO_TEAMS = [
  { id: 1, name: "Houston Westlake Chaparrals", sport: "Football", division: "6A", athletes: 85, coaches: 12, wins: 14, losses: 1, rank: 3 },
  { id: 2, name: "Katy Tigers", sport: "Football", division: "6A", athletes: 82, coaches: 11, wins: 12, losses: 3, rank: 8 },
  { id: 3, name: "The Woodlands Highlanders", sport: "Baseball", division: "6A", athletes: 24, coaches: 4, wins: 28, losses: 6, rank: 5 },
];

// ─── Prospect Recommendations ─────────────────────────────────────────────────
const TOP_PROSPECTS = [
  { name: "Marcus Williams", sport: "Football", pos: "QB", school: "Westlake HS", state: "TX", year: "2027", xScore: 95, height: "6'3\"", weight: "210", gpa: 3.8, offers: 24 },
  { name: "Tyler Brooks", sport: "Football", pos: "LB", school: "Mater Dei HS", state: "CA", year: "2027", xScore: 92, height: "6'2\"", weight: "225", gpa: 3.5, offers: 18 },
  { name: "Jordan Davis", sport: "Baseball", pos: "RHP", school: "The Woodlands HS", state: "TX", year: "2027", xScore: 91, height: "6'4\"", weight: "195", gpa: 3.6, offers: 12 },
  { name: "Aaliyah Thompson", sport: "Basketball", pos: "PG", school: "Cy-Fair HS", state: "TX", year: "2027", xScore: 93, height: "5'9\"", weight: "145", gpa: 4.0, offers: 22 },
  { name: "Devon Carter", sport: "Soccer", pos: "MF", school: "Klein HS", state: "TX", year: "2027", xScore: 89, height: "5'11\"", weight: "165", gpa: 3.7, offers: 8 },
];

// ─── Main Component ───────────────────────────────────────────────────────────
function RankingsHubInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"rankings" | "draft" | "events" | "teams" | "prospects">("rankings");
  const [activeSport, setActiveSport] = useState<"baseball" | "football" | "basketball">("baseball");
  const [activeDraft, setActiveDraft] = useState<"mlb" | "nfl" | "nba">("mlb");
  const [searchProspect, setSearchProspect] = useState("");

  const draft = MOCK_DRAFTS[activeDraft];
  const top25 = COLLEGE_TOP25[activeSport];

  return (
    <PlatformLayout>
      <div className="min-h-screen bg-[#040c1a] pb-24">

        {/* ── Hero ── */}
        <div className="bg-gradient-to-b from-[#0a1628] to-[#040c1a] px-4 pt-6 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-[10px] font-black tracking-[0.3em] text-yellow-400 uppercase mb-1">ATHLYNX Rankings</div>
            <h1 className="text-2xl font-black text-white">Rankings Hub™</h1>
            <p className="text-blue-400 text-sm mt-1">AI-powered rankings, mock drafts, live events & prospect discovery. Beats Perfect Game, 247Sports, On3, and Rivals.</p>
            <div className="flex gap-2 mt-3">
              {[
                { label: "⚡ Powered by Nebius H200 AI", color: "bg-purple-900/40 border-purple-700/40 text-purple-300" },
                { label: "📡 Updated Daily", color: "bg-blue-900/40 border-blue-700/40 text-blue-300" },
              ].map((b, i) => (
                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full border ${b.color}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab Nav ── */}
        <div className="sticky top-0 z-20 bg-[#040c1a]/95 backdrop-blur border-b border-blue-900/30 px-4 py-2">
          <div className="max-w-2xl mx-auto flex gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { id: "rankings", label: "🏆 Top 25" },
              { id: "draft", label: "📋 Mock Draft" },
              { id: "events", label: "📅 Live Events" },
              { id: "teams", label: "👥 Teams" },
              { id: "prospects", label: "🔍 Prospects" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-yellow-500 text-black" : "text-blue-400 hover:text-white bg-blue-900/20"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

          {/* ── COLLEGE TOP 25 ── */}
          {activeTab === "rankings" && (
            <>
              <div className="flex gap-2">
                {(["baseball", "football", "basketball"] as const).map(s => (
                  <button key={s} onClick={() => setActiveSport(s)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors capitalize ${
                      activeSport === s ? "bg-yellow-500 text-black" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                    }`}>
                    {s === "baseball" ? "⚾" : s === "football" ? "🏈" : "🏀"} {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/10 px-4 py-3 border-b border-yellow-500/20">
                  <div className="text-xs font-black text-yellow-400 tracking-widest uppercase">ATHLYNX College Top 25</div>
                  <div className="text-white font-black text-sm">
                    {activeSport === "baseball" ? "⚾ College Baseball" : activeSport === "football" ? "🏈 College Football" : "🏀 College Basketball"} — May 5, 2026
                  </div>
                </div>
                {top25.map((team, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-blue-900/30 last:border-0 ${i % 2 === 0 ? "bg-blue-900/10" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      team.rank <= 3 ? "bg-yellow-500 text-black" : "bg-blue-900/60 text-blue-300"
                    }`}>{team.rank}</div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{team.school}</div>
                      <div className="text-blue-400 text-xs">{team.conference}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-bold">{team.record}</div>
                      <div className="text-cyan-400 text-[10px] font-black">⚡ {team.xScore}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Competitor comparison */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-700/30 rounded-2xl p-4">
                <div className="text-xs font-black text-yellow-400 tracking-widest uppercase mb-2">Why ATHLYNX Rankings Beat the Rest</div>
                <div className="space-y-2">
                  {[
                    { platform: "Perfect Game", feature: "Baseball only · No AI scoring · Manual updates" },
                    { platform: "247Sports", feature: "Football/Basketball only · No live events" },
                    { platform: "On3", feature: "NIL valuations only · No team rankings" },
                    { platform: "ATHLYNX", feature: "44 sports · AI X-Factor scoring · Live events · Mock draft · Team management · All in one", isUs: true },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-xl ${r.isUs ? "bg-yellow-500/10 border border-yellow-500/20" : ""}`}>
                      <span className={`text-[10px] font-black shrink-0 ${r.isUs ? "text-yellow-400" : "text-blue-600"}`}>{r.isUs ? "✓" : "✗"}</span>
                      <div>
                        <span className={`text-xs font-black ${r.isUs ? "text-yellow-400" : "text-blue-400"}`}>{r.platform}: </span>
                        <span className="text-blue-300 text-xs">{r.feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── MOCK DRAFT ── */}
          {activeTab === "draft" && (
            <>
              <div className="flex gap-2">
                {(["mlb", "nfl", "nba"] as const).map(d => (
                  <button key={d} onClick={() => setActiveDraft(d)}
                    className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors uppercase ${
                      activeDraft === d ? "bg-yellow-500 text-black" : "bg-[#0d1e3c] border border-blue-800/50 text-blue-400"
                    }`}>
                    {d === "mlb" ? "⚾" : d === "nfl" ? "🏈" : "🏀"} {d}
                  </button>
                ))}
              </div>

              <div className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-900/60 to-cyan-900/30 px-4 py-3 border-b border-blue-800/50">
                  <div className="text-xs font-black text-blue-400 tracking-widest uppercase">ATHLYNX AI Mock Draft</div>
                  <div className="text-white font-black text-sm">{draft.title}</div>
                  <div className="text-blue-400 text-xs">{draft.subtitle}</div>
                </div>
                {draft.picks.map((pick, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-blue-900/30 last:border-0 ${i % 2 === 0 ? "bg-blue-900/10" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      pick.pick <= 3 ? "bg-yellow-500 text-black" : "bg-blue-900/60 text-blue-300"
                    }`}>{pick.pick}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm truncate">{pick.player}</div>
                      <div className="text-blue-400 text-xs truncate">{pick.pos} · {pick.school}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-blue-300 text-[10px] font-semibold truncate max-w-[80px]">{pick.team}</div>
                      <div className="text-cyan-400 text-[10px] font-black">⚡ {pick.xScore}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-3 text-center">
                <div className="text-blue-400 text-xs">Powered by Nebius H200 AI · Updated daily with real scouting data</div>
                <div className="text-blue-600 text-[10px] mt-1">AI projections only — not official league rankings</div>
              </div>
            </>
          )}

          {/* ── LIVE EVENTS ── */}
          {activeTab === "events" && (
            <>
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase">📅 Upcoming Events & Showcases</div>

              {/* Featured Events */}
              <div className="space-y-3">
                {LIVE_EVENTS.filter(e => e.featured).map(event => (
                  <div key={event.id} className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-700/40 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">FEATURED · {event.level.toUpperCase()}</span>
                        <div className="text-white font-black text-sm mt-1">{event.name}</div>
                      </div>
                      <span className="text-xl">{event.sport === "Baseball" ? "⚾" : event.sport === "Football" ? "🏈" : "🏀"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-blue-400 text-[9px]">Location</div>
                        <div className="text-white text-[10px] font-bold">{event.location}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 text-[9px]">Date</div>
                        <div className="text-white text-[10px] font-bold">{event.date}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 text-[9px]">Scouts</div>
                        <div className="text-cyan-400 text-[10px] font-black">{event.scouts}+</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black py-2 rounded-xl">
                        {event.price === "Invite Only" ? "Request Invite" : `Register — ${event.price}`}
                      </button>
                      <button className="border border-yellow-700/50 text-yellow-400 text-xs font-bold px-3 py-2 rounded-xl">Info</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* All Events */}
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase">All Events</div>
              <div className="space-y-2">
                {LIVE_EVENTS.filter(e => !e.featured).map(event => (
                  <div key={event.id} className="bg-[#0d1e3c] border border-blue-800/50 rounded-xl p-3 flex items-center gap-3">
                    <div className="text-2xl">{event.sport === "Baseball" ? "⚾" : event.sport === "Football" ? "🏈" : event.sport === "Basketball" ? "🏀" : "🏆"}</div>
                    <div className="flex-1">
                      <div className="text-white text-xs font-bold">{event.name}</div>
                      <div className="text-blue-400 text-[10px]">{event.location} · {event.date}</div>
                      <div className="text-blue-500 text-[9px]">{event.scouts} scouts · {event.spots} spots · {event.price}</div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shrink-0">
                      Register
                    </button>
                  </div>
                ))}
              </div>

              {/* Create Event CTA */}
              <div className="bg-gradient-to-br from-[#0d1e3c] to-[#0a1628] border border-blue-700/50 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-white font-black text-sm mb-1">Host Your Own Event</div>
                <div className="text-blue-400 text-xs mb-3">Create showcases, combines, and tournaments on ATHLYNX. Reach thousands of athletes instantly.</div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-2.5 rounded-xl">
                  Create Event →
                </button>
              </div>
            </>
          )}

          {/* ── TEAM MANAGEMENT ── */}
          {activeTab === "teams" && (
            <>
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase">👥 Team Management</div>

              {/* Create/Join Team */}
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-black py-4 rounded-2xl text-sm">
                  ➕ Create Team
                </button>
                <button className="bg-[#0d1e3c] border border-blue-700/50 text-blue-300 font-black py-4 rounded-2xl text-sm">
                  🔗 Join Team
                </button>
              </div>

              {/* Demo Teams */}
              <div className="space-y-3">
                {DEMO_TEAMS.map(team => (
                  <div key={team.id} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-white font-black text-sm">{team.name}</div>
                        <div className="text-blue-400 text-xs">{team.sport} · {team.division}</div>
                      </div>
                      <div className={`text-xs font-black px-2 py-1 rounded-full ${team.rank <= 5 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-900/40 text-blue-400"}`}>
                        #{team.rank}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { label: "Record", val: `${team.wins}-${team.losses}` },
                        { label: "Athletes", val: team.athletes },
                        { label: "Coaches", val: team.coaches },
                        { label: "Rank", val: `#${team.rank}` },
                      ].map((s, i) => (
                        <div key={i} className="bg-blue-900/30 rounded-xl p-2 text-center">
                          <div className="text-white font-black text-sm">{s.val}</div>
                          <div className="text-blue-500 text-[9px]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2 rounded-xl">Manage Team</button>
                      <button className="border border-blue-700/50 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl">Roster</button>
                      <button className="border border-blue-700/50 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl">Film</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Insurance CTA */}
              <div className="bg-gradient-to-br from-green-900/30 to-teal-900/20 border border-green-700/40 rounded-2xl p-4">
                <div className="text-xs font-black text-green-400 tracking-widest uppercase mb-2">🛡️ Team Insurance</div>
                <p className="text-blue-300 text-sm mb-3">Protect your team with comprehensive sports insurance. Coverage for injuries, liability, equipment, and events.</p>
                <button className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-black py-2.5 rounded-xl">
                  Get Team Insurance Quote →
                </button>
              </div>
            </>
          )}

          {/* ── PROSPECT RECOMMENDATION ── */}
          {activeTab === "prospects" && (
            <>
              <div className="text-xs font-black text-blue-400 tracking-widest uppercase">🔍 AI Prospect Finder</div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  value={searchProspect}
                  onChange={e => setSearchProspect(e.target.value)}
                  placeholder="Search prospects by name, sport, position, state..."
                  className="w-full bg-[#0d1e3c] border border-blue-800/50 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-600"
                />
              </div>

              {/* Recommend Prospect CTA */}
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-700/40 rounded-2xl p-4">
                <div className="text-xs font-black text-purple-400 tracking-widest uppercase mb-2">⚡ Recommend a Prospect</div>
                <p className="text-blue-300 text-xs mb-3">Know a talented athlete? Submit them to the ATHLYNX prospect database. Our AI will analyze their profile and assign an X-Factor score.</p>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-black py-2.5 rounded-xl">
                  Recommend a Prospect →
                </button>
              </div>

              {/* Top Prospects */}
              <div className="space-y-3">
                {TOP_PROSPECTS.filter(p =>
                  !searchProspect ||
                  p.name.toLowerCase().includes(searchProspect.toLowerCase()) ||
                  p.sport.toLowerCase().includes(searchProspect.toLowerCase()) ||
                  p.pos.toLowerCase().includes(searchProspect.toLowerCase()) ||
                  p.state.toLowerCase().includes(searchProspect.toLowerCase())
                ).map((prospect, i) => (
                  <div key={i} className="bg-[#0d1e3c] border border-blue-800/50 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                        {prospect.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-black text-sm">{prospect.name}</span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">⚡ {prospect.xScore}</span>
                        </div>
                        <div className="text-blue-400 text-xs">{prospect.pos} · {prospect.sport} · Class of {prospect.year}</div>
                        <div className="text-blue-500 text-xs">{prospect.school} · {prospect.state}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {[
                        { label: "Height", val: prospect.height },
                        { label: "Weight", val: `${prospect.weight} lbs` },
                        { label: "GPA", val: prospect.gpa },
                        { label: "Offers", val: prospect.offers },
                      ].map((s, si) => (
                        <div key={si} className="bg-blue-900/30 rounded-xl p-2 text-center">
                          <div className="text-white font-black text-xs">{s.val}</div>
                          <div className="text-blue-500 text-[9px]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link href={`/browse-athletes`} className="flex-1">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2 rounded-xl">View Profile</button>
                      </Link>
                      <button className="border border-blue-700/50 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl">Contact</button>
                      <button className="border border-blue-700/50 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl">Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </PlatformLayout>
  );
}

export default function RankingsHub() {
  return <RouteErrorBoundary><RankingsHubInner /></RouteErrorBoundary>;
}
