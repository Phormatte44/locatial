// ReaderMap — sphere markers, great-circle arcs, animated chaser between chapters.
import { useEffect, useRef } from 'react'
import type { Chapter } from '../../domain/types'
import { directCamera } from '../../domain/cameraDirector'
import { maplibregl, useMaplibre } from '../map/useMaplibre'

type LngLat = [number, number]

const SIGNAL = '#ff2d7a'

// Great-circle interpolation — densified for smooth curves on a globe projection.
function greatCircle(a: LngLat, b: LngLat, n = 80): LngLat[] {
  const R = Math.PI / 180, D = 180 / Math.PI
  const la1 = a[1]*R, lo1 = a[0]*R, la2 = b[1]*R, lo2 = b[0]*R
  const d = 2*Math.asin(Math.sqrt(Math.sin((la2-la1)/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin((lo2-lo1)/2)**2))
  if (!d) return [a, b]
  const pts: LngLat[] = []
  for (let i = 0; i <= n; i++) {
    const f = i/n, A = Math.sin((1-f)*d)/Math.sin(d), B = Math.sin(f*d)/Math.sin(d)
    const x = A*Math.cos(la1)*Math.cos(lo1) + B*Math.cos(la2)*Math.cos(lo2)
    const y = A*Math.cos(la1)*Math.sin(lo1) + B*Math.cos(la2)*Math.sin(lo2)
    const z = A*Math.sin(la1) + B*Math.sin(la2)
    pts.push([Math.atan2(y,x)*D, Math.atan2(z,Math.hypot(x,y))*D])
  }
  return pts
}

function makeSphere(): HTMLDivElement {
  const el = document.createElement('div')
  el.style.borderRadius = '50%'
  el.style.pointerEvents = 'auto'
  el.style.cursor = 'pointer'
  return el
}

function styleSphere(el: HTMLElement, active: boolean) {
  if (active) {
    el.style.width = '14px'
    el.style.height = '14px'
    el.style.opacity = '1'
    el.style.background = `radial-gradient(circle at 38% 38%, #ff8cb5, ${SIGNAL} 50%, #c4005a)`
    el.style.boxShadow = `0 0 0 3px rgba(255,45,122,0.25), 0 3px 10px rgba(255,45,122,0.5), 0 1px 3px rgba(0,0,0,0.3)`
    el.style.zIndex = '10'
  } else {
    el.style.width = '10px'
    el.style.height = '10px'
    el.style.opacity = '1'
    // White sphere with a gray ring — clearly distinct from the gray arc lines.
    el.style.background = '#ffffff'
    el.style.boxShadow = '0 0 0 2px rgba(130,144,160,0.65), 0 2px 6px rgba(0,0,0,0.12)'
    el.style.zIndex = '2'
  }
}

function buildArcData(chapters: Chapter[]) {
  const located = chapters.filter(c => typeof c.longitude === 'number' && typeof c.latitude === 'number')
  const features = []
  for (let i = 0; i < located.length - 1; i++) {
    const a: LngLat = [located[i].longitude!, located[i].latitude!]
    const b: LngLat = [located[i+1].longitude!, located[i+1].latitude!]
    features.push({
      type: 'Feature' as const,
      geometry: { type: 'LineString' as const, coordinates: greatCircle(a, b) },
      properties: { idx: i },
    })
  }
  return { type: 'FeatureCollection' as const, features }
}

type Props = {
  chapters: Chapter[]
  activeIndex: number
  reducedMotion?: boolean
  onChapterClick?: (index: number) => void
}

export function ReaderMap({ chapters, activeIndex, reducedMotion, onChapterClick }: Props) {
  const first = chapters.find((c) => typeof c.longitude === 'number')
  const { containerRef, mapRef, ready } = useMaplibre({
    interactive: true,
    center: first ? [first.longitude!, first.latitude!] : undefined,
    zoom: 13,
  })
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())
  const prevIndexRef = useRef<number>(-1)
  const prevLngLatRef = useRef<LngLat | null>(null)
  const chaserRef = useRef<maplibregl.Marker | null>(null)
  const arcAnimRef = useRef<number | null>(null)

  // Sphere markers — build/refresh on chapter or activeIndex change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const active = chapters[activeIndex]
    const seen = new Set<string>()
    chapters.forEach((c, idx) => {
      if (typeof c.longitude !== 'number' || typeof c.latitude !== 'number') return
      seen.add(c.id)
      let marker = markersRef.current.get(c.id)
      const isNew = !marker
      const el = marker?.getElement() ?? makeSphere()
      styleSphere(el, c.id === active?.id)
      if (isNew) {
        el.addEventListener('click', () => onChapterClick?.(idx))
        marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([c.longitude, c.latitude])
          .addTo(map)
        markersRef.current.set(c.id, marker)
      } else {
        marker!.setLngLat([c.longitude, c.latitude])
      }
    })
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) { marker.remove(); markersRef.current.delete(id) }
    }
  }, [chapters, activeIndex, ready, mapRef])

  // Arc source + layer — added once, data refreshed when chapters change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const data = buildArcData(chapters)
    if (map.getSource('chapter-arcs')) {
      (map.getSource('chapter-arcs') as maplibregl.GeoJSONSource).setData(data)
    } else {
      map.addSource('chapter-arcs', { type: 'geojson', data })
      // Insert arc lines above hillshade/boundaries but below roads.
      map.addLayer(
        {
          id: 'chapter-arc-lines',
          type: 'line',
          source: 'chapter-arcs',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#8c9aaa',
            'line-width': 1.2,
            'line-opacity': 0.55,
          },
        } as any,  // eslint-disable-line @typescript-eslint/no-explicit-any
        'roads'
      )
    }
  }, [chapters, ready, mapRef])

  // Chaser marker — created once, animated along the arc during transitions.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const el = document.createElement('div')
    el.style.cssText = [
      'width:10px;height:10px;border-radius:50%;pointer-events:none;',
      `background:${SIGNAL};`,
      'box-shadow:0 0 0 6px rgba(255,45,122,0.2),0 0 16px 6px rgba(255,45,122,0.4);',
      'transition:box-shadow 0.2s;',
    ].join('')
    const chaser = new maplibregl.Marker({ element: el, anchor: 'center' })
    chaserRef.current = chaser
    return () => {
      chaser.remove()
      if (arcAnimRef.current) cancelAnimationFrame(arcAnimRef.current)
      chaserRef.current = null
    }
  }, [ready, mapRef])

  // Camera movement + chaser animation — fires on activeIndex change.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const to = chapters[activeIndex]
    if (!to) return

    const isFirstMove = prevIndexRef.current < 0
    prevIndexRef.current = activeIndex

    const move = directCamera({ to, reducedMotion })
    if (!move) {
      if (to.longitude != null && to.latitude != null) prevLngLatRef.current = [to.longitude, to.latitude]
      return
    }

    const base = { center: move.center, zoom: move.zoom, pitch: move.pitch, bearing: move.bearing }

    if (move.mode === 'jump-to' || isFirstMove) {
      map.jumpTo(base)
    } else {
      map.flyTo({ ...base, speed: move.speed, curve: move.curve, essential: true })

      // Animate chaser along the arc from the previous chapter to this one.
      const chaser = chaserRef.current
      if (chaser && prevLngLatRef.current && to.longitude != null && to.latitude != null) {
        const arc = greatCircle(prevLngLatRef.current, [to.longitude, to.latitude])
        const DURATION = 2800
        const t0 = performance.now()
        if (arcAnimRef.current) cancelAnimationFrame(arcAnimRef.current)
        chaser.setLngLat(arc[0]).addTo(map)
        const tick = (now: number) => {
          const t = Math.min((now - t0) / DURATION, 1)
          chaser.setLngLat(arc[Math.floor(t * (arc.length - 1))])
          if (t < 1) { arcAnimRef.current = requestAnimationFrame(tick) }
          else { chaser.remove() }
        }
        arcAnimRef.current = requestAnimationFrame(tick)
      }
    }

    if (to.longitude != null && to.latitude != null) prevLngLatRef.current = [to.longitude, to.latitude]
  }, [activeIndex, chapters, ready, reducedMotion, mapRef])

  return <div ref={containerRef} className="h-full w-full" data-testid="reader-map" />
}
