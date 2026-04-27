import { useState } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setLocation('/')
    }
  }

  async function handleSignUp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setLocation('/')
    }
  }

  async function handleGoogleOAuth() {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://athlynx.ai/auth/callback' },
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <div style={{ background: '#1a1a1a', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
        <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', textAlign: 'center' }}>Athlynx</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>Sign in to your account</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#ccc', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Email</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#ccc', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleSignIn}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: 'pointer', marginBottom: '0.75rem' }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: '0.95rem', border: 'none', cursor: 'pointer', marginBottom: '1.25rem' }}
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#333' }} />
          <span style={{ color: '#555', fontSize: '0.8rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#333' }} />
        </div>

        <button
          onClick={handleGoogleOAuth}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#fff', color: '#111', fontWeight: 600, fontSize: '0.95rem', border: '1px solid #ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
