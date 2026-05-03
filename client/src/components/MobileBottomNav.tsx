/**
 * MobileBottomNav — Reusable mobile bottom navigation bar
 * Use on any page that does NOT use PlatformLayout (which has its own built-in bottom nav)
 * Shows 5 icons: Home, NIL, Chat, Transfer, Profile/Sign In
 */
import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'

export default function MobileBottomNav() {
  const [location] = useLocation()
  const { user } = useAuth()

  const navItems = [
    {
      href: '/feed',
      label: 'Home',
      icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    },
    {
      href: '/reels',
      label: 'Reels',
      icon: 'M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    },
    {
      href: '/messenger',
      label: 'Chat',
      icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
    },
    {
      href: '/nil-portal',
      label: 'NIL',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
    },
    {
      href: user ? '/profile' : '/signin',
      label: user ? 'Profile' : 'Sign In',
      icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    },
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: '#0d1b3e',
        borderTop: '1px solid rgba(30,58,110,0.8)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors"
              style={{ color: isActive ? '#00c8ff' : '#4a6fa5' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
              <span style={{ fontSize: '9px', fontWeight: isActive ? '700' : '500' }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Sign In strip for guests */}
      {!user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 16px',
            background: 'rgba(0,100,200,0.15)',
            borderTop: '1px solid rgba(30,58,110,0.5)',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Already a member?</span>
          <Link
            href="/signin"
            style={{
              background: 'linear-gradient(135deg, #0066cc, #00c8ff)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              padding: '5px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
