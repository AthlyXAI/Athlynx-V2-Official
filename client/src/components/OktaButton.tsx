/**
 * ATHLYNX — Sign In Button (replaces OktaButton)
 * Redirects to /signin page where Firebase Auth handles Google/Apple/Facebook/Email.
 */
interface OktaButtonProps {
  label?: string;
  className?: string;
  returnTo?: string;
  screenHint?: "signup" | "login";
}

export default function OktaButton({
  label = "Sign In",
  className,
  returnTo = "/feed",
}: OktaButtonProps) {
  const handleClick = () => {
    sessionStorage.setItem("auth_return_to", returnTo);
    window.location.href = "/signin";
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        "w-full flex items-center justify-center gap-3 bg-[#00c2ff] hover:bg-[#00a8e0] text-white font-bold text-base py-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      }
    >
      {label}
    </button>
  );
}
