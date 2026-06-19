// Pure validation for publishing. No I/O (slug-uniqueness is checked in the repo layer).
import type { StoryBundle } from './types'
import { sortByPosition } from './ordering'

export type ValidationError = { code: string; message: string; chapterId?: string }

export type ValidationResult = { ok: boolean; errors: ValidationError[] }

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string | null | undefined): boolean {
  return !!slug && SLUG_RE.test(slug) && slug.length <= 80
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function chapterHasLocation(c: { longitude: number | null; latitude: number | null }): boolean {
  return (
    typeof c.longitude === 'number' &&
    typeof c.latitude === 'number' &&
    Number.isFinite(c.longitude) &&
    Number.isFinite(c.latitude)
  )
}

/**
 * Validate that a story bundle is publishable. Mirrors the brief's publish rules:
 * needs a title, ≥1 chapter, every chapter named + located, valid contiguous ordering,
 * and a valid slug. (Slug *uniqueness* is enforced by the repository.)
 */
export function validateForPublish(bundle: StoryBundle): ValidationResult {
  const errors: ValidationError[] = []
  const { story, chapters } = bundle

  if (!story.title.trim()) {
    errors.push({ code: 'no_title', message: 'Story needs a title.' })
  }
  if (chapters.length === 0) {
    errors.push({ code: 'no_chapters', message: 'Story needs at least one chapter.' })
  }

  for (const c of chapters) {
    if (!c.name.trim()) {
      errors.push({ code: 'chapter_no_name', message: `Chapter at position ${c.position} needs a name.`, chapterId: c.id })
    }
    if (!chapterHasLocation(c)) {
      errors.push({
        code: 'chapter_no_location',
        message: `Chapter "${c.name || c.position}" needs a location.`,
        chapterId: c.id,
      })
    }
  }

  // Ordering must be contiguous 1..N and unique.
  const sorted = sortByPosition(chapters)
  const orderingValid = sorted.every((c, i) => c.position === i + 1)
  if (chapters.length > 0 && !orderingValid) {
    errors.push({ code: 'bad_ordering', message: 'Chapter ordering is invalid (positions must be contiguous).' })
  }

  if (!isValidSlug(story.slug)) {
    errors.push({ code: 'bad_slug', message: 'Story needs a valid URL slug.' })
  }

  return { ok: errors.length === 0, errors }
}
