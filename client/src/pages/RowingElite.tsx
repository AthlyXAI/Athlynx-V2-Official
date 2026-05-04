import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rowing")!;
export default function RowingElite() { return <SportXHub sport={sport} />; }
