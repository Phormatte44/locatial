// StoryListRoute — landing page: create / open / resume stories. Shows the active backend.
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStoryRepository, repositoryBackend, type StorySummary } from '../repositories'
import { seedDemoStory } from '../services/seedDemoStory'
import { Badge, Button, Input } from '../components/ui/primitives'
import { useAuth } from '../lib/auth'

export function StoryListRoute() {
  const repo = getStoryRepository()
  const nav = useNavigate()
  const auth = useAuth()
  const [stories, setStories] = useState<StorySummary[]>([])
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)

  const refresh = () =>
    repo
      .listStories()
      .then((s) => {
        setStories(s)
        setSetupError(null)
      })
      .catch((e) => setSetupError(String((e as Error)?.message ?? e)))
  useEffect(() => {
    refresh()
  }, [auth.user?.id]) // eslint-disable-line

  const create = async () => {
    setBusy(true)
    try {
      const story = await repo.createStory(title.trim() || 'Untitled story')
      nav(`/studio/${story.id}`)
    } finally {
      setBusy(false)
    }
  }

  const seed = async () => {
    setBusy(true)
    try {
      const id = await seedDemoStory(repo)
      nav(`/studio/${id}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-chalk">
      <div className="mb-1 flex items-center gap-2">
        <h1 className="text-2xl font-extrabold">LOCATIAL · Creator Studio</h1>
        <Badge tone={repositoryBackend === 'supabase' ? 'signal' : 'muted'}>
          {repositoryBackend === 'supabase' ? 'Supabase' : 'Local storage'}
        </Badge>
        {auth.enabled && auth.user && (
          <div className="ml-auto flex items-center gap-2">
            {(auth.user.user_metadata?.avatar_url as string | undefined) && (
              <img
                src={auth.user.user_metadata.avatar_url as string}
                alt=""
                className="h-6 w-6 rounded-full"
              />
            )}
            <span className="text-xs text-gray-mid">
              {(auth.user.user_metadata?.full_name as string | undefined) ||
                (auth.user.user_metadata?.name as string | undefined) ||
                auth.user.email}
            </span>
            <Button size="sm" variant="ghost" onClick={() => auth.signOut()}>
              Sign out
            </Button>
          </div>
        )}
      </div>
      <p className="mb-4 text-sm text-gray-mid">Build a spatial story, then publish it to a mobile Reader.</p>

      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-gray-rule bg-surface2 px-3 py-2 text-sm font-bold text-chalk hover:border-signal"
      >
        ☰ Browse published stories (public view)
      </Link>

      {repositoryBackend === 'supabase' && setupError && (
        <div className="mb-6 rounded-lg border border-amber-700 bg-amber-950/40 p-4 text-sm text-amber-200">
          <div className="font-bold">Supabase is connected, but the database isn’t set up yet.</div>
          <p className="mt-1 text-amber-200/80">
            Open your Supabase dashboard → SQL Editor → New query, paste the contents of{' '}
            <code className="rounded bg-black/40 px-1">supabase/setup_all.sql</code>, and click Run. Then refresh this
            page. (See <code className="rounded bg-black/40 px-1">docs/SETUP.md</code>.)
          </p>
          <p className="mt-1 text-amber-200/50">Details: {setupError}</p>
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <Input
          value={title}
          placeholder="New story title"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          className="max-w-xs"
          aria-label="New story title"
        />
        <Button variant="primary" onClick={create} disabled={busy}>
          Create story
        </Button>
        <Button variant="secondary" onClick={seed} disabled={busy}>
          Create demo story (20 chapters)
        </Button>
      </div>

      <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-mid">Your stories</h2>
      {stories.length === 0 ? (
        <div className="rounded-lg border border-gray-rule bg-surface1 p-6 text-center text-sm text-gray-mid">
          No stories yet. Create one above.
        </div>
      ) : (
        <ul className="space-y-2">
          {stories.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-gray-rule bg-surface1 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-chalk">{s.title || 'Untitled story'}</div>
                <div className="text-xs text-gray-mid">
                  {s.chapterCount} chapters · updated {new Date(s.updatedAt).toLocaleString()}
                </div>
              </div>
              <Badge tone={s.status === 'published' ? 'signal' : 'muted'}>{s.status}</Badge>
              <Link
                to={`/studio/${s.id}`}
                className="rounded-lg border border-gray-rule bg-surface2 px-3 py-1.5 text-xs font-bold text-chalk hover:bg-[#222]"
              >
                Open
              </Link>
              {s.status === 'published' && s.slug && (
                <Link to={`/story/${s.slug}`} className="text-xs font-bold text-signal" target="_blank">
                  Reader ↗
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
