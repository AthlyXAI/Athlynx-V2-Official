import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Trophy,
  Dumbbell,
  Briefcase,
  Users,
  Star,
  ExternalLink,
  Bell,
  Filter,
} from "lucide-react";

type EventType = "game" | "practice" | "nil" | "recruiting" | "team" | "personal";

interface AthleteEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: EventType;
  location?: string;
  description?: string;
  priority?: "high" | "medium" | "low";
}

const EVENT_COLORS: Record<EventType, { bg: string; border: string; text: string; badge: string }> = {
  game:       { bg: "bg-red-900/40",    border: "border-red-500/50",    text: "text-red-300",    badge: "bg-red-600" },
  practice:   { bg: "bg-blue-900/40",   border: "border-blue-500/50",   text: "text-blue-300",   badge: "bg-blue-600" },
  nil:        { bg: "bg-yellow-900/40", border: "border-yellow-500/50", text: "text-yellow-300", badge: "bg-yellow-600" },
  recruiting: { bg: "bg-green-900/40",  border: "border-green-500/50",  text: "text-green-300",  badge: "bg-green-600" },
  team:       { bg: "bg-purple-900/40", border: "border-purple-500/50", text: "text-purple-300", badge: "bg-purple-600" },
  personal:   { bg: "bg-slate-800/60",  border: "border-slate-600/50",  text: "text-slate-300",  badge: "bg-slate-600" },
};

const EVENT_ICONS: Record<EventType, React.ElementType> = {
  game:       Trophy,
  practice:   Dumbbell,
  nil:        Briefcase,
  recruiting: Star,
  team:       Users,
  personal:   Calendar,
};

const SAMPLE_EVENTS: AthleteEvent[] = [
  { id: 1,  title: "Game vs. State University",    date: "2026-05-02", time: "7:00 PM", type: "game",       location: "Home Stadium",              priority: "high" },
  { id: 2,  title: "Morning Practice",             date: "2026-04-30", time: "6:30 AM", type: "practice",   location: "Training Facility",         priority: "medium" },
  { id: 3,  title: "Nike NIL Deal Deadline",       date: "2026-05-01", time: "5:00 PM", type: "nil",        description: "Sign contract by EOD",   priority: "high" },
  { id: 4,  title: "Official Visit — UT Austin",   date: "2026-05-05", time: "10:00 AM", type: "recruiting", location: "Austin, TX",               priority: "high" },
  { id: 5,  title: "Film Session",                 date: "2026-04-30", time: "3:00 PM", type: "team",       location: "Film Room",                 priority: "medium" },
  { id: 6,  title: "Strength & Conditioning",      date: "2026-05-01", time: "8:00 AM", type: "practice",   location: "Weight Room",               priority: "medium" },
  { id: 7,  title: "Brand Deal Call — Gatorade",   date: "2026-05-03", time: "2:00 PM", type: "nil",        description: "Zoom call with brand team", priority: "high" },
  { id: 8,  title: "Team Meeting",                 date: "2026-05-04", time: "9:00 AM", type: "team",       location: "Meeting Room A",            priority: "medium" },
  { id: 9,  title: "Away Game @ Tech",             date: "2026-05-08", time: "6:00 PM", type: "game",       location: "Tech Stadium",              priority: "high" },
  { id: 10, title: "Agent Meeting",                date: "2026-05-06", time: "1:00 PM", type: "nil",        description: "Review Q2 NIL pipeline",  priority: "high" },
  { id: 11, title: "Unofficial Visit — LSU",       date: "2026-05-10", time: "11:00 AM", type: "recruiting", location: "Baton Rouge, LA",          priority: "medium" },
  { id: 12, title: "Media Day",                    date: "2026-05-07", time: "10:00 AM", type: "team",      location: "Press Box",                 priority: "medium" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AthleteCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [view, setView] = useState<"month" | "list">("month");
  const [showCalendly, setShowCalendly] = useState(false);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return SAMPLE_EVENTS.filter(e => e.date === dateStr && (filterType === "all" || e.type === filterType));
  };

  const upcomingEvents = SAMPLE_EVENTS
    .filter(e => e.date >= today.toISOString().split("T")[0] && (filterType === "all" || e.type === filterType))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const selectedEvents = selectedDate
    ? SAMPLE_EVENTS.filter(e => e.date === selectedDate && (filterType === "all" || e.type === filterType))
    : [];

  const filterButtons: { type: EventType | "all"; label: string }[] = [
    { type: "all",       label: "All" },
    { type: "game",      label: "Games" },
    { type: "practice",  label: "Practice" },
    { type: "nil",       label: "NIL" },
    { type: "recruiting",label: "Recruiting" },
    { type: "team",      label: "Team" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10 px-2">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#0d1b3e] border border-blue-700 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Athlete Calendar</h1>
                <p className="text-blue-300 text-sm">Games · Practice · NIL Deals · Recruiting · Team Events</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowCalendly(!showCalendly)}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Calendly
              </button>
              <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                <Plus className="w-4 h-4" /> Add Event
              </button>
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-blue-600 text-blue-300 hover:bg-blue-900/40 font-bold px-4 py-2 rounded-xl text-sm transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Google Calendar
              </a>
            </div>
          </div>
        </div>

        {/* ── Calendly Banner ── */}
        {showCalendly && (
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/40 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Share Your Booking Link</h3>
                <p className="text-cyan-300 text-sm mb-3">Let agents, brands, coaches, and media book time with you directly through Calendly.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://calendly.com" target="_blank" rel="noopener noreferrer"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Set Up Calendly
                  </a>
                  <button className="border border-cyan-600 text-cyan-300 hover:bg-cyan-900/40 font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                    Connect Existing Account
                  </button>
                </div>
              </div>
              <button onClick={() => setShowCalendly(false)} className="text-slate-400 hover:text-white text-xl font-bold">✕</button>
            </div>
          </div>
        )}

        {/* ── Filter + View Toggle ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {filterButtons.map(fb => (
              <button
                key={fb.type}
                onClick={() => setFilterType(fb.type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === fb.type
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                }`}
              >
                {fb.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView("month")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${view === "month" ? "bg-blue-700 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
            >
              Month
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${view === "list" ? "bg-blue-700 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
            >
              List
            </button>
          </div>
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Month Calendar ── */}
            <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
              {/* Month Nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all">
                  <ChevronLeft className="w-5 h-5 text-slate-300" />
                </button>
                <h2 className="text-white font-black text-lg">{MONTHS[currentMonth]} {currentYear}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-xl transition-all">
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              </div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-bold text-slate-500 py-1">{d}</div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 rounded-xl" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const events = getEventsForDate(day);
                  const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`h-14 rounded-xl flex flex-col items-center justify-start pt-1.5 transition-all relative ${
                        isSelected ? "bg-cyan-700/60 border border-cyan-500" :
                        isToday ? "bg-blue-800/60 border border-blue-500" :
                        "hover:bg-slate-700/60 border border-transparent"
                      }`}
                    >
                      <span className={`text-sm font-bold ${isToday ? "text-cyan-400" : "text-slate-300"}`}>{day}</span>
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {events.slice(0, 3).map(e => (
                          <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${EVENT_COLORS[e.type].badge}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Sidebar: Selected Day / Upcoming ── */}
            <div className="space-y-4">
              {selectedDate && selectedEvents.length > 0 ? (
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-3 text-sm">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                  <div className="space-y-2">
                    {selectedEvents.map(e => {
                      const Icon = EVENT_ICONS[e.type];
                      const colors = EVENT_COLORS[e.type];
                      return (
                        <div key={e.id} className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
                          <div className="flex items-start gap-2">
                            <Icon className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-semibold text-sm truncate">{e.title}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-slate-400 text-xs">{e.time}</span>
                              </div>
                              {e.location && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span className="text-slate-400 text-xs">{e.location}</span>
                                </div>
                              )}
                              {e.description && <p className="text-slate-400 text-xs mt-1">{e.description}</p>}
                            </div>
                            {e.priority === "high" && (
                              <Bell className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                  <h3 className="text-white font-bold mb-3 text-sm">Upcoming Events</h3>
                  <div className="space-y-2">
                    {upcomingEvents.map(e => {
                      const Icon = EVENT_ICONS[e.type];
                      const colors = EVENT_COLORS[e.type];
                      return (
                        <div key={e.id} className={`${colors.bg} ${colors.border} border rounded-xl p-3`}>
                          <div className="flex items-start gap-2">
                            <Icon className={`w-4 h-4 ${colors.text} mt-0.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-semibold text-xs truncate">{e.title}</div>
                              <div className="text-slate-400 text-xs mt-0.5">
                                {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {e.time}
                              </div>
                            </div>
                            {e.priority === "high" && <Bell className="w-3 h-3 text-red-400 shrink-0" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Legend ── */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3 text-sm">Event Types</h3>
                <div className="space-y-1.5">
                  {(Object.keys(EVENT_COLORS) as EventType[]).map(type => {
                    const Icon = EVENT_ICONS[type];
                    const colors = EVENT_COLORS[type];
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${colors.badge}`} />
                        <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                        <span className="text-slate-400 text-xs capitalize">{type === "nil" ? "NIL Deals" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── List View ── */
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm">All Upcoming Events</h3>
            {upcomingEvents.map(e => {
              const Icon = EVENT_ICONS[e.type];
              const colors = EVENT_COLORS[e.type];
              return (
                <div key={e.id} className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex items-start gap-4`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold">{e.title}</span>
                      {e.priority === "high" && (
                        <span className="bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">HIGH PRIORITY</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {e.time}
                      </div>
                      {e.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3" /> {e.location}
                        </div>
                      )}
                    </div>
                    {e.description && <p className="text-slate-400 text-xs mt-1">{e.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Important Dates 2026 ── */}
        <div className="bg-[#0d1b3e] border border-blue-900/60 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">📅 Key Dates for Athletes — 2026</h3>
          <div className="space-y-3">
            {[
              { date: "May 1, 2026", event: "NCAA Spring Signing Period Opens", sport: "All Sports", type: "recruiting", priority: "high" as const },
              { date: "June 1, 2026", event: "NCAA Transfer Portal Opens (Summer)", sport: "All Sports", type: "recruiting", priority: "high" as const },
              { date: "June 15, 2026", event: "Elite 11 QB Competition", sport: "Football", type: "game", priority: "medium" as const },
              { date: "July 1, 2026", event: "NIL Collective Deals — New Fiscal Year", sport: "All Sports", type: "nil", priority: "high" as const },
              { date: "July 15, 2026", event: "EYBL Peach Jam — Nike Circuit", sport: "Basketball", type: "game", priority: "high" as const },
              { date: "August 1, 2026", event: "NCAA Fall Practice Start (Football)", sport: "Football", type: "practice", priority: "medium" as const },
              { date: "September 5, 2026", event: "College Football Season Opener", sport: "Football", type: "game", priority: "high" as const },
              { date: "October 1, 2026", event: "Early Signing Period Opens (Basketball)", sport: "Basketball", type: "recruiting", priority: "high" as const },
              { date: "November 1, 2026", event: "NCAA Early Signing Period (Football)", sport: "Football", type: "recruiting", priority: "high" as const },
              { date: "December 15, 2026", event: "Transfer Portal Opens (Winter)", sport: "All Sports", type: "recruiting", priority: "high" as const },
            ].map((item, i) => {
              const colors = EVENT_COLORS[item.type as EventType];
              const Icon = EVENT_ICONS[item.type as EventType];
              return (
                <div key={i} className={`${colors.bg} ${colors.border} border rounded-xl p-3 flex items-center gap-3`}>
                  <div className={`w-8 h-8 rounded-lg ${colors.badge} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{item.event}</span>
                      {item.priority === "high" && <span className="text-xs bg-red-600/30 border border-red-500/40 text-red-300 font-bold px-1.5 py-0.5 rounded-full">KEY DATE</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-slate-400 text-xs">{item.date}</span>
                      <span className="text-slate-500 text-xs">• {item.sport}</span>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-white text-xs font-bold transition-colors shrink-0">+ Add</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Google Calendar Sync CTA ── */}
        <div className="bg-gradient-to-r from-blue-900/40 to-slate-800/60 border border-blue-700/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold">Sync with Google Calendar</h3>
            <p className="text-slate-400 text-sm">Keep all your events in one place — games, NIL deadlines, and recruiting visits sync automatically.</p>
          </div>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all whitespace-nowrap flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Connect Google Calendar
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
