import { describe, expect, it } from 'vitest'
import { isValidSlug, slugify, validateForPublish } from '../domain/validation'
import type { Chapter, StoryBundle } from '../domain/types'

function chapter(p: number, over: Partial<Chapter> = {}): Chapter {
  return {
    id: `c${p}`,
    storyId: 's1',
    sectionId: null,
    position: p,
    name: `Chapter ${p}`,
    headline: 'h',
    body: 'b',
    tags: [],
    imageUrl: null,
    placeName: null,
    longitude: -0.1,
    latitude: 51.5,
    placeId: null,
    camera: null,
    createdAt: 't',
    updatedAt: 't',
    ...over,
  }
}

function bundle(over: Partial<StoryBundle['story']> = {}, chapters: Chapter[] = [chapter(1)]): StoryBundle {
  return {
    story: {
      id: 's1',
      title: 'My Story',
      slug: 'my-story',
      status: 'draft',
      publishedAt: null,
      createdAt: 't',
      updatedAt: 't',
      ...over,
    },
    sections: [],
    chapters,
  }
}

describe('slug helpers', () => {
  it('slugifies titles', () => {
    expect(slugify('A London Evening!')).toBe('a-london-evening')
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
  })
  it('validates slugs', () => {
    expect(isValidSlug('a-london-evening')).toBe(true)
    expect(isValidSlug('Bad Slug')).toBe(false)
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug(null)).toBe(false)
  })
})

describe('validateForPublish', () => {
  it('passes a complete story', () => {
    expect(validateForPublish(bundle()).ok).toBe(true)
  })
  it('fails without a title', () => {
    const r = validateForPublish(bundle({ title: '' }))
    expect(r.ok).toBe(false)
    expect(r.errors.some((e) => e.code === 'no_title')).toBe(true)
  })
  it('fails with no chapters', () => {
    const r = validateForPublish(bundle({}, []))
    expect(r.errors.some((e) => e.code === 'no_chapters')).toBe(true)
  })
  it('fails when a chapter has no name', () => {
    const r = validateForPublish(bundle({}, [chapter(1, { name: '  ' })]))
    expect(r.errors.some((e) => e.code === 'chapter_no_name')).toBe(true)
  })
  it('fails when a chapter has no location', () => {
    const r = validateForPublish(bundle({}, [chapter(1, { longitude: null, latitude: null })]))
    expect(r.errors.some((e) => e.code === 'chapter_no_location')).toBe(true)
  })
  it('fails on non-contiguous ordering', () => {
    const r = validateForPublish(bundle({}, [chapter(1), chapter(3)]))
    expect(r.errors.some((e) => e.code === 'bad_ordering')).toBe(true)
  })
  it('fails on invalid slug', () => {
    const r = validateForPublish(bundle({ slug: 'Bad Slug' }))
    expect(r.errors.some((e) => e.code === 'bad_slug')).toBe(true)
  })
})
