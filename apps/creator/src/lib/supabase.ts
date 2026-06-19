// Supabase client (browser-safe ANON key only). Returns null when env is unconfigured,
// which makes the app fall back to the localStorage repository (see repositories/index.ts).
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const IMAGE_BUCKET = (import.meta.env.VITE_SUPABASE_IMAGE_BUCKET as string | undefined) ?? 'chapter-images'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (client) return client
  if (!url || !anonKey) return null
  client = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return client
}

export const isSupabaseConfigured = Boolean(url && anonKey)
