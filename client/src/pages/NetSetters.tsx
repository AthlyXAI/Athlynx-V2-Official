import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "volleyball") ?? ALL_SPORTS[0];
export default function NetSetters() { return <SportXHub sport={sport} />; }
