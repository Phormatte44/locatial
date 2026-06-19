import type { SupabaseClient } from '@supabase/supabase-js'
import type { Chapter, ChapterDraft, Section, Story, StoryBundle } from '../domain/types'
import type { StoryRepository, StorySummary } from './StoryRepository'
import {
  chapterDraftToRow,
  rowToChapter,
  rowToSection,
  rowToStory,
  type ChapterRow,
  type SectionRow,
  type StoryRow,
} from './mapping'

/** Real persistence against Supabase Postgres + Storage. */
export class SupabaseStoryRepository implements StoryRepository {
  constructor(private db: SupabaseClient) {}

  private throwIf(error: { message: string } | null, ctx: string) {
    if (error) throw new Error(`Supabase ${ctx} failed: ${error.message}`)
  }

  async listStories(): Promise<StorySummary[]> {
    // Studio list = only the signed-in creator's own stories. When auth is on but
    // nobody is signed in, return nothing rather than other people's published work.
    const { data: auth } = await this.db.auth.getUser()
    const ownerId = auth?.user?.id ?? null
    let query = this.db
      .from('stories')
      .select('id,title,slug,status,updated_at,chapters(count)')
      .order('updated_at', { ascending: false })
    if (ownerId) query = query.eq('owner_id', ownerId)
    const { data, error } = await query
    this.throwIf(error, 'listStories')
    return (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title ?? '',
      slug: r.slug,
      status: r.status === 'published' ? 'published' : 'draft',
      updatedAt: r.updated_at,
      chapterCount: r.chapters?.[0]?.count ?? 0,
    }))
  }

  async listPublishedStories() {
    // Pull each story's chapters' images (ordered) so we can show a cover + count.
    const { data, error } = await this.db
      .from('stories')
      .select('id,title,slug,published_at,chapters(image_url,position)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    this.throwIf(error, 'listPublishedStories')
    return (data ?? []).map((r: any) => {
      const chs = (r.chapters ?? []).slice().sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      const cover = chs.find((c: any) => c.image_url)?.image_url ?? null
      return {
        id: r.id,
        title: r.title ?? '',
        slug: r.slug,
        chapterCount: chs.length,
        coverImage: cover,
        publishedAt: r.published_at,
      }
    })
  }

  async createStory(title: string): Promise<Story> {
    // owner_id also has a DB default of auth.uid(); set it explicitly for clarity.
    const { data: auth } = await this.db.auth.getUser()
    const payload: Record<string, unknown> = { title }
    if (auth?.user?.id) payload.owner_id = auth.user.id
    const { data, error } = await this.db.from('stories').insert(payload).select('*').single()
    this.throwIf(error, 'createStory')
    return rowToStory(data as StoryRow)
  }

  private async getBundleByStoryRow(storyRow: StoryRow | null): Promise<StoryBundle | null> {
    if (!storyRow) return null
    const [{ data: sections, error: secErr }, { data: chapters, error: chErr }] = await Promise.all([
      this.db.from('sections').select('*').eq('story_id', storyRow.id).order('position'),
      this.db.from('chapters').select('*').eq('story_id', storyRow.id).order('position'),
    ])
    this.throwIf(secErr, 'getStory sections')
    this.throwIf(chErr, 'getStory chapters')
    return {
      story: rowToStory(storyRow),
      sections: (sections ?? []).map((r) => rowToSection(r as SectionRow)),
      chapters: (chapters ?? []).map((r) => rowToChapter(r as ChapterRow)),
    }
  }

  async getStoryById(id: string): Promise<StoryBundle | null> {
    const { data, error } = await this.db.from('stories').select('*').eq('id', id).maybeSingle()
    this.throwIf(error, 'getStoryById')
    return this.getBundleByStoryRow((data as StoryRow) ?? null)
  }

  async getStoryBySlug(slug: string): Promise<StoryBundle | null> {
    const { data, error } = await this.db.from('stories').select('*').eq('slug', slug).maybeSingle()
    this.throwIf(error, 'getStoryBySlug')
    return this.getBundleByStoryRow((data as StoryRow) ?? null)
  }

  async updateStory(
    id: string,
    patch: Partial<Pick<Story, 'title' | 'slug' | 'status' | 'publishedAt'>>,
  ): Promise<Story> {
    const row: Record<string, unknown> = {}
    if ('title' in patch) row.title = patch.title
    if ('slug' in patch) row.slug = patch.slug
    if ('status' in patch) row.status = patch.status
    if ('publishedAt' in patch) row.published_at = patch.publishedAt
    const { data, error } = await this.db.from('stories').update(row).eq('id', id).select('*').single()
    this.throwIf(error, 'updateStory')
    return rowToStory(data as StoryRow)
  }

  async deleteStory(id: string): Promise<void> {
    const { error } = await this.db.from('stories').delete().eq('id', id)
    this.throwIf(error, 'deleteStory')
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let q = this.db.from('stories').select('id').eq('slug', slug)
    if (excludeId) q = q.neq('id', excludeId)
    const { data, error } = await q
    this.throwIf(error, 'slugExists')
    return (data ?? []).length > 0
  }

  async createSection(storyId: string, name: string): Promise<Section> {
    const { count } = await this.db
      .from('sections')
      .select('id', { count: 'exact', head: true })
      .eq('story_id', storyId)
    const { data, error } = await this.db
      .from('sections')
      .insert({ story_id: storyId, name, position: count ?? 0 })
      .select('*')
      .single()
    this.throwIf(error, 'createSection')
    return rowToSection(data as SectionRow)
  }

  async updateSection(id: string, patch: Partial<Pick<Section, 'name' | 'position'>>): Promise<Section> {
    const { data, error } = await this.db.from('sections').update(patch).eq('id', id).select('*').single()
    this.throwIf(error, 'updateSection')
    return rowToSection(data as SectionRow)
  }

  async deleteSection(id: string): Promise<void> {
    const { error } = await this.db.from('sections').delete().eq('id', id)
    this.throwIf(error, 'deleteSection')
  }

  async createChapter(storyId: string, draft?: ChapterDraft): Promise<Chapter> {
    const { count } = await this.db
      .from('chapters')
      .select('id', { count: 'exact', head: true })
      .eq('story_id', storyId)
    const payload = { story_id: storyId, position: (count ?? 0) + 1, ...chapterDraftToRow(draft ?? {}) }
    const { data, error } = await this.db.from('chapters').insert(payload).select('*').single()
    this.throwIf(error, 'createChapter')
    return rowToChapter(data as ChapterRow)
  }

  async updateChapter(id: string, draft: ChapterDraft): Promise<Chapter> {
    const { data, error } = await this.db
      .from('chapters')
      .update(chapterDraftToRow(draft))
      .eq('id', id)
      .select('*')
      .single()
    this.throwIf(error, 'updateChapter')
    return rowToChapter(data as ChapterRow)
  }

  async deleteChapter(id: string): Promise<void> {
    const { error } = await this.db.from('chapters').delete().eq('id', id)
    this.throwIf(error, 'deleteChapter')
  }

  async persistOrder(input: {
    chapters?: Array<{ id: string; position: number; sectionId?: string | null }>
    sections?: Array<{ id: string; position: number }>
  }): Promise<void> {
    // Each row updated individually so we never clobber other columns.
    await Promise.all([
      ...(input.chapters ?? []).map((c) => {
        const row: Record<string, unknown> = { position: c.position }
        if ('sectionId' in c) row.section_id = c.sectionId
        return this.db
          .from('chapters')
          .update(row)
          .eq('id', c.id)
          .then(({ error }) => this.throwIf(error, 'persistOrder chapter'))
      }),
      ...(input.sections ?? []).map((s) =>
        this.db
          .from('sections')
          .update({ position: s.position })
          .eq('id', s.id)
          .then(({ error }) => this.throwIf(error, 'persistOrder section')),
      ),
    ])
  }
}
