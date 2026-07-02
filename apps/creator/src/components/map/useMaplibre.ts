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
      // Country boundaries — no labels, just outlines to orient without cluttering.
      {
        id: 'country-lines', type: 'line', source: 'omt', 'source-layer': 'boundary',
        filter: ['==', ['get', 'admin_level'], 2],
        paint: {
          'line-color': '#9aa0aa',
          'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 4, 0.9, 8, 1.1],
          'line-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.7, 6, 0.55, 10, 0.3],
          'line-dasharray': [3, 2],
        },
      },
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
  } as unknown as StyleSpecification
}

function applyPostLoadLayers(map: maplibregl.Map) {
  // Paper white sky — outside-globe area matches the paper background, not black space.
  map.setSky({
    'sky-color': '#edeff1',
    'horizon-color': '#f4f4f2',
    'fog-color': '#edeff1',
    'sky-horizon-blend': 0.3,
    'horizon-fog-blend': 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'atmosphere-blend': 0 as any,
  })
  // Charcoal stain sea — diffuse graphite wash so water reads as matte ink, not flat fill.
  if (!map.getLayer('stain-base')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addLayer({ id: 'stain-base', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#181818', 'fill-opacity': 0.80 } } as any, 'coast')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    container.style.background = '#edeff1'

    let map: maplibregl.Map
    try {
      map = new maplibregl.Map({
        container,
        style: paperStyle(),
        center: opts?.center ?? [-0.1278, 51.5074],
        zoom: opts?.zoom ?? 12,
        pitch: 0,
        bearing: 0,
        maxPitch: 85,
        interactive: opts?.interactive ?? true,
        attributionControl: false,
        canvasContextAttributes: { antialias: true },
      })
    } catch (e) {
      setMapError(e instanceof Error ? e.message : 'Map failed to initialize')
      return
    }
    mapRef.current = map

    const markReady = () => setReady(true)
    const onStyle = () => {
      if (map.isStyleLoaded()) markReady()
    }
    const onMapError = (e: maplibregl.ErrorEvent) => {
      console.error('[MapLibre]', e.error)
      setMapError(e.error?.message ?? 'Map tile error')
    }
    map.on('error', onMapError)
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
      map.off('error', onMapError)
      map.remove()
      mapRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, mapRef, ready, mapError }
}

/** Studio pillar pin — label + stem for the creator map. */
export function makePinElement(label?: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'loc-pin'
  el.style.transformOrigin = 'bottom center'
  if (label) {
    const lbl = document.createElement('div')
    lbl.className = 'loc-pin-label'
    lbl.textContent = label
    el.appendChild(lbl)
  }
  const pillar = document.createElement('div')
  pillar.className = 'loc-pin-pillar'
  el.appendChild(pillar)
  return el
}

export function stylePin(el: HTMLElement, active: boolean, dimmed = false) {
  const pillar = el.querySelector('.loc-pin-pillar') as HTMLElement | null
  if (!pillar) return
  el.style.opacity = dimmed ? '0.35' : '1'
  el.style.zIndex = active ? '10' : '1'
  if (active) {
    pillar.style.cssText = `width:10px;height:60px;border-radius:5px;background:linear-gradient(135deg,#ff5fa0 0%,${SIGNAL} 50%,#c4005a 100%);box-shadow:0 0 18px rgba(255,45,122,0.75),0 2px 8px rgba(0,0,0,0.3);`
  } else {
    pillar.style.cssText = 'width:7px;height:26px;border-radius:3.5px;background:linear-gradient(135deg,#aab2bf 0%,#80808c 100%);box-shadow:0 2px 6px rgba(0,0,0,0.25);'
  }
}

export { maplibregl }
