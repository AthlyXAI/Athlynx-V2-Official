import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "rowing") ?? ALL_SPORTS[0];
export default function RowingElite() { return <SportXHub sport={sport} />; }
