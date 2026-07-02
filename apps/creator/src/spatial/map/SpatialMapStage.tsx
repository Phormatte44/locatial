import { useEffect, useRef } from 'react'
import type { SpatialCameraKeyframe } from '../types'
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
  const prevBeatRef = useRef<number>(-1)

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    if (prevBeatRef.current === beatIndex && prevBeatRef.current !== -1) return
    prevBeatRef.current = beatIndex

    const move = {
      center: cam.center,
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
      duration: reducedMotion ? 0 : cam.durationMs,
      easing: easingToMapLibre(cam.easing),
      essential: true,
    }

    if (reducedMotion || cam.durationMs === 0) {
      map.jumpTo({
        center: cam.center,
        zoom: cam.zoom,
        pitch: cam.pitch,
        bearing: cam.bearing,
      })
    } else {
      map.flyTo(move)
    }
  }, [beatIndex, cam, ready, mapRef, reducedMotion])

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0">
        <SceneOverlayLayer
          map={mapRef.current}
          ready={ready}
          actors={resolved.actors}
          beatIndex={beatIndex}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_110%_at_50%_36%,transparent_0%,transparent_52%,rgba(238,240,243,0.35)_100%)]" />
    </div>
  )
}

export { maplibregl }
