import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cross-country")!;
export default function CrossCountryElite() { return <SportXHub sport={sport} />; }
