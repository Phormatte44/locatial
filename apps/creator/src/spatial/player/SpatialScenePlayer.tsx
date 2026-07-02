import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SpatialScene, SpatialStory } from '../types'
import { resolveSceneAtBeatIndex } from '../engine/timeline'
import { SpatialMapStage } from '../map/SpatialMapStage'
import { StoryPanel } from './StoryPanel'
import { BeatScrubber } from './BeatScrubber'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  return reduced
}

type Props = {
  story: SpatialStory
  scene: SpatialScene
  /** Optional title overlay on the map stage */
  showChrome?: boolean
  className?: string
}

/**
 * Shared spatial scene player — used by public experience and Studio preview.
 * Map/globe stage on top (~58%), editorial story panel below (~42%).
 */
export function SpatialScenePlayer({ story, scene, showChrome = true, className = '' }: Props) {
  const [beatIndex, setBeatIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const beats = scene.beatTrack

  const resolved = useMemo(
    () => resolveSceneAtBeatIndex(story, scene, beatIndex),
    [story, scene, beatIndex],
  )

  const go = useCallback(
    (i: number) => setBeatIndex(Math.max(0, Math.min(i, beats.length - 1))),
    [beats.length],
  )
  const next = useCallback(() => go(beatIndex + 1), [go, beatIndex])
  const prev = useCallback(() => go(beatIndex - 1), [go, beatIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  if (!resolved) {
    return <div className="flex h-full items-center justify-center bg-night text-sm text-gray-mid">Scene unavailable.</div>
  }

  return (
    <div className={`flex h-full flex-col ${className}`} data-testid="spatial-scene-player">
      {/* Map stage — globe-capable MapLibre, cinematic camera per beat */}
      <div className="relative min-h-0 shrink-0" style={{ height: '58%' }}>
        <SpatialMapStage resolved={resolved} beatIndex={beatIndex} reducedMotion={reducedMotion} />

        {showChrome && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="max-w-[70%] rounded-lg bg-night/80 px-3 py-2 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-pink">Spatial Scene</div>
              <div className="text-sm font-extrabold text-chalk">{scene.title}</div>
              <div className="mt-0.5 text-[11px] text-gray-lo">{scene.mapSentence}</div>
            </div>
          </div>
        )}

        <div className="pointer-events-auto absolute inset-x-0 bottom-0">
          <BeatScrubber beats={beats} activeIndex={beatIndex} onSelect={go} />
        </div>
      </div>

      {/* Editorial story panel */}
      <div className="min-h-0 flex-1">
        <StoryPanel
          beat={resolved.beat}
          beatIndex={beatIndex}
          total={beats.length}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </div>
  )
}
