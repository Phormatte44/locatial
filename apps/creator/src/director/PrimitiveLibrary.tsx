import { useDirector } from './directorStore'

const PRIMITIVES = [
  { type: 'bridge', label: 'Bridge' },
  { type: 'route', label: 'Route' },
  { type: 'blocked_road', label: 'Blocked Road' },
  { type: 'flood_glow', label: 'Flood Glow' },
  { type: 'traffic_flow', label: 'Traffic Flow' },
  { type: 'alternate_route', label: 'Alternate Route' },
  { type: 'label', label: 'Label' },
] as const

export function PrimitiveLibrary() {
  const d = useDirector()

  return (
    <div className="border-t border-gray-rule p-2">
      <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wide text-gray-mid">Primitives</div>
      <div className="flex flex-wrap gap-1">
        {PRIMITIVES.map((p) => {
          const actor = Object.values(d.story.actors).find((a) => a.type === p.type)
          return (
            <button
              key={p.type}
              type="button"
              disabled={!actor}
              onClick={() => actor && d.selectActor(actor.id)}
              className="rounded-md border border-gray-rule px-2 py-1 text-[10px] font-bold text-gray-lo hover:border-signal hover:text-chalk disabled:opacity-30"
            >
              {p.label}
            </button>
          )
        })}
      </div>
      <p className="mt-2 px-1 text-[10px] text-gray-hi">Use AI Director to place all primitives on stage.</p>
    </div>
  )
}
