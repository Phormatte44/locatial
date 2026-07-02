import { useEffect, useRef } from 'react'
import maplibregl, { Map as MLMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { SCENES } from '../data/scenes'

// Dark, label-free, open-data basemap (OpenStreetMap via CARTO's free GL style).
// All labels on the map are ours — fictional names over real coordinates.
const STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

// If the network denies the basemap (offline demo rooms happen), keep a dark
// stage alive: the camera and all coordinate-anchored overlays still perform.
const FALLBACK_STYLE = {
  version: 8 as const,
  name: 'offline-stage',
  sources: {},
  layers: [{ id: 'bg', type: 'background' as const, paint: { 'background-color': '#0b0f16' } }],
}

export function MapStage({ onMap }: { onMap: (m: MLMap) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const cam = SCENES[0].camera
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      center: cam.center,
      zoom: cam.zoom,
      bearing: cam.bearing ?? 0,
      pitch: cam.pitch ?? 0,
      interactive: false, // the story drives the camera; the reader drives the story
      attributionControl: false,
      fadeDuration: 300,
    })
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

    let fellBack = false
    map.on('error', (e) => {
      const msg = String((e as { error?: Error }).error?.message ?? '')
      if (!fellBack && msg.includes('style.json')) {
        fellBack = true
        map.setStyle(FALLBACK_STYLE)
      }
    })
    mapRef.current = map
    onMap(map)

    const ro = new ResizeObserver(() => map.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
    }
  }, [onMap])

  // inline position: maplibre-gl.css sets `.maplibregl-map { position: relative }`
  // outside any cascade layer, which would override Tailwind's layered utilities
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
}
