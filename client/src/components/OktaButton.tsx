// Universal Okta auth button — used everywhere on the platform
// One button. One process. Click → Okta → Platform.
import { useAuth0 } from "@auth0/auth0-react";

interface OktaButtonProps {
  label?: string;
  className?: string;
  returnTo?: string;
  screenHint?: "signup" | "login";
}

export default function OktaButton({
  label = "Sign In with Okta",
  className,
  returnTo = "/feed",
  screenHint = "login",
}: OktaButtonProps) {
  const { loginWithRedirect } = useAuth0();

  const handleClick = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo },
        authorizationParams: {
          screen_hint: screenHint,
        },
      });
    } catch (error) {
      console.error("Okta login error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        "w-full flex items-center justify-center gap-3 bg-[#007DC1] hover:bg-[#006aaa] text-white font-bold text-base py-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      }
    >
      <img
        src="https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.svg"
        alt="Okta"
        className="w-5 h-5"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      {label}
    </button>
  );
}
