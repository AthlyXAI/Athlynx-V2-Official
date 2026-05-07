/**
 * ChadCard — /card
 * Chad A. Dozier Sr. digital business card / dot.card profile page
 * Matches his dot.card style exactly
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";

const CHAD_PHOTO = "/images/team/chad-dozier-headshot.png";
const DHG_LOGO = "/dhg-crab-shield.png";
const ATHLYNX_LOGO = "/athlynx-icon.png";

const LINKS = [
  {
    icon: "💬",
    label: "Text",
    sub: "+1 (601) 498-5282",
    href: "sms:+16014985282",
    color: "bg-green-500",
    textColor: "text-white",
  },
  {
    icon: "✉️",
    label: "Email",
    sub: "cdozier14@athlynx.ai",
    href: "mailto:cdozier14@athlynx.ai",
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    icon: "🌐",
    label: "Dozier Holdings Group",
    sub: "dozierholdingsgroup.com",
    href: "https://dozierholdingsgroup.com",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "🏆",
    label: "ATHLYNX — The Athlete's Playbook",
    sub: "athlynx.ai",
    href: "https://athlynx.ai",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "📅",
    label: "Schedule a Meeting",
    sub: "calendly.com/cdozier14",
    href: "https://calendly.com/cdozier14",
    color: "bg-white",
    textColor: "text-gray-800",
    border: true,
  },
  {
    icon: "💼",
    label: "LinkedIn",
    sub: "linkedin.com/in/chaddozier",
    href: "https://linkedin.com/in/chaddozier",
    color: "bg-[#0077B5]",
    textColor: "text-white",
  },
  {
    icon: "📸",
    label: "Instagram",
    sub: "@chad_dozier",
    href: "https://instagram.com/chad_dozier",
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
    textColor: "text-white",
  },
  {
    icon: "🐦",
    label: "X / Twitter",
    sub: "@ChadADozier2",
    href: "https://x.com/ChadADozier2",
    color: "bg-black",
    textColor: "text-white",
  },
];

function ChadCardInner() {
  const [copied, setCopied] = useState(false);

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Chad Allen Dozier Sr
N:Dozier;Chad;Allen;Sr;
TITLE:Founder, CEO & Chairman
ORG:Dozier Holdings Group;ATHLYNX AI;Softmor Inc
TEL;TYPE=CELL:+16014985282
EMAIL;TYPE=WORK:cdozier14@athlynx.ai
URL:https://athlynx.ai
ADR;TYPE=WORK:;;12306 Lake Portal Drive;Houston;TX;77047;USA
NOTE:Founder. Builder. Servant Leader.
END:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Chad_Dozier.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://athlynx.ai/card");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header Banner */}
        <div className="relative h-36 bg-gradient-to-r from-[#0a1628] via-[#1a3a8f] to-[#0a1628] overflow-hidden">
          {/* DHG logo watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <img src={DHG_LOGO} alt="DHG" className="w-32 h-32 object-contain" />
          </div>
          {/* DOZIER HOLDINGS text */}
          <div className="absolute inset-0 flex items-end justify-center pb-3">
            <span className="text-white/30 text-xs font-black tracking-[0.3em] uppercase">DOZIER HOLDINGS GROUP</span>
          </div>
          {/* Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#1a3a8f]">
              <img
                src={CHAD_PHOTO}
                alt="Chad A. Dozier Sr."
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = DHG_LOGO; }}
              />
            </div>
            {/* DHG crab badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={DHG_LOGO} alt="DHG" className="w-5 h-5 object-contain" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 pb-4 px-5 text-center">
          <h1 className="text-2xl font-black text-gray-900 leading-tight">Chad Allen Dozier Sr</h1>
          <p className="text-gray-500 text-sm font-medium mt-0.5">Founder. Builder. Servant Leader.</p>
          {/* Title block */}
          <div className="mt-3 text-left border-l-4 border-gray-200 pl-3">
            <p className="text-gray-600 text-xs leading-relaxed">
              Founder | CEO | Chairman | Dozier Holdings Group<br />
              ATHLYNX AI | Softmor Inc.<br />
              Houston, TX (HQ) | Laurel, MS (SE)<br />
              Mississippi State University
            </p>
          </div>
          {/* Tags */}
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            {["Creative", "Entrepreneur", "Servant Leader"].map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={handleSaveContact}
            className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-2xl text-sm hover:bg-gray-800 transition-colors"
          >
            Save Contact
          </button>
          <button
            onClick={handleCopyLink}
            className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            {copied ? "✓" : "🔗"}
          </button>
        </div>

        {/* Links */}
        <div className="px-4 pb-6 space-y-2.5">
          {LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] ${link.color} ${link.border ? "border border-gray-200 shadow-sm" : "shadow-md"}`}
            >
              <span className="text-2xl w-8 text-center shrink-0">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${link.textColor}`}>{link.label}</div>
                <div className={`text-xs truncate ${link.textColor} opacity-70`}>{link.sub}</div>
              </div>
              <svg className={`w-4 h-4 ${link.textColor} opacity-40 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* Logos Row */}
        <div className="px-4 pb-5 flex items-center justify-center gap-4 border-t border-gray-100 pt-4">
          <img src={DHG_LOGO} alt="Dozier Holdings Group" className="h-8 w-8 object-contain" />
          <img src={ATHLYNX_LOGO} alt="ATHLYNX AI" className="h-8 w-8 object-contain rounded-lg" />
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Powered by</div>
            <div className="text-xs font-black text-gray-700">ATHLYNX AI</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            Iron Sharpens Iron — Proverbs 27:17<br />
            © 2026 Dozier Holdings Group · athlynx.ai/card
          </p>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function ChadCard() {
  return <RouteErrorBoundary><ChadCardInner /></RouteErrorBoundary>;
}
