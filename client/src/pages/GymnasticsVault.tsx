import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "gymnastics") ?? ALL_SPORTS[0];
export default function GymnasticsVault() { return <SportXHub sport={sport} />; }
