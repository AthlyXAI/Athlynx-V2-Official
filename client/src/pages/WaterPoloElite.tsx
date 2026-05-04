import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "water-polo") ?? ALL_SPORTS[0];
export default function WaterPoloElite() { return <SportXHub sport={sport} />; }
