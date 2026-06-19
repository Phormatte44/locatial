// ReaderRoute — public Reader at /story/:slug. Loads the published story by slug.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { StoryBundle } from '../domain/types'
import { getStoryRepository } from '../repositories'
import { StoryReader } from '../components/reader/StoryReader'

export function ReaderRoute() {
  const { slug } = useParams<{ slug: string }>()
  const [bundle, setBundle] = useState<StoryBundle | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    let alive = true
    if (!slug) return
    getStoryRepository()
      .getStoryBySlug(slug)
      .then((b) => {
        if (!alive) return
        if (b && b.story.status === 'published') {
          setBundle(b)
          setState('ready')
        } else {
          setState('missing')
        }
      })
      .catch(() => alive && setState('missing'))
    return () => {
      alive = false
    }
  }, [slug])

  if (state === 'loading') {
    return <div className="flex h-screen items-center justify-center bg-night text-sm text-gray-mid">Loading…</div>
  }
  if (state === 'missing' || !bundle) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-night text-center text-gray-mid">
        <div className="text-lg font-extrabold text-chalk">Story not found</div>
        <p className="text-sm">No published story exists at this address.</p>
        <Link to="/" className="text-sm font-bold text-signal">
          ← Browse stories
        </Link>
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-screen max-w-md bg-night">
      <Link
        to="/"
        className="absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-full border border-gray-rule bg-night/85 px-3 py-1 text-[11px] font-bold text-chalk shadow-lg backdrop-blur hover:border-signal"
      >
        ☰ Browse stories
      </Link>
      <StoryReader bundle={bundle} />
    </div>
  )
}
