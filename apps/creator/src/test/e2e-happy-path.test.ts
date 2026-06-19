// End-to-end happy path (data + sync logic, no DOM map):
// create story → add located chapters → group + reorder → publish → load by slug →
// navigate chapters → verify the map destination tracks the active chapter.
import { describe, expect, it } from 'vitest'
import { LocalStoryRepository, MemoryStore } from '../repositories/LocalStoryRepository'
import { changedPositions, moveToPosition, sortByPosition } from '../domain/ordering'
import { directCamera } from '../domain/cameraDirector'
import { publishStory } from '../services/publishService'

describe('end-to-end happy path', () => {
  it('runs the full Creator → Supabase(local) → Reader slice', async () => {
    const repo = new LocalStoryRepository(new MemoryStore())

    // 1. Create + name a story
    const story = await repo.createStory('A London Evening')

    // 2. Create sections
    const west = await repo.createSection(story.id, 'West London')
    const east = await repo.createSection(story.id, 'East London')

    // 3. Add 20 located chapters, grouped
    for (let i = 1; i <= 20; i++) {
      await repo.createChapter(story.id, {
        sectionId: i <= 10 ? west.id : east.id,
        name: `Stop ${i}`,
        headline: `Headline ${i}`,
        body: 'body',
        tags: ['bar', 'good vibes'],
        longitude: -0.2 + i * 0.02,
        latitude: 51.5 + i * 0.01,
      })
    }

    // 4. Reorder: move chapter 17 → position 7
    let chapters = sortByPosition((await repo.getStoryById(story.id))!.chapters)
    const movedId = chapters[16].id
    chapters = moveToPosition(chapters, movedId, 7)
    await repo.persistOrder({ chapters: changedPositions((await repo.getStoryById(story.id))!.chapters, chapters) })

    // 5. Move a chapter between sections
    await repo.updateChapter(chapters[0].id, { sectionId: east.id })

    // 6. Publish (human)
    const { slug } = await publishStory(repo, story.id, 'human')
    expect(slug).toBe('a-london-evening')

    // 7. Open Reader by slug — survives "refresh" because it re-reads from the store
    const published = await repo.getStoryBySlug(slug)
    expect(published).not.toBeNull()
    expect(published!.story.status).toBe('published')

    const ordered = sortByPosition(published!.chapters)
    expect(ordered).toHaveLength(20)
    expect(ordered[6].id).toBe(movedId) // reorder survived publish + reload

    // 8. Navigate chapters and verify the map destination tracks the active chapter
    for (let i = 1; i < ordered.length; i++) {
      const move = directCamera({ to: ordered[i], from: ordered[i - 1] })
      expect(move).not.toBeNull()
      expect(move!.center).toEqual([ordered[i].longitude, ordered[i].latitude])
    }
  })
})
