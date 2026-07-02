import { AnimatePresence, motion } from 'framer-motion'
import type { CSSProperties } from 'react'

// A ticker: every character rolls in with a stagger whenever the whole
// string changes. Used for the scene clock and the chapter index — small
// detail, but it's the difference between text that "updates" and text
// that "reports."
export function Odometer({ value, className, style }: { value: string; className?: string; style?: CSSProperties }) {
  return (
    <span className={className} style={{ ...style, display: 'inline-flex' }}>
      {value.split('').map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${ch}-${value}`}
              className="inline-block"
              initial={{ y: 8, opacity: 0, filter: 'blur(3px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -8, opacity: 0, filter: 'blur(3px)' }}
              transition={{ duration: 0.36, delay: i * 0.016, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}
