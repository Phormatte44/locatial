// PreviewWorkspace — Desktop / Tablet / Mobile preview of the real Reader, with a path
// back to editing and forward to publishing.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { StoryBundle } from '../../domain/types'
import { getStoryRepository } from '../../repositories'
import { DevicePreview, type Device } from './DevicePreview'

export function PreviewWorkspace({ storyId }: { storyId: string }) {
  const [bundle, setBundle] = useState<StoryBundle | null>(null)
  const [device, setDevice] = useState<Device>('mobile')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    getStoryRepository()
      .getStoryById(storyId)
      .then((b) => alive && setBundle(b))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [storyId])

  return (
    <div className="flex h-screen flex-col bg-root text-chalk">
      <header className="flex items-center gap-3 border-b border-gray-rule bg-night px-4 py-2.5">
        <Link to={`/studio/${storyId}`} className="text-xs font-bold text-gray-mid hover:text-signal">
          ← Back to editing
        </Link>
        <div className="ml-2 flex overflow-hidden rounded-lg border border-gray-rule">
          {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-3 py-1.5 text-xs font-bold capitalize ${device === d ? 'bg-surface2 text-chalk' : 'text-gray-mid'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <Link
          to={`/studio/${storyId}`}
          className="ml-auto rounded-lg border border-gray-rule bg-surface2 px-3 py-1.5 text-xs font-bold text-chalk hover:bg-[#222]"
        >
          Edit / Publish
        </Link>
      </header>

      <div className="flex flex-1 items-start justify-center overflow-auto p-6">
        {loading && <div className="text-sm text-gray-mid">Loading…</div>}
        {!loading && !bundle && <div className="text-sm text-red-400">Story not found.</div>}
        {bundle && <DevicePreview device={device} bundle={bundle} />}
      </div>
    </div>
  )
}
