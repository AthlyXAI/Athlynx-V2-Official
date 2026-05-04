import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rugby")!;
export default function RugbyElite() { return <SportXHub sport={sport} />; }
