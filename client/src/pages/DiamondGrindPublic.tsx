import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "baseball")!;
export default function DiamondGrindPublic() { return <SportXHub sport={sport} />; }
