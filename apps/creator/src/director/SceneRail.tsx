import { useDirector } from './directorStore'

export function SceneRail() {
  const d = useDirector()
  const scene = d.activeScene
  const actorCount = scene.actorTracks.length
  const beatCount = scene.beatTrack.length
  const cameraCaptured = scene.cameraTrack.keyframes.length >= beatCount

  return (
    <aside className="flex flex-1 flex-col border-r border-gray-rule bg-surface1">
      <div className="border-b border-gray-rule px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-mid">
        Scenes
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <button
          type="button"
          className="w-full rounded-xl border border-signal bg-surface2 p-3 text-left"
        >
          <div className="text-[10px] font-bold text-signal-pink">Scene 07</div>
          <div className="mt-0.5 text-sm font-extrabold leading-tight text-chalk">{scene.title}</div>
          <p className="mt-2 text-[11px] leading-snug text-gray-mid">{scene.mapSentence}</p>
          <dl className="mt-3 grid grid-cols-2 gap-1 text-[10px] text-gray-hi">
            <div>
              <dt>Actors</dt>
              <dd className="font-bold text-chalk">{actorCount}</dd>
            </div>
            <div>
              <dt>Beats</dt>
              <dd className="font-bold text-chalk">{beatCount}</dd>
            </div>
            <div className="col-span-2">
              <dt>Camera</dt>
              <dd className="font-bold text-chalk">{cameraCaptured ? 'Captured' : 'Partial'}</dd>
            </div>
          </dl>
        </button>
      </div>
    </aside>
  )
}
