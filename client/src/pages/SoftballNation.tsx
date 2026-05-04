import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "softball") ?? ALL_SPORTS[0];
export default function SoftballNation() { return <SportXHub sport={sport} />; }
