import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rugby") ?? ALL_SPORTS[0];
export default function RugbyElite() { return <SportXHub sport={sport} />; }
