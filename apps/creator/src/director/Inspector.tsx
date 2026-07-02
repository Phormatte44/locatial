import type { ReactNode } from 'react'
import { getCameraForBeat, getActorStateAtBeat } from '../spatial/engine/timeline'
import { useDirector } from './directorStore'

export function Inspector() {
  const d = useDirector()
  const scene = d.activeScene
  const beat = scene.beatTrack.find((b) => b.id === d.activeBeatId)

  if (d.selectedActorId) {
    const actor = d.story.actors[d.selectedActorId]
    const track = scene.actorTracks.find((t) => t.actorId === actor.id)
    if (!actor || !track) return null

    const atBeat = getActorStateAtBeat(track, d.activeBeatId)

    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-gray-rule bg-surface1">
        <div className="border-b border-gray-rule px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-mid">
          Inspector · Actor
        </div>
        <div className="flex-1 overflow-y-auto p-3 text-sm">
          <Field label="Name">
            <input
              value={actor.name}
              onChange={(e) => d.updateActor(actor.id, { name: e.target.value })}
              className="w-full rounded-lg border border-gray-rule bg-root px-2 py-1.5 text-chalk"
            />
          </Field>
          <Field label="Type">
            <span className="text-chalk">{actor.type}</span>
          </Field>
          {actor.type === 'label' && (
            <Field label="Label text">
              <textarea
                value={actor.defaultStyle.labelText ?? ''}
                onChange={(e) =>
                  d.updateActor(actor.id, {
                    defaultStyle: { ...actor.defaultStyle, labelText: e.target.value },
                  })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-rule bg-root px-2 py-1.5 text-chalk"
              />
            </Field>
          )}
          <Field label={`State @ ${beat?.title ?? 'beat'}`}>
            <span className="font-bold capitalize text-signal-pink">{atBeat.state}</span>
          </Field>
          <Field label="Color">
            <input
              type="color"
              value={actor.defaultStyle.color ?? '#ffffff'}
              onChange={(e) =>
                d.updateActor(actor.id, {
                  defaultStyle: { ...actor.defaultStyle, color: e.target.value },
                })
              }
              className="h-8 w-full cursor-pointer rounded border border-gray-rule bg-root"
            />
          </Field>
        </div>
      </aside>
    )
  }

  const cam = beat ? getCameraForBeat(scene.cameraTrack, beat.id) : undefined

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-gray-rule bg-surface1">
      <div className="border-b border-gray-rule px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-mid">
        Inspector · Scene
      </div>
      <div className="flex-1 overflow-y-auto p-3 text-sm">
        <Field label="Scene type">
          <span className="capitalize text-chalk">{scene.sceneType.replace('_', ' ')}</span>
        </Field>
        <Field label="Map sentence">
          <p className="text-chalk">{scene.mapSentence}</p>
        </Field>
        <Field label="Map look">
          <select
            value={d.mapLookId}
            onChange={(e) => d.setMapLook(e.target.value)}
            className="w-full rounded-lg border border-gray-rule bg-root px-2 py-1.5 text-chalk"
          >
            {Object.values(d.story.mapLooks).map((look) => (
              <option key={look.id} value={look.id}>
                {look.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Beats">{scene.beatTrack.length}</Field>
        <Field label="Actors">{scene.actorTracks.length}</Field>

        {cam && beat && (
          <>
            <div className="my-3 border-t border-gray-rule pt-3 text-[10px] font-bold uppercase tracking-wide text-gray-mid">
              Camera · {beat.title}
            </div>
            <Field label="Center">
              {cam.center[1].toFixed(4)}, {cam.center[0].toFixed(4)}
            </Field>
            <Field label="Zoom">{cam.zoom.toFixed(2)}</Field>
            <Field label="Pitch">{cam.pitch.toFixed(0)}°</Field>
            <Field label="Bearing">{cam.bearing.toFixed(0)}°</Field>
            <Field label="Easing">{cam.easing.replace('_', ' ')}</Field>
          </>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-gray-mid">
          Select an actor row in the timeline to edit it. Pan the map, then Capture Camera for the active beat.
        </p>
      </div>
    </aside>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-hi">{label}</div>
      <div className="text-gray-lo">{children}</div>
    </div>
  )
}
