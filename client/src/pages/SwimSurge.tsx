import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "swimming") ?? ALL_SPORTS[0];
export default function SwimSurge() { return <SportXHub sport={sport} />; }
