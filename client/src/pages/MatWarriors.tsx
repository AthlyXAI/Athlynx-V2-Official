import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "wrestling") ?? ALL_SPORTS[0];
export default function MatWarriors() { return <SportXHub sport={sport} />; }
