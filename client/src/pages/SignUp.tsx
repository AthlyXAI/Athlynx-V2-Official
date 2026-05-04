import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
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

function SignUpInner() {
  const [, setLocation] = useLocation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sport, setSport] = useState('')
  const [school, setSchool] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const savePhoneMutation = trpc.auth.savePhone.useMutation()

  const syncFirebaseMutation = trpc.auth.syncFirebaseUser.useMutation({
    onSuccess: () => { window.location.href = '/onboarding' },
    onError: (err) => { setError(err.message || 'Sign-up failed.'); setSocialLoading(null) },
  })

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => { window.location.href = '/portal' },
    onError: () => {
      window.location.href = '/signin?msg=existing&email=' + encodeURIComponent(email.trim())
      setLoading(false)
    },
  })

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      if (phone.trim()) savePhoneMutation.mutate({ phone: phone.trim() })
      window.location.href = '/onboarding'
    },
    onError: (err) => {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already exists')) {
        loginMutation.mutate({ email: email.trim(), password: password.trim() })
      } else {
        setError(msg || 'Registration failed. Please try again.')
        setLoading(false)
      }
    },
  })

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Full name, email, and password are required.')
      return
    }
    if (password.trim() !== confirmPassword.trim()) {
      setError('Passwords do not match.')
      return
    }
    if (password.trim().length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')
    registerMutation.mutate({
      name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    })
  }

  async function handleSocialSignIn(provider: 'google' | 'apple' | 'facebook' | 'twitter') {
    if (!isFirebaseConfigured) {
      setError('Social sign-up is temporarily unavailable. Please use email/password.')
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
      const msg = err?.message ?? 'Sign-up failed'
      if (msg.includes('popup-closed') || msg.includes('cancelled') || msg.includes('popup_closed')) {
        setSocialLoading(null)
        return
      }
      setError(msg)
      setSocialLoading(null)
    }
  }

  const isBusy = loading || registerMutation.isPending || syncFirebaseMutation.isPending || loginMutation.isPending

  const SPORTS = [
    'Football', 'Basketball', 'Baseball', 'Soccer', 'Track & Field',
    'Swimming', 'Wrestling', 'Tennis', 'Volleyball', 'Hockey',
    'Softball', 'Golf', 'Lacrosse', 'Gymnastics', 'Cross Country',
    'Rowing', 'Water Polo', 'Field Hockey', 'Cheerleading',
    'Rugby', 'Cricket', 'Cycling', 'Triathlon', 'Fencing',
    'Archery', 'Equestrian', 'Skiing', 'Snowboarding', 'Surfing',
    'Skateboarding', 'Boxing', 'MMA', 'Judo', 'Karate',
    'Taekwondo', 'Badminton', 'Table Tennis', 'Squash', 'Handball',
    'Water Skiing', 'Diving', 'Synchronized Swimming', 'Polo', 'Other',
  ]

  const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Professional', 'Coach', 'Parent', 'Agent', 'Other']

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(10,22,40,0.9)',
    border: '1px solid rgba(0,200,255,0.2)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    textTransform: 'uppercase',
  }

  // ── Sign In Banner (reused at top and bottom) ─────────────────────────────
  const SignInBanner = () => (
    <div
      onClick={() => setLocation('/signin')}
      style={{
        background: 'rgba(0,194,255,0.07)',
        border: '1px solid rgba(0,194,255,0.3)',
        borderRadius: '10px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: '18px' }}>👋</span>
      <span style={{ color: '#94a3b8', fontSize: '14px' }}>Already a member?</span>
      <span style={{ color: '#00c8ff', fontWeight: '800', fontSize: '15px', textDecoration: 'underline' }}>
        Sign In →
      </span>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'system-ui, sans-serif',
      padding: '32px 20px 48px',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            fontSize: '34px', fontWeight: '900',
            background: 'linear-gradient(135deg, #00c8ff, #0066cc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '6px', letterSpacing: '2px',
          }}>
            ATHLYNX AI
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 4px' }}>
            The Athlete's Playbook — Join Free
          </p>
          <p style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '700', margin: 0 }}>
            🏆 7-Day Free Trial — No charge until Day 8
          </p>
        </div>

        {/* ── TOP Sign In Banner ── */}
        <div style={{ marginBottom: '24px' }}>
          <SignInBanner />
        </div>

        {/* ── Main Card ── */}
        <div style={{
          background: 'rgba(13,27,62,0.95)',
          border: '1px solid rgba(0,200,255,0.2)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 0 40px rgba(0,150,255,0.1)',
        }}>

          {/* Social Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={isBusy}
              style={{ width: '100%', padding: '13px', background: '#fff', border: 'none', borderRadius: '8px', color: '#333', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: (isBusy && socialLoading !== 'google') ? 0.5 : 1 }}
            >
              {socialLoading === 'google' ? 'Signing up with Google...' : <>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign Up with Google
              </>}
            </button>

            <button
              onClick={() => handleSocialSignIn('apple')}
              disabled={isBusy}
              style={{ width: '100%', padding: '13px', background: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: (isBusy && socialLoading !== 'apple') ? 0.5 : 1 }}
            >
              {socialLoading === 'apple' ? 'Signing up with Apple...' : <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Sign Up with Apple
              </>}
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleSocialSignIn('facebook')}
                disabled={isBusy}
                style={{ flex: 1, padding: '12px', background: '#1877F2', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (isBusy && socialLoading !== 'facebook') ? 0.5 : 1 }}
              >
                {socialLoading === 'facebook' ? '...' : <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </>}
              </button>
              <button
                onClick={() => handleSocialSignIn('twitter')}
                disabled={isBusy}
                style={{ flex: 1, padding: '12px', background: '#141414', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: isBusy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (isBusy && socialLoading !== 'twitter') ? 0.5 : 1 }}
              >
                {socialLoading === 'twitter' ? '...' : <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X (Twitter)
                </>}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#64748b', fontSize: '13px', padding: '0 14px' }}>or create account with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp}>
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="First Last"
                style={inputStyle}
                required
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                required
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Phone Number <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(optional — for SMS alerts)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={inputStyle}
              />
            </div>

            {/* Sport + Year row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Sport</label>
                <select
                  value={sport}
                  onChange={e => setSport(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="">Select sport</option>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Year / Role</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* School */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>School / Team</label>
              <input
                type="text"
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="University, High School, or Club"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password * <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(min 8 characters)</span></label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                required
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                required
              />
            </div>

            {/* Trial notice */}
            <div style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>🏆</span>
              <p style={{ color: '#f59e0b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                <strong>7-Day Free Trial</strong> — Full access to every feature. No charge until Day 8. Cancel anytime.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy}
              style={{
                width: '100%',
                padding: '15px',
                background: isBusy ? 'rgba(0,102,204,0.5)' : 'linear-gradient(135deg, #0066cc, #00c8ff)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '800',
                cursor: isBusy ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}
            >
              {(loading || registerMutation.isPending) ? 'Creating Account...' : 'CREATE MY FREE ACCOUNT →'}
            </button>

            <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', margin: '8px 0 0', lineHeight: '1.5' }}>
              By signing up you agree to our{' '}
              <span onClick={() => setLocation('/terms-of-service')} style={{ color: '#00c8ff', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span onClick={() => setLocation('/privacy-policy')} style={{ color: '#00c8ff', cursor: 'pointer' }}>Privacy Policy</span>.
            </p>
          </form>
        </div>

        {/* ── BOTTOM Sign In Banner ── */}
        <div style={{ marginTop: '24px' }}>
          <SignInBanner />
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '20px' }}>
          ATHLYNX AI · A Dozier Holdings Group Company · athlynx.ai
        </p>
        <p style={{ textAlign: 'center', color: '#1e3a5f', fontSize: '11px', margin: '4px 0 0' }}>
          Iron Sharpens Iron — Proverbs 27:17
        </p>

      </div>
    </div>
  )
}

export default function SignUp() {
  return <RouteErrorBoundary><SignUpInner /></RouteErrorBoundary>;
}
