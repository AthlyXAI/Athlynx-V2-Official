import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "football")!;
export default function GridironNexus() { return <SportXHub sport={sport} />; }
