import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "softball")!;
export default function SoftballNation() { return <SportXHub sport={sport} />; }
