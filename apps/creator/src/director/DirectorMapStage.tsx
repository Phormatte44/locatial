import type { Map } from 'maplibre-gl'
import { useCallback, useRef } from 'react'
import { resolveBeat } from '../spatial/engine/timeline'
import { SpatialMapStage } from '../spatial/map/SpatialMapStage'
import { useDirector } from './directorStore'

export function DirectorMapStage() {
  const d = useDirector()
  const mapRef = useRef<Map | null>(null)
  const resolved = resolveBeat(d.story, d.activeScene, d.activeBeatId)

  const onMapReady = useCallback((map: Map) => {
    mapRef.current = map
  }, [])

  const onCapture = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const c = map.getCenter()
    d.captureCamera({
      center: [c.lng, c.lat],
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
      durationMs: 1800,
      easing: 'documentary_glide',
    })
  }, [d])

  if (!resolved) {
    return <div className="flex flex-1 items-center justify-center text-sm text-gray-mid">No beat selected.</div>
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#0a0a0b]">
      <div className="absolute left-3 top-3 z-30 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCapture}
          className="rounded-lg border border-gray-rule bg-night/90 px-3 py-1.5 text-[11px] font-bold text-chalk backdrop-blur hover:border-signal-pink"
        >
          Capture Camera
        </button>
        <span className="rounded-lg bg-night/75 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-lo">
          Beat: {resolved.beat.title}
        </span>
      </div>

      <div className="min-h-0 flex-1">
        <SpatialMapStage
          resolved={resolved}
          beatIndex={d.activeBeatIndex}
          reducedMotion={false}
          onMapReady={onMapReady}
        />
      </div>
    </div>
  )
}
