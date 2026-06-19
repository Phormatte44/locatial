// ExploreRoute — public consumer page ("/explore"). Lists every PUBLISHED story so a
// visitor (citizen) can browse and open them. No login required.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStoryRepository, type PublishedStorySummary } from '../repositories'

export function ExploreRoute() {
  const [stories, setStories] = useState<PublishedStorySummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    getStoryRepository()
      .listPublishedStories()
      .then((s) => alive && setStories(s))
      .catch((e) => alive && setError(String((e as Error)?.message ?? e)))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-root text-chalk">
      <header className="flex items-center justify-between border-b border-gray-rule bg-night px-5 py-4">
        <div>
          <h1 className="text-xl font-extrabold">LOCATIAL</h1>
          <p className="text-sm text-gray-mid">Browse published stories</p>
        </div>
        <Link
          to="/studio"
          className="rounded-lg border border-gray-rule bg-surface2 px-3 py-2 text-xs font-bold text-chalk hover:border-signal"
        >
          Creator Studio →
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-6">
        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        {!stories && !error && <div className="text-sm text-gray-mid">Loading…</div>}
        {stories && stories.length === 0 && (
          <div className="rounded-lg border border-gray-rule bg-surface1 p-6 text-center text-sm text-gray-mid">
            No published stories yet.
          </div>
        )}

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(stories ?? []).map((s) => (
            <li key={s.id}>
              <Link
                to={`/story/${s.slug}`}
                className="block overflow-hidden rounded-xl border border-gray-rule bg-surface1 transition hover:border-signal"
              >
                {s.coverImage ? (
                  <img src={s.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center bg-surface2 text-xs text-gray-hi">
                    LOCATIAL
                  </div>
                )}
                <div className="p-3">
                  <div className="font-bold text-chalk">{s.title || 'Untitled story'}</div>
                  <div className="mt-0.5 text-xs text-gray-mid">
                    {s.chapterCount} {s.chapterCount === 1 ? 'chapter' : 'chapters'}
                    {s.publishedAt ? ` · ${new Date(s.publishedAt).toLocaleDateString()}` : ''}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
