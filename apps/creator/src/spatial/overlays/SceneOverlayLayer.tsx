import { useEffect, useRef, useState } from 'react'
import type { Map } from 'maplibre-gl'
import type { ActorState, ActorStyle, SpatialActor } from '../types'
import { actorOpacity, isActorVisible } from '../engine/timeline'

type ProjectedActor = {
  actor: SpatialActor
  state: ActorState
  style: ActorStyle
  animationPreset?: string
  points: Array<[number, number]>
  label?: string
}

type Props = {
  map: Map | null
  ready: boolean
  actors: Array<{
    actor: SpatialActor
    state: ActorState
    style: ActorStyle
    animationPreset?: string
  }>
  beatIndex: number
}

function projectGeometry(
  map: Map,
  actor: SpatialActor,
): Array<[number, number]> {
  const g = actor.geometry
  if (g.type === 'Point') {
    const p = map.project([g.coordinates[0], g.coordinates[1]])
    return [[p.x, p.y]]
  }
  if (g.type === 'LineString') {
    return g.coordinates.map((c: number[]) => {
      const p = map.project([c[0], c[1]])
      return [p.x, p.y] as [number, number]
    })
  }
  if (g.type === 'Polygon') {
    return g.coordinates[0].map((c: number[]) => {
      const p = map.project([c[0], c[1]])
      return [p.x, p.y] as [number, number]
    })
  }
  return []
}

function polyline(points: Array<[number, number]>, progress = 1): string {
  if (points.length === 0) return ''
  const count = Math.max(2, Math.ceil(points.length * progress))
  const slice = points.slice(0, count)
  return slice.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
}

function polygon(points: Array<[number, number]>): string {
  if (points.length < 3) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ' Z'
}

function RouteActorView({
  points,
  color,
  opacity,
  broken,
  drawProgress,
}: {
  points: Array<[number, number]>
  color: string
  opacity: number
  broken?: boolean
  drawProgress: number
}) {
  const breakAt = broken ? Math.floor(points.length * 0.72) : points.length
  const visible = points.slice(0, breakAt)
  const d = polyline(visible, drawProgress)
  if (!d) return null
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={0.25} filter="url(#glow)" />
      <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {broken && visible.length > 1 && (
        <circle
          cx={visible[visible.length - 1][0]}
          cy={visible[visible.length - 1][1]}
          r={7}
          fill="#ff6b35"
          stroke="#fff"
          strokeWidth={2}
        />
      )}
    </g>
  )
}

export function SceneOverlayLayer({ map, ready, actors, beatIndex }: Props) {
  const [projected, setProjected] = useState<ProjectedActor[]>([])
  const rafRef = useRef<number | null>(null)
  const drawStartRef = useRef<number>(Date.now())

  useEffect(() => {
    drawStartRef.current = Date.now()
  }, [beatIndex])

  useEffect(() => {
    if (!map || !ready) return

    const update = () => {
      const next: ProjectedActor[] = actors
        .filter((a) => isActorVisible(a.state))
        .map((a) => ({
          ...a,
          points: projectGeometry(map, a.actor),
          label: a.style.labelText ?? (a.actor.properties.label as string | undefined),
        }))
      setProjected(next)
    }

    update()
    const onMove = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }
    map.on('move', onMove)
    map.on('resize', onMove)
    return () => {
      map.off('move', onMove)
      map.off('resize', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [map, ready, actors, beatIndex])

  const drawProgress = Math.min(1, (Date.now() - drawStartRef.current) / 1400)

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {projected.map(({ actor, state, style, animationPreset, points, label }) => {
        const opacity = actorOpacity(state, style.opacity ?? 1)
        const color = style.color ?? '#f5f0e6'

        if (actor.type === 'route') {
          return (
            <RouteActorView
              key={actor.id}
              points={points}
              color={color}
              opacity={opacity}
              broken={state === 'broken' || animationPreset === 'break'}
              drawProgress={animationPreset === 'draw' || state === 'enter' ? drawProgress : 1}
            />
          )
        }

        if (actor.type === 'alternate_route') {
          return (
            <RouteActorView
              key={actor.id}
              points={points}
              color={color}
              opacity={opacity}
              drawProgress={animationPreset === 'draw' ? drawProgress : 1}
            />
          )
        }

        if (actor.type === 'traffic_flow') {
          const d = polyline(points, 1)
          return d ? (
            <g key={actor.id} opacity={opacity}>
              <path d={d} fill="none" stroke={color} strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" opacity={0.8} />
            </g>
          ) : null
        }

        if (actor.type === 'flood_glow' && points.length > 2) {
          return (
            <path
              key={actor.id}
              d={polygon(points)}
              fill={color}
              opacity={opacity * 0.55}
              stroke={color}
              strokeWidth={1}
              strokeOpacity={0.4}
            />
          )
        }

        if (actor.type === 'blocked_road' && points[0]) {
          const [x, y] = points[0]
          return (
            <g key={actor.id} opacity={opacity}>
              <circle cx={x} cy={y} r={style.pulse ? 22 : 16} fill="#ff6b35" opacity={0.2} className={style.pulse ? 'loc-scene-pulse' : undefined} />
              <circle cx={x} cy={y} r={8} fill="#ff6b35" stroke="#fff" strokeWidth={2} />
              {label && (
                <text x={x + 14} y={y - 10} fill="#ff6b35" fontSize={11} fontWeight={700}>
                  {label}
                </text>
              )}
            </g>
          )
        }

        if (actor.type === 'bridge' && points[0]) {
          const [x, y] = points[0]
          return (
            <g key={actor.id} opacity={opacity}>
              <circle cx={x} cy={y} r={6} fill={color} stroke="#fff" strokeWidth={2} />
              <text x={x + 12} y={y + 4} fill={color} fontSize={11} fontWeight={800}>
                {actor.name}
              </text>
            </g>
          )
        }

        if (actor.type === 'label' && points[0]) {
          const [x, y] = points[0]
          const text = style.labelText ?? label ?? actor.name
          return (
            <g key={actor.id} opacity={opacity}>
              <rect x={x - 120} y={y - 36} width={240} height={52} rx={8} fill="rgba(19,19,19,0.88)" stroke="rgba(255,255,255,0.12)" />
              <text x={x} y={y - 8} textAnchor="middle" fill={color} fontSize={12} fontWeight={800}>
                {text.split('. ')[0]}.
              </text>
              <text x={x} y={y + 10} textAnchor="middle" fill="#b6b6b6" fontSize={11} fontWeight={600}>
                {text.split('. ').slice(1).join('. ')}
              </text>
            </g>
          )
        }

        return null
      })}
    </svg>
  )
}
