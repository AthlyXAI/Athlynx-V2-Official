import { useEffect } from 'react'
import { useLocation } from 'wouter'

/**
 * ATHLYNX — Auth Callback Handler
 * After Google OAuth redirects back via server, the session cookie is already set.
 * Just redirect to portal.
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Server has already set the session cookie via /api/auth/google/callback
    // Just redirect to portal
    setLocation('/portal')
  }, [setLocation])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          border: '3px solid #00c2ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', margin: '0 0 8px' }}>
          Signing you in...
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
          Setting up your ATHLYNX account
        </p>
      </div>
    </div>
  )
}
