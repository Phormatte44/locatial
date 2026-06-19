import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStoryRepository, MemoryStore } from '../repositories/LocalStoryRepository'
import { changedPositions, moveToPosition, sortByPosition } from '../domain/ordering'
import { AgentPublishForbiddenError, publishStory } from '../services/publishService'

function repo() {
  return new LocalStoryRepository(new MemoryStore())
}

async function seed20(r: LocalStoryRepository) {
  const story = await r.createStory('A London Evening')
  const west = await r.createSection(story.id, 'West London')
  const east = await r.createSection(story.id, 'East London')
  for (let i = 1; i <= 20; i++) {
    await r.createChapter(story.id, {
      sectionId: i <= 10 ? west.id : east.id,
      name: `Stop ${i}`,
      headline: `H${i}`,
      body: 'body',
      tags: ['bar'],
      longitude: -0.1278 + i * 0.001,
      latitude: 51.5074 + i * 0.001,
    })
  }
  return { story, west, east }
}

describe('LocalStoryRepository', () => {
  let r: LocalStoryRepository
  beforeEach(() => {
    r = repo()
  })

  it('creates a story, 2 sections, and 20 located chapters with contiguous positions', async () => {
    const { story } = await seed20(r)
    const bundle = await r.getStoryById(story.id)
    expect(bundle).not.toBeNull()
    expect(bundle!.sections).toHaveLength(2)
    expect(bundle!.chapters).toHaveLength(20)
    expect(sortByPosition(bundle!.chapters).map((c) => c.position)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
    expect(bundle!.chapters.every((c) => typeof c.longitude === 'number')).toBe(true)
  })

  it('moves Chapter 17 to position 7 and persists, keeping ids stable', async () => {
    const { story } = await seed20(r)
    const before = sortByPosition((await r.getStoryById(story.id))!.chapters)
    const c17 = before[16] // position 17
    const c17Id = c17.id

    const after = moveToPosition(before, c17Id, 7)
    await r.persistOrder({ chapters: changedPositions(before, after) })

    const reloaded = sortByPosition((await r.getStoryById(story.id))!.chapters)
    expect(reloaded[6].id).toBe(c17Id) // index 6 == position 7
    expect(reloaded[6].position).toBe(7)
    expect(reloaded.map((c) => c.position)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    // ID was not recreated
    expect(reloaded.find((c) => c.id === c17Id)).toBeTruthy()
  })

  it('moves a chapter between sections and persists', async () => {
    const { story, east } = await seed20(r)
    const chapters = sortByPosition((await r.getStoryById(story.id))!.chapters)
    const first = chapters[0]
    expect(first.sectionId).not.toBe(east.id)

    await r.updateChapter(first.id, { sectionId: east.id })

    const reloaded = (await r.getStoryById(story.id))!.chapters.find((c) => c.id === first.id)!
    expect(reloaded.sectionId).toBe(east.id)
  })

  it('reorders sections and persists', async () => {
    const { story } = await seed20(r)
    const secs = sortByPosition((await r.getStoryById(story.id))!.sections)
    const after = moveToPosition(secs, secs[1].id, 1)
    await r.persistOrder({ sections: changedPositions(secs, after) })
    const reloaded = sortByPosition((await r.getStoryById(story.id))!.sections)
    expect(reloaded[0].id).toBe(secs[1].id)
  })

  it('detaches chapters when their section is deleted', async () => {
    const { story, west } = await seed20(r)
    await r.deleteSection(west.id)
    const chapters = (await r.getStoryById(story.id))!.chapters
    expect(chapters.filter((c) => c.sectionId === west.id)).toHaveLength(0)
  })

  it('enforces unique slugs', async () => {
    const a = await r.createStory('A')
    await r.updateStory(a.id, { slug: 'taken' })
    expect(await r.slugExists('taken')).toBe(true)
    expect(await r.slugExists('taken', a.id)).toBe(false) // excluding self
  })
})

describe('publishService', () => {
  it('blocks agents from publishing', async () => {
    const r = repo()
    const { story } = await seed20(r)
    await expect(publishStory(r, story.id, 'agent')).rejects.toBeInstanceOf(AgentPublishForbiddenError)
    const reloaded = await r.getStoryById(story.id)
    expect(reloaded!.story.status).toBe('draft')
  })

  it('publishes a valid story by a human, assigns slug + published_at, and is readable by slug', async () => {
    const r = repo()
    const { story } = await seed20(r)
    const { slug } = await publishStory(r, story.id, 'human')
    expect(slug).toBe('a-london-evening')

    const published = await r.getStoryById(story.id)
    expect(published!.story.status).toBe('published')
    expect(published!.story.publishedAt).toBeTruthy()

    const bySlug = await r.getStoryBySlug(slug)
    expect(bySlug).not.toBeNull()
    expect(bySlug!.story.id).toBe(story.id)
    expect(bySlug!.chapters).toHaveLength(20)
  })

  it('disambiguates duplicate slugs', async () => {
    const r = repo()
    const a = await seed20(r)
    await publishStory(r, a.story.id, 'human') // a-london-evening
    const b = await seed20(r)
    const { slug } = await publishStory(r, b.story.id, 'human')
    expect(slug).toBe('a-london-evening-2')
  })

  it('refuses to publish an invalid story (chapter without location)', async () => {
    const r = repo()
    const story = await r.createStory('Bare')
    await r.createChapter(story.id, { name: 'No location' })
    await expect(publishStory(r, story.id, 'human')).rejects.toThrow()
    expect((await r.getStoryById(story.id))!.story.status).toBe('draft')
  })
})
