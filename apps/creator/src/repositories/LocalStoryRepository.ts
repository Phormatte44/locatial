// localStorage-backed repository. Same contract as the Supabase one, so the entire app
// (and the test suite) runs without a provisioned database. Dev aid, not a substitute —
// see docs/implementation/DECISIONS_AND_CONFLICTS.md D3.
import type { Chapter, ChapterDraft, Section, Story, StoryBundle } from '../domain/types'
import type { StoryRepository, StorySummary } from './StoryRepository'

type DB = { stories: Story[]; sections: Section[]; chapters: Chapter[] }

export interface KeyValueStore {
  getItem(k: string): string | null
  setItem(k: string, v: string): void
}

const KEY = 'locatial.db.v1'

function emptyDB(): DB {
  return { stories: [], sections: [], chapters: [] }
}

// Deterministic-ish id without external deps. Unique enough for prototype/test use.
let counter = 0
function uid(prefix: string): string {
  counter += 1
  const rand = Math.floor(Math.random() * 1e9).toString(36)
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${rand}`
}

function now(): string {
  return new Date().toISOString()
}

/** In-memory KV used by tests (and as a safe fallback when localStorage is absent). */
export class MemoryStore implements KeyValueStore {
  private map = new Map<string, string>()
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null
  }
  setItem(k: string, v: string) {
    this.map.set(k, v)
  }
}

export class LocalStoryRepository implements StoryRepository {
  constructor(private store: KeyValueStore = defaultStore()) {}

  private read(): DB {
    const raw = this.store.getItem(KEY)
    if (!raw) return emptyDB()
    try {
      return { ...emptyDB(), ...(JSON.parse(raw) as DB) }
    } catch {
      return emptyDB()
    }
  }

  private write(db: DB) {
    this.store.setItem(KEY, JSON.stringify(db))
  }

  async listStories(): Promise<StorySummary[]> {
    const db = this.read()
    return [...db.stories]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        status: s.status,
        updatedAt: s.updatedAt,
        chapterCount: db.chapters.filter((c) => c.storyId === s.id).length,
      }))
  }

  async listPublishedStories() {
    const db = this.read()
    return db.stories
      .filter((s) => s.status === 'published')
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
      .map((s) => {
        const chapters = db.chapters.filter((c) => c.storyId === s.id)
        const cover = chapters.find((c) => c.imageUrl)?.imageUrl ?? null
        return {
          id: s.id,
          title: s.title,
          slug: s.slug,
          chapterCount: chapters.length,
          coverImage: cover,
          publishedAt: s.publishedAt,
        }
      })
  }

  async createStory(title: string): Promise<Story> {
    const db = this.read()
    const story: Story = {
      id: uid('story'),
      title,
      slug: null,
      status: 'draft',
      publishedAt: null,
      createdAt: now(),
      updatedAt: now(),
    }
    db.stories.push(story)
    this.write(db)
    return story
  }

  private bundle(db: DB, story: Story): StoryBundle {
    return {
      story,
      sections: db.sections.filter((s) => s.storyId === story.id).sort((a, b) => a.position - b.position),
      chapters: db.chapters.filter((c) => c.storyId === story.id).sort((a, b) => a.position - b.position),
    }
  }

  async getStoryById(id: string): Promise<StoryBundle | null> {
    const db = this.read()
    const story = db.stories.find((s) => s.id === id)
    return story ? this.bundle(db, story) : null
  }

  async getStoryBySlug(slug: string): Promise<StoryBundle | null> {
    const db = this.read()
    const story = db.stories.find((s) => s.slug === slug)
    return story ? this.bundle(db, story) : null
  }

  async updateStory(
    id: string,
    patch: Partial<Pick<Story, 'title' | 'slug' | 'status' | 'publishedAt'>>,
  ): Promise<Story> {
    const db = this.read()
    const story = db.stories.find((s) => s.id === id)
    if (!story) throw new Error('Story not found')
    Object.assign(story, patch, { updatedAt: now() })
    this.write(db)
    return story
  }

  async deleteStory(id: string): Promise<void> {
    const db = this.read()
    db.stories = db.stories.filter((s) => s.id !== id)
    db.sections = db.sections.filter((s) => s.storyId !== id)
    db.chapters = db.chapters.filter((c) => c.storyId !== id)
    this.write(db)
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const db = this.read()
    return db.stories.some((s) => s.slug === slug && s.id !== excludeId)
  }

  async createSection(storyId: string, name: string): Promise<Section> {
    const db = this.read()
    const position = db.sections.filter((s) => s.storyId === storyId).length
    const section: Section = {
      id: uid('sec'),
      storyId,
      name,
      position,
      createdAt: now(),
      updatedAt: now(),
    }
    db.sections.push(section)
    this.write(db)
    return section
  }

  async updateSection(id: string, patch: Partial<Pick<Section, 'name' | 'position'>>): Promise<Section> {
    const db = this.read()
    const section = db.sections.find((s) => s.id === id)
    if (!section) throw new Error('Section not found')
    Object.assign(section, patch, { updatedAt: now() })
    this.write(db)
    return section
  }

  async deleteSection(id: string): Promise<void> {
    const db = this.read()
    db.sections = db.sections.filter((s) => s.id !== id)
    // Detach chapters from the removed section (mirrors ON DELETE SET NULL).
    db.chapters.forEach((c) => {
      if (c.sectionId === id) c.sectionId = null
    })
    this.write(db)
  }

  async createChapter(storyId: string, draft?: ChapterDraft): Promise<Chapter> {
    const db = this.read()
    const position = db.chapters.filter((c) => c.storyId === storyId).length + 1
    const chapter: Chapter = {
      id: uid('ch'),
      storyId,
      sectionId: draft?.sectionId ?? null,
      position,
      name: draft?.name ?? '',
      headline: draft?.headline ?? '',
      body: draft?.body ?? '',
      tags: draft?.tags ?? [],
      imageUrl: draft?.imageUrl ?? null,
      placeName: draft?.placeName ?? null,
      longitude: draft?.longitude ?? null,
      latitude: draft?.latitude ?? null,
      placeId: draft?.placeId ?? null,
      camera: draft?.camera ?? null,
      createdAt: now(),
      updatedAt: now(),
    }
    db.chapters.push(chapter)
    this.write(db)
    return chapter
  }

  async updateChapter(id: string, draft: ChapterDraft): Promise<Chapter> {
    const db = this.read()
    const chapter = db.chapters.find((c) => c.id === id)
    if (!chapter) throw new Error('Chapter not found')
    Object.assign(chapter, draft, { updatedAt: now() })
    this.write(db)
    return chapter
  }

  async deleteChapter(id: string): Promise<void> {
    const db = this.read()
    db.chapters = db.chapters.filter((c) => c.id !== id)
    this.write(db)
  }

  async persistOrder(input: {
    chapters?: Array<{ id: string; position: number; sectionId?: string | null }>
    sections?: Array<{ id: string; position: number }>
  }): Promise<void> {
    const db = this.read()
    for (const c of input.chapters ?? []) {
      const chapter = db.chapters.find((x) => x.id === c.id)
      if (chapter) {
        chapter.position = c.position
        if ('sectionId' in c) chapter.sectionId = c.sectionId ?? null
        chapter.updatedAt = now()
      }
    }
    for (const s of input.sections ?? []) {
      const section = db.sections.find((x) => x.id === s.id)
      if (section) {
        section.position = s.position
        section.updatedAt = now()
      }
    }
    this.write(db)
  }
}

function defaultStore(): KeyValueStore {
  if (typeof localStorage !== 'undefined') return localStorage
  return new MemoryStore()
}
