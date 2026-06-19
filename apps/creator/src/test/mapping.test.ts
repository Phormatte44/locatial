import { describe, expect, it } from 'vitest'
import { chapterDraftToRow, rowToChapter, rowToSection, rowToStory } from '../repositories/mapping'

describe('row ↔ domain mapping', () => {
  it('maps a chapter row to a domain chapter', () => {
    const c = rowToChapter({
      id: 'c1',
      story_id: 's1',
      section_id: 'sec1',
      position: 3,
      name: 'Bar Goto',
      headline: 'Best in town',
      body: 'copy',
      tags: ['bar', 'chill'],
      image_url: 'http://img',
      place_name: 'NYC',
      longitude: -74,
      latitude: 40.7,
      place_id: 'node/1',
      camera: { zoom: 16 },
      created_at: 't1',
      updated_at: 't2',
    })
    expect(c).toMatchObject({
      id: 'c1',
      storyId: 's1',
      sectionId: 'sec1',
      position: 3,
      tags: ['bar', 'chill'],
      imageUrl: 'http://img',
      placeName: 'NYC',
      longitude: -74,
      latitude: 40.7,
      placeId: 'node/1',
      camera: { zoom: 16 },
    })
  })

  it('defaults null tags to empty array', () => {
    const c = rowToChapter({
      id: 'c',
      story_id: 's',
      section_id: null,
      position: 1,
      name: '',
      headline: '',
      body: '',
      tags: null,
      image_url: null,
      place_name: null,
      longitude: null,
      latitude: null,
      place_id: null,
      camera: null,
      created_at: 't',
      updated_at: 't',
    })
    expect(c.tags).toEqual([])
    expect(c.camera).toBeNull()
  })

  it('maps story status safely', () => {
    expect(rowToStory({ id: 's', title: '', slug: null, status: 'published', published_at: 'x', created_at: 't', updated_at: 't' }).status).toBe('published')
    expect(rowToStory({ id: 's', title: '', slug: null, status: 'weird', published_at: null, created_at: 't', updated_at: 't' }).status).toBe('draft')
  })

  it('maps section row', () => {
    expect(rowToSection({ id: 'x', story_id: 's', name: 'West', position: 2, created_at: 't', updated_at: 't' })).toMatchObject({
      id: 'x',
      storyId: 's',
      name: 'West',
      position: 2,
    })
  })

  it('chapterDraftToRow only includes provided keys (snake_case)', () => {
    expect(chapterDraftToRow({ name: 'n', longitude: 1, sectionId: 'sec' })).toEqual({
      name: 'n',
      longitude: 1,
      section_id: 'sec',
    })
    expect(chapterDraftToRow({})).toEqual({})
  })
})
