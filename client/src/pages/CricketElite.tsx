import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cricket")!;
export default function CricketElite() { return <SportXHub sport={sport} />; }
