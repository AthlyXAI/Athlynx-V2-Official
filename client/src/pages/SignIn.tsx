import { useEffect } from "react";
import { getLoginUrl } from "@/const";

/**
 * SignIn page — redirects to the OAuth portal.
 * The OAuth portal handles Google login and all auth methods,
 * then redirects back to /api/oauth/callback which sets the session cookie.
 */
export default function SignIn() {
  useEffect(() => {
    window.location.href = getLoginUrl();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #0a1628 100%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "900",
            letterSpacing: "4px",
            background: "linear-gradient(135deg, #00d4ff, #0080ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ATHLYNX
        </div>
        <div style={{ fontSize: "12px", letterSpacing: "6px", color: "#4a9eff", marginTop: "4px" }}>
          ATHLETE INTELLIGENCE PLATFORM
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(0,212,255,0.2)",
            borderTop: "3px solid #00d4ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#8ab4d4", fontSize: "14px" }}>Redirecting to sign in…</p>
      </div>

      <a
        href={getLoginUrl()}
        style={{
          marginTop: "24px",
          color: "#00d4ff",
          fontSize: "13px",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Click here if you are not redirected
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` }} />
    </div>
  );
}
