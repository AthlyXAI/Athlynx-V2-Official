import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { handleRedirectResult } from '@/lib/firebase'
import { trpc } from '@/lib/trpc'

/**
 * ATHLYNXAI — Auth Callback Handler
 * Handles both:
 * 1. Firebase redirect result (mobile iOS/Android after Google/social sign-in)
 * 2. Server OAuth callback (desktop)
 */
export default function AuthCallback() {
  const [, setLocation] = useLocation()
  const [status, setStatus] = useState('Signing you in...')

  const syncFirebaseMutation = trpc.auth.syncFirebaseUser.useMutation({
    onSuccess: () => {
      setStatus('Success! Taking you to your portal...')
      setTimeout(() => { window.location.href = '/portal' }, 500)
    },
    onError: (err) => {
      setStatus('Sign-in failed: ' + (err.message || 'Unknown error'))
      setTimeout(() => { setLocation('/signin') }, 2000)
    },
  })

  useEffect(() => {
    async function handleCallback() {
      try {
        // Try to get Firebase redirect result (mobile flow)
        const result = await handleRedirectResult()
        if (result) {
          setStatus('Completing sign-in...')
          syncFirebaseMutation.mutate({
            idToken: result.idToken,
            name: result.user.displayName ?? '',
            email: result.user.email ?? '',
            picture: result.user.photoURL ?? undefined,
          })
          return
        }
        // No redirect result — server OAuth already set cookie, go to portal
        setLocation('/portal')
      } catch (err: any) {
        if (err?.message?.includes('Redirecting')) return
        setStatus('Sign-in error. Redirecting...')
        setTimeout(() => { setLocation('/signin') }, 2000)
      }
    }
    handleCallback()
  }, [])

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
          width: '56px', height: '56px',
          border: '3px solid #00c2ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', margin: '0 0 8px' }}>
          {status}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
          Setting up your AthlynXAI account
        </p>
      </div>
    </div>
  )
}
