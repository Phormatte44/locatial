import { useEffect, useReducer } from 'react'
import type { Map as MLMap } from 'maplibre-gl'
import { AnimatePresence, motion } from 'framer-motion'
import { ELEMENTS, type ElementDef, type LngLat } from '../data/geo'
import type { Beat, Scene, SceneElement } from '../data/scenes'

type Pt = { x: number; y: number }
type P = (ll: LngLat) => Pt

const STATE_OPACITY = { active: 1, persistent: 0.72, dimmed: 0.26 }

// ---------------------------------------------------------------------------

export function MapOverlay({ map, scene, beat }: { map: MLMap | null; scene: Scene; beat: Beat }) {
  const [, force] = useReducer((c: number) => c + 1, 0)

  useEffect(() => {
    if (!map) return
    const h = () => force()
    map.on('move', h)
    map.on('resize', h)
    // re-measure once layout settles (the map may mount before flex sizing)
    const raf = requestAnimationFrame(h)
    const ro = new ResizeObserver(h)
    ro.observe(map.getContainer())
    return () => {
      map.off('move', h)
      map.off('resize', h)
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [map])

  if (!map) return null
  const el = map.getContainer()
  const w = el.clientWidth
  const h = el.clientHeight
  if (!w || !h) return null
  const project: P = (ll) => {
    const p = map.project(ll)
    return { x: p.x, y: p.y }
  }
  // pixels per km at a given anchor latitude
  const kmPx = (at: LngLat, km: number) => {
    const a = map.project(at)
    const b = map.project([at[0] + km / (111.32 * Math.cos((at[1] * Math.PI) / 180)), at[1]])
    return Math.abs(b.x - a.x)
  }

  const visible = scene.elements.filter((e) => (e.beat ?? 0) <= beat)

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 5 }}
    >
      <Defs />
      <AnimatePresence>
        {visible.map((se) => {
          const def = ELEMENTS[se.id]
          const dimmedNow = se.dimAtBeat !== undefined && beat >= se.dimAtBeat
          const target = dimmedNow ? STATE_OPACITY.dimmed : STATE_OPACITY[se.state]
          return (
            <motion.g
              key={se.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: target }}
              exit={{ opacity: 0, transition: { duration: 0.7 } }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <Actor def={def} se={se} P={project} kmPx={kmPx} />
            </motion.g>
          )
        })}
      </AnimatePresence>
      {/* faint film grain for the cinematic surface */}
      <rect width={w} height={h} filter="url(#grain)" opacity="0.05" />
    </svg>
  )
}

// ---------------------------------------------------------------------------

function Defs() {
  return (
    <defs>
      <radialGradient id="storm-outer">
        <stop offset="0%" stopColor="#8b97f5" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#5a6bd8" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#5a6bd8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="storm-core">
        <stop offset="0%" stopColor="#e6ebff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#a5b0fb" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="warm-glow">
        <stop offset="0%" stopColor="#ffe6bd" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#ffce8a" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#ffce8a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cyan-glow">
        <stop offset="0%" stopColor="#9df2ff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#38cfe8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flood-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38cfe8" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#0e7c96" stopOpacity="0.42" />
      </linearGradient>
      <linearGradient id="vis-line" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffce8a" stopOpacity="0.15" />
        <stop offset="50%" stopColor="#ffe6bd" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ffce8a" stopOpacity="0.15" />
      </linearGradient>
      <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.2" />
      </filter>
      <filter id="soft-lg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="2.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <marker id="arrowhead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#7fe3f5" />
      </marker>
      <marker id="arrowhead-sm" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#9df2ff" />
      </marker>
    </defs>
  )
}

// ---------------------------------------------------------------------------

const d = (P: P, coords: LngLat[], close = false) =>
  coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${P(c).x.toFixed(1)},${P(c).y.toFixed(1)}`).join(' ') +
  (close ? ' Z' : '')

// Catmull-Rom → cubic bézier: floodwater should look organic, not surveyed
function smoothD(P: P, coords: LngLat[], close = false) {
  const pts = coords.map(P)
  if (pts.length < 3) return d(P, coords, close)
  const n = pts.length
  const get = (i: number) => (close ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let path = `M${get(0).x.toFixed(1)},${get(0).y.toFixed(1)}`
  const last = close ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1)
    const p1 = get(i)
    const p2 = get(i + 1)
    const p3 = get(i + 2)
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    path += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  return close ? path + ' Z' : path
}

const LABEL_PX = { xs: 9, sm: 10.5, md: 12.5 }
const LABEL_FILL = { water: '#7dd3fc', city: '#e8e6e1', quiet: '#7d8595', warm: '#ffce8a' }

function Actor({ def, se, P, kmPx }: { def: ElementDef; se: SceneElement; P: P; kmPx: (at: LngLat, km: number) => number }) {
  switch (def.kind) {
    case 'stormCore': {
      const c = P(def.at)
      const r = kmPx(def.at, def.km)
      return (
        <g>
          <circle cx={c.x} cy={c.y} r={r * 2.4} fill="url(#storm-outer)" className="tb-fill anim-breathe" />
          {/* rotating spiral texture */}
          <g className="tb-fill anim-spin-slow">
            <circle cx={c.x} cy={c.y} r={r * 1.55} fill="none" stroke="#aab4ff" strokeOpacity="0.28" strokeWidth="1" strokeDasharray={`${r * 1.4} ${r * 1.1}`} />
            <circle cx={c.x} cy={c.y} r={r * 1.05} fill="none" stroke="#c3cbff" strokeOpacity="0.34" strokeWidth="1" strokeDasharray={`${r * 0.9} ${r * 0.8}`} />
          </g>
          <circle cx={c.x} cy={c.y} r={r} fill="url(#storm-core)" className="tb-fill anim-pulse-soft" />
          <circle cx={c.x} cy={c.y} r={Math.max(2.5, r * 0.16)} fill="#eef1ff" filter="url(#glow)" />
        </g>
      )
    }
    case 'pressureField': {
      const c = P(def.at)
      const r = kmPx(def.at, def.km)
      return <circle cx={c.x} cy={c.y} r={r} fill="url(#storm-outer)" className="tb-fill anim-breathe" style={{ animationDuration: '7s' }} />
    }
    case 'windRing': {
      const c = P(def.at)
      const r = kmPx(def.at, def.km)
      return (
        <g>
          <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#8b97f5" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 7" className="tb-fill anim-spin-slower" />
          <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#8b97f5" strokeOpacity="0.6" strokeWidth="1" className="tb-fill anim-ring-pulse" style={{ animationDuration: '4.5s' }} />
        </g>
      )
    }
    case 'cone': {
      const path = d(P, def.ring, true)
      return (
        <g>
          <path d={path} fill="#8b97f5" opacity="0.1" />
          <path d={path} fill="none" stroke="#a3adf7" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="7 6" pathLength={1} className="anim-draw" style={{ strokeDasharray: '0.02 0.015' }} />
        </g>
      )
    }
    case 'modelTracks':
      return (
        <g>
          {def.paths.map((p, i) => (
            <path key={i} d={d(P, p)} fill="none" stroke="#9aa5c4" strokeOpacity="0.42" strokeWidth="1" pathLength={1} className="anim-draw" style={{ ['--d' as string]: `${i * 0.28}s` }} />
          ))}
        </g>
      )
    case 'stormTrack':
      return (
        <g filter="url(#glow)">
          <path d={d(P, def.path)} fill="none" stroke="#c7d2fe" strokeOpacity="0.85" strokeWidth="2" pathLength={1} className="anim-draw" />
          {def.path.map((c, i) => {
            const p = P(c)
            return <circle key={i} cx={p.x} cy={p.y} r="2.4" fill="#c7d2fe" className="anim-fade-up" style={{ ['--d' as string]: `${0.5 + i * 0.3}s` }} />
          })}
        </g>
      )
    case 'arrows': {
      const s = def.scale ?? 1
      return (
        <g>
          {def.paths.map((p, i) => (
            <g key={i}>
              <path d={d(P, p)} fill="none" stroke="#38cfe8" strokeOpacity="0.16" strokeWidth={9 * s} filter="url(#soft)" />
              <path
                d={d(P, p)}
                fill="none"
                stroke="#7fe3f5"
                strokeOpacity="0.85"
                strokeWidth={2.2 * s}
                pathLength={1}
                strokeDasharray="0.16 0.09"
                className="anim-flow"
                style={{ animationDelay: `${i * 0.5}s` }}
                markerEnd={s >= 0.8 ? 'url(#arrowhead)' : 'url(#arrowhead-sm)'}
              />
            </g>
          ))}
        </g>
      )
    }
    case 'area': {
      // water and atmosphere flow; official/municipal shapes stay surveyed
      const organic = def.tone === 'flood' || def.tone === 'funnel' || def.tone === 'outage'
      const path = organic ? smoothD(P, def.ring, true) : d(P, def.ring, true)
      const label = def.label && def.labelAt && (
        <MapLabel P={P} at={def.labelAt} text={def.label} size="xs" tone={def.tone === 'flood' ? 'water' : def.tone === 'zone' ? 'city' : 'quiet'} />
      )
      if (def.tone === 'flood')
        return (
          <g>
            <path d={path} fill="url(#flood-fill)" className="anim-bloom" />
            <path d={path} fill="none" stroke="#67e8f9" strokeOpacity="0.65" strokeWidth="1.1" pathLength={1} className="anim-draw" filter="url(#glow)" />
            {label}
          </g>
        )
      if (def.tone === 'zone')
        return (
          <g>
            <path d={path} fill="#e8e6e1" opacity="0.045" />
            <path d={path} fill="none" stroke="#e8e6e1" strokeOpacity="0.8" strokeWidth="1.3" pathLength={1} strokeDasharray="0.018 0.012" className="anim-draw" />
            {label}
          </g>
        )
      if (def.tone === 'outage')
        return (
          <g>
            <path d={path} fill="#02040a" opacity="0.62" filter="url(#soft-lg)" />
            <path d={path} fill="none" stroke="#4b5563" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2 4" />
            {label}
          </g>
        )
      if (def.tone === 'funnel')
        return (
          <g>
            <path d={path} fill="#38cfe8" opacity="0.1" filter="url(#soft-lg)" />
            <path d={path} fill="none" stroke="#38cfe8" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 5" />
            {label}
          </g>
        )
      // district
      return (
        <g>
          <path d={path} fill="#38bdf8" opacity="0.09" />
          <path d={path} fill="none" stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" />
          {label}
        </g>
      )
    }
    case 'line': {
      const path = d(P, def.path)
      const label = def.label && def.labelAt && (
        <MapLabel P={P} at={def.labelAt} text={def.label} size="xs" tone={def.tone === 'highwater' ? 'warm' : def.tone === 'bridge' ? 'city' : 'quiet'} />
      )
      const styles: Record<string, JSX.Element> = {
        embankment: <path d={path} fill="none" stroke="#d6d3d1" strokeOpacity="0.6" strokeWidth="1.3" pathLength={1} className="anim-draw" />,
        highwater: (
          <g filter="url(#glow)">
            <path d={smoothD(P, def.path)} fill="none" stroke="#d7f95c" strokeOpacity="0.95" strokeWidth="2" pathLength={1} className="anim-draw" style={{ animationDuration: '2.6s' }} />
          </g>
        ),
        distance: <path d={path} fill="none" stroke="#fde68a" strokeOpacity="0.75" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />,
        visibility: (
          <path d={path} fill="none" stroke="url(#vis-line)" strokeWidth="1.2" className="anim-glow-throb" filter="url(#glow)" />
        ),
        exposure: <path d={path} fill="none" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="9" filter="url(#soft-lg)" strokeLinecap="round" />,
        bridge: (
          <g filter="url(#glow)">
            <path d={path} fill="none" stroke="#e8e6e1" strokeOpacity="0.9" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        ),
      }
      return (
        <g>
          {styles[def.tone]}
          {label}
        </g>
      )
    }
    case 'glowPoint': {
      const c = P(def.at)
      const r = kmPx(def.at, def.km)
      return <circle cx={c.x} cy={c.y} r={r} fill="url(#cyan-glow)" className="tb-fill anim-pulse-soft" />
    }
    case 'route': {
      const path = d(P, def.path)
      const end = P(def.path[def.path.length - 1])
      const delay = `${def.delay ?? 0}s`
      const block = def.blockAtEnd && (
        <g className="anim-fade-up" style={{ ['--d' as string]: `${(def.delay ?? 0) + 1.2}s` }}>
          <BlockGlyph x={end.x} y={end.y} />
        </g>
      )
      switch (def.tone) {
        case 'intended':
          return <path d={path} fill="none" stroke="#e2e8f0" strokeOpacity="0.9" strokeWidth="2.4" pathLength={1} className="anim-draw" strokeLinecap="round" />
        case 'failed':
          return (
            <g>
              <path d={path} fill="none" stroke="#ff5c38" strokeOpacity="0.9" strokeWidth="2.2" pathLength={1} strokeDasharray="0.05 0.035" className="anim-draw" style={{ ['--d' as string]: delay }} />
              {block}
            </g>
          )
        case 'reroute':
          return <path d={path} fill="none" stroke="#a8b3c5" strokeOpacity="0.85" strokeWidth="1.8" pathLength={1} className="anim-draw" style={{ ['--d' as string]: delay, animationDuration: '2.4s' }} strokeLinecap="round" />
        case 'bus':
          return <path d={path} fill="none" stroke="#cbd5e1" strokeOpacity="0.7" strokeWidth="1.4" strokeDasharray="1.5 4" strokeLinecap="round" />
        case 'boat':
          return (
            <g filter="url(#glow)">
              <path d={path} fill="none" stroke="#7fe3f5" strokeOpacity="0.9" strokeWidth="2" pathLength={1} strokeDasharray="0.12 0.08" className="anim-flow-slow" />
            </g>
          )
        case 'walk':
          return <path d={path} fill="none" stroke="#fcd34d" strokeOpacity="0.9" strokeWidth="1.5" strokeDasharray="2 4.5" strokeLinecap="round" className="anim-fade-up" style={{ ['--d' as string]: delay }} />
      }
      return null
    }
    case 'marker':
      return <Marker def={def} P={P} />
    case 'ring': {
      const c = P(def.at)
      const r = kmPx(def.at, def.km)
      return (
        <g>
          <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#ffce8a" strokeOpacity="0.75" strokeWidth="1.2" strokeDasharray="5 4" className="tb-fill anim-ring-close" />
          <circle cx={c.x} cy={c.y} r={r * 0.82} fill="none" stroke="#ffce8a" strokeOpacity="0.25" strokeWidth="1" className="tb-fill anim-spin-slow" strokeDasharray="2 6" />
        </g>
      )
    }
    case 'dots': {
      const pts = def.path.map(P)
      return (
        <g>
          {Array.from({ length: def.n }, (_, i) => {
            const t = (i + 0.5) / def.n
            const jitter = ((i * 7919) % 13) / 13 - 0.5
            const p = alongPolyline(pts, t)
            return (
              <circle
                key={i}
                cx={p.x + jitter * 7}
                cy={p.y + (((i * 104729) % 11) / 11 - 0.5) * 7}
                r="1.9"
                fill="#fbbf24"
                className="tb-fill anim-warn"
                style={{ animationDelay: `${(i % 5) * 0.35}s`, animationDuration: '2.2s' }}
              />
            )
          })}
        </g>
      )
    }
    case 'label':
      return <MapLabel P={P} at={def.at} text={def.text} size={def.size ?? 'sm'} tone={def.tone ?? 'city'} dx={def.dx} dy={def.dy} />
    case 'consequence': {
      const c = P(def.at)
      const dx = def.dx ?? 0
      const dy = def.dy ?? 0
      return (
        <g className="anim-fade-up" style={{ ['--d' as string]: `${(def.n - 1) * 0.32}s` }}>
          <circle cx={c.x} cy={c.y} r="7.5" fill="#0b0e14" stroke="#e8e6e1" strokeOpacity="0.85" strokeWidth="1" />
          <text x={c.x} y={c.y + 3} textAnchor="middle" fontSize="8.5" fill="#e8e6e1" className="font-mono-ed" style={{ letterSpacing: 0 }}>
            {def.n}
          </text>
          <text x={c.x + (dx || 12)} y={c.y + dy + 3} textAnchor={dx && dx < 0 ? 'end' : 'start'} fontSize="8.5" fill="#b8bcc6" className="map-label" style={{ letterSpacing: '0.08em' }}>
            {def.text}
          </text>
        </g>
      )
    }
  }
  return null
}

// ---------------------------------------------------------------------------

function MapLabel({ P, at, text, size, tone, dx = 0, dy = 0 }: { P: P; at: LngLat; text: string; size: 'xs' | 'sm' | 'md'; tone: 'water' | 'city' | 'quiet' | 'warm'; dx?: number; dy?: number }) {
  const p = P(at)
  return (
    <text x={p.x + dx} y={p.y + dy} textAnchor="middle" fontSize={LABEL_PX[size]} fill={LABEL_FILL[tone]} className="map-label">
      {text}
    </text>
  )
}

function BlockGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g filter="url(#glow)">
      <circle cx={x} cy={y} r="6.5" fill="#1a0c08" stroke="#ff5c38" strokeWidth="1.4" />
      <path d={`M${x - 3},${y - 3} L${x + 3},${y + 3} M${x + 3},${y - 3} L${x - 3},${y + 3}`} stroke="#ff5c38" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

function Marker({ def, P }: { def: Extract<ElementDef, { kind: 'marker' }>; P: P }) {
  const c = P(def.at)
  const dx = def.dx ?? 0
  const dy = def.dy ?? 0
  const labelEl = def.label && (
    <g>
      <text x={c.x + dx} y={c.y + dy + (dy < 0 ? -4 : 12)} textAnchor="middle" fontSize="9" fill="#e8e6e1" className="map-label">
        {def.label}
      </text>
      {def.sub && (
        <text x={c.x + dx} y={c.y + dy + (dy < 0 ? 6 : 22)} textAnchor="middle" fontSize="7.5" fill="#8b93a3" className="map-label" style={{ letterSpacing: '0.1em' }}>
          {def.sub}
        </text>
      )}
    </g>
  )
  switch (def.icon) {
    case 'pump':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="9" fill="none" stroke="#ff5c38" strokeWidth="1.2" className="tb-fill anim-ring-pulse" />
          <rect x={c.x - 4} y={c.y - 4} width="8" height="8" fill="#12060a" stroke="#ff5c38" strokeWidth="1.4" className="anim-warn" />
          {labelEl}
        </g>
      )
    case 'breach':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="10" fill="none" stroke="#ff5c38" strokeWidth="1.2" className="tb-fill anim-ring-pulse" />
          <circle cx={c.x} cy={c.y} r="10" fill="none" stroke="#ff5c38" strokeWidth="1" className="tb-fill anim-ring-pulse" style={{ animationDelay: '1.4s' }} />
          <path d={`M${c.x},${c.y - 5} L${c.x + 5},${c.y} L${c.x},${c.y + 5} L${c.x - 5},${c.y} Z`} fill="#ff5c38" filter="url(#glow)" />
          {labelEl}
        </g>
      )
    case 'block':
      return (
        <g>
          <BlockGlyph x={c.x} y={c.y} />
          {labelEl}
        </g>
      )
    case 'wall':
      return (
        <g filter="url(#glow)">
          <path d={`M${c.x - 7},${c.y + 3} L${c.x - 2},${c.y - 2} M${c.x + 1},${c.y + 1} L${c.x + 7},${c.y - 5}`} stroke="#ff5c38" strokeWidth="2.2" strokeLinecap="round" />
          <path d={`M${c.x - 2},${c.y - 2} L${c.x + 1},${c.y + 4}`} stroke="#ff5c38" strokeWidth="1.2" strokeDasharray="2 2" />
          {labelEl}
        </g>
      )
    case 'port':
      return (
        <g>
          <path d={`M${c.x},${c.y - 4} L${c.x + 4},${c.y + 3} L${c.x - 4},${c.y + 3} Z`} fill="none" stroke="#9aa5c4" strokeWidth="1.2" />
          {labelEl}
        </g>
      )
    case 'school':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="7" fill="url(#warm-glow)" className="tb-fill anim-pulse-soft" />
          <circle cx={c.x} cy={c.y} r="3" fill="#ffce8a" />
          {labelEl}
        </g>
      )
    case 'shelter':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="16" fill="url(#warm-glow)" className="tb-fill anim-pulse-soft" />
          <circle cx={c.x} cy={c.y} r="4.5" fill="#ffe6bd" filter="url(#glow)" />
          <circle cx={c.x} cy={c.y} r="8.5" fill="none" stroke="#ffce8a" strokeOpacity="0.7" strokeWidth="1" />
          {labelEl}
        </g>
      )
    case 'hospital':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="14" fill="url(#warm-glow)" className="tb-fill anim-glow-throb" />
          <circle cx={c.x} cy={c.y} r="7" fill="#141009" stroke="#ffe6bd" strokeWidth="1.2" />
          <path d={`M${c.x - 3},${c.y} L${c.x + 3},${c.y} M${c.x},${c.y - 3} L${c.x},${c.y + 3}`} stroke="#ffe6bd" strokeWidth="1.6" strokeLinecap="round" />
          {labelEl}
        </g>
      )
    case 'seq':
      return (
        <g>
          <circle cx={c.x} cy={c.y} r="2.4" fill="#9df2ff" filter="url(#glow)" />
          {def.label && (
            <text x={c.x + (dx || 0)} y={c.y + (dy || -8)} textAnchor="middle" fontSize="7.5" fill="#9db2c4" className="map-label" style={{ letterSpacing: '0.1em' }}>
              {def.label}
            </text>
          )}
        </g>
      )
    case 'origin':
      return (
        <g>
          <rect x={c.x - 3.5} y={c.y - 3.5} width="7" height="7" transform={`rotate(45 ${c.x} ${c.y})`} fill="none" stroke="#7fe3f5" strokeWidth="1.4" />
          {labelEl}
        </g>
      )
  }
  return null
}

function alongPolyline(pts: Pt[], t: number): Pt {
  if (pts.length < 2) return pts[0] ?? { x: 0, y: 0 }
  const segs: number[] = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const len = Math.hypot(dx, dy)
    segs.push(len)
    total += len
  }
  let dist = t * total
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i] || i === segs.length - 1) {
      const f = segs[i] === 0 ? 0 : dist / segs[i]
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * f,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * f,
      }
    }
    dist -= segs[i]
  }
  return pts[pts.length - 1]
}
