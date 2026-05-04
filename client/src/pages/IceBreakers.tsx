import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "hockey") ?? ALL_SPORTS[0];
export default function IceBreakers() { return <SportXHub sport={sport} />; }
