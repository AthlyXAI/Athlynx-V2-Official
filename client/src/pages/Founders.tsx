import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Mail, Phone, ExternalLink } from "lucide-react";

const TEAM = [
  {
    name: "Chad A. Dozier Sr.",
    title: "Founder, CEO & Chairman",
    org: "ATHLYNX | Dozier Holdings Group",
    photo: "https://www.gravatar.com/avatar/400fe18dbc29cd824f277af7e41710b0?s=200&d=identicon",
    emails: ["cdozier14@athlynx.ai", "cdozier14@athlynx.ai", "cdozier14@athlynx.ai"],
    phone: null,
    alignable: "https://www.alignable.com/houston-tx/athlynx-ai-corporation",
    linkedin: "https://www.linkedin.com/in/chad-a-dozier-sr",
    bio: "Chad A. Dozier Sr. is the Founder, CEO & Chairman of Dozier Holdings Group and ATHLYNX. A visionary entrepreneur and athlete advocate, Chad co-founded DHG in Houston, TX in November 2024 after meeting Glenn Tse at Hope Lodge. His mission: give every athlete the tools, resources, and opportunities they need to succeed on and off the field.",
    tags: ["NIL Pioneer", "Tech Founder", "Athlete Advocate"],
    frameColor: "border-cyan-400",
    badgeColor: "bg-cyan-700 text-cyan-100",
  },
  {
    name: "Lee Marshall",
    title: "VP Sales & Partnerships",
    org: "ATHLYNX | Dozier Holdings Group",
    photo: "https://www.gravatar.com/avatar/5a38de4950c1f738a38fea6581f03f3f?s=200&d=identicon",
    emails: ["lmarshall@athlynx.ai", "lmarshall@dozierholdingsgroup.com.mx", "lmarshall@dozierholdingsgroup.com"],
    phone: null,
    alignable: null,
    linkedin: null,
    bio: "Lee Marshall drives DHG's revenue growth as VP Sales & Partnerships. Lee builds the strategic relationships and partnership channels that fuel DHG's expansion across all divisions — from NIL brand deals to enterprise technology partnerships.",
    tags: ["VP Sales", "Partnerships", "Revenue Leader"],
    frameColor: "border-blue-400",
    badgeColor: "bg-blue-700 text-blue-100",
  },
  {
    name: "Jimmy Boyd",
    title: "VP Real Estate",
    org: "Dozier Holdings Group",
    photo: "https://www.gravatar.com/avatar/4c78b41ba07ad88bbff1d7192b7083e0?s=200&d=identicon",
    emails: ["jboyd@athlynx.ai", "jboyd@dozierholdingsgroup.com.mx", "jboyd@dozierholdingsgroup.com"],
    phone: null,
    alignable: null,
    linkedin: null,
    bio: "Jimmy Boyd oversees DHG's real estate portfolio and development pipeline as VP Real Estate. Jimmy leads acquisitions, development, and management across DHG's residential and commercial real estate divisions — including Uma Real Estate, VC Residential, Villa Agape, and Pisces Resort.",
    tags: ["VP Real Estate", "Development", "Acquisitions"],
    frameColor: "border-teal-400",
    badgeColor: "bg-teal-700 text-teal-100",
  },
  {
    name: "Glenn Tse",
    title: "CFO / COO",
    org: "ATHLYNX | Dozier Holdings Group",
    photo: "https://www.gravatar.com/avatar/957a05e8df8fc733496a8f23e3440343?s=200&d=identicon",
    emails: ["gtse@athlynx.ai", "gtse@dozierholdingsgroup.com.mx", "gtse@dozierholdingsgroup.com"],
    phone: null,
    alignable: null,
    linkedin: null,
    bio: "Glenn Tse is the co-founder of Dozier Holdings Group and serves as CFO/COO. Glenn and Chad met at Hope Lodge in Houston, TX in November 2024, and together built DHG on a foundation of resilience, shared purpose, and the belief that the best is yet to come.",
    tags: ["CFO / COO", "Co-Founder", "Financial Strategy"],
    frameColor: "border-indigo-400",
    badgeColor: "bg-indigo-700 text-indigo-100",
  },
  {
    name: "Andrew Kustes",
    title: "VP Technology",
    org: "ATHLYNX | Dozier Holdings Group",
    photo: "https://www.gravatar.com/avatar/b49fee0c3f415058fb165932ef889845?s=200&d=identicon",
    emails: ["akustes@athlynx.ai", "akustes@dozierholdingsgroup.com.mx", "akustes@dozierholdingsgroup.com"],
    phone: null,
    alignable: null,
    linkedin: null,
    bio: "Andy Kustes leads DHG's technology vision as VP Technology. Andy architects the technical infrastructure powering ATHLYNX, Softmor AI, and VC Data Centers — building the technological backbone of the DHG ecosystem.",
    tags: ["VP Technology", "Platform Architect", "AI Builder"],
    frameColor: "border-blue-500",
    badgeColor: "bg-blue-800 text-blue-100",
  },
];

function FoundersInner() {
  return (
    <PlatformLayout>
      <div className="space-y-4 pb-20 lg:pb-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d1f4e] to-[#1a2a5e] border border-blue-800 rounded-xl p-5 text-center">
          <img
            src="/athlynx-icon.png"
            alt="ATHLYNX"
            className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg"
          />
          <h2 className="text-3xl font-black text-white tracking-wide">THE TEAM</h2>
          <p className="text-blue-300 text-sm mt-1">The visionaries building the future of athlete success</p>
          <p className="text-blue-500 text-xs mt-1">Dozier Holdings Group · Founded November 2024 · Houston, TX</p>
        </div>

        {/* Team Cards — Dot.card style */}
        {TEAM.map((person) => (
          <div
            key={person.name}
            className="bg-gradient-to-b from-[#0d1f4e] to-[#091535] border border-blue-900 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl"
          >
            {/* Photo in rounded square frame */}
            <div className={`w-36 h-36 rounded-2xl border-4 ${person.frameColor} overflow-hidden mb-4 shadow-lg`}>
              <img
                src={person.photo}
                alt={person.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name & Title */}
            <h3 className="text-2xl font-black text-white mb-0.5">{person.name}</h3>
            <div className="text-cyan-400 font-semibold text-sm mb-1">{person.title}</div>
            <div className="text-blue-400 text-xs mb-3">{person.org}</div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {person.tags.map((tag) => (
                <span key={tag} className={`text-xs ${person.badgeColor} px-3 py-1 rounded-full font-medium`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-blue-200 text-xs leading-relaxed mb-4 max-w-sm">{person.bio}</p>

            {/* Contact Info */}
            <div className="w-full space-y-2 max-w-sm">
              {person.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 bg-[#1a2a5e] hover:bg-[#1e3470] border border-blue-800 rounded-xl px-4 py-3 transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium truncate">{email}</span>
                </a>
              ))}
              {person.phone && (
                <a
                  href={`tel:${person.phone}`}
                  className="flex items-center gap-3 bg-[#1a2a5e] hover:bg-[#1e3470] border border-blue-800 rounded-xl px-4 py-3 transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{person.phone}</span>
                </a>
              )}
              {/* Alignable */}
              {person.alignable && (
                <a
                  href={person.alignable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#1a1a4e] hover:bg-[#22226e] border border-purple-800 rounded-xl px-4 py-3 transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm font-bold">Alignable</span>
                    <span className="text-purple-300 text-xs">Athlynx AI Corporation · Houston, TX</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-purple-400 ml-auto shrink-0" />
                </a>
              )}
              {/* LinkedIn */}
              {person.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0a1f3e] hover:bg-[#0e2a52] border border-blue-700 rounded-xl px-4 py-3 transition-colors w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm font-bold">LinkedIn</span>
                    <span className="text-blue-300 text-xs">Chad A. Dozier Sr.</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-blue-400 ml-auto shrink-0" />
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Vision Quote */}
        <div className="bg-gradient-to-br from-[#0d1f4e] to-[#091535] border border-blue-800 rounded-xl p-5 text-center">
          <div className="text-cyan-400 text-xs uppercase tracking-widest mb-2">The Vision</div>
          <blockquote className="text-white text-xl font-black leading-relaxed">
            "Every athlete deserves a playbook. We built it."
          </blockquote>
          <div className="text-blue-400 text-sm mt-2">— Chad A. Dozier & Glenn Tse, Founders</div>
        </div>

        {/* Mission */}
        <div className="bg-[#0d1f4e] border border-blue-900 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">The Mission</h3>
          <div className="space-y-3">
            {[
              { icon: "🏆", title: "Athlete First", desc: "Every decision we make starts with what's best for the athlete." },
              { icon: "💰", title: "NIL Empowerment", desc: "Helping athletes understand, protect, and maximize their NIL value." },
              { icon: "🤝", title: "Community", desc: "Building the largest network of athletes, coaches, and brands in sports." },
              { icon: "🚀", title: "Innovation", desc: "Using AI and technology to give athletes an unfair advantage." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#091535] rounded-xl p-3">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm">{item.title}</div>
                  <div className="text-blue-400 text-xs">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1f4e] border border-blue-900 rounded-xl p-4 text-center">
          <div className="text-white font-black text-xl mb-1">Dreams Do Come True</div>
          <div className="text-blue-400 text-sm">2026 · Dozier Holdings Group · Houston, TX</div>
          <div className="text-blue-600 text-xs mt-1">Attitude of Gratitude · To God Be The Glory · Always 🙏</div>
        </div>
      <MobileBottomNav />
    </div>
    </PlatformLayout>
  );
}
export default function Founders() {
  return <RouteErrorBoundary><FoundersInner /></RouteErrorBoundary>;
}
