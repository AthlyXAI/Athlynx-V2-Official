import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '@/lib/supabase'

/**
 * ATHLYNX — Supabase Auth Callback Handler
 * After Supabase OAuth redirects back, this page:
 * 1. Waits for Supabase to finish processing the token from the URL
 * 2. Redirects to the portal on success
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Supabase automatically reads the token from the URL hash/params
    // We just need to wait for the session to be established
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setLocation('/portal')
      } else {
        // Wait a moment for Supabase to process the OAuth callback
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            setLocation('/portal')
          } else {
            setLocation('/signin')
          }
        }, 2000)
      }
    }

    checkSession()
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
