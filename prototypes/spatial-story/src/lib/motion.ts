// One motion voice for the whole app: confident deceleration, no bounce.
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const
export const SPRING_SNAP = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const
export const SPRING_SOFT = { type: 'spring', stiffness: 170, damping: 24 } as const

export function haptic(ms = 8) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms)
    } catch {
      /* unsupported or blocked — silent */
    }
  }
}
