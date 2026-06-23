// ReaderMap — sphere markers, arcs, chaser, cinematic arrival, territory footprint.
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
    el.style.background = `radial-gradient(circle at 38% 38%, #ff8cb5, ${SIGNAL} 50%, #c4005a)`
    el.style.boxShadow = `0 0 0 3px rgba(255,45,122,0.25), 0 3px 10px rgba(255,45,122,0.5), 0 1px 3px rgba(0,0,0,0.3)`
    el.style.zIndex = '10'
  } else {
    el.style.width = '10px'
    el.style.height = '10px'
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

// Map chapter zoom → Nominatim admin detail level.
function nomZoomFor(chapterZoom: number): number {
  if (chapterZoom < 6)  return 3   // country
  if (chapterZoom < 9)  return 5   // state / region
  if (chapterZoom < 12) return 10  // city
  if (chapterZoom < 15) return 14  // suburb / neighbourhood
  return 16                        // district / street block
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
  const markersRef    = useRef<Map<string, maplibregl.Marker>>(new Map())
  const prevIndexRef  = useRef<number>(-1)
  const prevLngLatRef = useRef<LngLat | null>(null)
  const chaserRef     = useRef<maplibregl.Marker | null>(null)
  const arcAnimRef    = useRef<number | null>(null)
  const labelMarkerRef = useRef<maplibregl.Marker | null>(null)
  // Cache fetched footprint GeoJSON per chapter id to avoid repeat API calls.
  const footprintCache = useRef<Map<string, object | null>>(new Map())

  // ── Sphere markers ──────────────────────────────────────────────────────────
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

  // ── Arc + footprint GL sources / layers (added once) ────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    // Arc lines between consecutive chapters.
    const arcData = buildArcData(chapters)
    if (map.getSource('chapter-arcs')) {
      (map.getSource('chapter-arcs') as maplibregl.GeoJSONSource).setData(arcData)
    } else {
      map.addSource('chapter-arcs', { type: 'geojson', data: arcData })
      map.addLayer(
        {
          id: 'chapter-arc-lines', type: 'line', source: 'chapter-arcs',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#8c9aaa', 'line-width': 1.2, 'line-opacity': 0.55 },
        } as any, 'roads' // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    }

    // Territory footprint — filled when camera arrives, cleared on departure.
    if (!map.getSource('chapter-footprint')) {
      map.addSource('chapter-footprint', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })
      map.addLayer(
        {
          id: 'chapter-footprint-fill', type: 'fill', source: 'chapter-footprint',
          paint: {
            'fill-color': SIGNAL,
            'fill-opacity': 0,
            'fill-opacity-transition': { duration: 700, delay: 0 },
          },
        } as any, 'roads' // eslint-disable-line @typescript-eslint/no-explicit-any
      )
      map.addLayer(
        {
          id: 'chapter-footprint-stroke', type: 'line', source: 'chapter-footprint',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': SIGNAL,
            'line-width': 1.4,
            'line-opacity': 0,
            'line-opacity-transition': { duration: 700, delay: 0 },
          },
        } as any, 'roads' // eslint-disable-line @typescript-eslint/no-explicit-any
      )
    }
  }, [chapters, ready, mapRef])

  // ── Chaser marker (created once) ────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const el = document.createElement('div')
    el.style.cssText = [
      'width:10px;height:10px;border-radius:50%;pointer-events:none;',
      `background:${SIGNAL};`,
      'box-shadow:0 0 0 6px rgba(255,45,122,0.2),0 0 16px 6px rgba(255,45,122,0.4);',
    ].join('')
    const chaser = new maplibregl.Marker({ element: el, anchor: 'center' })
    chaserRef.current = chaser
    return () => {
      chaser.remove()
      if (arcAnimRef.current) cancelAnimationFrame(arcAnimRef.current)
      chaserRef.current = null
    }
  }, [ready, mapRef])

  // ── Camera + arrival effects ─────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const to = chapters[activeIndex]
    if (!to) return

    const isFirstMove = prevIndexRef.current < 0
    const idx = activeIndex
    prevIndexRef.current = activeIndex

    // Fade out old footprint + clear old label at the start of every transition.
    if (map.getLayer('chapter-footprint-fill')) {
      map.setPaintProperty('chapter-footprint-fill',   'fill-opacity', 0)
      map.setPaintProperty('chapter-footprint-stroke', 'line-opacity', 0)
    }
    labelMarkerRef.current?.remove()
    labelMarkerRef.current = null

    const move = directCamera({ to, reducedMotion })
    if (!move) {
      if (to.longitude != null && to.latitude != null) prevLngLatRef.current = [to.longitude, to.latitude]
      return
    }

    const base = { center: move.center, zoom: move.zoom, pitch: move.pitch, bearing: move.bearing }

    // showArrival fires after the camera settles — for both jumpTo and flyTo.
    const showArrival = (withCinematic: boolean) => {
      if (prevIndexRef.current !== idx) return
      const chapter = chapters[idx]
      if (!chapter?.longitude || !chapter?.latitude) return

      if (withCinematic) {
        // Ripple pulse on the active sphere.
        const activeMarker = markersRef.current.get(chapter.id)
        if (activeMarker) {
          const ripple = document.createElement('div')
          ripple.className = 'loc-sphere-ripple'
          activeMarker.getElement().appendChild(ripple)
          setTimeout(() => ripple.remove(), 1500)
        }
      }

      // Image card (or text label fallback) anchored above the active sphere.
      const el = makeArrivalCard(chapter)
      if (el) {
        labelMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -24] })
          .setLngLat([chapter.longitude, chapter.latitude])
          .addTo(map)
      }

      // Territory footprint — Nominatim reverse-geocode → admin polygon.
      const cacheKey = chapter.id
      if (footprintCache.current.has(cacheKey)) {
        const cached = footprintCache.current.get(cacheKey)
        if (cached) showFootprint(map, cached)
        return
      }
      const nomZoom = nomZoomFor(chapter.camera?.zoom ?? 13)
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${chapter.latitude}&lon=${chapter.longitude}&format=geojson&zoom=${nomZoom}&polygon_geojson=1`
      fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(r => r.json())
        .then(data => {
          const geom = data?.geometry
          if (!geom || (geom.type !== 'Polygon' && geom.type !== 'MultiPolygon')) {
            footprintCache.current.set(cacheKey, null)
            return
          }
          const feature = { type: 'Feature', geometry: geom, properties: {} }
          footprintCache.current.set(cacheKey, feature)
          if (prevIndexRef.current === idx) showFootprint(mapRef.current!, feature)
        })
        .catch(() => footprintCache.current.set(cacheKey, null))
    }

    if (isFirstMove) {
      map.jumpTo(base)
      // jumpTo fires moveend synchronously — use setTimeout to fire after render.
      setTimeout(() => showArrival(false), 400)
    } else {
      map.flyTo({ ...base, speed: move.speed, curve: move.curve, essential: true })

      // Chaser along the arc while the camera flies.
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

      map.once('moveend', () => showArrival(true))
    }

    if (to.longitude != null && to.latitude != null) prevLngLatRef.current = [to.longitude, to.latitude]
  }, [activeIndex, chapters, ready, reducedMotion, mapRef])

  return <div ref={containerRef} className="h-full w-full" data-testid="reader-map" />
}

// Build the arrival card: image card if the chapter has a photo, text pill fallback.
function makeArrivalCard(chapter: Chapter): HTMLDivElement | null {
  const imageUrl = chapter.imageUrl
  const label = chapter.name || chapter.headline

  if (imageUrl) {
    const card = document.createElement('div')
    card.className = 'loc-image-card'

    const img = document.createElement('img')
    img.src = imageUrl
    img.alt = label ?? ''
    card.appendChild(img)

    if (label) {
      const cap = document.createElement('div')
      cap.className = 'loc-image-card-caption'
      cap.textContent = label
      card.appendChild(cap)
    }
    return card
  }

  if (label) {
    const pill = document.createElement('div')
    pill.className = 'loc-chapter-label'
    pill.textContent = chapter.headline || label
    return pill
  }

  return null
}

// Set footprint GeoJSON and fade in the fill + stroke layers.
function showFootprint(map: maplibregl.Map, feature: object) {
  const src = map.getSource('chapter-footprint') as maplibregl.GeoJSONSource | undefined
  if (!src) return
  src.setData(feature as any) // eslint-disable-line @typescript-eslint/no-explicit-any
  // Tick lets MapLibre process the new data before the opacity transition fires.
  requestAnimationFrame(() => {
    if (!map.getLayer('chapter-footprint-fill')) return
    map.setPaintProperty('chapter-footprint-fill',   'fill-opacity', 0.07)
    map.setPaintProperty('chapter-footprint-stroke', 'line-opacity', 0.28)
  })
}
