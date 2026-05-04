import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cricket") ?? ALL_SPORTS[0];
export default function CricketElite() { return <SportXHub sport={sport} />; }
