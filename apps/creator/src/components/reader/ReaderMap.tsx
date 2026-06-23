// ReaderMap — the upper half of the Reader. Markers for every located chapter; the camera
// follows the active chapter via cameraDirector. Pins rotate perpendicular to the globe.
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
      const el = marker?.getElement() ?? makePinElement()
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
    const isFirstMove = prevIndexRef.current < 0
    const from = isFirstMove ? null : chapters[prevIndexRef.current]
    prevIndexRef.current = activeIndex
    const move = directCamera({ to, from, reducedMotion })
    if (!move) return
    const base = { center: move.center, zoom: move.zoom, pitch: move.pitch, bearing: move.bearing }
    // First load: jump instantly rather than flying from the default center.
    if (move.mode === 'jump-to' || isFirstMove) map.jumpTo(base)
    else if (move.mode === 'fly-to') map.flyTo({ ...base, speed: move.speed, curve: move.curve, essential: true })
    else map.easeTo({ ...base, duration: move.duration })
  }, [activeIndex, chapters, ready, reducedMotion, mapRef])

  // Perpendicular pin rotation — recalculate on every render frame so pins stay
  // correctly oriented during flyTo animations and manual globe spin.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const onRender = () => {
      const container = map.getContainer()
      const cx = container.clientWidth / 2
      const cy = container.clientHeight / 2
      markersRef.current.forEach((marker) => {
        const lngLat = marker.getLngLat()
        const pt = map.project(lngLat)
        const dx = pt.x - cx
        const dy = pt.y - cy
        // Angle from vertical: pins radiate away from the globe centre on screen.
        const angle = Math.atan2(dx, -dy) * (180 / Math.PI)
        marker.getElement().style.transform = `rotate(${angle}deg)`
      })
    }
    map.on('render', onRender)
    return () => { map.off('render', onRender) }
  }, [ready, mapRef])

  return <div ref={containerRef} className="h-full w-full" data-testid="reader-map" />
}
