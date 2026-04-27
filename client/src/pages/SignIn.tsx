import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Use the correct procedure names that match the server router (login / register)
  const login = trpc.auth.login.useMutation({
    onSuccess: () => { window.location.href = "/dashboard"; },
    onError: (e) => { setError(e.message); setLoading(false); },
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: () => { window.location.href = "/dashboard"; },
    onError: (e) => { setError(e.message); setLoading(false); },
  });

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    if (mode === "signin") {
      login.mutate({ email: email.trim(), password });
    } else {
      if (!name.trim()) {
        setError("Name is required to create an account.");
        setLoading(false);
        return;
      }
      register.mutate({ email: email.trim(), password, name: name.trim() });
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#1a2d4d",
    color: "white",
    border: "1px solid #2a3d5d",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    fontSize: "16px",
    boxSizing: "border-box" as const,
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", padding: "20px" }}>
      <div style={{ background: "#0f1f3d", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px" }}>
        <h1 style={{ color: "#00d4ff", fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "8px" }}>ATHLYNX</h1>
        <p style={{ color: "#8899aa", textAlign: "center", marginBottom: "28px" }}>
          {mode === "signin" ? "Sign in to your account" : "Create your account"}
        </p>

        <div style={{ display: "flex", marginBottom: "24px", borderRadius: "8px", overflow: "hidden", border: "1px solid #2a3d5d" }}>
          <button onClick={() => { setMode("signin"); setError(""); }}
            style={{ flex: 1, padding: "10px", background: mode === "signin" ? "#00d4ff" : "transparent", color: mode === "signin" ? "#0a1628" : "#8899aa", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "14px" }}>
            Sign In
          </button>
          <button onClick={() => { setMode("signup"); setError(""); }}
            style={{ flex: 1, padding: "10px", background: mode === "signup" ? "#00d4ff" : "transparent", color: mode === "signup" ? "#0a1628" : "#8899aa", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "14px" }}>
            Create Account
          </button>
        </div>

        {mode === "signup" && (
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        )}

        {/* type="text" prevents browser-native email pattern validation that caused "string did not match expected pattern" */}
        <input type="text" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          style={{ ...inputStyle, marginBottom: "16px" }}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} />

        {error && <p style={{ color: "#ff4444", textAlign: "center", marginBottom: "12px", fontSize: "14px" }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: loading ? "#0099bb" : "#00d4ff", color: "#0a1628", fontWeight: "700", padding: "14px", borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", marginBottom: "12px" }}>
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        {mode === "signin" && (
          <p style={{ textAlign: "center", marginTop: "8px" }}>
            <a href="/forgot-password" style={{ color: "#8899aa", fontSize: "13px", textDecoration: "none" }}>Forgot password?</a>
          </p>
        )}
      </div>
    </div>
  );
}
