import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cross-country") ?? ALL_SPORTS[0];
export default function CrossCountryElite() { return <SportXHub sport={sport} />; }
