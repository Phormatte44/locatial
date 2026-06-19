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
}

// Documented defaults (DESIGN-SYSTEM.md): bar/stop view pitch 45–50°, bearing −10°.
const DEFAULTS = { zoom: 15.5, pitch: 45, bearing: -10 }

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
 * Decide the camera move when the active chapter changes.
 * - reducedMotion → instant jump-to.
 * - no previous location → ease into the target.
 * - near (< 600m) → restrained local easeTo (keep zoom in close).
 * - far → broad flyTo that pulls back to frame the journey then settles.
 * Explicit per-chapter `camera` intent overrides the derived zoom/pitch/bearing.
 */
export function directCamera(opts: {
  to: Pick<Chapter, 'longitude' | 'latitude' | 'camera'>
  from?: Pick<Chapter, 'longitude' | 'latitude'> | null
  reducedMotion?: boolean
}): CameraMove | null {
  const target = chapterLngLat(opts.to)
  if (!target) return null

  const intent: CameraIntent = opts.to.camera ?? {}
  const base = {
    center: target,
    zoom: intent.zoom ?? DEFAULTS.zoom,
    pitch: intent.pitch ?? DEFAULTS.pitch,
    bearing: intent.bearing ?? DEFAULTS.bearing,
  }

  if (opts.reducedMotion) {
    return { ...base, mode: 'jump-to', duration: 0 }
  }

  const fromLngLat = opts.from ? chapterLngLat(opts.from) : null
  if (!fromLngLat) {
    return { ...base, mode: 'ease-to', duration: 600 }
  }

  const dist = haversineMeters(fromLngLat, target)
  if (dist < 600) {
    // Restrained local movement for nearby places.
    return { ...base, zoom: intent.zoom ?? 16, mode: 'ease-to', duration: 500 }
  }

  // Broader movement for distant places: zoom out a touch, longer flight.
  const farZoom = intent.zoom ?? (dist > 5000 ? 12.5 : 14)
  const duration = Math.min(2200, 900 + dist / 6)
  return { ...base, zoom: farZoom, mode: 'fly-to', duration }
}
