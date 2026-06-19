// PublishPanel — validate, set slug, publish/unpublish, and link to the live Reader.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { StoryBundle } from '../../domain/types'
import { isValidSlug, slugify, validateForPublish } from '../../domain/validation'
import { Button, Field, Input } from '../ui/primitives'

type Props = {
  bundle: StoryBundle
  busy: boolean
  onSlugChange: (slug: string) => void
  onPublish: () => Promise<void>
  onUnpublish: () => Promise<void>
}

export function PublishPanel({ bundle, busy, onSlugChange, onPublish, onUnpublish }: Props) {
  const suggested = bundle.story.slug ?? slugify(bundle.story.title)
  const [slug, setSlug] = useState(suggested)
  const result = useMemo(
    () => validateForPublish({ ...bundle, story: { ...bundle.story, slug: slug || null } }),
    [bundle, slug],
  )
  const [published, setPublished] = useState<string | null>(
    bundle.story.status === 'published' ? bundle.story.slug : null,
  )

  return (
    <div className="space-y-3" data-testid="publish-panel">
      <Field label="Public slug">
        <Input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          onBlur={() => onSlugChange(slug)}
          placeholder="my-story"
          aria-label="Slug"
        />
        {!isValidSlug(slug || null) && <div className="mt-1 text-xs text-amber-500">Slug is required and must be url-safe.</div>}
      </Field>

      <div className="rounded-lg border border-gray-rule bg-surface1 p-3 text-xs">
        <div className="mb-1 font-bold text-chalk">
          Status: <span className={bundle.story.status === 'published' ? 'text-signal' : 'text-gray-mid'}>{bundle.story.status}</span>
        </div>
        {result.ok ? (
          <div className="text-green-400">Ready to publish.</div>
        ) : (
          <ul className="list-disc space-y-0.5 pl-4 text-amber-500">
            {result.errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={busy || !result.ok}
          onClick={async () => {
            await onPublish()
            setPublished(slug)
          }}
        >
          {bundle.story.status === 'published' ? 'Re-publish' : 'Publish'}
        </Button>
        {bundle.story.status === 'published' && (
          <Button variant="secondary" disabled={busy} onClick={onUnpublish}>
            Unpublish
          </Button>
        )}
        {(published || bundle.story.slug) && bundle.story.status === 'published' && (
          <Link
            to={`/story/${bundle.story.slug}`}
            className="inline-flex items-center rounded-lg border border-signal/40 bg-signal/15 px-3 py-2 text-sm font-bold text-signal"
            target="_blank"
          >
            Open Reader ↗
          </Link>
        )}
      </div>
    </div>
  )
}
