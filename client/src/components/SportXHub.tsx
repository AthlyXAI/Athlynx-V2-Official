/**
 * SportXHub — Universal All-in-One X-Factor Sport App Engine
 * Powers every sport on AthlynXAI with the full X-style experience:
 * - Real DB feed scoped to sport
 * - AI X-Factor scoring (Gemini + Nebius)
 * - NIL deals, recruiting, transfer portal, scouts, messaging
 * - Three-column X-style layout
 * One component. Every sport. Worldwide.
 */
import { useState } from "react";
import { Link } from "wouter";
import MobileBottomNav from "@/components/MobileBottomNav";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Zap, Trophy, Star, TrendingUp, Heart, MessageCircle, Repeat2,
  Share2, Bookmark, Eye, Users, Verified, BarChart2, MapPin,
  ImageIcon, ArrowUp, Hash, Target, Activity, ChevronRight, Award
} from "lucide-react";

// ─── Sport Config ─────────────────────────────────────────────────────────────
export interface SportConfig {
  id: string;           // route slug e.g. "football"
  name: string;         // display name e.g. "Football"
  emoji: string;        // e.g. "🏈"
  tagline: string;      // hero tagline
  accentColor: string;  // tailwind color e.g. "blue"
  nilDeals: { brand: string; type: string; value: string; req: string; icon: string }[];
  trendingTags: { tag: string; posts: string }[];
  scouts: { name: string; org: string; role: string }[];
  events: { name: string; location: string; date: string; level: string }[];
  positions: string[];
  stats: { icon: string; value: string; label: string }[];
  seedPosts: { user: string; handle: string; pos: string; content: string; highlight: string; likes: number; xScore: number }[];
}

// ─── All 25 Sports ────────────────────────────────────────────────────────────
export const ALL_SPORTS: SportConfig[] = [
  {
    id: "football", name: "Football", emoji: "🏈", tagline: "DOMINATE THE FIELD",
    accentColor: "blue",
    stats: [{ icon: "🏈", value: "8M+", label: "Players" }, { icon: "🏆", value: "14K+", label: "Programs" }, { icon: "🎓", value: "3,200+", label: "College Programs" }, { icon: "💰", value: "$2B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Apparel Sponsor", value: "$5K–$100K/yr", req: "D1 or elite recruit", icon: "👟" },
      { brand: "Under Armour", type: "Brand Ambassador", value: "$3K–$50K/yr", req: "Any college level", icon: "🏈" },
      { brand: "Riddell", type: "Helmet Partner", value: "$2K–$20K/yr", req: "College or HS elite", icon: "⛑️" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$2K–$15K/yr", req: "Any college level", icon: "💧" },
      { brand: "EA Sports", type: "Gaming Ambassador", value: "$5K–$50K/yr", req: "D1 starter", icon: "🎮" },
    ],
    trendingTags: [{ tag: "#Elite11", posts: "12.4K" }, { tag: "#7v7Nationals", posts: "8.9K" }, { tag: "#Committed", posts: "34.2K" }, { tag: "#CombineReady", posts: "6.1K" }, { tag: "#SigningDay", posts: "21.7K" }],
    scouts: [{ name: "Coach Davis", org: "NFL Scout · Dallas Cowboys", role: "Watching QBs & WRs" }, { name: "Rivals.com", org: "National Recruiting", role: "Ranking Class 2027" }, { name: "On3 Sports", org: "NIL Valuation", role: "Tracking top prospects" }],
    events: [{ name: "Elite 11 QB Competition", location: "Dallas, TX", date: "Jun 2026", level: "Elite" }, { name: "Under Armour All-America", location: "Orlando, FL", date: "Jan 2027", level: "Elite" }, { name: "Nike Opening Series", location: "Multiple Sites", date: "Jun-Jul 2026", level: "National" }, { name: "Army All-American Bowl", location: "San Antonio, TX", date: "Jan 2027", level: "Elite" }],
    positions: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"],
    seedPosts: [
      { user: "Marcus Williams", handle: "@mwilliams_qb", pos: "QB · Westlake HS", content: "Just dropped a 4.38 40-yard dash at the Nike Combine. The work doesn't lie. 🏈⚡ #CombineReady", highlight: "4.38s 40-Yard Dash", likes: 2847, xScore: 94 },
      { user: "Tyler Brooks", handle: "@tbrooks_lb", pos: "LB · Mater Dei HS", content: "Elite 11 invite just hit the inbox. See y'all in Dallas. 🔥 #Elite11", highlight: "Elite 11 Invite", likes: 4201, xScore: 92 },
    ],
  },
  {
    id: "basketball", name: "Basketball", emoji: "🏀", tagline: "RISE ABOVE",
    accentColor: "orange",
    stats: [{ icon: "🏀", value: "26M+", label: "Players" }, { icon: "🏆", value: "8,000+", label: "Programs" }, { icon: "🎓", value: "1,800+", label: "College Programs" }, { icon: "💰", value: "$1.5B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike / Jordan", type: "Signature Deal", value: "$10K–$500K/yr", req: "Top 50 recruit or D1", icon: "👟" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$5K–$100K/yr", req: "Any college level", icon: "🏀" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$2K–$15K/yr", req: "Any college level", icon: "💧" },
      { brand: "2K Sports", type: "Gaming Ambassador", value: "$5K–$50K/yr", req: "D1 starter", icon: "🎮" },
      { brand: "Wilson", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level", icon: "🏀" },
    ],
    trendingTags: [{ tag: "#PeachJam", posts: "8.9K" }, { tag: "#EYBL", posts: "15.2K" }, { tag: "#NILDeal", posts: "34.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#HoopDreams", posts: "9.4K" }],
    scouts: [{ name: "ESPN Recruiting", org: "National Rankings", role: "Tracking Class 2027" }, { name: "247Sports", org: "NIL Valuation", role: "Top 100 prospects" }, { name: "NBA G League", org: "Pro Development", role: "Scouting elite seniors" }],
    events: [{ name: "Nike EYBL Peach Jam", location: "North Augusta, SC", date: "Jul 2026", level: "Elite" }, { name: "Under Armour Association", location: "Multiple Sites", date: "Apr-Jul 2026", level: "National" }, { name: "Adidas 3SSB", location: "Multiple Sites", date: "Apr-Jul 2026", level: "National" }, { name: "McDonald's All-American", location: "Houston, TX", date: "Apr 2027", level: "Elite" }],
    positions: ["PG", "SG", "SF", "PF", "C"],
    seedPosts: [
      { user: "Aaliyah Johnson", handle: "@aaliyah_hoops", pos: "PG · Oak Ridge Academy", content: "Dropped 38 pts, 11 ast, 6 reb last night. Nike EYBL Peach Jam next week. Scouts — I'll be there. 🏀 #EYBL", highlight: "38 PTS | 11 AST | 6 REB", likes: 5103, xScore: 91 },
    ],
  },
  {
    id: "baseball", name: "Baseball", emoji: "⚾", tagline: "PLAY BALL",
    accentColor: "red",
    stats: [{ icon: "⚾", value: "15M+", label: "Players" }, { icon: "🏆", value: "10K+", label: "Programs" }, { icon: "🎓", value: "2,000+", label: "College Programs" }, { icon: "💰", value: "$800M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Rawlings", type: "Glove & Equipment", value: "$2K–$30K/yr", req: "College or elite travel", icon: "⚾" },
      { brand: "Louisville Slugger", type: "Bat Sponsor", value: "$1K–$20K/yr", req: "Any college level", icon: "🪵" },
      { brand: "Nike", type: "Apparel Partner", value: "$3K–$40K/yr", req: "D1 or elite recruit", icon: "👟" },
      { brand: "Marucci", type: "Bat Partner", value: "$1K–$15K/yr", req: "Any level", icon: "🏏" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#PerfectGame", posts: "11.2K" }, { tag: "#MLBDraft", posts: "18.4K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#ShowcaseSeason", posts: "7.8K" }, { tag: "#DiamondGrind", posts: "5.3K" }],
    scouts: [{ name: "Perfect Game", org: "National Scouting", role: "Ranking Class 2027" }, { name: "MLB Pipeline", org: "Pro Scouting", role: "Draft prospects" }, { name: "Baseball America", org: "Rankings", role: "Top 100 prospects" }],
    events: [{ name: "Perfect Game National Showcase", location: "Fort Myers, FL", date: "Jun 2026", level: "Elite" }, { name: "Area Code Games", location: "Long Beach, CA", date: "Aug 2026", level: "Elite" }, { name: "Under Armour All-America", location: "Wrigley Field, Chicago", date: "Aug 2026", level: "Elite" }, { name: "WWBA World Championship", location: "Jupiter, FL", date: "Oct 2026", level: "National" }],
    positions: ["SP", "RP", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
    seedPosts: [
      { user: "Jake Rodriguez", handle: "@jrod_pitcher", pos: "SP · Jesuit HS", content: "95 MPH fastball clocked at Perfect Game today. MLB scouts in the stands. God is good. ⚾ #PerfectGame", highlight: "95 MPH Fastball", likes: 3102, xScore: 93 },
    ],
  },
  {
    id: "soccer", name: "Soccer", emoji: "⚽", tagline: "THE BEAUTIFUL GAME",
    accentColor: "green",
    stats: [{ icon: "⚽", value: "265M+", label: "Players Worldwide" }, { icon: "🏆", value: "50K+", label: "Clubs" }, { icon: "🎓", value: "2,500+", label: "College Programs" }, { icon: "💰", value: "$1B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Adidas", type: "Boot & Apparel Deal", value: "$5K–$200K/yr", req: "College or elite club", icon: "⚽" },
      { brand: "Nike", type: "Brand Ambassador", value: "$3K–$100K/yr", req: "Any college level", icon: "👟" },
      { brand: "Puma", type: "Boot Sponsor", value: "$2K–$50K/yr", req: "Club or college player", icon: "🐆" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
      { brand: "EA FC", type: "Gaming Ambassador", value: "$3K–$30K/yr", req: "D1 or elite club", icon: "🎮" },
    ],
    trendingTags: [{ tag: "#USYNT", posts: "22.1K" }, { tag: "#MLS", posts: "45.8K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#SoccerNIL", posts: "8.9K" }, { tag: "#WorldCup2026", posts: "189K" }],
    scouts: [{ name: "US Soccer Federation", org: "National Team", role: "U-20 Pool Scouting" }, { name: "MLS Next Pro", org: "Pro Development", role: "Draft prospects" }, { name: "TopDrawerSoccer", org: "National Rankings", role: "Class 2027" }],
    events: [{ name: "US Soccer Development Academy Showcase", location: "Multiple Sites", date: "Jun 2026", level: "Elite" }, { name: "ECNL National Championships", location: "San Diego, CA", date: "Jun 2026", level: "National" }, { name: "MLS NEXT Fest", location: "Multiple Sites", date: "Jul 2026", level: "Elite" }, { name: "Generation Adidas Cup", location: "Multiple Sites", date: "Apr 2026", level: "National" }],
    positions: ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"],
    seedPosts: [
      { user: "Sofia Reyes", handle: "@sofia_soccer10", pos: "MF · Dallas FC Academy", content: "Named to the US Soccer U-20 National Pool. Everything I've worked for since age 6. ⚽🇺🇸 #USYNT", highlight: "US Soccer U-20 National Pool", likes: 3412, xScore: 89 },
    ],
  },
  {
    id: "track", name: "Track & Field", emoji: "🏃", tagline: "FASTER. HIGHER. STRONGER.",
    accentColor: "yellow",
    stats: [{ icon: "🏃", value: "57M+", label: "Athletes Worldwide" }, { icon: "🏆", value: "8,000+", label: "Meets" }, { icon: "🎓", value: "2,800+", label: "College Programs" }, { icon: "💰", value: "$400M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Shoe & Apparel Deal", value: "$5K–$500K/yr", req: "College or elite club", icon: "👟" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$3K–$200K/yr", req: "Any college level", icon: "🏃" },
      { brand: "New Balance", type: "Shoe Sponsor", value: "$2K–$100K/yr", req: "Club or college athlete", icon: "👟" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$10K/yr", req: "Any college level", icon: "💧" },
      { brand: "Omega Timing", type: "Brand Partner", value: "$2K–$20K/yr", req: "National-level athlete", icon: "⏱️" },
    ],
    trendingTags: [{ tag: "#NBNationals", posts: "9.2K" }, { tag: "#USATFOutdoors", posts: "14.8K" }, { tag: "#OlympicTrials", posts: "38.4K" }, { tag: "#PRAlert", posts: "22.1K" }, { tag: "#TrackLife", posts: "67.3K" }],
    scouts: [{ name: "USATF", org: "National Federation", role: "Olympic Trials scouting" }, { name: "New Balance Nationals", org: "Elite HS Meet", role: "Recruiting top sprinters" }, { name: "NCAA Track & Field", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "New Balance Nationals Indoor", location: "Boston, MA", date: "Mar 2026", level: "Elite" }, { name: "New Balance Nationals Outdoor", location: "Greensboro, NC", date: "Jun 2026", level: "Elite" }, { name: "USATF Outdoor Championships", location: "Eugene, OR", date: "Jun 2026", level: "Elite" }, { name: "Arcadia Invitational", location: "Arcadia, CA", date: "Apr 2026", level: "National" }],
    positions: ["100m", "200m", "400m", "800m", "1500m", "5000m", "10000m", "110mH", "400mH", "HJ", "PV", "LJ", "TJ", "SP", "DT", "HT", "JT", "Dec", "Hep"],
    seedPosts: [
      { user: "Jordan Miles", handle: "@jmiles_track", pos: "Sprinter · Centennial HS", content: "10.87 in the 100m at New Balance Nationals. PR by 0.12 seconds. The grind is real. 💨 #NBNationals #PRAlert", highlight: "10.87s 100M — Personal Record", likes: 1923, xScore: 86 },
    ],
  },
  {
    id: "swimming", name: "Swimming", emoji: "🏊", tagline: "MAKE WAVES",
    accentColor: "cyan",
    stats: [{ icon: "🏊", value: "900K+", label: "Swimmers" }, { icon: "🏆", value: "6,000+", label: "Meets" }, { icon: "🎓", value: "500+", label: "College Programs" }, { icon: "💰", value: "$120M+", label: "NIL Deals" }],
    nilDeals: [
      { brand: "Speedo", type: "Swimwear Sponsor", value: "$3K–$30K/yr", req: "College or elite club", icon: "🏊" },
      { brand: "TYR Sport", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "Any college level", icon: "💧" },
      { brand: "Arena", type: "Equipment Deal", value: "$1K–$15K/yr", req: "Club or college", icon: "🥽" },
      { brand: "Finis", type: "Training Partner", value: "$500–$5K/yr", req: "Any level", icon: "⏱️" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#USASwimming", posts: "12.1K" }, { tag: "#WinterJuniors", posts: "6.8K" }, { tag: "#OlympicTrials", posts: "38.4K" }, { tag: "#TimeDropAlert", posts: "9.2K" }, { tag: "#SwimLife", posts: "44.7K" }],
    scouts: [{ name: "USA Swimming", org: "National Federation", role: "Olympic Trials scouting" }, { name: "Speedo Sectionals", org: "Elite Meet", role: "Recruiting top swimmers" }, { name: "NCAA Swimming", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "USA Swimming Winter Junior Nationals", location: "Greensboro, NC", date: "Dec 2026", level: "Elite" }, { name: "Speedo Junior Championships", location: "Multiple Sites", date: "Aug 2026", level: "National" }, { name: "USA Swimming Summer Nationals", location: "Irvine, CA", date: "Jul 2026", level: "Elite" }, { name: "Futures Championships", location: "Multiple Sites", date: "Jun-Jul 2026", level: "Elite" }],
    positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "IM", "Open Water"],
    seedPosts: [
      { user: "Tyler Nguyen", handle: "@tyler_swim", pos: "Freestyle · PASA", content: "44.21 in the 100 free at sectionals. Stanford coaches were in the stands. 🏊 #USASwimming", highlight: "44.21 100 Free", likes: 1842, xScore: 97 },
    ],
  },
  {
    id: "wrestling", name: "Wrestling", emoji: "🤼", tagline: "DOMINATE THE MAT",
    accentColor: "red",
    stats: [{ icon: "🤼", value: "250K+", label: "Wrestlers" }, { icon: "🏆", value: "4,000+", label: "Tournaments" }, { icon: "🎓", value: "400+", label: "College Programs" }, { icon: "💰", value: "$80M+", label: "NIL Deals" }],
    nilDeals: [
      { brand: "Asics", type: "Shoe & Apparel", value: "$2K–$25K/yr", req: "College or elite club", icon: "🤼" },
      { brand: "Nike", type: "Brand Ambassador", value: "$3K–$40K/yr", req: "D1 or national-level", icon: "👟" },
      { brand: "Cliff Keen", type: "Gear Sponsor", value: "$1K–$10K/yr", req: "Any college level", icon: "🏆" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
      { brand: "FloWrestling", type: "Media Partner", value: "$500–$5K/yr", req: "Any level", icon: "📹" },
    ],
    trendingTags: [{ tag: "#NCAAs", posts: "18.4K" }, { tag: "#Folkstyle", posts: "7.2K" }, { tag: "#Freestyle", posts: "9.8K" }, { tag: "#WrestlingLife", posts: "33.1K" }, { tag: "#MatWarriors", posts: "4.9K" }],
    scouts: [{ name: "FloWrestling", org: "National Rankings", role: "Tracking Class 2027" }, { name: "InterMat", org: "College Recruiting", role: "Scholarship offers" }, { name: "USA Wrestling", org: "National Federation", role: "World Team scouting" }],
    events: [{ name: "NCAA Wrestling Championships", location: "Philadelphia, PA", date: "Mar 2026", level: "Elite" }, { name: "Fargo Nationals", location: "Fargo, ND", date: "Jul 2026", level: "National" }, { name: "Beast of the East", location: "Bethlehem, PA", date: "Dec 2026", level: "National" }, { name: "Walsh Ironman", location: "North Canton, OH", date: "Dec 2026", level: "National" }],
    positions: ["125", "133", "141", "149", "157", "165", "174", "184", "197", "285"],
    seedPosts: [
      { user: "Cody Thompson", handle: "@cody_wrestles", pos: "165 · Blair Academy", content: "2x state champ. Fargo Nationals next. Unfinished business. 🤼 #Folkstyle", highlight: "2x State Champion", likes: 1204, xScore: 91 },
    ],
  },
  {
    id: "tennis", name: "Tennis", emoji: "🎾", tagline: "ACE YOUR FUTURE",
    accentColor: "green",
    stats: [{ icon: "🎾", value: "87M+", label: "Players Worldwide" }, { icon: "🏆", value: "5,000+", label: "Tournaments" }, { icon: "🎓", value: "1,000+", label: "College Programs" }, { icon: "💰", value: "$300M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Wilson", type: "Racket & Apparel", value: "$3K–$100K/yr", req: "College or ITF-ranked", icon: "🎾" },
      { brand: "Nike", type: "Brand Ambassador", value: "$5K–$200K/yr", req: "Any college level", icon: "👟" },
      { brand: "Babolat", type: "Racket Sponsor", value: "$2K–$50K/yr", req: "ITF or college player", icon: "🏸" },
      { brand: "Rolex", type: "Watch Partner", value: "$10K–$500K/yr", req: "ATP/WTA ranked", icon: "⌚" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#USOpen", posts: "245K" }, { tag: "#Wimbledon", posts: "312K" }, { tag: "#ITFJuniors", posts: "14.2K" }, { tag: "#TennisNIL", posts: "6.8K" }, { tag: "#AceAlert", posts: "9.1K" }],
    scouts: [{ name: "USTA", org: "National Federation", role: "Junior development" }, { name: "Tennis Recruiting", org: "College Rankings", role: "Class 2027 prospects" }, { name: "ATP/WTA Tour", org: "Pro Circuit", role: "Scouting juniors" }],
    events: [{ name: "USTA National Championships", location: "Kalamazoo, MI", date: "Aug 2026", level: "Elite" }, { name: "Easter Bowl", location: "Indian Wells, CA", date: "Apr 2026", level: "National" }, { name: "ITF Junior Circuit", location: "Worldwide", date: "Year-Round", level: "International" }, { name: "NCAA Tennis Championships", location: "Champaign, IL", date: "May 2026", level: "National" }],
    positions: ["Singles", "Doubles", "Mixed Doubles"],
    seedPosts: [
      { user: "Emma Chen", handle: "@emma_tennis", pos: "Singles · USTA National", content: "ITF Junior ranking just broke top 50 worldwide. College coaches are calling. 🎾 #ITFJuniors", highlight: "ITF Top 50 Worldwide", likes: 2103, xScore: 92 },
    ],
  },
  {
    id: "volleyball", name: "Volleyball", emoji: "🏐", tagline: "SPIKE YOUR FUTURE",
    accentColor: "blue",
    stats: [{ icon: "🏐", value: "800M+", label: "Players Worldwide" }, { icon: "🏆", value: "6,000+", label: "Clubs" }, { icon: "🎓", value: "1,800+", label: "College Programs" }, { icon: "💰", value: "$250M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Mizuno", type: "Shoe & Apparel", value: "$2K–$30K/yr", req: "College or elite club", icon: "🏐" },
      { brand: "Nike", type: "Brand Ambassador", value: "$3K–$50K/yr", req: "Any college level", icon: "👟" },
      { brand: "Molten", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level", icon: "🏐" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$2K–$20K/yr", req: "D1 or elite club", icon: "👕" },
    ],
    trendingTags: [{ tag: "#JVA", posts: "8.4K" }, { tag: "#AVCATop25", posts: "12.1K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#VolleyballNIL", posts: "7.2K" }, { tag: "#BeachVB", posts: "18.9K" }],
    scouts: [{ name: "AVCA", org: "College Coaches", role: "Recruiting Class 2027" }, { name: "PrepVolleyball", org: "National Rankings", role: "Top 150 prospects" }, { name: "USA Volleyball", org: "National Team", role: "Junior national pool" }],
    events: [{ name: "USAV Girls Junior National Championships", location: "Indianapolis, IN", date: "Jul 2026", level: "Elite" }, { name: "JVA World Challenge", location: "Louisville, KY", date: "Jun 2026", level: "National" }, { name: "AVCA Convention", location: "Louisville, KY", date: "Dec 2026", level: "National" }, { name: "AAU Junior National Volleyball Championships", location: "Orlando, FL", date: "Jul 2026", level: "National" }],
    positions: ["OH", "MB", "RS", "S", "L", "DS"],
    seedPosts: [
      { user: "Kayla Torres", handle: "@kayla_vb", pos: "OH · Texas Pistols", content: "USAV All-Tournament team at JVA World Challenge. Stanford offer on the table. 🏐 #JVA", highlight: "USAV All-Tournament", likes: 2891, xScore: 93 },
    ],
  },
  {
    id: "hockey", name: "Hockey", emoji: "🏒", tagline: "BREAK THE ICE",
    accentColor: "blue",
    stats: [{ icon: "🏒", value: "2M+", label: "Players" }, { icon: "🏆", value: "3,500+", label: "Programs" }, { icon: "🎓", value: "800+", label: "College Programs" }, { icon: "💰", value: "$150M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Bauer", type: "Equipment Sponsor", value: "$3K–$50K/yr", req: "College or elite junior", icon: "🏒" },
      { brand: "CCM", type: "Brand Ambassador", value: "$2K–$40K/yr", req: "Any college level", icon: "🥅" },
      { brand: "Warrior", type: "Stick Sponsor", value: "$1K–$20K/yr", req: "Junior or college", icon: "⚔️" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
      { brand: "EA Sports NHL", type: "Gaming Ambassador", value: "$3K–$30K/yr", req: "D1 or OHL/WHL", icon: "🎮" },
    ],
    trendingTags: [{ tag: "#NHLDraft", posts: "28.4K" }, { tag: "#USHL", posts: "9.2K" }, { tag: "#OHL", posts: "11.8K" }, { tag: "#HockeyNIL", posts: "5.4K" }, { tag: "#FrozenFour", posts: "18.9K" }],
    scouts: [{ name: "NHL Central Scouting", org: "Pro Scouting", role: "Draft prospects" }, { name: "USHL", org: "Junior Hockey", role: "Recruiting players" }, { name: "NCAA Hockey", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "NHL Draft", location: "Las Vegas, NV", date: "Jun 2026", level: "Elite" }, { name: "USHL Fall Classic", location: "Multiple Sites", date: "Sep 2026", level: "National" }, { name: "NCAA Frozen Four", location: "St. Paul, MN", date: "Apr 2026", level: "Elite" }, { name: "World Junior Championships", location: "TBD", date: "Dec 2026", level: "International" }],
    positions: ["C", "LW", "RW", "LD", "RD", "G"],
    seedPosts: [
      { user: "Connor Walsh", handle: "@cwalsh_hockey", pos: "C · USHL Tri-City", content: "NHL Central Scouting mid-term rankings just dropped. B-rated prospect. The work continues. 🏒 #NHLDraft", highlight: "NHL Central Scouting B-Rated", likes: 3204, xScore: 94 },
    ],
  },
  {
    id: "lacrosse", name: "Lacrosse", emoji: "🥍", tagline: "DOMINATE THE FIELD",
    accentColor: "blue",
    stats: [{ icon: "🥍", value: "825K+", label: "Players" }, { icon: "🏆", value: "3,200+", label: "Programs" }, { icon: "🎓", value: "1,100+", label: "College Programs" }, { icon: "💰", value: "$85M+", label: "NIL Deals" }],
    nilDeals: [
      { brand: "Maverik Lacrosse", type: "Stick & Equipment", value: "$2K–$25K/yr", req: "College or elite club", icon: "🥍" },
      { brand: "StringKing", type: "Brand Ambassador", value: "$1K–$15K/yr", req: "Any college level", icon: "🎯" },
      { brand: "Warrior Sports", type: "Equipment Deal", value: "$1K–$12K/yr", req: "Club or college", icon: "⚔️" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$2K–$20K/yr", req: "D1 or elite club", icon: "👕" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#PLLDraft", posts: "8.4K" }, { tag: "#Underclassman", posts: "6.2K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#LaxLife", posts: "14.9K" }, { tag: "#MaverikShowtime", posts: "5.1K" }],
    scouts: [{ name: "PLL Scouting", org: "Pro League", role: "Draft prospects" }, { name: "Inside Lacrosse", org: "National Rankings", role: "Class 2027" }, { name: "NCAA Lacrosse", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "Under Armour Underclassman All-America", location: "Baltimore, MD", date: "Jun 2026", level: "Elite" }, { name: "Maverik Showtime Lacrosse", location: "Denver, CO", date: "Jul 2026", level: "National" }, { name: "USLL National Championships", location: "Multiple Sites", date: "Aug 2026", level: "National" }, { name: "PLL College Draft Showcase", location: "TBD", date: "Apr 2026", level: "Elite" }],
    positions: ["Attack", "Midfield", "Defense", "Goalie", "FOGO"],
    seedPosts: [
      { user: "Marcus Williams", handle: "@marcus_lax", pos: "Attack · Laxachusetts Elite", content: "Under Armour Underclassman invite confirmed. Maryland coaches watching. 🥍 #Underclassman", highlight: "UA Underclassman Invite", likes: 1892, xScore: 97 },
    ],
  },
  {
    id: "softball", name: "Softball", emoji: "🥎", tagline: "HIT DIFFERENT",
    accentColor: "blue",
    stats: [{ icon: "🥎", value: "1.2M+", label: "Players" }, { icon: "🏆", value: "5,000+", label: "Tournaments" }, { icon: "🎓", value: "1,500+", label: "College Programs" }, { icon: "💰", value: "$200M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Easton Sports", type: "Bat & Equipment", value: "$2K–$20K/yr", req: "College or elite travel", icon: "🥎" },
      { brand: "DeMarini", type: "Brand Ambassador", value: "$1K–$15K/yr", req: "Any college level", icon: "🎯" },
      { brand: "Mizuno", type: "Glove & Apparel", value: "$1K–$12K/yr", req: "Club or college", icon: "🧤" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$2K–$18K/yr", req: "D1 or elite travel", icon: "👕" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#PGFNationals", posts: "14.2K" }, { tag: "#WCWS", posts: "28.9K" }, { tag: "#Committed", posts: "21.7K" }, { tag: "#SoftballNIL", posts: "9.4K" }, { tag: "#TravelBall", posts: "18.1K" }],
    scouts: [{ name: "PGF Scouting", org: "National", role: "Top travel players" }, { name: "Extra Innings Softball", org: "Rankings", role: "Class 2027 prospects" }, { name: "NCAA Softball", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "PGF Premier Nationals", location: "Huntington Beach, CA", date: "Jul 2026", level: "Elite" }, { name: "Triple Crown Sports Nationals", location: "Denver, CO", date: "Jun 2026", level: "National" }, { name: "USA Softball National Championships", location: "Oklahoma City, OK", date: "Aug 2026", level: "National" }, { name: "USSSA Elite Select", location: "Multiple Sites", date: "Jul 2026", level: "National" }],
    positions: ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DP/UTIL"],
    seedPosts: [
      { user: "Kayla Martinez", handle: "@kayla_softball", pos: "P/Utility · So Cal Athletics", content: "PGF Nationals MVP. UCLA offer official. This is just the beginning. 🥎 #PGFNationals", highlight: "PGF Nationals MVP", likes: 4102, xScore: 98 },
    ],
  },
  {
    id: "gymnastics", name: "Gymnastics", emoji: "🤸", tagline: "STICK THE LANDING",
    accentColor: "purple",
    stats: [{ icon: "🤸", value: "500K+", label: "Gymnasts" }, { icon: "🏆", value: "2,800+", label: "Competitions" }, { icon: "🎓", value: "400+", label: "College Programs" }, { icon: "💰", value: "$60M+", label: "NIL Deals" }],
    nilDeals: [
      { brand: "Nike", type: "Apparel Sponsor", value: "$3K–$30K/yr", req: "College or elite gymnast", icon: "👟" },
      { brand: "GK Elite Sportswear", type: "Leotard Sponsor", value: "$1K–$15K/yr", req: "Any competitive level", icon: "🤸" },
      { brand: "Nastia Liukin Collection", type: "Brand Ambassador", value: "$2K–$20K/yr", req: "J.O. Level 9/10 or college", icon: "⭐" },
      { brand: "Chalk Bag Brands", type: "Equipment Deal", value: "$500–$5K/yr", req: "Any level", icon: "🤲" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#JONationals", posts: "9.2K" }, { tag: "#PGChampionships", posts: "14.8K" }, { tag: "#OlympicTrials", posts: "38.4K" }, { tag: "#GymnasticsNIL", posts: "6.1K" }, { tag: "#StickTheLanding", posts: "22.3K" }],
    scouts: [{ name: "USA Gymnastics", org: "National Federation", role: "Olympic Trials scouting" }, { name: "NCAA Gymnastics", org: "College Recruiting", role: "Scholarship offers" }, { name: "Nastia Liukin Cup", org: "Elite Meet", role: "Recruiting top gymnasts" }],
    events: [{ name: "USA Gymnastics J.O. National Championships", location: "Fort Worth, TX", date: "Jun 2026", level: "Elite" }, { name: "P&G Championships", location: "Hartford, CT", date: "Aug 2026", level: "Elite" }, { name: "NCAA Women's Gymnastics Championships", location: "Fort Worth, TX", date: "Apr 2026", level: "National" }, { name: "Nastia Liukin Cup", location: "Jacksonville, FL", date: "Feb 2026", level: "National" }],
    positions: ["All-Around", "Vault", "Uneven Bars", "Balance Beam", "Floor Exercise"],
    seedPosts: [
      { user: "Olivia Chen", handle: "@olivia_gym", pos: "All-Around · WOGA Gymnastics", content: "55.650 all-around at J.O. Nationals. UCLA offer confirmed. 🤸 #JONationals", highlight: "55.650 All-Around", likes: 3102, xScore: 98 },
    ],
  },
  {
    id: "golf", name: "Golf", emoji: "⛳", tagline: "PLAY YOUR BEST ROUND",
    accentColor: "green",
    stats: [{ icon: "⛳", value: "66M+", label: "Players Worldwide" }, { icon: "🏆", value: "3,000+", label: "Tournaments" }, { icon: "🎓", value: "1,200+", label: "College Programs" }, { icon: "💰", value: "$500M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "TaylorMade", type: "Club & Apparel", value: "$5K–$200K/yr", req: "College or elite amateur", icon: "⛳" },
      { brand: "Callaway", type: "Brand Ambassador", value: "$3K–$100K/yr", req: "Any college level", icon: "🏌️" },
      { brand: "Nike Golf", type: "Apparel Partner", value: "$5K–$150K/yr", req: "D1 or elite amateur", icon: "👕" },
      { brand: "Rolex", type: "Watch Partner", value: "$10K–$500K/yr", req: "PGA/LPGA ranked", icon: "⌚" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#USAmateur", posts: "12.4K" }, { tag: "#PGATour", posts: "89.2K" }, { tag: "#LPGATour", posts: "34.8K" }, { tag: "#GolfNIL", posts: "8.9K" }, { tag: "#CollegeGolf", posts: "14.2K" }],
    scouts: [{ name: "USGA", org: "National Federation", role: "Amateur rankings" }, { name: "Golf Channel", org: "Media", role: "Covering top amateurs" }, { name: "PGA Tour", org: "Pro Circuit", role: "Scouting top amateurs" }],
    events: [{ name: "US Amateur Championship", location: "Hazeltine, MN", date: "Aug 2026", level: "Elite" }, { name: "Junior Ryder Cup", location: "TBD", date: "Sep 2026", level: "International" }, { name: "NCAA Golf Championships", location: "Scottsdale, AZ", date: "May 2026", level: "National" }, { name: "AJGA Invitational", location: "Multiple Sites", date: "Year-Round", level: "National" }],
    positions: ["Individual", "Match Play", "Stroke Play", "Team"],
    seedPosts: [
      { user: "Ryan Park", handle: "@ryan_golf", pos: "Individual · AJGA Top 50", content: "Shot a 65 at the AJGA Invitational. Stanford and Augusta National Scholar on my radar. ⛳ #USAmateur", highlight: "65 — Course Record", likes: 1892, xScore: 93 },
    ],
  },
  {
    id: "rugby", name: "Rugby", emoji: "🏉", tagline: "NO MERCY",
    accentColor: "blue",
    stats: [{ icon: "🏉", value: "9.6M+", label: "Players Worldwide" }, { icon: "🏆", value: "2,000+", label: "Clubs" }, { icon: "🎓", value: "400+", label: "College Programs" }, { icon: "💰", value: "$100M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Canterbury", type: "Kit & Apparel", value: "$2K–$30K/yr", req: "College or elite club", icon: "🏉" },
      { brand: "Gilbert", type: "Ball Partner", value: "$1K–$10K/yr", req: "Any level", icon: "🏉" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$3K–$50K/yr", req: "National team or D1", icon: "👟" },
      { brand: "Under Armour", type: "Apparel Partner", value: "$2K–$20K/yr", req: "College or elite club", icon: "👕" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#RugbyWorldCup", posts: "189K" }, { tag: "#Sevens", posts: "28.4K" }, { tag: "#USARugby", posts: "12.1K" }, { tag: "#RugbyNIL", posts: "4.8K" }, { tag: "#CollegeRugby", posts: "9.2K" }],
    scouts: [{ name: "USA Rugby", org: "National Federation", role: "Eagle scouting" }, { name: "World Rugby", org: "International", role: "Sevens circuit" }, { name: "Major League Rugby", org: "Pro League", role: "Draft prospects" }],
    events: [{ name: "USA Rugby Collegiate Championships", location: "TBD", date: "May 2026", level: "National" }, { name: "World Rugby Sevens Series", location: "Worldwide", date: "Year-Round", level: "International" }, { name: "MLR Draft", location: "TBD", date: "Jan 2026", level: "Elite" }, { name: "NSCRO National Championships", location: "TBD", date: "May 2026", level: "National" }],
    positions: ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum-half", "Fly-half", "Centre", "Wing", "Fullback"],
    seedPosts: [
      { user: "James Okafor", handle: "@james_rugby", pos: "Flanker · Life University", content: "USA Eagles training camp invite. This is what I've been working for. 🏉 #USARugby", highlight: "USA Eagles Camp Invite", likes: 2104, xScore: 91 },
    ],
  },
  {
    id: "cricket", name: "Cricket", emoji: "🏏", tagline: "BAT. BOWL. WIN.",
    accentColor: "blue",
    stats: [{ icon: "🏏", value: "2.5B+", label: "Fans Worldwide" }, { icon: "🏆", value: "100+", label: "Countries" }, { icon: "🎓", value: "200+", label: "College Programs" }, { icon: "💰", value: "$2B+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Gray-Nicolls", type: "Bat & Equipment", value: "$3K–$100K/yr", req: "National or elite club", icon: "🏏" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$5K–$200K/yr", req: "International level", icon: "👟" },
      { brand: "MRF", type: "Bat Sponsor", value: "$2K–$50K/yr", req: "Elite club or national", icon: "🏏" },
      { brand: "Pepsi", type: "Brand Partner", value: "$10K–$500K/yr", req: "International player", icon: "🥤" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$10K/yr", req: "Any level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#IPL", posts: "2.4M" }, { tag: "#T20WorldCup", posts: "890K" }, { tag: "#CricketNIL", posts: "18.4K" }, { tag: "#USACricket", posts: "12.1K" }, { tag: "#CollegeCricket", posts: "6.8K" }],
    scouts: [{ name: "ICC", org: "International Cricket Council", role: "World rankings" }, { name: "USA Cricket", org: "National Federation", role: "National team scouting" }, { name: "IPL Franchises", org: "Pro League", role: "Auction prospects" }],
    events: [{ name: "ICC T20 World Cup", location: "Worldwide", date: "Jun 2026", level: "International" }, { name: "USA Cricket National Championships", location: "TBD", date: "Aug 2026", level: "National" }, { name: "College Cricket World Cup", location: "Multiple Sites", date: "Jul 2026", level: "National" }, { name: "Minor League Cricket", location: "USA", date: "Year-Round", level: "National" }],
    positions: ["Batsman", "Bowler", "All-Rounder", "Wicketkeeper", "Opening Bat", "Middle Order"],
    seedPosts: [
      { user: "Arjun Patel", handle: "@arjun_cricket", pos: "All-Rounder · USA Cricket", content: "Selected for USA Cricket U-19 World Cup squad. Representing the red, white and blue. 🏏🇺🇸 #USACricket", highlight: "USA U-19 World Cup Squad", likes: 3892, xScore: 90 },
    ],
  },
  {
    id: "cross-country", name: "Cross Country", emoji: "🏃‍♂️", tagline: "MILES MAKE CHAMPIONS",
    accentColor: "green",
    stats: [{ icon: "🏃‍♂️", value: "500K+", label: "Runners" }, { icon: "🏆", value: "5,000+", label: "Meets" }, { icon: "🎓", value: "2,000+", label: "College Programs" }, { icon: "💰", value: "$200M+", label: "NIL Market" }],
    nilDeals: [
      { brand: "Nike", type: "Shoe & Apparel", value: "$3K–$200K/yr", req: "College or elite club", icon: "👟" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$2K–$100K/yr", req: "Any college level", icon: "🏃‍♂️" },
      { brand: "Brooks Running", type: "Shoe Sponsor", value: "$1K–$50K/yr", req: "Any level", icon: "👟" },
      { brand: "Garmin", type: "Watch Partner", value: "$1K–$20K/yr", req: "Any college level", icon: "⌚" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#NCAACross", posts: "14.2K" }, { tag: "#NXN", posts: "8.9K" }, { tag: "#MileSplit", posts: "22.1K" }, { tag: "#XCLife", posts: "34.8K" }, { tag: "#PRAlert", posts: "22.1K" }],
    scouts: [{ name: "MileSplit", org: "National Rankings", role: "Class 2027 prospects" }, { name: "NCAA Cross Country", org: "College Recruiting", role: "Scholarship offers" }, { name: "USATF", org: "National Federation", role: "Road racing pipeline" }],
    events: [{ name: "Nike Cross Nationals", location: "Portland, OR", date: "Nov 2026", level: "Elite" }, { name: "Foot Locker Cross Country Championships", location: "San Diego, CA", date: "Dec 2026", level: "Elite" }, { name: "NCAA Cross Country Championships", location: "Tallahassee, FL", date: "Nov 2026", level: "National" }, { name: "Sunflower Invitational", location: "Wichita, KS", date: "Sep 2026", level: "National" }],
    positions: ["5K", "6K", "8K", "10K", "Individual", "Team"],
    seedPosts: [
      { user: "Ethan Brooks", handle: "@ethan_xc", pos: "5K · Downers Grove North", content: "14:28 in the 5K at NXN Midwest Regional. Punching my ticket to Portland. 🏃‍♂️ #NXN", highlight: "14:28 5K — NXN Qualifier", likes: 1204, xScore: 88 },
    ],
  },
  {
    id: "rowing", name: "Rowing", emoji: "🚣", tagline: "PULL HARDER",
    accentColor: "blue",
    stats: [{ icon: "🚣", value: "200K+", label: "Rowers" }, { icon: "🏆", value: "1,500+", label: "Regattas" }, { icon: "🎓", value: "400+", label: "College Programs" }, { icon: "💰", value: "$80M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Concept2", type: "Equipment Partner", value: "$1K–$15K/yr", req: "College or elite club", icon: "🚣" },
      { brand: "Nike", type: "Apparel Sponsor", value: "$2K–$30K/yr", req: "Any college level", icon: "👟" },
      { brand: "Strava", type: "Training Partner", value: "$500–$5K/yr", req: "Any level", icon: "📱" },
      { brand: "Garmin", type: "Watch Partner", value: "$1K–$10K/yr", req: "Any college level", icon: "⌚" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#HenleyRoyal", posts: "28.4K" }, { tag: "#USRowing", posts: "8.9K" }, { tag: "#OlympicTrials", posts: "38.4K" }, { tag: "#RowingNIL", posts: "3.8K" }, { tag: "#CollegeRowing", posts: "9.2K" }],
    scouts: [{ name: "US Rowing", org: "National Federation", role: "Olympic Trials scouting" }, { name: "NCAA Rowing", org: "College Recruiting", role: "Scholarship offers" }, { name: "Henley Royal Regatta", org: "Elite Event", role: "International scouting" }],
    events: [{ name: "Head of the Charles Regatta", location: "Boston, MA", date: "Oct 2026", level: "Elite" }, { name: "US Rowing Youth National Championships", location: "Sarasota, FL", date: "Jul 2026", level: "National" }, { name: "NCAA Rowing Championships", location: "Sacramento, CA", date: "May 2026", level: "National" }, { name: "Henley Royal Regatta", location: "Henley, UK", date: "Jul 2026", level: "International" }],
    positions: ["Single Scull", "Double Scull", "Quad Scull", "Coxless Pair", "Coxless Four", "Eight", "Coxswain"],
    seedPosts: [
      { user: "Sarah Mitchell", handle: "@sarah_rowing", pos: "Single Scull · Princeton RC", content: "Head of the Charles qualifier confirmed. Yale and Harvard coaches watching. 🚣 #HenleyRoyal", highlight: "Head of the Charles Qualifier", likes: 892, xScore: 89 },
    ],
  },
  {
    id: "water-polo", name: "Water Polo", emoji: "🤽", tagline: "MAKE A SPLASH",
    accentColor: "blue",
    stats: [{ icon: "🤽", value: "200K+", label: "Players" }, { icon: "🏆", value: "1,000+", label: "Tournaments" }, { icon: "🎓", value: "300+", label: "College Programs" }, { icon: "💰", value: "$50M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Speedo", type: "Cap & Suit Sponsor", value: "$1K–$15K/yr", req: "College or elite club", icon: "🤽" },
      { brand: "Nike", type: "Apparel Sponsor", value: "$2K–$20K/yr", req: "Any college level", icon: "👟" },
      { brand: "TYR Sport", type: "Brand Ambassador", value: "$1K–$10K/yr", req: "Any level", icon: "💧" },
      { brand: "Mikasa", type: "Ball Partner", value: "$500–$5K/yr", req: "Any level", icon: "🤽" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#USAWaterPolo", posts: "6.4K" }, { tag: "#NCAAWaterPolo", posts: "4.8K" }, { tag: "#OlympicTrials", posts: "38.4K" }, { tag: "#WaterPoloNIL", posts: "2.1K" }, { tag: "#PoolLife", posts: "12.4K" }],
    scouts: [{ name: "USA Water Polo", org: "National Federation", role: "Olympic Trials scouting" }, { name: "NCAA Water Polo", org: "College Recruiting", role: "Scholarship offers" }, { name: "FINA", org: "International Federation", role: "World Championship scouting" }],
    events: [{ name: "USA Water Polo Junior Olympics", location: "Anaheim, CA", date: "Jul 2026", level: "Elite" }, { name: "NCAA Water Polo Championships", location: "Los Angeles, CA", date: "Dec 2026", level: "National" }, { name: "FINA World Junior Championships", location: "TBD", date: "Aug 2026", level: "International" }, { name: "Speedo Cup", location: "Multiple Sites", date: "Year-Round", level: "National" }],
    positions: ["GK", "Field Player", "Center Forward", "Wing", "Driver", "Hole Set"],
    seedPosts: [
      { user: "Alex Kim", handle: "@alex_waterpolo", pos: "GK · Stanford WP", content: "USA Water Polo Junior Olympic team made. Stanford offer locked in. 🤽 #USAWaterPolo", highlight: "USA Junior Olympic Team", likes: 1204, xScore: 92 },
    ],
  },
  {
    id: "field-hockey", name: "Field Hockey", emoji: "🏑", tagline: "CONTROL THE FIELD",
    accentColor: "green",
    stats: [{ icon: "🏑", value: "30M+", label: "Players Worldwide" }, { icon: "🏆", value: "2,000+", label: "Clubs" }, { icon: "🎓", value: "400+", label: "College Programs" }, { icon: "💰", value: "$60M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Grays", type: "Stick & Equipment", value: "$2K–$20K/yr", req: "College or national team", icon: "🏑" },
      { brand: "Adidas", type: "Brand Ambassador", value: "$3K–$50K/yr", req: "Any college level", icon: "👟" },
      { brand: "Nike", type: "Apparel Partner", value: "$2K–$30K/yr", req: "D1 or national team", icon: "👕" },
      { brand: "Dita", type: "Stick Sponsor", value: "$1K–$15K/yr", req: "Any level", icon: "🏑" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
    ],
    trendingTags: [{ tag: "#FIH", posts: "28.4K" }, { tag: "#USAFieldHockey", posts: "8.9K" }, { tag: "#NCAAFieldHockey", posts: "6.2K" }, { tag: "#FieldHockeyNIL", posts: "3.4K" }, { tag: "#Committed", posts: "21.7K" }],
    scouts: [{ name: "USA Field Hockey", org: "National Federation", role: "Olympic Trials scouting" }, { name: "NCAA Field Hockey", org: "College Recruiting", role: "Scholarship offers" }, { name: "FIH", org: "International Federation", role: "World Cup scouting" }],
    events: [{ name: "USA Field Hockey National Championships", location: "TBD", date: "Oct 2026", level: "National" }, { name: "NCAA Field Hockey Championships", location: "Storrs, CT", date: "Nov 2026", level: "National" }, { name: "FIH Pro League", location: "Worldwide", date: "Year-Round", level: "International" }, { name: "Junior Pan American Championships", location: "TBD", date: "Aug 2026", level: "International" }],
    positions: ["GK", "Sweeper", "Defender", "Midfielder", "Forward", "Striker"],
    seedPosts: [
      { user: "Emma Walsh", handle: "@emma_fh", pos: "Forward · Penn State", content: "USA Field Hockey U-21 camp invite. This is the moment I've been training for. 🏑 #USAFieldHockey", highlight: "USA U-21 Camp Invite", likes: 1492, xScore: 91 },
    ],
  },
  {
    id: "cheer", name: "Cheerleading", emoji: "📣", tagline: "STUNT. TUMBLE. WIN.",
    accentColor: "blue",
    stats: [{ icon: "📣", value: "4.5M+", label: "Athletes" }, { icon: "🏆", value: "2,000+", label: "Competitions" }, { icon: "🎓", value: "500+", label: "College Programs" }, { icon: "💰", value: "$100M+", label: "Scholarships" }],
    nilDeals: [
      { brand: "Varsity Brands", type: "Uniform & Apparel", value: "$2K–$20K/yr", req: "College or elite club", icon: "📣" },
      { brand: "Nike", type: "Brand Ambassador", value: "$2K–$30K/yr", req: "Any college level", icon: "👟" },
      { brand: "Rebel Athletic", type: "Uniform Sponsor", value: "$1K–$10K/yr", req: "Any level", icon: "👕" },
      { brand: "Gatorade", type: "Hydration Partner", value: "$1K–$8K/yr", req: "Any college level", icon: "💧" },
      { brand: "GK Elite", type: "Apparel Partner", value: "$1K–$8K/yr", req: "Any level", icon: "📣" },
    ],
    trendingTags: [{ tag: "#UCANationals", posts: "18.4K" }, { tag: "#NCACheer", posts: "12.1K" }, { tag: "#CheerNIL", posts: "8.9K" }, { tag: "#AllStar", posts: "22.4K" }, { tag: "#Committed", posts: "21.7K" }],
    scouts: [{ name: "Varsity Brands", org: "National Scouting", role: "Elite camp invites" }, { name: "NCA", org: "National Cheerleaders Association", role: "All-Star rankings" }, { name: "NCAA Cheer", org: "College Recruiting", role: "Scholarship offers" }],
    events: [{ name: "UCA National High School Championships", location: "Orlando, FL", date: "Feb 2026", level: "Elite" }, { name: "NCA All-Star National Championship", location: "Dallas, TX", date: "Apr 2026", level: "National" }, { name: "ESPN Wide World of Sports Classic", location: "Orlando, FL", date: "Feb 2026", level: "National" }, { name: "Cheersport Nationals", location: "Atlanta, GA", date: "Feb 2026", level: "National" }],
    positions: ["Flyer", "Base", "Back Spot", "Tumbler", "Stunter", "All-Around"],
    seedPosts: [
      { user: "Brianna Lee", handle: "@bri_cheer", pos: "Flyer · Top Gun All Stars", content: "UCA All-American selection confirmed. Alabama offer on the table. 📣 #UCANationals", highlight: "UCA All-American", likes: 2891, xScore: 90 },
    ],
  },
];

// ─── SportXHub Component ───────────────────────────────────────────────────────
export default function SportXHub({ sport }: { sport: SportConfig }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"feed" | "events" | "nil" | "transfer" | "scouts">("feed");
  const [postText, setPostText] = useState("");
  const [xScoreResult, setXScoreResult] = useState<{ score: number; breakdown: string; tier: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: feedData, isLoading: feedLoading } = trpc.feed.getFeed.useQuery({ limit: 20 }, { refetchInterval: 30000, retry: 1 });
  const likePost = trpc.feed.likePost.useMutation({ onSuccess: () => utils.feed.getFeed.invalidate() });
  const createPost = trpc.feed.createPost.useMutation({ onSuccess: () => { setPostText(""); utils.feed.getFeed.invalidate(); } });
  const calcXFactor = trpc.ai.calculateXFactor.useMutation({ onSuccess: (data) => setXScoreResult(data) });

  const dbPosts = feedData?.posts ?? [];
  const sportPosts = dbPosts.filter((p: any) =>
    (p.content as string)?.toLowerCase().includes(sport.name.toLowerCase()) ||
    (p.type as string)?.toLowerCase().includes(sport.id.toLowerCase())
  );
  const displayPosts = sportPosts.length > 0 ? sportPosts : sport.seedPosts;

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "AT";

  return (
    <div className="min-h-screen bg-[#000a1a] text-white">
      {/* Top Nav — X-style */}
      <header className="sticky top-0 z-50 bg-[#000a1a]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white text-sm font-medium">← ATHLYNX</Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sport.emoji}</span>
              <div>
                <div className="text-xs text-blue-300 font-black tracking-widest uppercase">{sport.name}</div>
                <div className="text-[10px] text-cyan-400 tracking-wider font-bold">ATHLYNXAI</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-bold text-xs cursor-pointer">{initials}</div>
              </Link>
            ) : (
              <>
                <Link href="/signin" className="text-sm text-slate-300 hover:text-white font-medium">Sign In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-4 py-2 rounded-full transition-colors">Join Free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="sticky top-[57px] z-40 bg-[#000a1a]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {[
            { id: "feed", label: `${sport.emoji} Feed` },
            { id: "events", label: "🏆 Events" },
            { id: "nil", label: "💰 NIL Deals" },
            { id: "transfer", label: "🔄 Transfer Portal" },
            { id: "scouts", label: "👁️ Scouts" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 px-5 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id ? "border-blue-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#000a1a] to-[#000a1a] border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-4xl font-black text-white mb-1">{sport.tagline}</div>
            <div className="text-slate-400 text-sm">Every {sport.name} athlete. Every level. Worldwide. Powered by AthlynXAI.</div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {sport.stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black text-blue-400">{s.value}</div>
                <div className="text-slate-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="max-w-7xl mx-auto flex gap-0">

        {/* Left Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto border-r border-slate-800 px-4 py-4">
          {/* X-Factor Score Widget */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-black text-white text-sm">Your X-Factor Score</h3>
            </div>
            {xScoreResult ? (
              <div className="text-center py-2">
                <div className={`text-5xl font-black mb-1 ${xScoreResult.score >= 90 ? "text-yellow-400" : xScoreResult.score >= 80 ? "text-blue-400" : "text-green-400"}`}>{xScoreResult.score}</div>
                <div className="text-blue-300 text-xs font-bold mb-2">{xScoreResult.tier}</div>
                <p className="text-slate-400 text-xs leading-relaxed">{xScoreResult.breakdown}</p>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-xs mb-3">AI-powered rating based on your stats, film, recruiting interest & intangibles. Powered by Nebius + Gemini.</p>
                <button
                  onClick={() => calcXFactor.mutate({ sport: sport.name })}
                  disabled={!user || calcXFactor.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {calcXFactor.isPending ? "Calculating..." : user ? "Get My X-Factor Score" : "Sign In to Score"}
                </button>
              </>
            )}
          </div>

          {/* Trending Tags */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Trending in {sport.name}
            </h3>
            <div className="space-y-2">
              {sport.trendingTags.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-blue-400 text-sm font-bold hover:text-blue-300 cursor-pointer">{t.tag}</span>
                  <span className="text-slate-600 text-xs">{t.posts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1">
            {[
              { href: "/nil-portal", label: "💰 NIL Portal" },
              { href: "/transfer-portal", label: "🔄 Transfer Portal" },
              { href: "/browse-athletes", label: "👥 Browse Athletes" },
              { href: "/ai-recruiter", label: "🤖 AI Recruiter" },
              { href: "/messenger", label: "💬 Messages" },
            ].map(link => (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                  {link.label}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Center Feed */}
        <div className="flex-1 min-w-0 border-r border-slate-800">

          {/* FEED TAB */}
          {activeTab === "feed" && (
            <div>
              {/* Compose */}
              {user && (
                <div className="px-4 py-4 border-b border-slate-800">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{initials}</div>
                    <div className="flex-1">
                      <textarea
                        value={postText}
                        onChange={e => setPostText(e.target.value)}
                        placeholder={`Share your ${sport.name} X-Factor moment...`}
                        className="w-full bg-transparent text-white placeholder-slate-600 text-base resize-none outline-none min-h-[60px]"
                        rows={2}
                      />
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-3 text-blue-400">
                          <button className="hover:text-blue-300"><ImageIcon className="w-5 h-5" /></button>
                          <button className="hover:text-blue-300"><BarChart2 className="w-5 h-5" /></button>
                          <button className="hover:text-blue-300"><MapPin className="w-5 h-5" /></button>
                        </div>
                        <button
                          onClick={() => { if (postText.trim() && user) createPost.mutate({ content: postText, postType: "status" }); }}
                          disabled={!postText.trim() || createPost.isPending}
                          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black px-5 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1.5"
                        >
                          <Zap className="w-4 h-4" />
                          {createPost.isPending ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts */}
              {feedLoading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Loading {sport.name} feed...</p>
                </div>
              ) : (
                displayPosts.map((post: any, i: number) => (
                  <div key={post.id ?? i} className="border-b border-slate-800 px-4 py-4 hover:bg-slate-900/40 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(post.user?.avatar ?? (post.authorName ?? post.user ?? "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-black text-white text-sm">{post.user?.name ?? post.authorName ?? post.user ?? "Athlete"}</span>
                          <span className="text-slate-500 text-xs">{post.user?.handle ?? post.handle ?? ""}</span>
                          {(post.user?.xScore ?? post.xScore) && (
                            <span className="text-yellow-400 text-xs font-bold flex items-center gap-0.5">
                              <Zap className="w-3 h-3" />{post.user?.xScore ?? post.xScore}
                            </span>
                          )}
                          {(post.user?.pos ?? post.pos) && <span className="text-blue-400 text-xs bg-blue-950/60 px-2 py-0.5 rounded-full">{post.user?.pos ?? post.pos}</span>}
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed mb-2">{post.content}</p>
                        {(post.highlight ?? post.user?.highlight) && (
                          <div className="inline-flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/40 rounded-full px-3 py-1 mb-2">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-blue-300 text-xs font-bold">{post.highlight ?? post.user?.highlight}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-5 text-slate-600 text-sm">
                          <button onClick={() => post.id && likePost.mutate({ postId: post.id })} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.likes ?? post.likes ?? post.likesCount ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.comments ?? post.commentsCount ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                            <Repeat2 className="w-4 h-4" />
                            <span className="text-xs">{post.stats?.reposts ?? 0}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors ml-auto">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!user && (
                <div className="p-6 border-b border-slate-800 bg-blue-950/20">
                  <p className="text-slate-400 text-sm mb-3">Join AthlynXAI to post your {sport.name} moments and get your X-Factor score.</p>
                  <div className="flex gap-3">
                    <Link href="/signup"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors">Join Free</button></Link>
                    <Link href="/signin"><button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">Sign In</button></Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div className="p-4 space-y-3">
              <h2 className="text-xl font-black text-white mb-4">🏆 2026 {sport.name} Events & Showcases</h2>
              {sport.events.map((e, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-blue-700/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-black">{e.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.level === "Elite" ? "bg-yellow-700/40 text-yellow-400 border border-yellow-700/40" : e.level === "International" ? "bg-purple-700/40 text-purple-400 border border-purple-700/40" : e.level === "National" ? "bg-blue-700/40 text-blue-400 border border-blue-700/40" : "bg-slate-700/40 text-slate-400 border border-slate-700/40"}`}>{e.level}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>📍 {e.location}</span>
                        <span>📅 {e.date}</span>
                      </div>
                    </div>
                    <Link href={user ? "/athlete-calendar" : "/signup"}>
                      <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-full transition-colors flex-shrink-0">Register →</button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5 text-center mt-4">
                <p className="text-slate-300 text-sm mb-3">Add events to your Athlete Calendar and get reminders when registration opens.</p>
                <Link href="/athlete-calendar"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors">Open My Calendar</button></Link>
              </div>
            </div>
          )}

          {/* NIL DEALS TAB */}
          {activeTab === "nil" && (
            <div className="p-4 space-y-3">
              <h2 className="text-xl font-black text-white mb-4">💰 {sport.name} NIL Deals</h2>
              {sport.nilDeals.map((deal, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-700/50 transition-all">
                  <div className="text-3xl w-12 text-center flex-shrink-0">{deal.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black">{deal.brand}</div>
                    <div className="text-slate-500 text-sm">{deal.type}</div>
                    <div className="text-slate-600 text-xs mt-0.5">Requirement: {deal.req}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-blue-400 font-black text-sm">{deal.value}</div>
                    <Link href={user ? "/nil-portal" : "/signup"}>
                      <button className="text-xs text-blue-400 hover:text-white transition-colors mt-1">Apply →</button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5 text-center mt-4">
                <p className="text-slate-300 text-sm mb-3">The NIL Portal connects you with brands, secures contracts, and manages your deals — all in one place.</p>
                <Link href="/nil-portal"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-full text-sm transition-colors">Open NIL Portal</button></Link>
              </div>
            </div>
          )}

          {/* TRANSFER PORTAL TAB */}
          {activeTab === "transfer" && (
            <div className="p-4">
              <h2 className="text-xl font-black text-white mb-4">🔄 {sport.name} Transfer Portal</h2>
              <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 border border-blue-800/40 rounded-2xl p-6 mb-4">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{sport.emoji}</div>
                  <h3 className="text-2xl font-black text-white mb-2">Find Your Next School</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">The Transfer Portal connects {sport.name} athletes with programs looking for exactly your skills. Go from small school to big opportunity.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[{ label: "Programs Searching", value: "1,200+" }, { label: "Open Scholarships", value: "450+" }, { label: "Avg Response Time", value: "48hrs" }].map((s, i) => (
                    <div key={i} className="bg-blue-950/40 rounded-xl p-3 text-center">
                      <div className="text-blue-400 font-black text-xl">{s.value}</div>
                      <div className="text-slate-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  {["Complete your athlete profile", "Enter the Transfer Portal", "Get matched with programs", "Receive scholarship offers"].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">{i + 1}</div>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/transfer-portal"><button className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3 rounded-full transition-colors">Enter Transfer Portal</button></Link>
                  <Link href={user ? "/profile" : "/signup"}><button className="border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white font-bold px-6 py-3 rounded-full transition-colors">Build My Profile</button></Link>
                </div>
              </div>
            </div>
          )}

          {/* SCOUTS TAB */}
          {activeTab === "scouts" && (
            <div className="p-4">
              <h2 className="text-xl font-black text-white mb-4">👁️ {sport.name} Scouts & Recruiters</h2>
              <div className="space-y-3 mb-6">
                {sport.scouts.map((scout, i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-700/50 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {scout.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-black">{scout.name}</div>
                      <div className="text-slate-500 text-sm">{scout.org}</div>
                      <div className="text-blue-400 text-xs mt-0.5">🔍 {scout.role}</div>
                    </div>
                    <Link href={user ? "/profile" : "/signup"}>
                      <button className="border border-slate-600 hover:border-blue-500 hover:text-blue-400 text-slate-400 text-xs font-bold px-4 py-2 rounded-full transition-colors">Get Noticed</button>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-800/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-black">How to Get Noticed</h3>
                </div>
                <div className="space-y-2">
                  {["Complete your athlete profile with stats and highlights", "Post your X-Factor moments to the feed", "Enter your sport's showcases and events", "Get your AI X-Factor score to stand out"].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
                <Link href={user ? "/profile" : "/signup"}>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-full text-sm transition-colors">Build My Profile Now</button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-72 flex-shrink-0 sticky top-[105px] h-[calc(100vh-105px)] overflow-y-auto px-4 py-4">
          {/* X-Factor Score Tiers */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-black text-white text-sm">X-Factor Tiers</h3>
            </div>
            {[
              { label: "90–100", desc: "Elite — Pro Prospect", color: "text-yellow-400" },
              { label: "80–89", desc: "High Major D1", color: "text-blue-400" },
              { label: "70–79", desc: "Mid Major D1", color: "text-green-400" },
              { label: "60–69", desc: "D2 / D3 Prospect", color: "text-slate-400" },
            ].map((tier, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0">
                <span className={`font-black ${tier.color}`}>{tier.label}</span>
                <span className="text-slate-500">{tier.desc}</span>
              </div>
            ))}
            <button
              onClick={() => calcXFactor.mutate({ sport: sport.name })}
              disabled={!user || calcXFactor.isPending}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-black py-2 rounded-full transition-colors"
            >
              {calcXFactor.isPending ? "Calculating..." : user ? "Get My Score" : "Sign In to Score"}
            </button>
          </div>

          {/* Who to Follow */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Who to Follow
            </h3>
            <div className="space-y-3">
              {sport.scouts.map((scout, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {scout.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{scout.name}</div>
                    <div className="text-xs text-slate-500 truncate">{scout.org}</div>
                  </div>
                  <button className="text-xs border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-400 px-3 py-1 rounded-full transition-colors flex-shrink-0">Follow</button>
                </div>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div className="bg-slate-900/60 rounded-2xl p-4 mb-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Positions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {sport.positions.map((pos, i) => (
                <span key={i} className="text-xs bg-blue-950/60 text-blue-300 border border-blue-900/40 px-2 py-1 rounded-full">{pos}</span>
              ))}
            </div>
          </div>

          {/* Scout Spotlight */}
          <div className="bg-slate-900/60 rounded-2xl p-4">
            <h3 className="font-black text-white text-sm mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              Scout Spotlight
            </h3>
            <div className="bg-blue-950/50 border border-blue-800/30 rounded-xl p-3">
              <div className="text-xs text-blue-300 font-bold mb-1">🔍 Scouts are watching</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {sport.scouts.length} verified scouts and coaches are active in {sport.name} right now. Post your highlights to get noticed.
              </p>
              <Link href={user ? "/profile" : "/signup"}>
                <button className="mt-2 text-xs text-blue-400 hover:underline font-bold">Get noticed →</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
