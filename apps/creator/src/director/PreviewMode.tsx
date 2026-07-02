import { SpatialScenePlayer } from '../spatial/player/SpatialScenePlayer'
import { useDirector } from './directorStore'

export function PreviewMode() {
  const d = useDirector()
  if (d.mode !== 'preview') return null

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-night">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-rule px-4 py-2">
        <span className="text-xs font-extrabold text-chalk">Preview · same SpatialScenePlayer as public app</span>
        <button
          type="button"
          onClick={() => d.setMode('author')}
          className="rounded-lg border border-gray-rule px-3 py-1.5 text-[11px] font-bold text-chalk hover:border-signal"
        >
          ← Back to Author
        </button>
      </div>
      <div className="mx-auto min-h-0 w-full max-w-lg flex-1">
        <SpatialScenePlayer story={d.story} scene={d.activeScene} showChrome />
      </div>
    </div>
  )
}
