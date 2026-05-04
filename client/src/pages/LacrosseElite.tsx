import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "lacrosse") ?? ALL_SPORTS[0];
export default function LacrosseElite() { return <SportXHub sport={sport} />; }
