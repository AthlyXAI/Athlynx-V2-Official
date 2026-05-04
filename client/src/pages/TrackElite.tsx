import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "track") ?? ALL_SPORTS[0];
export default function TrackElite() { return <SportXHub sport={sport} />; }
