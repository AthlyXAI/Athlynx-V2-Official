import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cheer") ?? ALL_SPORTS[0];
export default function CheerElite() { return <SportXHub sport={sport} />; }
