// publishService — the only path that flips a story to 'published'.
// Enforces: validation, slug assignment + uniqueness, published_at, and the rule that
// agents may create drafts but NEVER publish (D5).
import type { Actor, StoryBundle } from '../domain/types'
import { slugify, validateForPublish, type ValidationResult } from '../domain/validation'
import type { StoryRepository } from '../repositories/StoryRepository'

export class AgentPublishForbiddenError extends Error {
  constructor() {
    super('Agents may create drafts but may not publish a story.')
    this.name = 'AgentPublishForbiddenError'
  }
}

export class PublishValidationError extends Error {
  constructor(public result: ValidationResult) {
    super('Story failed publish validation.')
    this.name = 'PublishValidationError'
  }
}

/** Ensure the story has a valid, unique slug; returns the slug to use. */
export async function ensureUniqueSlug(
  repo: StoryRepository,
  bundle: StoryBundle,
): Promise<string> {
  const base = bundle.story.slug && bundle.story.slug.trim() ? bundle.story.slug : slugify(bundle.story.title)
  let candidate = base || `story-${bundle.story.id.slice(0, 8)}`
  let n = 2
  // Append -2, -3… until unique (excluding this story).
  while (await repo.slugExists(candidate, bundle.story.id)) {
    candidate = `${base}-${n}`
    n += 1
  }
  return candidate
}

export async function publishStory(
  repo: StoryRepository,
  storyId: string,
  actor: Actor,
): Promise<{ slug: string }> {
  if (actor === 'agent') throw new AgentPublishForbiddenError()

  const bundle = await repo.getStoryById(storyId)
  if (!bundle) throw new Error('Story not found')

  // Assign slug first so validation sees it.
  const slug = await ensureUniqueSlug(repo, bundle)
  const withSlug: StoryBundle = { ...bundle, story: { ...bundle.story, slug } }

  const result = validateForPublish(withSlug)
  if (!result.ok) throw new PublishValidationError(result)

  await repo.updateStory(storyId, {
    slug,
    status: 'published',
    publishedAt: new Date().toISOString(),
  })
  return { slug }
}

/** Revert a published story to draft (does not clear the slug). */
export async function unpublishStory(repo: StoryRepository, storyId: string): Promise<void> {
  await repo.updateStory(storyId, { status: 'draft', publishedAt: null })
}
