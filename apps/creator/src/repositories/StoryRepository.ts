// The contract every storage backend implements. Components/services depend on THIS,
// never on Supabase directly (see docs/implementation/PROTOTYPE_BUILD_PLAN.md).
import type { Chapter, ChapterDraft, Section, Story, StoryBundle, StoryStatus } from '../domain/types'

export type StorySummary = Pick<Story, 'id' | 'title' | 'slug' | 'status' | 'updatedAt'> & {
  chapterCount: number
}

/** A published story as shown on the public consumer "browse" page. */
export type PublishedStorySummary = {
  id: string
  title: string
  slug: string | null
  chapterCount: number
  coverImage: string | null
  publishedAt: string | null
}

export interface StoryRepository {
  listStories(): Promise<StorySummary[]>
  /** Public: every published story, for the consumer browse page. */
  listPublishedStories(): Promise<PublishedStorySummary[]>
  createStory(title: string): Promise<Story>
  getStoryById(id: string): Promise<StoryBundle | null>
  getStoryBySlug(slug: string): Promise<StoryBundle | null>
  updateStory(id: string, patch: Partial<Pick<Story, 'title' | 'slug' | 'status' | 'publishedAt'>>): Promise<Story>
  deleteStory(id: string): Promise<void>

  /** True if another story (≠ excludeId) already owns this slug. */
  slugExists(slug: string, excludeId?: string): Promise<boolean>

  // Sections
  createSection(storyId: string, name: string): Promise<Section>
  updateSection(id: string, patch: Partial<Pick<Section, 'name' | 'position'>>): Promise<Section>
  deleteSection(id: string): Promise<void>

  // Chapters
  createChapter(storyId: string, draft?: ChapterDraft): Promise<Chapter>
  updateChapter(id: string, draft: ChapterDraft): Promise<Chapter>
  deleteChapter(id: string): Promise<void>

  /** Persist new positions in bulk (chapters and/or sections). The core ordering write. */
  persistOrder(input: {
    chapters?: Array<{ id: string; position: number; sectionId?: string | null }>
    sections?: Array<{ id: string; position: number }>
  }): Promise<void>
}

export type { Chapter, ChapterDraft, Section, Story, StoryBundle, StoryStatus }
