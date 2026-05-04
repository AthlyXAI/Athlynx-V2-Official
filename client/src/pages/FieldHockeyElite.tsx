import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "field-hockey")!;
export default function FieldHockeyElite() { return <SportXHub sport={sport} />; }
