// StoryMap — studio map. Shows every located chapter, emphasises the active one,
// and lets the creator click the map to place/adjust the active chapter's location.
import { useEffect, useRef } from 'react'
import type { Chapter } from '../../domain/types'
import { makePinElement, maplibregl, stylePin, useMaplibre } from '../map/useMaplibre'

type Props = {
  chapters: Chapter[]
  activeChapterId: string | null
  onMapClick?: (lng: number, lat: number) => void
}

export function StoryMap({ chapters, activeChapterId, onMapClick }: Props) {
  const { containerRef, mapRef, ready } = useMaplibre({ interactive: true })
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())
  const clickRef = useRef(onMapClick)
  clickRef.current = onMapClick

  // Map click → place active chapter.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const handler = (e: maplibregl.MapMouseEvent) => {
      clickRef.current?.(e.lngLat.lng, e.lngLat.lat)
    }
    map.on('click', handler)
    return () => {
      map.off('click', handler)
    }
  }, [ready, mapRef])

  // Sync markers to located chapters.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const located = chapters.filter((c) => typeof c.longitude === 'number' && typeof c.latitude === 'number')
    const seen = new Set<string>()

    for (const c of located) {
      seen.add(c.id)
      let marker = markersRef.current.get(c.id)
      const el = marker?.getElement() ?? makePinElement(c.name || `#${c.position}`)
      const lbl = el.querySelector('.loc-pin-label') as HTMLElement | null
      if (lbl) lbl.textContent = c.name || `#${c.position}`
      stylePin(el, c.id === activeChapterId)
      if (!marker) {
        marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([c.longitude!, c.latitude!]).addTo(map)
        markersRef.current.set(c.id, marker)
      } else {
        marker.setLngLat([c.longitude!, c.latitude!])
      }
    }
    // Remove markers for deleted/unlocated chapters.
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    }
  }, [chapters, activeChapterId, ready, mapRef])

  // Fit to all located chapters when the set changes meaningfully.
  const fitKeyRef = useRef('')
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const located = chapters.filter((c) => typeof c.longitude === 'number' && typeof c.latitude === 'number')
    if (located.length === 0) return
    const key = located.map((c) => `${c.longitude!.toFixed(4)},${c.latitude!.toFixed(4)}`).sort().join('|')
    if (key === fitKeyRef.current) return
    fitKeyRef.current = key
    const lngs = located.map((c) => c.longitude!)
    const lats = located.map((c) => c.latitude!)
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 64, maxZoom: 15, duration: 600, pitch: 45, bearing: -10 },
    )
  }, [chapters, ready, mapRef])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" data-testid="story-map" />
      <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-night/80 px-2 py-1 text-[11px] font-bold text-gray-mid">
        Click the map to place the active chapter
      </div>
    </div>
  )
}
