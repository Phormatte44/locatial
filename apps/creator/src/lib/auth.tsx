// Auth context. Wraps Supabase Auth (email magic link). When Supabase is not configured
// (local dev fallback), auth is bypassed so the app still runs without login.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from './supabase'

type AuthState = {
  /** Whether real auth is active (Supabase configured). */
  enabled: boolean
  loading: boolean
  user: User | null
  session: Session | null
  signInWithEmail: (email: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase()
  const enabled = isSupabaseConfigured && !!supabase
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  const value = useMemo<AuthState>(
    () => ({
      enabled,
      loading,
      user: session?.user ?? null,
      session,
      async signInWithEmail(email: string) {
        if (!supabase) return { error: 'Auth is not configured.' }
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/studio` },
        })
        return { error: error?.message ?? null }
      },
      async signInWithGoogle() {
        if (!supabase) return { error: 'Auth is not configured.' }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/studio` },
        })
        return { error: error?.message ?? null }
      },
      async signOut() {
        await supabase?.auth.signOut()
      },
    }),
    [enabled, loading, session, supabase],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
