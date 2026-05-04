/**
 * DIAMOND GRIND — Elite Baseball Training Platform
 * Session 19: Full rebuild — baseball-specific stats, real DB training,
 * AI pitching/hitting coach, recruiting integration, leaderboard
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

const BASEBALL_STATS_FIELDS = [
  { label: "ERA", key: "era", placeholder: "2.45", group: "Pitching" },
  { label: "WHIP", key: "whip", placeholder: "1.12", group: "Pitching" },
  { label: "Fastball (mph)", key: "fastballMph", placeholder: "88", group: "Pitching" },
  { label: "Strikeouts", key: "strikeouts", placeholder: "84", group: "Pitching" },
  { label: "Innings Pitched", key: "inningsPitched", placeholder: "72.1", group: "Pitching" },
  { label: "Win/Loss", key: "winLoss", placeholder: "8-2", group: "Pitching" },
  { label: "Batting Avg", key: "battingAvg", placeholder: ".342", group: "Hitting" },
  { label: "Home Runs", key: "homeRuns", placeholder: "12", group: "Hitting" },
  { label: "RBI", key: "rbi", placeholder: "48", group: "Hitting" },
  { label: "OBP", key: "obp", placeholder: ".412", group: "Hitting" },
  { label: "SLG", key: "slg", placeholder: ".567", group: "Hitting" },
  { label: "Stolen Bases", key: "stolenBases", placeholder: "18", group: "Hitting" },
  { label: "Fielding %", key: "fieldingPct", placeholder: ".987", group: "Fielding" },
  { label: "Position", key: "fieldingPosition", placeholder: "SS / CF", group: "Fielding" },
  { label: "60-Yd Dash", key: "sixtyYardDash", placeholder: "6.8", group: "Physical" },
  { label: "Exit Velocity", key: "exitVelocity", placeholder: "98 mph", group: "Physical" },
];

const PROGRAMS = [
  { title: "Elite Pitching Mechanics", level: "Elite", duration: "8 weeks", sessions: 24, icon: "⚾", desc: "Velocity, command, and secondary pitch development with biomechanics analysis." },
  { title: "Hitting Power Development", level: "Intermediate", duration: "6 weeks", sessions: 18, icon: "🏏", desc: "Launch angle optimization, bat speed, and exit velocity training." },
  { title: "Speed & Baserunning", level: "All Levels", duration: "4 weeks", sessions: 12, icon: "💨", desc: "60-yard dash improvement, leads, reads, and stolen base technique." },
  { title: "Fielding & Footwork", level: "All Levels", duration: "4 weeks", sessions: 12, icon: "🧤", desc: "Infield/outfield fundamentals, range, and throwing mechanics." },
  { title: "Mental Performance", level: "All Levels", duration: "Ongoing", sessions: null, icon: "🧠", desc: "Plate discipline, mound presence, and high-pressure situation training." },
  { title: "Showcase Prep", level: "Elite", duration: "3 weeks", sessions: 9, icon: "🏆", desc: "Perfect-Game, Area Code, and college showcase preparation." },
];

function DiamondGrindInner() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("programs");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [statsForm, setStatsForm] = useState<Record<string, string>>({});
  const [statsSaving, setStatsSaving] = useState(false);
  const utils = trpc.useUtils();

  const { data: trainingHistory = [] } = trpc.training.getHistory.useQuery({ limit: 10 }, { enabled: !!user });
  const { data: trainingStats } = trpc.training.getStats.useQuery(undefined, { enabled: !!user });
  const { data: profile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const { data: athletes = [] } = trpc.profile.browseAthletes.useQuery({ sport: "Baseball", limit: 10 });

  const logWorkoutMutation = trpc.training.logWorkout.useMutation({
    onSuccess: () => {
      setWorkoutName(""); setWorkoutDuration(""); setWorkoutNotes("");
      utils.training.getHistory.invalidate();
      utils.training.getStats.invalidate();
      toast.success("Workout logged!");
    },
  });

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      setStatsSaving(false);
      utils.profile.getMyProfile.invalidate();
      toast.success("Baseball stats saved to your recruiting profile!");
    },
    onError: () => setStatsSaving(false),
  });

  const generatePlanMutation = trpc.ai.getRecruitingAdvice.useMutation({
    onSuccess: (data) => setAiPlan((data as any).advice || ""),
    onError: () => toast.error("AI Coach unavailable. Try again."),
  });

  const handleStatsSave = () => {
    if (!user) return;
    setStatsSaving(true);
    const sportStats: any = { ...(profile?.sportStats as any || {}) };
    Object.entries(statsForm).forEach(([k, v]) => { if (v) sportStats[k] = v; });
    updateProfileMutation.mutate({ sportStats });
  };

  const existingStats = (profile?.sportStats as any) || {};

  return (
    <PlatformLayout title="Diamond Grind">
      <div className="space-y-4 pb-20 lg:pb-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-red-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img src="/diamond-grind-baseball-icon.png" alt="Diamond Grind" className="w-14 h-14 rounded-2xl object-cover shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = "/athlynx-icon.png"; }} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white">DIAMOND GRIND</h2>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">BASEBALL</span>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">ELITE</span>
              </div>
              <p className="text-blue-300 text-sm">Elite baseball training platform powered by AI analytics</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1 overflow-x-auto">
          {["programs", "stats", "tracker", "leaderboard", "ai-coach"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-fit py-2 px-2 text-xs font-bold rounded-lg capitalize transition-colors whitespace-nowrap ${activeTab === tab ? "bg-red-600 text-white" : "text-blue-400 hover:text-white"}`}>
              {tab === "ai-coach" ? "🤖 AI Coach" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Programs */}
        {activeTab === "programs" && (
          <div className="space-y-3">
            {PROGRAMS.map((prog, i) => (
              <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{prog.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-white">{prog.title}</div>
                    <div className="text-blue-400 text-xs mb-1">{prog.level} · {prog.duration}{prog.sessions ? ` · ${prog.sessions} sessions` : ""}</div>
                    <div className="text-blue-300 text-xs">{prog.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!user) { window.location.href = "/signin"; return; }
                    logWorkoutMutation.mutate({ workout: prog.title, duration: prog.sessions ? prog.sessions * 60 : undefined, notes: prog.desc });
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Start Program
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats — Sport-Specific Baseball Stats */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            {Object.keys(existingStats).length > 0 && (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3">⚾ Your Baseball Stats</h3>
                <div className="grid grid-cols-3 gap-2">
                  {BASEBALL_STATS_FIELDS.filter(f => existingStats[f.key]).map((f, i) => (
                    <div key={i} className="bg-[#1530a0] rounded-xl p-2.5 text-center">
                      <div className="text-blue-400 font-black text-base truncate">{existingStats[f.key]}</div>
                      <div className="text-blue-500 text-[10px]">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!user ? (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">⚾</div>
                <div className="text-white font-bold mb-2">Sign in to enter your stats</div>
                <a href="/signin" className="inline-block bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl">Sign In</a>
              </div>
            ) : (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h3 className="text-white font-bold mb-1">Update Your Baseball Stats</h3>
                <p className="text-blue-400 text-xs mb-4">These appear on your recruiting profile and are visible to college coaches.</p>
                {["Pitching", "Hitting", "Fielding", "Physical"].map(group => (
                  <div key={group} className="mb-4">
                    <div className="text-red-400 font-bold text-xs mb-2 uppercase tracking-wider">{group}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {BASEBALL_STATS_FIELDS.filter(f => f.group === group).map(f => (
                        <div key={f.key}>
                          <label className="text-blue-400 text-[10px] mb-1 block">{f.label}</label>
                          <input
                            value={statsForm[f.key] ?? existingStats[f.key] ?? ""}
                            onChange={e => setStatsForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-500 placeholder-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleStatsSave} disabled={statsSaving}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors">
                  {statsSaving ? "Saving…" : "Save Stats to Recruiting Profile"}
                </button>
                <div className="text-center text-blue-600 text-[10px] mt-2">Stats are visible to college coaches on your public profile</div>
              </div>
            )}
          </div>
        )}

        {/* Tracker */}
        {activeTab === "tracker" && (
          <div className="space-y-4">
            {user && trainingStats && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sessions", value: trainingStats.totalSessions, color: "text-red-400" },
                  { label: "Minutes", value: trainingStats.totalMinutes, color: "text-green-400" },
                  { label: "Avg Perf", value: trainingStats.avgPerformance ? trainingStats.avgPerformance + "/10" : "N/A", color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3 text-center">
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-blue-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-5">
              <h3 className="text-white font-black text-lg mb-4">⚾ Log Baseball Workout</h3>
              {!user ? (
                <div className="text-center py-4">
                  <a href="/signin" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">Sign In to Log Workouts</a>
                </div>
              ) : (
                <div className="space-y-3">
                  <input value={workoutName} onChange={e => setWorkoutName(e.target.value)}
                    placeholder="Workout type (e.g. Bullpen Session, Batting Practice, Fielding Drills)"
                    className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500" />
                  <div className="flex gap-3">
                    <input value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)}
                      placeholder="Duration (mins)" type="number"
                      className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500" />
                    <input value={workoutNotes} onChange={e => setWorkoutNotes(e.target.value)}
                      placeholder="Notes (optional)"
                      className="flex-1 bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 placeholder-blue-500" />
                  </div>
                  <button onClick={() => workoutName.trim() && logWorkoutMutation.mutate({ workout: workoutName, duration: workoutDuration ? parseInt(workoutDuration) : undefined, notes: workoutNotes || undefined })}
                    disabled={logWorkoutMutation.isPending || !workoutName.trim()}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
                    {logWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
                  </button>
                </div>
              )}
            </div>
            {user && (trainingHistory as any[]).length > 0 && (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <h4 className="text-white font-bold mb-3">Recent Sessions</h4>
                <div className="space-y-2">
                  {(trainingHistory as any[]).map((log: any) => (
                    <div key={log.id} className="flex items-center gap-3 py-2 border-b border-blue-900/50 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400 text-lg">⚾</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-semibold truncate">{log.workout}</div>
                        <div className="text-blue-400 text-xs">{log.duration ? log.duration + " min" : ""}{log.notes ? " · " + log.notes : ""}</div>
                      </div>
                      <div className="text-blue-500 text-xs shrink-0">{new Date(log.logDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="space-y-3">
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">🏆 Top Baseball Athletes on ATHLYNX</h3>
              {(athletes as any[]).length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-blue-400 text-sm">No baseball athletes yet. Be the first!</div>
                  <Link href="/browse-athletes"><button className="mt-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2 rounded-lg">Browse All Athletes</button></Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {(athletes as any[]).map((a: any, i: number) => (
                    <div key={a.id} className="flex items-center gap-3 bg-[#1530a0] rounded-xl p-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${i === 0 ? "bg-yellow-500 text-black" : i === 1 ? "bg-gray-400 text-black" : i === 2 ? "bg-orange-600 text-white" : "bg-blue-800 text-white"}`}>{i + 1}</div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-black shrink-0 overflow-hidden">
                        {a.avatarUrl ? <img src={a.avatarUrl} className="w-full h-full object-cover" alt="" /> : (a.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-bold truncate">{a.name || "Athlete"}</div>
                        <div className="text-blue-400 text-xs">{a.position || "—"} · {a.school || "—"}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-green-400 font-bold text-sm">{a.nilValue ? `$${Number(a.nilValue).toLocaleString()}` : "—"}</div>
                        <div className="text-blue-500 text-xs">NIL Value</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/browse-athletes"><button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 rounded-xl">Browse Athletes</button></Link>
              <Link href="/transfer-portal"><button className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-3 rounded-xl">Transfer Portal</button></Link>
            </div>
          </div>
        )}

        {/* AI Coach */}
        {activeTab === "ai-coach" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#1a3a8f] to-[#0d1f3c] border border-blue-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl">⚾</div>
                <div>
                  <div className="text-white font-black">Diamond Grind AI Coach</div>
                  <div className="text-blue-300 text-xs">Powered by Gemini AI · Pitching · Hitting · Recruiting</div>
                </div>
              </div>
            </div>
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  "Create a 4-week pitching velocity program",
                  "How do I improve my batting average?",
                  "What scouts look for at showcases",
                  "Help me write a coach email",
                  "Analyze my ERA of 3.45 — is it D1 ready?",
                  "Best drills for a 60-yard dash under 6.8",
                ].map((q, i) => (
                  <button key={i} onClick={() => setAiPrompt(q)}
                    className="text-left text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-2 rounded-lg transition-colors border border-blue-800">
                    {q}
                  </button>
                ))}
              </div>
              <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                placeholder="Ask your AI baseball coach anything — pitching mechanics, hitting approach, recruiting strategy, showcase prep…"
                rows={3} className="w-full bg-[#0d1f3c] border border-blue-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 placeholder-blue-500 resize-none mb-3" />
              <button
                onClick={() => aiPrompt.trim() && generatePlanMutation.mutate({ sport: "Baseball", question: aiPrompt })}
                disabled={generatePlanMutation.isPending || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                {generatePlanMutation.isPending ? "⚾ Coaching…" : "Get AI Coaching Plan"}
              </button>
            </div>
            {aiPlan && (
              <div className="bg-[#1a3a8f] border border-red-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">⚾</div>
                  <div className="text-white font-bold text-sm">Your AI Coaching Plan</div>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed whitespace-pre-wrap">{aiPlan}</p>
                <div className="mt-3 flex gap-2">
                  <Link href="/nil-portal"><button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg">Share to Feed</button></Link>
                  <Link href="/ai-recruiter"><button className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg">AI Recruiter</button></Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}

export default function DiamondGrind() {
  return <RouteErrorBoundary><DiamondGrindInner /></RouteErrorBoundary>;
}
