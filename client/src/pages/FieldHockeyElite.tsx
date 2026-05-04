import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "field-hockey") ?? ALL_SPORTS[0];
export default function FieldHockeyElite() { return <SportXHub sport={sport} />; }
