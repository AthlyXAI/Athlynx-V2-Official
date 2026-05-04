import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "basketball") ?? ALL_SPORTS[0];
export default function CourtKings() { return <SportXHub sport={sport} />; }
