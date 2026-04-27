// Legacy component — redirects to the new sign-in page
import { useLocation } from "wouter";
export default function OktaButton() {
  const [, setLocation] = useLocation();
  return (
    <button
      onClick={() => setLocation("/signin")}
      className="text-sm text-cyan-400 hover:underline"
    >
      Sign In
    </button>
  );
}
