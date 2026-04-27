import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  signInWithTwitter,
} from "@/lib/firebase";

export default function SignIn() {
  const [error, setError] = useState("");
  const syncMutation = trpc.auth.syncFirebaseUser.useMutation();

  const handleSocial = async (provider: () => Promise<any>) => {
    try {
      setError("");
      const result = await provider();
      const token = await result.user.getIdToken();
      await syncMutation.mutateAsync({ idToken: token });
      window.location.href = "/dashboard";
    } catch (e: any) {
      setError(e.message || "Sign in failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "#0f2040",
        border: "1px solid #1e3a5f",
        borderRadius: 16,
        padding: 40,
        width: "100%",
        maxWidth: 420
      }}>
        <h1 style={{ color: "#00d4ff", textAlign: "center", marginBottom: 8, fontSize: 24 }}>
          ATHLYNX
        </h1>
        <p style={{ color: "#8899aa", textAlign: "center", marginBottom: 32 }}>
          Sign up or sign in to get started
        </p>

        <button onClick={() => handleSocial(signInWithGoogle)} style={{
          width: "100%", padding: "14px", marginBottom: 12,
          background: "#fff", color: "#000", border: "none",
          borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10
        }}>
          <img src="https://www.google.com/favicon.ico" width={20} height={20} />
          Continue with Google
        </button>

        <button onClick={() => handleSocial(signInWithApple)} style={{
          width: "100%", padding: "14px", marginBottom: 12,
          background: "#000", color: "#fff", border: "1px solid #333",
          borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer"
        }}>
          🍎 Continue with Apple
        </button>

        <button onClick={() => handleSocial(signInWithFacebook)} style={{
          width: "100%", padding: "14px", marginBottom: 12,
          background: "#1877f2", color: "#fff", border: "none",
          borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer"
        }}>
          f &nbsp; Continue with Facebook
        </button>

        <button onClick={() => handleSocial(signInWithTwitter)} style={{
          width: "100%", padding: "14px", marginBottom: 24,
          background: "#000", color: "#fff", border: "1px solid #333",
          borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer"
        }}>
          𝕏 &nbsp; Continue with X
        </button>

        {error && (
          <p style={{ color: "#ff4444", textAlign: "center", marginBottom: 16 }}>{error}</p>
        )}

        <p style={{ color: "#8899aa", textAlign: "center", fontSize: 12 }}>
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
