import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "swimming")!;
export default function SwimSurge() { return <SportXHub sport={sport} />; }
