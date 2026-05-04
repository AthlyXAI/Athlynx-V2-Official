import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "tennis")!;
export default function RacketKings() { return <SportXHub sport={sport} />; }
