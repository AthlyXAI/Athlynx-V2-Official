import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import SportXHub, { ALL_SPORTS } from "@/components/SportXHub";
const sport = ALL_SPORTS.find(s => s.id === "cheer") ?? ALL_SPORTS[0];
function CheerEliteInner() { return <SportXHub sport={sport} />; }
export default function CheerElite() {
  return <RouteErrorBoundary><CheerEliteInner /></RouteErrorBoundary>;
}
