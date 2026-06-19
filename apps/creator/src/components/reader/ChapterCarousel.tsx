// ChapterCarousel — horizontal swipe through chapters. Supports touch, mouse drag,
// trackpad (horizontal wheel), keyboard (←/→), and explicit accessible prev/next buttons.
// Vertical scrolling lives inside each ChapterSlide.
import { useCallback, useEffect, useRef } from 'react'
import type { Chapter, Section } from '../../domain/types'
import { ChapterSlide } from './ChapterSlide'
import { Button } from '../ui/primitives'

type Props = {
  chapters: Chapter[]
  sections: Section[]
  activeIndex: number
  onIndexChange: (index: number) => void
}

const SWIPE_THRESHOLD = 50

export function ChapterCarousel({ chapters, sections, activeIndex, onIndexChange }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const sectionById = new Map(sections.map((s) => [s.id, s]))

  const clamp = useCallback((i: number) => Math.max(0, Math.min(i, chapters.length - 1)), [chapters.length])
  const go = useCallback((i: number) => onIndexChange(clamp(i)), [clamp, onIndexChange])
  const next = useCallback(() => go(activeIndex + 1), [go, activeIndex])
  const prev = useCallback(() => go(activeIndex - 1), [go, activeIndex])

  // Keyboard navigation.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Touch + mouse drag with axis lock (don't hijack vertical scroll).
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let startX = 0
    let startY = 0
    let dragging = false
    let axis: 'x' | 'y' | null = null

    const start = (x: number, y: number) => {
      startX = x
      startY = y
      dragging = true
      axis = null
    }
    const move = (x: number, y: number, e?: Event) => {
      if (!dragging) return
      const dx = x - startX
      const dy = y - startY
      if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }
      if (axis === 'x' && e && e.cancelable) e.preventDefault()
    }
    const end = (x: number) => {
      if (!dragging) return
      dragging = false
      const dx = x - startX
      if (axis === 'x' && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) next()
        else prev()
      }
    }

    const onTouchStart = (e: TouchEvent) => start(e.touches[0].clientX, e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientX, e.touches[0].clientY, e)
    const onTouchEnd = (e: TouchEvent) => end(e.changedTouches[0].clientX)

    const onMouseDown = (e: MouseEvent) => start(e.clientX, e.clientY)
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onMouseUp = (e: MouseEvent) => end(e.clientX)

    track.addEventListener('touchstart', onTouchStart, { passive: true })
    track.addEventListener('touchmove', onTouchMove, { passive: false })
    track.addEventListener('touchend', onTouchEnd, { passive: true })
    track.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      track.removeEventListener('touchstart', onTouchStart)
      track.removeEventListener('touchmove', onTouchMove)
      track.removeEventListener('touchend', onTouchEnd)
      track.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [next, prev])

  // Trackpad horizontal wheel (debounced so one gesture = one step).
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let lock = false
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 30) return
      e.preventDefault()
      if (lock) return
      lock = true
      if (e.deltaX > 0) next()
      else prev()
      setTimeout(() => (lock = false), 450)
    }
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => track.removeEventListener('wheel', onWheel)
  }, [next, prev])

  return (
    <div ref={rootRef} tabIndex={0} className="relative flex h-full flex-col outline-none" data-testid="chapter-carousel">
      <div ref={trackRef} className="relative flex-1 overflow-hidden">
        <div
          className="reader-track"
          style={{ width: `${chapters.length * 100}%`, transform: `translateX(-${(activeIndex * 100) / chapters.length}%)` }}
        >
          {chapters.map((c, i) => (
            <div key={c.id} style={{ width: `${100 / chapters.length}%` }} className="h-full">
              <ChapterSlide chapter={c} index={i} total={chapters.length} />
            </div>
          ))}
        </div>
      </div>

      {/* lime progress bar (matches locatial.io) */}
      <div className="h-1 w-full bg-gray-rule">
        <div
          className="h-full bg-lime transition-[width] duration-300"
          style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-rule bg-night px-3 py-2">
        <Button size="sm" variant="secondary" onClick={prev} disabled={activeIndex === 0} aria-label="Previous chapter">
          ‹ Prev
        </Button>
        <div className="text-[11px] font-bold text-gray-mid" data-testid="carousel-position">
          {activeIndex + 1} / {chapters.length}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={next}
          disabled={activeIndex === chapters.length - 1}
          aria-label="Next chapter"
        >
          Next ›
        </Button>
      </div>
    </div>
  )
}
