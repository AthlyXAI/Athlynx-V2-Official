import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cricket") ?? ALL_SPORTS[0];
function CricketEliteInner() { return <SportXHub sport={sport} />; }
export default function CricketElite() {
  return <RouteErrorBoundary><CricketEliteInner /></RouteErrorBoundary>;
}
