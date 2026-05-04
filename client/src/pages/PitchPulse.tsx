import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "soccer")!;
export default function PitchPulse() { return <SportXHub sport={sport} />; }
