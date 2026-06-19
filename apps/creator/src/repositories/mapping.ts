// Pure mapping between snake_case DB rows and camelCase domain objects.
// Unit-tested (src/test/mapping.test.ts) — this is the Supabase boundary.
import type { Chapter, Section, Story } from '../domain/types'

export type StoryRow = {
  id: string
  title: string
  slug: string | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export type SectionRow = {
  id: string
  story_id: string
  name: string
  position: number
  created_at: string
  updated_at: string
}

export type ChapterRow = {
  id: string
  story_id: string
  section_id: string | null
  position: number
  name: string
  headline: string
  body: string
  tags: string[] | null
  image_url: string | null
  place_name: string | null
  longitude: number | null
  latitude: number | null
  place_id: string | null
  camera: { zoom?: number; pitch?: number; bearing?: number } | null
  created_at: string
  updated_at: string
}

export function rowToStory(r: StoryRow): Story {
  return {
    id: r.id,
    title: r.title ?? '',
    slug: r.slug,
    status: r.status === 'published' ? 'published' : 'draft',
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export function rowToSection(r: SectionRow): Section {
  return {
    id: r.id,
    storyId: r.story_id,
    name: r.name ?? '',
    position: r.position ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

export function rowToChapter(r: ChapterRow): Chapter {
  return {
    id: r.id,
    storyId: r.story_id,
    sectionId: r.section_id,
    position: r.position ?? 0,
    name: r.name ?? '',
    headline: r.headline ?? '',
    body: r.body ?? '',
    tags: Array.isArray(r.tags) ? r.tags : [],
    imageUrl: r.image_url,
    placeName: r.place_name,
    longitude: r.longitude,
    latitude: r.latitude,
    placeId: r.place_id,
    camera: r.camera ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

/** Map a chapter draft (camelCase) to a DB update payload (snake_case). */
export function chapterDraftToRow(draft: Partial<Chapter>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if ('name' in draft) out.name = draft.name
  if ('headline' in draft) out.headline = draft.headline
  if ('body' in draft) out.body = draft.body
  if ('tags' in draft) out.tags = draft.tags
  if ('imageUrl' in draft) out.image_url = draft.imageUrl
  if ('placeName' in draft) out.place_name = draft.placeName
  if ('longitude' in draft) out.longitude = draft.longitude
  if ('latitude' in draft) out.latitude = draft.latitude
  if ('placeId' in draft) out.place_id = draft.placeId
  if ('camera' in draft) out.camera = draft.camera
  if ('sectionId' in draft) out.section_id = draft.sectionId
  if ('position' in draft) out.position = draft.position
  return out
}
