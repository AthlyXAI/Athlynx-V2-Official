import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "football") ?? ALL_SPORTS[0];
export default function GridironNexus() { return <SportXHub sport={sport} />; }
