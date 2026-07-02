import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, type MotionValue } from 'framer-motion'
import { SCENES, STORY, type Beat, type Scene } from '../data/scenes'
import { Odometer } from './Odometer'
import { useRipple } from './Ripple'
import { EASE_EDITORIAL, SPRING_SNAP, SPRING_SOFT } from '../lib/motion'

const SWIPE_DIST = 70
const SWIPE_VELOCITY = 420
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

type Props = {
  index: number
  beat: Beat
  onNavigate: (next: number) => void
  onBeat: (b: Beat) => void
  hintVisible: boolean
  onFirstGesture: () => void
  onReadProgress: (r: number) => void
  dragProgress: MotionValue<number>
}

export function StoryPanel({ index, beat, onNavigate, onBeat, hintVisible, onFirstGesture, onReadProgress, dragProgress }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [width, setWidth] = useState(0)
  const [atBottom, setAtBottom] = useState(false)

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  // new chapter: reset scroll + bottom state; if the chapter fits without
  // scrolling, let the beats advance on their own
  useEffect(() => {
    const card = cardRefs.current[index]
    if (card) card.scrollTop = 0
    setAtBottom(false)
    onReadProgress(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    if (card && card.scrollHeight - card.clientHeight < 60) {
      timers.push(setTimeout(() => onBeat(1), 1800))
      timers.push(
        setTimeout(() => {
          onBeat(2)
          setAtBottom(true)
        }, 3600),
      )
    }
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const handleScroll = (i: number) => {
    if (i !== index) return
    const card = cardRefs.current[i]
    if (!card) return
    const max = card.scrollHeight - card.clientHeight
    const r = max <= 0 ? 1 : Math.min(1, card.scrollTop / max)
    onReadProgress(r)
    if (r > 0.05) onFirstGesture()
    // beats ratchet forward: reading back up never un-reveals the map
    if (r > 0.82) onBeat(2)
    else if (r > 0.35) onBeat(1)
    setAtBottom(r > 0.94)
  }

  const go = (next: number) => {
    if (next < 0 || next >= SCENES.length) return
    onFirstGesture()
    onNavigate(next)
  }

  const peek = atBottom && index < SCENES.length - 1 ? 16 : 0

  return (
    <div ref={frameRef} className="relative flex-1 overflow-hidden" style={{ background: 'var(--paper)' }}>
      {/* chapter progress: tick rail + a live index the map's cut echoes */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center gap-3 px-5 pt-3 pb-2" style={{ background: 'linear-gradient(to bottom, var(--paper) 78%, transparent)' }}>
        <div className="flex flex-1 items-center gap-1">
          {SCENES.map((_, i) => (
            <div key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(231,229,228,0.14)' }}>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'var(--chalk)' }}
                initial={false}
                animate={{ scaleX: i <= index ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
              />
              {i === index && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--flood)', filter: 'blur(3px)' }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="font-mono-ed flex items-baseline text-[10px] tracking-[0.2em]" style={{ color: 'var(--fog)' }}>
          <Odometer value={SCENES[index].num} style={{ color: 'var(--chalk)' }} />
          <span>&nbsp;/&nbsp;{String(SCENES.length)}</span>
        </div>
      </div>

      {width > 0 && (
        <motion.div
          className="flex h-full"
          style={{ width: width * SCENES.length, touchAction: 'pan-y' }}
          drag="x"
          dragElastic={0.14}
          dragMomentum={false}
          dragDirectionLock
          dragConstraints={{ left: -(SCENES.length - 1) * width, right: 0 }}
          animate={{ x: -index * width - peek }}
          transition={SPRING_SNAP}
          onDrag={(_, info) => {
            dragProgress.set(clamp(info.offset.x / width, -1, 1))
          }}
          onDragEnd={(_, info) => {
            const advancing = info.offset.x < -SWIPE_DIST || info.velocity.x < -SWIPE_VELOCITY
            const receding = info.offset.x > SWIPE_DIST || info.velocity.x > SWIPE_VELOCITY
            if (advancing || receding) {
              // a flyTo is about to start — zero instantly so no lingering
              // spring tick can fight the camera mid-flight
              dragProgress.set(0)
            } else {
              animate(dragProgress, 0, SPRING_SOFT)
            }
            if (advancing) go(index + 1)
            else if (receding) go(index - 1)
            else onNavigate(index) // snap back
          }}
        >
          {SCENES.map((scene, i) => (
            <div
              key={scene.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="story-scroll h-full shrink-0 border-l"
              style={{ width, borderColor: i === 0 ? 'transparent' : 'var(--hair)' }}
              onScroll={() => handleScroll(i)}
            >
              <Chapter scene={scene} i={i} onNext={() => go(i + 1)} onRestart={() => go(0)} />
            </div>
          ))}
        </motion.div>
      )}

      {/* fade at the bottom while more text remains */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-14 transition-opacity duration-500"
        style={{ background: 'linear-gradient(to top, var(--paper), transparent)', opacity: atBottom ? 0 : 1 }}
      />

      {/* first-time hint — scene 1 only, retires after the first gesture */}
      <AnimatePresence>
        {hintVisible && index === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 2.2, duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="font-mono-ed pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border px-4 py-2 text-[9.5px] tracking-[0.18em] uppercase"
            style={{ borderColor: 'var(--hair)', background: 'rgba(5,7,11,0.85)', color: 'var(--fog)', backdropFilter: 'blur(6px)' }}
          >
            Scroll to read · Swipe ← for the next scene
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------

function Chapter({ scene, i, onNext, onRestart }: { scene: Scene; i: number; onNext: () => void; onRestart: () => void }) {
  const isFirst = i === 0
  const isLast = i === SCENES.length - 1
  const next = SCENES[i + 1]
  const nextRipple = useRipple()
  const restartRipple = useRipple()

  return (
    <div className="px-6 pb-10 pt-12">
      {isFirst && (
        <header className="mb-9 border-b pb-7" style={{ borderColor: 'var(--hair)' }}>
          <div className="font-mono-ed mb-4 text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--fog)' }}>
            Locatial · A Spatial Story
          </div>
          <h1 className="font-display text-[30px] leading-[1.12] font-[640]" style={{ color: 'var(--chalk)' }}>
            {STORY.title}
          </h1>
          <p className="mt-3 text-[14.5px] italic leading-normal" style={{ color: 'var(--fog)' }}>
            {STORY.subtitle}
          </p>
          <div className="font-mono-ed mt-4 text-[8.5px] tracking-[0.18em] uppercase" style={{ color: '#5b6272' }}>
            {STORY.note}
          </div>
        </header>
      )}

      <div className="font-mono-ed mb-3 flex items-baseline gap-3 text-[10px] tracking-[0.22em] uppercase" style={{ color: 'var(--fog)' }}>
        <span style={{ color: 'var(--chalk)' }}>{scene.num}</span>
        <span className="h-px w-6 self-center" style={{ background: 'var(--hair)' }} />
        <span>{scene.timestamp}</span>
      </div>

      <h2 className="font-display mb-6 text-[25px] leading-[1.15] font-[560]" style={{ color: 'var(--chalk)' }}>
        {scene.title}
      </h2>

      <div className="body-copy">
        {scene.body.map((p, k) => (
          <motion.p
            key={k}
            initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
          >
            {p}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="mt-8 border-l-2 pl-4"
        style={{ borderColor: 'rgba(56,207,232,0.5)' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
      >
        <div className="font-mono-ed mb-1 text-[8.5px] tracking-[0.25em] uppercase" style={{ color: 'var(--fog)' }}>
          Map insight
        </div>
        <div className="font-display text-[15px] italic" style={{ color: '#bfe9f2' }}>
          {scene.mapSentence}
        </div>
      </motion.div>

      {/* end-of-chapter cue */}
      {!isLast && next && (
        <button
          onClick={onNext}
          onPointerDown={nextRipple.onPointerDown}
          className="relative mt-10 block w-full overflow-hidden border-t pt-5 text-left active:opacity-80"
          style={{ borderColor: 'var(--hair)' }}
        >
          {nextRipple.layer}
          <div className="font-mono-ed mb-1.5 text-[8.5px] tracking-[0.25em] uppercase" style={{ color: 'var(--fog)' }}>
            Next spatial beat
          </div>
          <div className="font-display flex items-center justify-between text-[17px] font-[560]" style={{ color: 'var(--chalk)' }}>
            <span>
              <span className="font-mono-ed mr-2 text-[11px]" style={{ color: 'var(--fog)' }}>
                {next.num}
              </span>
              {next.title}
            </span>
            <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }} style={{ color: 'var(--flood)' }}>
              →
            </motion.span>
          </div>
        </button>
      )}

      {isLast && (
        <footer className="mt-12 border-t pt-8 text-center" style={{ borderColor: 'var(--hair)' }}>
          <p className="font-display text-[19px] italic leading-snug" style={{ color: 'var(--chalk)' }}>
            The map was not opened.
            <br />
            The place was revealed.
          </p>
          <button
            onClick={onRestart}
            onPointerDown={restartRipple.onPointerDown}
            className="font-mono-ed relative mt-7 overflow-hidden rounded-full border px-5 py-2.5 text-[9.5px] tracking-[0.25em] uppercase active:opacity-80"
            style={{ borderColor: 'var(--hair)', color: 'var(--fog)' }}
          >
            {restartRipple.layer}
            ↺ Read it again
          </button>
          <div className="font-mono-ed mt-6 text-[8px] tracking-[0.18em] uppercase" style={{ color: '#4b5261' }}>
            {STORY.note} · Map data © OpenStreetMap
          </div>
        </footer>
      )}
    </div>
  )
}
