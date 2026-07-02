// ExploreRoute — public consumer home ("/"). Lists published PlayceLists (stories) so a
// visitor can browse and open them. No login. Styled to match locatial.io (dark + violet,
// hamburger menu + LOCATIAL wordmark, place-count cards).
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStoryRepository, type PublishedStorySummary } from '../repositories'

function MenuButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-rule bg-surface1 text-chalk hover:border-signal"
      >
        <span className="text-lg leading-none">☰</span>
      </button>
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-rule bg-surface1 shadow-2xl">
          <Link to="/" className="block px-4 py-2.5 text-sm font-semibold text-chalk hover:bg-surface2" onClick={() => setOpen(false)}>
            Browse PlayceLists
          </Link>
          <Link to="/director" className="block px-4 py-2.5 text-sm font-semibold text-chalk hover:bg-surface2" onClick={() => setOpen(false)}>
            Spatial Director →
          </Link>
          <Link to="/studio" className="block px-4 py-2.5 text-sm font-semibold text-chalk hover:bg-surface2" onClick={() => setOpen(false)}>
            Creator Studio →
          </Link>
        </div>
      )}
    </div>
  )
}

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
    <div className="min-h-screen bg-night text-chalk">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-rule bg-night/95 px-5 py-3 backdrop-blur">
        <MenuButton />
        <div className="text-lg font-extrabold uppercase tracking-[0.35em] text-chalk">LOCATIAL</div>
        <div className="ml-auto flex items-center gap-2">
        <Link
          to="/director"
          className="rounded-lg border border-gray-rule px-3 py-2 text-xs font-bold text-chalk hover:border-signal"
        >
          Director →
        </Link>
        <Link
          to="/studio"
          className="rounded-lg bg-signal px-3 py-2 text-xs font-bold text-white hover:brightness-110"
        >
          Creator Studio →
        </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-chalk">PlayceLists</h1>
        <p className="mb-4 text-sm text-gray-mid">Spatial stories you can explore on the map.</p>

        <Link
          to="/scene"
          className="mb-6 block overflow-hidden rounded-2xl border-2 border-signal bg-surface1 p-5 transition hover:border-signal-pink"
        >
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-signal-pink">Spatial Scene · Prototype</div>
          <div className="text-lg font-extrabold text-chalk">The Road to the Bridge Fails</div>
          <p className="mt-1 text-sm text-gray-mid">Beat-driven map reveal — globe to street, real geography.</p>
          <span className="mt-3 inline-block text-xs font-bold text-signal">Open experience →</span>
        </Link>

        <Link
          to="/director"
          className="mb-4 block overflow-hidden rounded-2xl border border-gray-rule bg-surface1 p-4 transition hover:border-signal"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-mid">Spatial Director · V0</div>
          <div className="text-base font-extrabold text-chalk">Direct Scene 07</div>
          <p className="mt-1 text-sm text-gray-mid">Timeline, camera capture, preview, JSON export.</p>
          <span className="mt-2 inline-block text-xs font-bold text-signal">Open Director →</span>
        </Link>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        {!stories && !error && <div className="text-sm text-gray-mid">Loading…</div>}
        {stories && stories.length === 0 && (
          <div className="rounded-2xl border border-gray-rule bg-surface1 p-8 text-center text-sm text-gray-mid">
            No published PlayceLists yet.
          </div>
        )}

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(stories ?? []).map((s) => (
            <li key={s.id}>
              <Link
                to={`/story/${s.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-rule bg-surface1 transition hover:border-signal"
              >
                {s.coverImage ? (
                  <img src={s.coverImage} alt="" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface2 text-sm font-bold uppercase tracking-[0.3em] text-gray-hi">
                    LOCATIAL
                  </div>
                )}
                <div className="p-4">
                  <div className="text-base font-bold text-chalk group-hover:text-signal">{s.title || 'Untitled'}</div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-signal">{s.chapterCount}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-mid">
                      {s.chapterCount === 1 ? 'place' : 'places'}
                    </span>
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
