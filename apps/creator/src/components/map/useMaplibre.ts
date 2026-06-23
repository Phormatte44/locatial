// Shared MapLibre GL initialization — paper aesthetic from compilation-standalone.
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import type { StyleSpecification } from 'maplibre-gl'

const MAPTERHORN_DEM = 'https://tiles.mapterhorn.com/tilejson.json'
const OPENFREEMAP = 'https://tiles.openfreemap.org/planet'
const PAL = { paper: '#edeff1', water: '#e4e8ec', coast: '#aab2bf', building: '#ffffff' }
const SIGNAL = '#ff2d7a'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paperStyle(): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    projection: { type: 'globe' },
    sources: {
      dem: { type: 'raster-dem', url: MAPTERHORN_DEM },
      omt: { type: 'vector', url: OPENFREEMAP },
    },
    layers: [
      { id: 'paper', type: 'background', paint: { 'background-color': ['interpolate', ['linear'], ['zoom'], 10, PAL.paper, 14, '#c8c8c8'] } },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': PAL.water } },
      {
        id: 'hills', type: 'hillshade', source: 'dem', minzoom: 0, paint: {
          'hillshade-shadow-color': '#7a8490', 'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#ccd4de', 'hillshade-exaggeration': 1.0,
          'hillshade-illumination-direction': 315, 'hillshade-illumination-anchor': 'map',
        },
      },
      {
        id: 'hills2', type: 'hillshade', source: 'dem', minzoom: 0, paint: {
          'hillshade-shadow-color': '#b0bbc8', 'hillshade-highlight-color': '#ffffff',
          'hillshade-accent-color': '#e8eef4', 'hillshade-exaggeration': 0.22,
          'hillshade-illumination-direction': 315, 'hillshade-illumination-anchor': 'map',
        },
      },
      { id: 'coast', type: 'line', source: 'omt', 'source-layer': 'water', paint: { 'line-color': PAL.coast, 'line-width': 0.7, 'line-opacity': 0.5, 'line-blur': 0.3 } },
      {
        id: 'roads', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 12,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.2, 17, 5], 'line-opacity': 0.9 },
      },
      {
        id: 'roads-centre', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 13,
        layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: {
          'line-color': '#c8cdd4',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.3, 17, 0.7],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0, 14, 0.55],
          'line-dasharray': [6, 4],
        },
      },
      {
        id: 'building-shadow', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 14, paint: {
          'fill-color': '#7a8290',
          'fill-translate': [-4, 8], 'fill-translate-anchor': 'viewport',
          'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 0.55],
        },
      },
      {
        id: 'building-skirt', type: 'line', source: 'omt', 'source-layer': 'building', minzoom: 14,
        layout: { 'line-join': 'round' },
        paint: {
          'line-color': '#a8b0bc',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1.5, 16.5, 7],
          'line-blur': 3,
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 0.7],
        },
      },
      {
        id: 'buildings', type: 'fill-extrusion', source: 'omt', 'source-layer': 'building', minzoom: 14, paint: {
          'fill-extrusion-color': PAL.building,
          'fill-extrusion-height': ['interpolate', ['exponential', 0.6], ['zoom'], 14, 0, 17, ['coalesce', ['get', 'render_height'], 10]],
          'fill-extrusion-base': ['interpolate', ['exponential', 0.6], ['zoom'], 14, 0, 17, ['coalesce', ['get', 'render_min_height'], 0]],
          'fill-extrusion-vertical-gradient': true,
          'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 14.6, 1],
        },
      },
    ],
  // MapLibre expression arrays are too complex to satisfy TS generics here; the runtime handles them correctly.
  } as unknown as StyleSpecification
}

function applyPostLoadLayers(map: maplibregl.Map) {
  map.setSky({
    'sky-color': '#d8d9dd', 'horizon-color': '#f0f1f5', 'fog-color': '#d8d9dd',
    'sky-horizon-blend': 0.3, 'horizon-fog-blend': 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'atmosphere-blend': 0 as any,
  })
  // Charcoal stain sea — diffuse graphite wash so water reads as matte ink, not flat fill.
  if (!map.getLayer('stain-base')) {
    map.addLayer({ id: 'stain-base', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#181818', 'fill-opacity': 0.80 } } as any, 'coast')
    map.addLayer({ id: 'stain-wash', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#2e2e2e', 'fill-opacity': 0.16 } } as any, 'coast')
  }
}

export function useMaplibre(opts?: {
  center?: [number, number]
  zoom?: number
  interactive?: boolean
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return
    const map = new maplibregl.Map({
      container,
      style: paperStyle(),
      center: opts?.center ?? [-0.1278, 51.5074],
      zoom: opts?.zoom ?? 12,
      pitch: 60,
      bearing: -10,
      interactive: opts?.interactive ?? true,
      attributionControl: false,
    })
    mapRef.current = map

    // Flip `ready` as soon as the map is usable (markers + camera only need the
    // style, not a full render). We listen on several signals because the `load`
    // event can be MISSED when the map mounts inside a 0-height container — the
    // Reader's percentage-height panel is collapsed on first paint, which left
    // the map blank forever (no tiles, no markers). `styledata` + isStyleLoaded
    // fires reliably once the style JSON is parsed, independent of rendering.
    const markReady = () => setReady(true)
    const onStyle = () => {
      if (map.isStyleLoaded()) markReady()
    }
    map.on('style.load', () => applyPostLoadLayers(map))
    map.on('load', markReady)
    map.on('idle', markReady)
    map.on('styledata', onStyle)

    // Keep the canvas matched to its container. A map created while the container
    // is 0-sized never requests tiles until it is resized to a real size.
    const ro = new ResizeObserver(() => map.resize())
    ro.observe(container)
    const raf = requestAnimationFrame(() => {
      map.resize()
      onStyle()
    })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      map.off('load', markReady)
      map.off('idle', markReady)
      map.off('styledata', onStyle)
      map.remove()
      mapRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, mapRef, ready }
}

export function makePinElement(label: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'loc-pin'
  const lbl = document.createElement('span')
  lbl.className = 'loc-pin-label'
  lbl.textContent = label
  const pillar = document.createElement('div')
  pillar.className = 'loc-pin-pillar'
  el.appendChild(lbl)
  el.appendChild(pillar)
  return el
}

export function stylePin(el: HTMLElement, active: boolean, dimmed = false) {
  const label = el.querySelector('.loc-pin-label') as HTMLElement | null
  const pillar = el.querySelector('.loc-pin-pillar') as HTMLElement | null
  if (!label || !pillar) return
  el.style.opacity = dimmed ? '0.35' : '1'
  el.style.zIndex = active ? '10' : '1'
  if (active) {
    label.style.cssText = `color:${SIGNAL};font-size:11px;font-weight:800;white-space:nowrap;margin-bottom:5px;text-shadow:0 0 12px rgba(255,45,122,0.7);`
    pillar.style.cssText = `width:10px;height:60px;border-radius:5px;background:linear-gradient(135deg,#ff5fa0 0%,${SIGNAL} 50%,#c4005a 100%);box-shadow:0 0 18px rgba(255,45,122,0.75),0 2px 8px rgba(0,0,0,0.3);`
  } else {
    label.style.cssText = 'color:#80808c;font-size:10px;font-weight:700;white-space:nowrap;margin-bottom:4px;'
    pillar.style.cssText = 'width:7px;height:26px;border-radius:3.5px;background:linear-gradient(135deg,#aab2bf 0%,#80808c 100%);box-shadow:0 2px 6px rgba(0,0,0,0.25);'
  }
}

export { maplibregl }
