import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { trpc } from '@/lib/trpc';

/**
 * ATHLYNX — Auth0 Callback Handler
 * After Auth0 redirects back, this page:
 * 1. Waits for Auth0 to finish processing the token
 * 2. Syncs the Auth0 user to our local DB (creates account if new)
 * 3. Fires welcome email + SMS for new users
 * 4. Redirects to the platform
 */
export default function AuthCallback() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const syncAuth0User = trpc.auth.syncAuth0User.useMutation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      window.location.href = '/signin';
      return;
    }

    const doSync = async () => {
      try {
        const token = await getAccessTokenSilently();
        await syncAuth0User.mutateAsync({
          token,
          name: user.name || user.nickname || user.email?.split('@')[0] || 'Athlete',
          email: user.email || '',
          picture: user.picture || undefined,
          sub: user.sub || '',
          phone: (user as any).phone_number || undefined,
        });
        window.location.href = '/portal';
      } catch (err) {
        console.error('[AuthCallback] Sync failed:', err);
        window.location.href = '/';
      }
    };

    doSync();
  }, [isAuthenticated, isLoading, user]);

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
  );
}
