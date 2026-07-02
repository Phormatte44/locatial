import type { ActorState } from '../spatial/types'
import { getActorStateAtBeat } from '../spatial/engine/timeline'
import { useDirector } from './directorStore'

const STATES: ActorState[] = [
  'hidden',
  'enter',
  'active',
  'persistent',
  'dimmed',
  'ghost',
  'broken',
  'exit',
]

export function BeatTimeline() {
  const d = useDirector()
  const { activeScene, activeBeatId, story } = d
  const beats = activeScene.beatTrack

  return (
    <div className="shrink-0 border-t border-gray-rule bg-surface1">
      <div className="flex items-center justify-between border-b border-gray-rule px-3 py-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-mid">Beat Timeline</span>
        <span className="text-[10px] text-gray-hi">Click a beat column · edit actor states per row</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-gray-rule text-gray-mid">
              <th className="sticky left-0 z-10 bg-surface1 px-3 py-2 text-left font-bold">Track</th>
              {beats.map((beat) => (
                <th key={beat.id} className="min-w-[100px] px-2 py-2 text-center font-bold">
                  <button
                    type="button"
                    onClick={() => d.setActiveBeat(beat.id)}
                    className={`rounded-md px-2 py-1 ${
                      beat.id === activeBeatId
                        ? 'bg-signal text-white'
                        : 'text-gray-lo hover:bg-surface2 hover:text-chalk'
                    }`}
                  >
                    {beat.title}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-rule/60">
              <td className="sticky left-0 z-10 bg-surface1 px-3 py-1.5 font-bold text-chalk">Camera</td>
              {beats.map((beat) => {
                const hasCam = activeScene.cameraTrack.keyframes.some((k) => k.beatId === beat.id)
                return (
                  <td key={beat.id} className="px-2 py-1.5 text-center text-gray-hi">
                    {hasCam ? '●' : '○'}
                  </td>
                )
              })}
            </tr>
            {activeScene.actorTracks.map((track) => {
              const actor = story.actors[track.actorId]
              if (!actor) return null
              const selected = d.selectedActorId === actor.id
              return (
                <tr
                  key={track.actorId}
                  className={`border-b border-gray-rule/40 ${selected ? 'bg-surface2/80' : ''}`}
                >
                  <td className="sticky left-0 z-10 bg-surface1 px-3 py-1">
                    <button
                      type="button"
                      onClick={() => d.selectActor(actor.id)}
                      className={`truncate text-left font-bold ${selected ? 'text-signal-pink' : 'text-chalk'}`}
                    >
                      {actor.name}
                    </button>
                  </td>
                  {beats.map((beat) => {
                    const { state } = getActorStateAtBeat(track, beat.id)
                    return (
                      <td key={beat.id} className="px-1 py-1">
                        <select
                          value={state}
                          onChange={(e) =>
                            d.updateActorKeyframe(actor.id, beat.id, e.target.value as ActorState)
                          }
                          className="w-full rounded border border-gray-rule bg-root px-1 py-0.5 text-[10px] text-chalk"
                        >
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
