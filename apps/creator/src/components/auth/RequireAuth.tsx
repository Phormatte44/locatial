// RequireAuth — gates Studio routes. If auth is disabled (local dev), lets everyone in.
import type { ReactNode } from 'react'
import { useAuth } from '../../lib/auth'
import { SignIn } from './SignIn'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { enabled, loading, user } = useAuth()
  if (!enabled) return <>{children}</> // local dev fallback: no login required
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-root text-sm text-gray-mid">Loading…</div>
  if (!user) return <SignIn />
  return <>{children}</>
}
