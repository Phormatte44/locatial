// Repository factory: real Supabase when configured, localStorage fallback otherwise.
import { getSupabase } from '../lib/supabase'
import { LocalStoryRepository } from './LocalStoryRepository'
import { SupabaseStoryRepository } from './SupabaseStoryRepository'
import type { StoryRepository } from './StoryRepository'

let instance: StoryRepository | null = null

export function getStoryRepository(): StoryRepository {
  if (instance) return instance
  const db = getSupabase()
  instance = db ? new SupabaseStoryRepository(db) : new LocalStoryRepository()
  return instance
}

export const repositoryBackend: 'supabase' | 'local' = getSupabase() ? 'supabase' : 'local'

export type { StoryRepository, StorySummary, PublishedStorySummary } from './StoryRepository'
