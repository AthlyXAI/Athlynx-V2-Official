import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a1628",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        background: "#0f2040",
        border: "1px solid #1e3a5f",
        borderRadius: 16,
        padding: 40,
        width: "100%",
        maxWidth: 420
      }}>
        <h1 style={{ color: "#00d4ff", textAlign: "center", marginBottom: 8 }}>
          ATHLYNX
        </h1>
        <p style={{ color: "#8899aa", textAlign: "center", marginBottom: 32 }}>
          Sign in to your account
        </p>

        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#0a1628",
                border: "1px solid #1e3a5f",
                borderRadius: 8,
                color: "#fff",
                fontSize: 16,
                boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#0a1628",
                border: "1px solid #1e3a5f",
                borderRadius: 8,
                color: "#fff",
                fontSize: 16,
                boxSizing: "border-box"
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#ff4444", marginBottom: 16, textAlign: "center" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#1e3a5f" : "#00d4ff",
              color: loading ? "#8899aa" : "#000",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ color: "#8899aa", textAlign: "center", marginTop: 24 }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#00d4ff" }}>Sign up free</a>
        </p>
      </div>
    </div>
  );
}
