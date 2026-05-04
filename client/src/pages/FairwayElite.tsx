import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "golf")!;
export default function FairwayElite() { return <SportXHub sport={sport} />; }
