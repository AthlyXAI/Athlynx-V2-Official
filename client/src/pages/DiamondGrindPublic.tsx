import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "baseball") ?? ALL_SPORTS[0];
export default function DiamondGrindPublic() { return <SportXHub sport={sport} />; }
