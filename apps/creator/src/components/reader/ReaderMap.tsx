// ReaderMap — the upper half of the Reader. Markers for every located chapter; the camera
// follows the active chapter via cameraDirector. Other markers are de-emphasised.
import { useEffect, useRef } from 'react'
import type { Chapter } from '../../domain/types'
import { directCamera } from '../../domain/cameraDirector'
import { makePinElement, maplibregl, stylePin, useMaplibre } from '../map/useMaplibre'

type Props = {
  chapters: Chapter[]
  activeIndex: number
  reducedMotion?: boolean
}

export function ReaderMap({ chapters, activeIndex, reducedMotion }: Props) {
  const first = chapters.find((c) => typeof c.longitude === 'number')
  const { containerRef, mapRef, ready } = useMaplibre({
    interactive: true,
    center: first ? [first.longitude!, first.latitude!] : undefined,
    zoom: 13,
  })
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())
  const prevIndexRef = useRef<number>(-1)

  // Build/refresh markers.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const active = chapters[activeIndex]
    const seen = new Set<string>()
    chapters.forEach((c) => {
      if (typeof c.longitude !== 'number' || typeof c.latitude !== 'number') return
      seen.add(c.id)
      let marker = markersRef.current.get(c.id)
      const el = marker?.getElement() ?? makePinElement(c.name || `#${c.position}`)
      stylePin(el, c.id === active?.id, c.id !== active?.id)
      if (!marker) {
        marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([c.longitude, c.latitude]).addTo(map)
        markersRef.current.set(c.id, marker)
      } else {
        marker.setLngLat([c.longitude, c.latitude])
      }
    })
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    }
  }, [chapters, activeIndex, ready, mapRef])

  // Move camera to active chapter.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const to = chapters[activeIndex]
    if (!to) return
    const from = prevIndexRef.current >= 0 ? chapters[prevIndexRef.current] : null
    prevIndexRef.current = activeIndex
    const move = directCamera({ to, from, reducedMotion })
    if (!move) return
    const opts = { center: move.center, zoom: move.zoom, pitch: move.pitch, bearing: move.bearing, duration: move.duration }
    if (move.mode === 'jump-to') map.jumpTo(opts)
    else if (move.mode === 'fly-to') map.flyTo(opts)
    else map.easeTo(opts)
  }, [activeIndex, chapters, ready, reducedMotion, mapRef])

  return <div ref={containerRef} className="h-full w-full" data-testid="reader-map" />
}
