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
  showChrome?: boolean
  className?: string
}

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
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center bg-night p-6 text-center text-sm text-gray-mid">
        Scene unavailable.
      </div>
    )
  }

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`} data-testid="spatial-scene-player">
      {/* Map stage — flex basis keeps height even when parent chain is imperfect */}
      <div className="relative flex min-h-[45vh] flex-[1.45] flex-col">
        <SpatialMapStage resolved={resolved} beatIndex={beatIndex} reducedMotion={reducedMotion} />

        {showChrome && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-3 pt-12">
            <div className="max-w-[85%] rounded-lg bg-night/85 px-3 py-2 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal-pink">Spatial Scene</div>
              <div className="text-sm font-extrabold text-chalk">{scene.title}</div>
              <div className="mt-0.5 text-[11px] text-gray-lo">{scene.mapSentence}</div>
            </div>
          </div>
        )}

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 pb-1">
          <BeatScrubber beats={beats} activeIndex={beatIndex} onSelect={go} />
        </div>
      </div>

      {/* Editorial story panel — always visible */}
      <div className="flex min-h-[180px] flex-1 flex-col border-t border-paper-rule">
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
