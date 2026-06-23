// StoryReader — map (upper) + carousel (lower) in a unified paper register.
import { useEffect, useMemo, useState } from 'react'
import type { StoryBundle } from '../../domain/types'
import { sortByPosition } from '../../domain/ordering'
import { ReaderMap } from './ReaderMap'
import { ChapterCarousel } from './ChapterCarousel'
import { ReaderProgress } from './ReaderProgress'
import { SectionIndicator } from './SectionIndicator'

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

export function StoryReader({ bundle }: { bundle: StoryBundle }) {
  const chapters = useMemo(() => sortByPosition(bundle.chapters), [bundle.chapters])
  const sections = useMemo(() => sortByPosition(bundle.sections), [bundle.sections])
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (activeIndex > chapters.length - 1) setActiveIndex(Math.max(0, chapters.length - 1))
  }, [chapters.length, activeIndex])

  if (chapters.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-paper text-sm text-stone">
        This story has no chapters yet.
      </div>
    )
  }

  const active = chapters[activeIndex]
  const activeSection = active?.sectionId ? sections.find((s) => s.id === active.sectionId) : null

  return (
    <div className="flex h-full flex-col bg-paper" data-testid="story-reader">
      {/* Map — 55% of viewport height; paper-white everywhere */}
      <div className="relative shrink-0" style={{ height: '55%', background: '#edeff1' }}>
        <ReaderMap
          chapters={chapters}
          activeIndex={activeIndex}
          reducedMotion={reducedMotion}
          onChapterClick={setActiveIndex}
        />

        {/* Overlay — dark pill for contrast on the light map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <div className="rounded-md bg-night/75 px-2 py-1 backdrop-blur-sm">
            <div className="text-xs font-extrabold text-chalk">{bundle.story.title}</div>
            <SectionIndicator section={activeSection} />
          </div>
          <div className="rounded-md bg-night/75 px-2 py-1 backdrop-blur-sm">
            <ReaderProgress index={activeIndex} total={chapters.length} />
          </div>
        </div>
      </div>

      {/* Content — same paper register as the map */}
      <div className="min-h-0 flex-1">
        <ChapterCarousel
          chapters={chapters}
          sections={sections}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />
      </div>
    </div>
  )
}
