import { useState } from 'react'
import { useLocation } from 'wouter'
import { trpc } from '@/lib/trpc'

export default function SignIn() {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      window.location.href = '/portal'
    },
    onError: (err) => {
      setError(err.message || 'Invalid email or password')
      setLoading(false)
    },
  })

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    loginMutation.mutate({ email: email.trim(), password: password.trim() })
  }

  async function handleGoogleSignIn() {
    setError('')
    window.location.href = '/api/auth/google'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
    }}>

      {/* ── MAINTENANCE BANNER ── */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        marginBottom: '16px',
        background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
        border: '1px solid rgba(251,191,36,0.5)',
        borderRadius: '10px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        <span style={{ fontSize: '20px', marginTop: '1px' }}>&#128295;</span>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(251,191,36,0.95)',
              color: '#000',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '20px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}>Platform Update In Progress</span>
            <span style={{
              background: 'rgba(34,197,94,0.2)',
              border: '1px solid rgba(34,197,94,0.5)',
              color: '#86efac',
              fontSize: '10px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '20px',
            }}>Live</span>
          </div>
          <p style={{ color: '#fde68a', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
            We are actively upgrading our systems for an even better experience.
            If you experience any login issues, our team is on it and will have
            everything fully restored shortly.
          </p>
          <p style={{ color: '#fbbf24', fontSize: '12px', margin: '8px 0 0', fontWeight: '600' }}>
            Need help? Contact us: cdozier@dozierholdingsgroup.com
          </p>
        </div>
      </div>

      {/* ── LOGIN CARD ── */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(0,200,255,0.2)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 0 40px rgba(0,150,255,0.1)',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #00c8ff, #0066cc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>
            ATHLYNX AI
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%', padding: '13px',
            background: '#fff', border: 'none', borderRadius: '8px',
            color: '#333', fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px', marginBottom: '20px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: '#64748b', fontSize: '13px', padding: '0 12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            color: '#fca5a5', fontSize: '14px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || loginMutation.isPending}
            style={{
              width: '100%', padding: '13px',
              background: (loading || loginMutation.isPending) ? 'rgba(0,102,204,0.5)' : 'linear-gradient(135deg, #0066cc, #00c8ff)',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '700',
              cursor: (loading || loginMutation.isPending) ? 'not-allowed' : 'pointer',
              marginBottom: '16px', letterSpacing: '0.5px',
            }}
          >
            {(loading || loginMutation.isPending) ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
          Don't have an account?{' '}
          <span
            onClick={() => setLocation('/signup')}
            style={{ color: '#00c8ff', cursor: 'pointer', fontWeight: '600' }}
          >
            Sign Up Free
          </span>
        </p>
      </div>
    </div>
  )
}
