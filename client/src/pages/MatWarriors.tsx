import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "wrestling")!;
export default function MatWarriors() { return <SportXHub sport={sport} />; }
