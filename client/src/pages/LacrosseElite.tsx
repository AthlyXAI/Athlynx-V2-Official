import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "lacrosse")!;
export default function LacrosseElite() { return <SportXHub sport={sport} />; }
