import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

// ── Static showcase data — always renders regardless of DB state ──────────────
const SHOWCASE_ATHLETES = [
  { name: "Marcus J.", position: "QB", sport: "Football", fromSchool: "Alabama", gpa: "3.8", stats: "3,200 yds, 28 TD, 4 INT", nilValue: "$1.2M", status: "Available" },
  { name: "DeShawn T.", position: "PG", sport: "Basketball", fromSchool: "Duke", gpa: "3.5", stats: "18.4 PPG, 7.2 APG, 3.1 SPG", nilValue: "$850K", status: "Available" },
  { name: "Carlos R.", position: "SP", sport: "Baseball", fromSchool: "LSU", gpa: "3.6", stats: "2.87 ERA, 142 K, 11-3 record", nilValue: "$420K", status: "Available" },
  { name: "Jaylen W.", position: "WR", sport: "Football", fromSchool: "Ohio State", gpa: "3.4", stats: "87 rec, 1,240 yds, 12 TD", nilValue: "$780K", status: "Available" },
  { name: "Amara S.", position: "CF", sport: "Soccer", fromSchool: "UCLA", gpa: "3.9", stats: "22 goals, 14 assists, 2,100 min", nilValue: "$290K", status: "Available" },
  { name: "Tyler B.", position: "C", sport: "Basketball", fromSchool: "Kentucky", gpa: "3.2", stats: "14.1 PPG, 9.8 RPG, 2.4 BPG", nilValue: "$620K", status: "Committed" },
];

const RECRUITING_SCHOOLS = [
  { name: "University of Florida", sport: "Football", openings: "2 WR, 1 QB", scholarship: true, nilProgram: "Elite", conference: "SEC", logo: "🐊" },
  { name: "Ohio State", sport: "Basketball", openings: "1 PG, 1 SG", scholarship: true, nilProgram: "Elite", conference: "Big Ten", logo: "🌰" },
  { name: "LSU", sport: "Baseball", openings: "2 SP, 1 C", scholarship: true, nilProgram: "Strong", conference: "SEC", logo: "🐯" },
  { name: "USC", sport: "Football", openings: "3 DB, 1 LB", scholarship: true, nilProgram: "Elite", conference: "Big Ten", logo: "✌️" },
  { name: "Texas", sport: "Football", openings: "2 RB, 1 TE", scholarship: true, nilProgram: "Elite", conference: "SEC", logo: "🤘" },
  { name: "Michigan", sport: "Basketball", openings: "2 SF, 1 PF", scholarship: true, nilProgram: "Strong", conference: "Big Ten", logo: "〽️" },
];

const SPORTS = ["All", "Football", "Basketball", "Baseball", "Soccer"];

export default function TransferPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("athletes");
  const [sport, setSport] = useState("All");
  const [showEnterPortal, setShowEnterPortal] = useState(false);
  const [portalForm, setPortalForm] = useState({
    sport: "Football", position: "", currentSchool: "", gpa: "", stats: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [eligResult, setEligResult] = useState<string | null>(null);

  const filteredAthletes = sport === "All"
    ? SHOWCASE_ATHLETES
    : SHOWCASE_ATHLETES.filter(a => a.sport === sport);

  function handleSubmitPortal() {
    setSubmitted(true);
    setShowEnterPortal(false);
  }

  function checkEligibility() {
    setEligResult("ELIGIBLE TO TRANSFER — You qualify for immediate eligibility at your next school.");
  }

  return (
    <PlatformLayout title="Transfer Portal">
      <div className="space-y-4 pb-20 lg:pb-4">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-700 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028706780/zXVECIAqcyZDAOuV.png"
              alt="Transfer Portal"
              className="w-14 h-14 rounded-2xl object-cover shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white">TRANSFER PORTAL</h2>
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
                <span className="text-xs bg-blue-700 text-blue-200 px-2 py-0.5 rounded-full font-bold">POWERED BY ATHLYNX AI</span>
              </div>
              <p className="text-blue-300 text-sm mt-0.5">Find your next school. Maximize your NIL value.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Athletes Available", value: SHOWCASE_ATHLETES.filter(a => a.status === "Available").length.toString() },
              { label: "Schools Recruiting", value: RECRUITING_SCHOOLS.length.toString() },
              { label: "Avg NIL Value", value: "$694K" },
            ].map((s, i) => (
              <div key={i} className="bg-[#1530a0] rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-blue-400">{s.value}</div>
                <div className="text-blue-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-[#1a3a8f] border border-blue-900 rounded-xl p-1">
          {["athletes", "schools", "eligibility"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white"
              }`}
            >
              {tab === "athletes" ? "Athletes" : tab === "schools" ? "Schools" : "Eligibility"}
            </button>
          ))}
        </div>

        {/* ── Athletes Tab ── */}
        {activeTab === "athletes" && (
          <div className="space-y-3">
            {/* Sport filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SPORTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSport(s)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    sport === s
                      ? "bg-blue-600 text-white"
                      : "bg-[#1a3a8f] border border-blue-800 text-blue-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Enter Portal CTA */}
            {user && !submitted && (
              <button
                onClick={() => setShowEnterPortal(true)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all"
              >
                + Enter Transfer Portal
              </button>
            )}
            {submitted && (
              <div className="bg-green-900/40 border border-green-600 rounded-xl p-4 text-center">
                <div className="text-green-400 font-black text-base">✅ YOU'RE IN THE PORTAL</div>
                <div className="text-green-300 text-sm mt-1">Coaches can now find your profile. Check your messages for recruiting interest.</div>
              </div>
            )}

            {/* Enter Portal Form */}
            {showEnterPortal && (
              <div className="bg-[#0d1f3c] border border-green-700 rounded-xl p-5 space-y-3">
                <h4 className="text-white font-bold">Enter Transfer Portal</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-blue-300 text-xs font-semibold block mb-1">Sport</label>
                    <select
                      className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2"
                      value={portalForm.sport}
                      onChange={e => setPortalForm(f => ({ ...f, sport: e.target.value }))}
                    >
                      {["Football","Basketball","Baseball","Soccer","Track","Swimming","Tennis","Volleyball","Other"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-blue-300 text-xs font-semibold block mb-1">Position</label>
                    <input
                      className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 placeholder-blue-600"
                      placeholder="e.g. QB, PG"
                      value={portalForm.position}
                      onChange={e => setPortalForm(f => ({ ...f, position: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-blue-300 text-xs font-semibold block mb-1">Current School</label>
                    <input
                      className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 placeholder-blue-600"
                      placeholder="e.g. Alabama"
                      value={portalForm.currentSchool}
                      onChange={e => setPortalForm(f => ({ ...f, currentSchool: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-blue-300 text-xs font-semibold block mb-1">GPA</label>
                    <input
                      className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 placeholder-blue-600"
                      placeholder="e.g. 3.5"
                      value={portalForm.gpa}
                      onChange={e => setPortalForm(f => ({ ...f, gpa: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-blue-300 text-xs font-semibold block mb-1">Key Stats</label>
                  <input
                    className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2 placeholder-blue-600"
                    placeholder="e.g. 87 rec, 1,240 yds, 12 TD"
                    value={portalForm.stats}
                    onChange={e => setPortalForm(f => ({ ...f, stats: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitPortal}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl"
                  >
                    Submit to Portal
                  </button>
                  <button
                    onClick={() => setShowEnterPortal(false)}
                    className="flex-1 border border-blue-700 text-blue-300 font-bold py-2.5 rounded-xl hover:bg-blue-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Athlete cards */}
            {filteredAthletes.map((athlete, i) => (
              <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-sm font-black shrink-0 text-white">
                    {athlete.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{athlete.name}</span>
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{athlete.position}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        athlete.status === "Available" ? "bg-green-900 text-green-400" : "bg-yellow-900 text-yellow-400"
                      }`}>
                        {athlete.status}
                      </span>
                    </div>
                    <div className="text-blue-400 text-xs mt-0.5">
                      {athlete.sport} · From: {athlete.fromSchool} · GPA: {athlete.gpa}
                    </div>
                    <div className="text-blue-300 text-xs mt-0.5">{athlete.stats}</div>
                    <div className="text-green-400 text-xs font-bold mt-0.5">NIL Value: {athlete.nilValue}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                    View Profile
                  </button>
                  <button className="flex-1 border border-blue-700 text-blue-300 text-xs font-bold py-2 rounded-lg hover:bg-blue-900 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Schools Tab ── */}
        {activeTab === "schools" && (
          <div className="space-y-3">
            {RECRUITING_SCHOOLS.map((school, i) => (
              <div key={i} className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{school.logo}</span>
                    <div>
                      <div className="font-bold text-white">{school.name}</div>
                      <div className="text-blue-400 text-xs">{school.conference} · {school.sport}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    school.nilProgram === "Elite" ? "bg-blue-950 text-blue-300" : "bg-blue-900 text-blue-300"
                  }`}>
                    {school.nilProgram} NIL
                  </span>
                </div>
                <div className="text-xs text-green-400 mb-3 font-semibold">Open Spots: {school.openings}</div>
                {school.scholarship && (
                  <div className="text-xs text-yellow-400 mb-3">✓ Full Scholarship Available</div>
                )}
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Apply to Transfer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Eligibility Tab ── */}
        {activeTab === "eligibility" && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-5">
            <h3 className="text-white font-bold mb-1">Transfer Eligibility Checker</h3>
            <p className="text-blue-400 text-xs mb-4">Answer 4 quick questions to see if you qualify for immediate eligibility.</p>
            <div className="space-y-3">
              {[
                { q: "Current Division Level", opts: ["D1", "D2", "D3", "NAIA", "JUCO"] },
                { q: "Years Played", opts: ["1", "2", "3", "4"] },
                { q: "Previous Transfers", opts: ["None", "1 Transfer", "2+ Transfers"] },
                { q: "Academic Standing", opts: ["Good Standing", "Academic Probation"] },
              ].map((item, i) => (
                <div key={i}>
                  <label className="text-blue-300 text-sm font-semibold block mb-1">{item.q}</label>
                  <select className="w-full bg-[#1a2a4a] border border-blue-800 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none">
                    {item.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button
                onClick={checkEligibility}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-colors"
              >
                CHECK MY ELIGIBILITY
              </button>
              {eligResult && (
                <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 text-center">
                  <div className="text-green-400 font-black text-lg">✅ ELIGIBLE TO TRANSFER</div>
                  <div className="text-green-300 text-sm mt-1">You qualify for immediate eligibility at your next school.</div>
                </div>
              )}
            </div>

            {/* NIL Connection Banner */}
            <div className="mt-5 bg-gradient-to-r from-[#1530a0] to-[#0d1f3c] border border-blue-700 rounded-xl p-4 text-center">
              <div className="text-white font-black mb-1">💰 Maximize Your Transfer Value</div>
              <div className="text-blue-300 text-xs mb-3">Connect your transfer with the NIL Portal to find the best school + the best deal simultaneously.</div>
              <a href="/nil-portal" className="inline-block bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Open NIL Portal →
              </a>
            </div>
          </div>
        )}

        {/* ── AI Advisor Banner ── */}
        <div className="bg-gradient-to-r from-[#0d1f3c] to-[#1a3a8f] border border-blue-700 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="text-white font-bold text-sm">ATHLYNX AI Transfer Advisor</div>
              <div className="text-blue-400 text-xs">Get a personalized transfer strategy in seconds</div>
            </div>
          </div>
          <a
            href="/ai-recruiter"
            className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            Get My AI Transfer Plan →
          </a>
        </div>

      </div>
    </PlatformLayout>
  );
}
