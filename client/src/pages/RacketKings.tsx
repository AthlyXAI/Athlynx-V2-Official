import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "tennis") ?? ALL_SPORTS[0];
export default function RacketKings() { return <SportXHub sport={sport} />; }
