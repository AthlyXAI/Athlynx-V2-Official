import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setLocation('/signin')
      } else {
        setLocation('/')
      }
    })
  }, [setLocation])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <p style={{ color: '#fff', fontSize: '1rem' }}>Completing sign in…</p>
    </div>
  )
}
