import { useState } from 'react'
import { motion } from 'framer-motion'
import { STORY } from '../data/scenes'
import { EASE_EDITORIAL } from '../lib/motion'

// The map loads silently behind this screen (see App.tsx: MapStage mounts
// unconditionally). By the time the reader taps in, tiles are usually
// already warm — the classic "preload behind the title card" trick.
export function Intro({ mapReady, onEnter }: { mapReady: boolean; onEnter: () => void }) {
  const [exiting, setExiting] = useState(false)

  const enter = () => {
    if (exiting) return
    setExiting(true)
    setTimeout(onEnter, 640)
  }

  const words = STORY.title.toUpperCase().split(' ')

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-8 py-12"
      style={{ background: '#020304' }}
      animate={
        exiting
          ? { opacity: 0, scale: 1.06, filter: 'blur(8px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
      onClick={enter}
      role="button"
      aria-label="Enter the story"
    >
      {/* ambient storm glyph — same visual language as the map's storm-core actor */}
      <div className="pointer-events-none absolute left-1/2 top-[31%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-40 w-40">
          <div
            className="tb-fill anim-breathe absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,151,245,0.32), transparent 70%)' }}
          />
          <div
            className="tb-fill anim-spin-slow absolute inset-3 rounded-full border border-dashed"
            style={{ borderColor: 'rgba(170,180,255,0.32)' }}
          />
          <div
            className="tb-fill anim-spin-slower absolute inset-8 rounded-full border border-dashed"
            style={{ borderColor: 'rgba(195,203,255,0.28)' }}
          />
          <div
            className="anim-pulse-soft absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: '#eef1ff', boxShadow: '0 0 26px 6px rgba(139,151,245,0.65)' }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-mono-ed mt-6 text-center text-[9.5px] tracking-[0.35em] uppercase"
        style={{ color: 'var(--fog)' }}
      >
        Locatial &middot; A Spatial Story
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="font-display max-w-[300px] text-[33px] font-[640] leading-[1.1]" style={{ color: 'var(--chalk)' }}>
          {words.map((w, i) => (
            <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '112%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.09, ease: EASE_EDITORIAL }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="mt-5 max-w-[260px] text-[14px] italic leading-snug"
          style={{ color: 'var(--fog)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: EASE_EDITORIAL }}
        >
          {STORY.subtitle}
        </motion.p>
      </div>

      <motion.button
        onClick={enter}
        disabled={exiting}
        className="font-mono-ed mb-2 flex flex-col items-center gap-3 text-[10px] tracking-[0.3em] uppercase"
        style={{ color: 'var(--chalk)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.35 }}
      >
        <span className="flex items-center gap-2">
          {!mapReady && (
            <span
              className="anim-spin-slow inline-block h-2.5 w-2.5 rounded-full border border-dashed"
              style={{ borderColor: 'var(--fog)' }}
            />
          )}
          <span style={{ color: mapReady ? 'var(--chalk)' : 'var(--fog)' }}>
            {mapReady ? 'Enter the story' : 'Preparing the map'}
          </span>
        </span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ color: 'var(--flood)' }}
        >
          ↓
        </motion.span>
      </motion.button>
    </motion.div>
  )
}
