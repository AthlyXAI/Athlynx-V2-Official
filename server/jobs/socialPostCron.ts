/**
 * ATHLYNX Social Post Automation
 * Runs 3x/day via Vercel Cron (8am, 12pm, 6pm CST)
 * Posts to: Facebook, X (Twitter), Instagram, Google Business via Buffer GraphQL API
 * Posts to: LinkedIn via Zapier MCP
 * TikTok: requires video — text-only posts skipped
 *
 * MEDIA ROTATION RULES (Updated Session 11):
 * - Each channel receives a DIFFERENT post per cron run — no two channels get the same content
 * - Each post gets a DIFFERENT branded image — images rotate independently from text
 * - Posts advance through the library daily so the same post never repeats on the same day
 * - 30 unique text posts × 20 unique images = 600 unique combinations before any repeat
 *
 * BUFFER API NOTES (May 2, 2026):
 * - Use schedulingType: automatic + mode: shareNow
 * - Return type is PostActionPayload — use __typename, NOT "... on Post { id }"
 * - Token: kB3LprBJtIH1-1F1v_DQcjOIRFdX13YFQVPXrpz9gD_ (AthlynXAI, expires May 2, 2027)
 */

const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN!;
const ZAPIER_MCP_TOKEN = process.env.ZAPIER_MCP_TOKEN!;
const BASE_URL = "https://athlynx.ai";

// Buffer channel IDs — ALL 10 channels (from cdozier14@athlynx.ai account)
const BUFFER_CHANNELS = {
  instagram_chad_dozier:  "69e6cca6031bfa423c26478e", // chad_dozier (Instagram)
  linkedin:               "69e6cd3f031bfa423c264c63", // chad-a-dozier (LinkedIn)
  youtube:                "69e6cd7c031bfa423c264dd5", // Chad A. Dozier (YouTube)
  tiktok_chad:            "69e6cd99031bfa423c264e8c", // chadadozierdozier (TikTok — video only)
  google_business:        "69e6cdf3031bfa423c2650a8", // VCT Holdings Group LLC
  twitter:                "69e6ce05031bfa423c265121", // ChadADozier2 (X/Twitter)
  tiktok_cdozier75:       "69e6ce56031bfa423c2652c8", // cdozier75 (TikTok — video only)
  instagram_chaddozier14: "69e6ce77031bfa423c265389", // chaddozier14 (Instagram)
  facebook_athlynx:       "69f29ddf5c4c051afaf3e12e", // Athlynx - The Complete Athlete Ecosystem
  facebook_chad:          "69f3f06f5c4c051afaf9eeb7", // Chad Allen Dozier Sr (Facebook)
};

// Text-capable channels in posting order (TikTok excluded — requires video)
// ORDER MATTERS: each channel gets a different offset so no two channels share the same post
const TEXT_CHANNELS_ORDERED = [
  { id: BUFFER_CHANNELS.facebook_athlynx,       offset: 0, name: "Facebook/Athlynx" },
  { id: BUFFER_CHANNELS.instagram_chad_dozier,  offset: 1, name: "Instagram/chad_dozier" },
  { id: BUFFER_CHANNELS.twitter,                offset: 2, name: "X/Twitter" },
  { id: BUFFER_CHANNELS.instagram_chaddozier14, offset: 3, name: "Instagram/chaddozier14" },
  { id: BUFFER_CHANNELS.facebook_chad,          offset: 4, name: "Facebook/Chad" },
  { id: BUFFER_CHANNELS.google_business,        offset: 5, name: "Google Business" },
];

// ─────────────────────────────────────────────
// BRANDED IMAGE LIBRARY — 20 unique images
// Each image is a real asset hosted on athlynx.ai
// ─────────────────────────────────────────────
const IMAGE_LIBRARY: string[] = [
  `${BASE_URL}/brand/athlynx-promo.png`,
  `${BASE_URL}/brand/athlynx-logo-main.png`,
  `${BASE_URL}/brand/athlynx-investor.png`,
  `${BASE_URL}/brand/app-screen-2.png`,
  `${BASE_URL}/brand/app-screen-5.png`,
  `${BASE_URL}/brand/app-screen-9.png`,
  `${BASE_URL}/brand/app-screen-12.png`,
  `${BASE_URL}/brand/app-screen-15.png`,
  `${BASE_URL}/brand/app-screen-18.png`,
  `${BASE_URL}/brand/dhg-empire-hero.png`,
  `${BASE_URL}/images/athlete-focus.jpg`,
  `${BASE_URL}/images/champion-hero.jpg`,
  `${BASE_URL}/athlete-football.jpg`,
  `${BASE_URL}/athlete-basketball.jpg`,
  `${BASE_URL}/athlete-baseball.jpg`,
  `${BASE_URL}/athlete-track.jpg`,
  `${BASE_URL}/athlete-training.jpg`,
  `${BASE_URL}/athlynx-og-social.png`,
  `${BASE_URL}/economic-vision.png`,
  `${BASE_URL}/professional-athlete-dashboard.png`,
];

// ─────────────────────────────────────────────
// POST LIBRARY — 30 unique text posts
// ─────────────────────────────────────────────
const POST_LIBRARY = [
  {
    text: "🏆 ATHLYNX.AI — The #1 AI Platform for Athletes & NIL Deals.\n\nYour career. Your brand. Your future — all in one place.\n\n✅ AI-powered NIL marketplace\n✅ Real-time recruiting analytics\n✅ 20+ integrated platforms\n\nhttps://athlynx.ai\n\n#ATHLYNX #NIL #SportsAI #AthleteMarketing",
    link: "https://athlynx.ai",
  },
  {
    text: "⚡ ONE PLATFORM. EVERY EDGE.\n\nATHLYNX gives athletes the tools to get recruited, get paid, and get ahead.\n\n🎯 NIL deals\n🎯 Transfer portal analytics\n🎯 AI coaching insights\n\nhttps://athlynx.ai\n\n#ATHLYNX #CollegiateAthletes #NIL #RecruitingEdge",
    link: "https://athlynx.ai",
  },
  {
    text: "💎 THE DIAMOND GRIND IS REAL.\n\nBaseball athletes — ATHLYNX tracks your stats, connects you to scouts, and finds your NIL deals.\n\nYour next level starts here 👉 https://athlynx.ai\n\n#ATHLYNX #BaseballRecruiting #NIL #CollegiateBaseball",
    link: "https://athlynx.ai",
  },
  {
    text: "🤖 YOUR AI COACH NEVER SLEEPS.\n\nWhile you rest, ATHLYNX is analyzing your performance, finding opportunities, and building your brand.\n\n24/7 AI-powered athlete management 👉 https://athlynx.ai\n\n#ATHLYNX #AICoach #SportsAI #AthletePerformance",
    link: "https://athlynx.ai",
  },
  {
    text: "🏈 FOOTBALL ATHLETES — YOUR NIL ERA IS NOW.\n\nATHLYNX connects you directly to brands, boosters, and NIL deals.\n\nNo agents. No middlemen. Just results.\n\nhttps://athlynx.ai\n\n#ATHLYNX #FootballNIL #NILDeals #CollegiateFootball",
    link: "https://athlynx.ai",
  },
  {
    text: "🏀 BASKETBALL PLAYERS — LEVEL UP YOUR RECRUITING.\n\nATHLYNX gives you real-time analytics, NIL opportunities, and a global athlete network.\n\nJoin the movement 👉 https://athlynx.ai\n\n#ATHLYNX #BasketballRecruiting #NIL #HoopsDreams",
    link: "https://athlynx.ai",
  },
  {
    text: "🌍 ATHLETES CONNECT GLOBALLY ON ATHLYNX.\n\nShare schedules. Compare recruiting efforts. Build your brand worldwide.\n\nThe Athlete Playbook starts here 👉 https://athlynx.ai\n\n#ATHLYNX #GlobalAthletes #AthletePlaybook #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🚀 FROM UNRECRUITED TO UNSTOPPABLE.\n\nATHLYNX's Transfer Portal analytics help athletes at smaller schools get seen, get recruited, and increase their NIL value.\n\nhttps://athlynx.ai\n\n#ATHLYNX #TransferPortal #NIL #CollegiateAthletes",
    link: "https://athlynx.ai",
  },
  {
    text: "💰 YOUR NAME. YOUR IMAGE. YOUR LIKENESS. YOUR MONEY.\n\nATHLYNX's AI-powered NIL marketplace connects athletes with brands that want to pay them.\n\nStart earning 👉 https://athlynx.ai\n\n#ATHLYNX #NILMarketplace #AthleteMarketing #GetPaid",
    link: "https://athlynx.ai",
  },
  {
    text: "📊 DATA-DRIVEN RECRUITING.\n\nATHLYNX gives coaches and athletes real-time analytics to make smarter recruiting decisions.\n\n20+ integrated platforms. One dashboard.\n\nhttps://athlynx.ai\n\n#ATHLYNX #RecruitingAnalytics #SportsData #CoachingEdge",
    link: "https://athlynx.ai",
  },
  {
    text: "⚾ DIAMOND GRIND BASEBALL.\n\nFrom Little League to the pros — ATHLYNX tracks every pitch, every at-bat, and every recruiting opportunity.\n\nGet started 👉 https://athlynx.ai/diamond-grind\n\n#DiamondGrind #BaseballNIL #ATHLYNX #CollegiateBaseball",
    link: "https://athlynx.ai/diamond-grind",
  },
  {
    text: "🏈 WARRIORS PLAYBOOK — FOOTBALL DOMINANCE.\n\nATHLYNX's football platform gives players the edge in recruiting, film study, and NIL deals.\n\nOwn the field 👉 https://athlynx.ai/warriors-playbook\n\n#WarriorsPlaybook #FootballNIL #ATHLYNX #CollegiateFootball",
    link: "https://athlynx.ai/warriors-playbook",
  },
  {
    text: "💡 BUILT FOR LESS THAN $145,000.\n\nATHLYNX AI — 142 pages. 75,662 lines of code. 34 database tables. Dual AI engines.\n\nA traditional team would charge $2,074,000. We built it for $145K.\n\nPre-Seed round open → cdozier14@athlynx.ai\n\n#ATHLYNX #SportsTech #Startup #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🎯 SIGNING DAY IS EVERY DAY ON ATHLYNX.\n\nTrack your letter of intent, manage your commitments, and celebrate your signing day with the ATHLYNX community.\n\nhttps://athlynx.ai\n\n#SigningDay #CollegeRecruiting #ATHLYNX #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🧠 YOUR AI TRAINER KNOWS YOU.\n\nATHLYNX's personal AI Trainer Bot remembers every conversation, every workout, and every goal.\n\nStart training smarter 👉 https://athlynx.ai\n\n#AITrainer #AthletePerformance #ATHLYNX #SportsAI",
    link: "https://athlynx.ai",
  },
  {
    text: "🥇 NIL IS NOT A TREND — IT'S YOUR CAREER.\n\nATHLYNX's NIL Vault secures your deals, tracks your earnings, and grows your brand.\n\nProtect your NIL 👉 https://athlynx.ai/nil-vault\n\n#NILVault #AthleteMarketing #ATHLYNX #CollegiateAthletes",
    link: "https://athlynx.ai/nil-vault",
  },
  {
    text: "🏋️ ELITE ATHLETES USE ELITE TOOLS.\n\nATHLYNX's AI-powered platform gives you the same analytics edge that pro teams use — for free.\n\nJoin the elite 👉 https://athlynx.ai\n\n#EliteAthletes #SportsAI #ATHLYNX #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "📱 YOUR ENTIRE ATHLETIC CAREER IN ONE APP.\n\nStats. Recruiting. NIL deals. Scheduling. Community. All on ATHLYNX.\n\nDownload now 👉 https://athlynx.ai\n\n#ATHLYNX #AthleteApp #NIL #SportsAI",
    link: "https://athlynx.ai",
  },
  {
    text: "🤝 BRANDS WANT TO WORK WITH YOU.\n\nATHLYNX's AI matches athletes with brands based on sport, audience, and values — not just follower count.\n\nFind your brand deal 👉 https://athlynx.ai\n\n#NILDeals #BrandPartnerships #ATHLYNX #AthleteMarketing",
    link: "https://athlynx.ai",
  },
  {
    text: "🌟 CHAD DOZIER SR. — FOUNDER & CEO.\n\nBuilt ATHLYNX AI from the ground up to give every athlete — regardless of school size — a fair shot at NIL deals and recruiting exposure.\n\nJoin the mission 👉 https://athlynx.ai\n\n#ATHLYNX #Founder #SportsTech #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🏟️ PRO TEAMS — POWERED BY ATHLYNX.\n\nScout smarter. Recruit faster. Build your roster with AI-driven athlete intelligence.\n\nPro Teams platform 👉 https://athlynx.ai/pro-teams\n\n#ProTeams #SportsScouting #ATHLYNX #AIRecruiting",
    link: "https://athlynx.ai/pro-teams",
  },
  {
    text: "💼 DOZIER HOLDINGS GROUP — THE EMPIRE BEHIND ATHLYNX.\n\nDHG is the parent company powering AthlynX AI, Diamond Grind Baseball, Warriors Playbook, and ConCreator™.\n\nLearn more 👉 https://athlynx.ai/dhg\n\n#DozierHoldingsGroup #DHG #SportsTech #NIL",
    link: "https://athlynx.ai/dhg",
  },
  {
    text: "⚡ CONCREATOR™ — AI CREDITS FOR BUSINESS.\n\nB2B AI intelligence platform built by Dozier Holdings Group. Pulse, Insight, Command, and Enterprise tiers available.\n\nGet started 👉 https://athlynx.ai/softmor\n\n#ConCreator #B2BAI #DozierHoldingsGroup #AICredits",
    link: "https://athlynx.ai/softmor",
  },
  {
    text: "🙏 FAITH FUELS THE GRIND.\n\nATHLYNX's Faith section is for athletes who compete with purpose and train with conviction.\n\nIron Sharpens Iron — Proverbs 27:17\n\nhttps://athlynx.ai/faith\n\n#Faith #ATHLYNX #IronSharpensIron #AthleteLife",
    link: "https://athlynx.ai/faith",
  },
  {
    text: "📣 THE NIL PORTAL IS OPEN.\n\nATHLYNX's NIL Portal connects athletes directly to brand deals, sponsorships, and earning opportunities.\n\nClaim your NIL 👉 https://athlynx.ai/nil-portal\n\n#NILPortal #ATHLYNX #AthleteMarketing #GetPaid",
    link: "https://athlynx.ai/nil-portal",
  },
  {
    text: "🔄 TRANSFER PORTAL SEASON IS YEAR-ROUND.\n\nATHLYNX tracks every transfer, every opportunity, and every school that's looking for your position.\n\nExplore the portal 👉 https://athlynx.ai/transfer-portal\n\n#TransferPortal #CollegeRecruiting #ATHLYNX #NIL",
    link: "https://athlynx.ai/transfer-portal",
  },
  {
    text: "🎓 RECRUITING STARTS EARLIER THAN YOU THINK.\n\nATHLYNX helps student-athletes build their recruiting profile from day one — so coaches find them before the competition does.\n\nhttps://athlynx.ai\n\n#CollegeRecruiting #ATHLYNX #StudentAthlete #NIL",
    link: "https://athlynx.ai",
  },
  {
    text: "🛒 THE ATHLYNX STORE IS LIVE.\n\nGear up with official ATHLYNX merchandise — and rep the platform that's changing athlete careers.\n\nShop now 👉 https://athlynx.ai/store\n\n#ATHLYNXStore #AthleteGear #NIL #SportsMerch",
    link: "https://athlynx.ai/store",
  },
  {
    text: "📅 ELITE EVENTS — WHERE ATHLETES GET DISCOVERED.\n\nATHLYNX's Elite Events platform connects athletes to showcases, combines, and recruiting camps.\n\nFind your event 👉 https://athlynx.ai/elite-events\n\n#EliteEvents #AthleteShowcase #ATHLYNX #Recruiting",
    link: "https://athlynx.ai/elite-events",
  },
  {
    text: "🔥 X-FACTOR FEED — ATHLETE CULTURE LIVES HERE.\n\nThe ATHLYNX X-Factor Feed is where athletes share wins, highlight reels, and real talk about the grind.\n\nJoin the conversation 👉 https://athlynx.ai/x-factor\n\n#XFactor #ATHLYNX #AthleteLife #NIL",
    link: "https://athlynx.ai/x-factor",
  },
];

// ─────────────────────────────────────────────
// ROTATION LOGIC
// Each channel gets a unique post and a unique image per cron run.
// No two channels share the same post or image in the same run.
// Posts and images advance daily so the same combination never repeats on the same day.
// ─────────────────────────────────────────────

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function getHourSlot(): number {
  const hour = new Date().getUTCHours();
  if (hour < 14) return 0;   // 8am CST
  if (hour < 18) return 1;   // 12pm CST
  return 2;                   // 6pm CST
}

/**
 * Returns a unique post index for a given channel offset.
 * Each channel gets a different post. Posts advance each day and each hour slot.
 * Formula: (dayOfYear * numSlots * numChannels + hourSlot * numChannels + channelOffset) % librarySize
 */
function getPostIndex(channelOffset: number): number {
  const day = getDayOfYear();
  const slot = getHourSlot();
  const numChannels = TEXT_CHANNELS_ORDERED.length;
  const numSlots = 3;
  return (day * numSlots * numChannels + slot * numChannels + channelOffset) % POST_LIBRARY.length;
}

/**
 * Returns a unique image index for a given channel offset.
 * Images rotate independently from posts using a prime-offset stride to maximize variety.
 */
function getImageIndex(channelOffset: number): number {
  const day = getDayOfYear();
  const slot = getHourSlot();
  const numChannels = TEXT_CHANNELS_ORDERED.length;
  const numSlots = 3;
  // Use a different stride (prime number) so images don't align with post rotation
  const stride = 7;
  return (day * numSlots * numChannels * stride + slot * numChannels + channelOffset * stride) % IMAGE_LIBRARY.length;
}

// ─────────────────────────────────────────────
// BUFFER API
// ─────────────────────────────────────────────

async function postToBuffer(channelId: string, text: string, mediaUrl: string): Promise<void> {
  // Buffer GraphQL mutation — correct schema per Master Reference
  const mutation = `
    mutation CreatePost($channelId: String!, $text: String!) {
      createPost(input: {
        channelId: $channelId
        text: $text
        schedulingType: automatic
        mode: shareNow
      }) {
        __typename
      }
    }
  `;

  try {
    const response = await fetch("https://api.buffer.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BUFFER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation, variables: { channelId, text } }),
    });
    const result = await response.json() as any;
    const typename = result?.data?.createPost?.__typename;
    if (typename === "PostActionSuccess") {
      console.log(`[Buffer] ✅ ${channelId}: PostActionSuccess | Image: ${mediaUrl}`);
    } else {
      console.error(`[Buffer] ❌ ${channelId}:`, JSON.stringify(result?.errors || result?.data));
    }
  } catch (err) {
    console.error(`[Buffer] Error posting to channel ${channelId}:`, err);
  }
}

// ─────────────────────────────────────────────
// LINKEDIN VIA ZAPIER
// ─────────────────────────────────────────────

async function postToLinkedInViaZapier(text: string, imageUrl: string): Promise<void> {
  try {
    const response = await fetch("https://mcp.zapier.com/api/mcp/v1/execute", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ZAPIER_MCP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serverId: "3d496f1b-ba2b-49df-8c05-b69e4ed3ce10",
        toolName: "linkedin_create_share_update",
        params: {
          comment: text,
          visibility__code: "anyone",
          content__submitted_url: "https://athlynx.ai",
          content__title: "ATHLYNX AI — The Athlete's Playbook",
          content__submitted_image_url: imageUrl,
          instructions: `Post this to LinkedIn: ${text}`,
        },
      }),
    });
    const result = await response.json() as any;
    console.log("[Zapier/LinkedIn]:", JSON.stringify(result).slice(0, 200));
  } catch (err) {
    console.error("[Zapier/LinkedIn] Error:", err);
  }
}

// ─────────────────────────────────────────────
// MAIN CRON HANDLER
// ─────────────────────────────────────────────

export async function runSocialPostCron(): Promise<{ success: boolean; message: string }> {
  console.log("[SocialPostCron] Starting at", new Date().toISOString());
  console.log(`[SocialPostCron] Day: ${getDayOfYear()} | Slot: ${getHourSlot()}`);

  const posted: string[] = [];

  // Post to each Buffer channel with a UNIQUE post + UNIQUE image
  for (const channel of TEXT_CHANNELS_ORDERED) {
    const postIndex = getPostIndex(channel.offset);
    const imageIndex = getImageIndex(channel.offset);
    const post = POST_LIBRARY[postIndex];
    const image = IMAGE_LIBRARY[imageIndex];

    console.log(`[SocialPostCron] ${channel.name} → Post #${postIndex} | Image #${imageIndex}`);
    await postToBuffer(channel.id, post.text, image);
    posted.push(`${channel.name}: post#${postIndex} img#${imageIndex}`);
  }

  // LinkedIn gets its own unique post + image (offset = number of Buffer channels)
  const linkedInOffset = TEXT_CHANNELS_ORDERED.length;
  const linkedInPostIndex = getPostIndex(linkedInOffset);
  const linkedInImageIndex = getImageIndex(linkedInOffset);
  const linkedInPost = POST_LIBRARY[linkedInPostIndex];
  const linkedInImage = IMAGE_LIBRARY[linkedInImageIndex];

  console.log(`[SocialPostCron] LinkedIn → Post #${linkedInPostIndex} | Image #${linkedInImageIndex}`);
  await postToLinkedInViaZapier(linkedInPost.text, linkedInImage);
  posted.push(`LinkedIn: post#${linkedInPostIndex} img#${linkedInImageIndex}`);

  console.log("[SocialPostCron] Completed at", new Date().toISOString());
  console.log("[SocialPostCron] Summary:", posted.join(" | "));

  return {
    success: true,
    message: `Posted to ${posted.length} channels — all unique content. ${posted.join(" | ")}`,
  };
}
