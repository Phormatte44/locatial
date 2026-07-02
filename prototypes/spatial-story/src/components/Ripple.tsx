import { useRef, useState, type PointerEvent } from 'react'

type Pulse = { id: number; x: number; y: number }

// Touch feedback for tappable affordances: a ring expands from the exact
// contact point. Cheap, but it's what makes a tap feel received.
export function useRipple() {
  const [pulses, setPulses] = useState<Pulse[]>([])
  const counter = useRef(0)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = counter.current++
    setPulses((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setPulses((p) => p.filter((pp) => pp.id !== id)), 700)
  }

  const layer = (
    <span className="pointer-events-none absolute inset-0 overflow-hidden">
      {pulses.map((p) => (
        <span key={p.id} className="ripple-ping absolute rounded-full" style={{ left: p.x, top: p.y }} />
      ))}
    </span>
  )

  return { onPointerDown, layer }
}
