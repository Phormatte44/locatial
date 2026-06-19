// StoryReader — composes the map (upper) + carousel (lower) with synchronized state.
// Used by the public /story/:slug route AND by the Studio Preview (same real component).
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
    return <div className="flex h-full items-center justify-center text-sm text-gray-mid">This story has no chapters yet.</div>
  }

  const active = chapters[activeIndex]
  const activeSection = active?.sectionId ? sections.find((s) => s.id === active.sectionId) : null

  return (
    <div className="flex h-full flex-col bg-night" data-testid="story-reader">
      {/* Upper half: map */}
      <div className="relative" style={{ height: '42%' }}>
        <ReaderMap chapters={chapters} activeIndex={activeIndex} reducedMotion={reducedMotion} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <div className="rounded-md bg-night/80 px-2 py-1">
            <div className="text-xs font-extrabold text-chalk">{bundle.story.title}</div>
            <SectionIndicator section={activeSection} />
          </div>
          <div className="rounded-md bg-night/80 px-2 py-1">
            <ReaderProgress index={activeIndex} total={chapters.length} />
          </div>
        </div>
      </div>

      {/* Lower half: content carousel */}
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
