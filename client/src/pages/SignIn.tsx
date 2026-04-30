import { useState } from 'react'
import { useLocation } from 'wouter'
import { trpc } from '@/lib/trpc'
import {
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  signInWithTwitter,
  isFirebaseConfigured,
} from '@/lib/firebase'

export default function SignIn() {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const urlParams = new URLSearchParams(window.location.search)
  const existingAccount = urlParams.get('msg') === 'existing'

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => { window.location.href = '/portal' },
    onError: (err) => {
      setError(err.message || 'Invalid email or password')
      setLoading(false)
    },
  })

  const syncFirebaseMutation = trpc.auth.syncFirebaseUser.useMutation({
    onSuccess: () => { window.location.href = '/portal' },
    onError: (err) => {
      setError(err.message || 'Social sign-in failed. Please try again.')
      setSocialLoading(null)
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

  async function handleSocialSignIn(provider: 'google' | 'apple' | 'facebook' | 'twitter') {
    if (!isFirebaseConfigured) {
      setError('Social sign-in is temporarily unavailable. Please use email/password.')
      return
    }
    setError('')
    setSocialLoading(provider)
    try {
      let result: { idToken: string; user: any }
      if (provider === 'google') result = await signInWithGoogle()
      else if (provider === 'apple') result = await signInWithApple()
      else if (provider === 'facebook') result = await signInWithFacebook()
      else result = await signInWithTwitter()

      syncFirebaseMutation.mutate({
        idToken: result.idToken,
        name: result.user.displayName ?? '',
        email: result.user.email ?? '',
        picture: result.user.photoURL ?? undefined,
      })
    } catch (err: any) {
      const msg = err?.message ?? 'Sign-in failed'
      if (msg.includes('popup-closed') || msg.includes('cancelled') || msg.includes('popup_closed')) {
        setSocialLoading(null)
        return
      }
      setError(msg)
      setSocialLoading(null)
    }
  }

  const isBusy = loading || loginMutation.isPending || syncFirebaseMutation.isPending

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


      {existingAccount && (
        <div style={{
          width: '100%', maxWidth: '480px', marginBottom: '16px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,102,204,0.08))',
          border: '1px solid rgba(0,212,255,0.4)', borderRadius: '10px',
          padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>👋</span>
          <div>
            <p style={{ color: '#00d4ff', fontWeight: '700', fontSize: '14px', margin: '0 0 4px' }}>You already have an account!</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Sign in below with your email and password to access your portal.</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,200,255,0.2)',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 0 40px rgba(0,150,255,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(135deg, #00c8ff, #0066cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
            ATHLYNX AI
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Sign in to your account</p>
        </div>

        {/* Google */}
        <button onClick={() => handleSocialSignIn('google')} disabled={isBusy} style={{ width: '100%', padding: '13px', background: '#fff', border: 'none', borderRadius: '8px', color: '#333', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', opacity: (isBusy && socialLoading !== 'google') ? 0.5 : 1 }}>
          {socialLoading === 'google' ? <span>Signing in with Google...</span> : <>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </>}
        </button>

        {/* Apple */}
        <button onClick={() => handleSocialSignIn('apple')} disabled={isBusy} style={{ width: '100%', padding: '13px', background: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', opacity: (isBusy && socialLoading !== 'apple') ? 0.5 : 1 }}>
          {socialLoading === 'apple' ? <span>Signing in with Apple...</span> : <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Continue with Apple
          </>}
        </button>

        {/* Facebook */}
        <button onClick={() => handleSocialSignIn('facebook')} disabled={isBusy} style={{ width: '100%', padding: '13px', background: '#1877F2', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', opacity: (isBusy && socialLoading !== 'facebook') ? 0.5 : 1 }}>
          {socialLoading === 'facebook' ? <span>Signing in with Facebook...</span> : <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </>}
        </button>

        {/* X (Twitter) */}
        <button onClick={() => handleSocialSignIn('twitter')} disabled={isBusy} style={{ width: '100%', padding: '13px', background: '#141414', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px', opacity: (isBusy && socialLoading !== 'twitter') ? 0.5 : 1 }}>
          {socialLoading === 'twitter' ? <span>Signing in with X...</span> : <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Continue with X
          </>}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: '#64748b', fontSize: '13px', padding: '0 12px' }}>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Email Address</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,200,255,0.25)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,200,255,0.25)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span onClick={() => setLocation('/forgot-password')} style={{ color: '#00c8ff', cursor: 'pointer', fontSize: '13px' }}>Forgot password?</span>
          </div>
          <button type="submit" disabled={isBusy} style={{ width: '100%', padding: '13px', background: isBusy ? 'rgba(0,102,204,0.5)' : 'linear-gradient(135deg, #0066cc, #00c8ff)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: isBusy ? 'not-allowed' : 'pointer', marginBottom: '16px', letterSpacing: '0.5px' }}>
            {(loading || loginMutation.isPending) ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
          Don't have an account?{' '}
          <span onClick={() => setLocation('/signup')} style={{ color: '#00c8ff', cursor: 'pointer', fontWeight: '600' }}>Sign Up Free</span>
        </p>
      </div>
    </div>
  )
}
