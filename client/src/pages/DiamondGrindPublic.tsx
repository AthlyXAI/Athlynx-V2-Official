import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "baseball") ?? ALL_SPORTS[0];
function DiamondGrindPublicInner() { return <SportXHub sport={sport} />; }
export default function DiamondGrindPublic() {
  return <RouteErrorBoundary><DiamondGrindPublicInner /></RouteErrorBoundary>;
}
