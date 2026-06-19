// Creates a demo story (2 sections, 20 located chapters) through the repository layer.
// Works against either backend — powers the Studio "Create demo story" action and is
// reused by the end-to-end test.
import type { StoryRepository } from '../repositories/StoryRepository'

const BASE: [number, number] = [-0.1278, 51.5074] // central London

export async function seedDemoStory(repo: StoryRepository): Promise<string> {
  const story = await repo.createStory('A London Evening')
  const west = await repo.createSection(story.id, 'West London')
  const east = await repo.createSection(story.id, 'East London')

  for (let i = 1; i <= 20; i++) {
    await repo.createChapter(story.id, {
      sectionId: i <= 10 ? west.id : east.id,
      name: `Stop ${i}`,
      headline: `Headline for stop ${i}`,
      body:
        `Body copy describing the ${i}th stop on this London evening. Scroll for more — ` +
        `this paragraph is intentionally long so the vertical scroll inside a chapter is ` +
        `demonstrable below the fold. ` .repeat(2),
      tags: ['bar', 'good vibes'],
      placeName: `Venue ${i}, London`,
      longitude: BASE[0] + (i - 10) * 0.004,
      latitude: BASE[1] + (i - 10) * 0.0025,
    })
  }
  return story.id
}
