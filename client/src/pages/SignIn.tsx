import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = trpc.auth.signIn.useMutation({
    onSuccess: () => { window.location.href = "/dashboard"; },
    onError: (e) => { setError(e.message); setLoading(false); },
  });

  const signUp = trpc.auth.signUp.useMutation({
    onSuccess: () => { window.location.href = "/dashboard"; },
    onError: (e) => { setError(e.message); setLoading(false); },
  });

  return (
    <div style={{ minHeight:"100vh", background:"#0a1628", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter,sans-serif", padding:"20px" }}>
      <div style={{ background:"#0f1f3d", borderRadius:"16px", padding:"40px", width:"100%", maxWidth:"400px" }}>
        <h1 style={{ color:"#00d4ff", fontSize:"28px", fontWeight:"800", textAlign:"center", marginBottom:"8px" }}>ATHLYNX</h1>
        <p style={{ color:"#8899aa", textAlign:"center", marginBottom:"32px" }}>Sign up or sign in to get started</p>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          style={{ width:"100%", background:"#1a2d4d", color:"white", border:"1px solid #2a3d5d", borderRadius:"8px", padding:"12px", marginBottom:"12px", fontSize:"16px", boxSizing:"border-box" }} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
          style={{ width:"100%", background:"#1a2d4d", color:"white", border:"1px solid #2a3d5d", borderRadius:"8px", padding:"12px", marginBottom:"16px", fontSize:"16px", boxSizing:"border-box" }} />
        {error && <p style={{ color:"#ff4444", textAlign:"center", marginBottom:"12px" }}>{error}</p>}
        <button onClick={()=>{ setLoading(true); setError(""); signIn.mutate({ email, password }); }} disabled={loading}
          style={{ width:"100%", background:"#00d4ff", color:"#0a1628", fontWeight:"700", padding:"14px", borderRadius:"8px", border:"none", cursor:"pointer", marginBottom:"12px", fontSize:"16px" }}>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <button onClick={()=>{ setLoading(true); setError(""); signUp.mutate({ email, password }); }} disabled={loading}
          style={{ width:"100%", background:"transparent", color:"#00d4ff", fontWeight:"700", padding:"14px", borderRadius:"8px", border:"2px solid #00d4ff", cursor:"pointer", fontSize:"16px" }}>
          Create Account
        </button>
      </div>
    </div>
  );
}
