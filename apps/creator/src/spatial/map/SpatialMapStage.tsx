import { useEffect, useRef, useState } from 'react'
import type { Map } from 'maplibre-gl'
import { easingToMapLibre } from '../engine/timeline'
import { maplibregl, useMaplibre } from '../../components/map/useMaplibre'
import { SceneOverlayLayer } from '../overlays/SceneOverlayLayer'
import type { ResolvedBeat } from '../types'

type Props = {
  resolved: ResolvedBeat
  beatIndex: number
  reducedMotion?: boolean
}

export function SpatialMapStage({ resolved, beatIndex, reducedMotion }: Props) {
  const cam = resolved.camera
  const { containerRef, mapRef, ready } = useMaplibre({
    center: cam.center,
    zoom: cam.zoom,
    interactive: true,
  })
  const [mapInstance, setMapInstance] = useState<Map | null>(null)
  const appliedBeatRef = useRef<number>(-1)

  // Expose map instance to overlays once ready (refs alone don't trigger re-render).
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current
    setMapInstance(map)
    map.setMaxPitch(85)
    requestAnimationFrame(() => {
      map.resize()
      map.jumpTo({
        center: cam.center,
        zoom: cam.zoom,
        pitch: cam.pitch,
        bearing: cam.bearing,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mapRef])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    if (appliedBeatRef.current === beatIndex) return
    appliedBeatRef.current = beatIndex

    const target = {
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    }

    requestAnimationFrame(() => map.resize())

    if (reducedMotion || cam.durationMs === 0) {
      map.jumpTo(target)
      return
    }

    map.flyTo({
      ...target,
      duration: cam.durationMs,
      easing: easingToMapLibre(cam.easing),
      essential: true,
    })
  }, [beatIndex, cam, ready, mapRef, reducedMotion])

  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden bg-paper">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!ready && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-paper text-stone">
          <div className="h-2 w-2 animate-pulse rounded-full bg-signal-pink" />
          <span className="text-xs font-bold">Loading map…</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20">
        <SceneOverlayLayer
          map={mapInstance}
          ready={ready}
          actors={resolved.actors}
          beatIndex={beatIndex}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(125%_110%_at_50%_36%,transparent_0%,transparent_52%,rgba(238,240,243,0.35)_100%)]" />
    </div>
  )
}

export { maplibregl }
