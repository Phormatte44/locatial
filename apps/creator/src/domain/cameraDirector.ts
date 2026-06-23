// cameraDirector — translates a chapter transition into a renderer-agnostic camera move.
// Mirrors docs/ARCHITECTURE.md "SpatialCameraState" + the documented motion rules:
// short hops = local easeTo; long hops = broader flyTo. Respects reduced-motion.
import type { CameraIntent, Chapter } from './types'

export type LngLat = [number, number]

export type CameraMove = {
  center: LngLat
  zoom: number
  pitch: number
  bearing: number
  mode: 'fly-to' | 'ease-to' | 'jump-to'
  duration: number
  /** Mapbox/MapLibre flyTo tuning, matched to locatial.io (speed 0.6, curve 1.8). */
  speed: number
  curve: number
}

const DEFAULTS = { zoom: 13, bearing: -10 }
// Hard ceiling — no chapter can exceed this, even with explicit DB data.
const MAX_PITCH = 35
// locatial.io uses Mapbox flyTo({ speed: 0.6, curve: 1.8 }) for every place transition.
const FLY = { speed: 0.6, curve: 1.42 }

/** Great-circle distance in metres between two [lng,lat] points. */
export function haversineMeters(a: LngLat, b: LngLat): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function chapterLngLat(c: Pick<Chapter, 'longitude' | 'latitude'>): LngLat | null {
  if (typeof c.longitude !== 'number' || typeof c.latitude !== 'number') return null
  return [c.longitude, c.latitude]
}

/**
 * Decide the camera move when the active chapter changes — matched to locatial.io,
 * which uses a single Mapbox `flyTo({ speed: 0.6, curve: 1.8 })` for every transition,
 * with each place's own pitch / bearing / zoom (from the CMS, stored in chapter.camera).
 * Reduced-motion → instant jump-to. The flight auto-scales its duration by distance via
 * the speed/curve parameters, so near hops are quick and far ones sweep out and back.
 */
export function directCamera(opts: {
  to: Pick<Chapter, 'longitude' | 'latitude' | 'camera'>
  from?: Pick<Chapter, 'longitude' | 'latitude'> | null
  reducedMotion?: boolean
}): CameraMove | null {
  const target = chapterLngLat(opts.to)
  if (!target) return null

  const intent: CameraIntent = opts.to.camera ?? {}
  const zoom = intent.zoom ?? DEFAULTS.zoom
  // Pitch scales with zoom: flat at country-level, tilted at street-level.
  // An explicit DB pitch is still respected (capped at MAX_PITCH).
  const autoPitch = Math.min(Math.max((zoom - 7) * 5, 0), MAX_PITCH)
  const base = {
    center: target,
    zoom,
    pitch: Math.min(intent.pitch ?? autoPitch, MAX_PITCH),
    bearing: intent.bearing ?? DEFAULTS.bearing,
    ...FLY,
  }

  if (opts.reducedMotion) {
    return { ...base, mode: 'jump-to', duration: 0 }
  }
  // flyTo with speed/curve drives the timing; duration:0 lets the lib compute it.
  return { ...base, mode: 'fly-to', duration: 0 }
}
