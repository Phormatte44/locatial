// Pure ordering utilities. No I/O. Heavily unit-tested (src/test/ordering.test.ts).
// Positions are 1-indexed integers, kept contiguous within their scope.

export type Positioned = { id: string; position: number }

/** Sort a copy by position ascending (stable on ties by id). */
export function sortByPosition<T extends Positioned>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
}

/** Re-number items 1..N following their CURRENT array order (no re-sort). */
export function renumberInOrder<T extends Positioned>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, position: i + 1 }))
}

/** Return items re-numbered 1..N in position-sorted order. Stable. */
export function normalizePositions<T extends Positioned>(items: T[]): T[] {
  return renumberInOrder(sortByPosition(items))
}

/** Move the item at index `from` to index `to` in a plain array (0-indexed). */
export function arrayMove<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  if (from < 0 || from >= next.length) return next
  const clampedTo = Math.max(0, Math.min(to, next.length - 1))
  const [moved] = next.splice(from, 1)
  next.splice(clampedTo, 0, moved)
  return next
}

/**
 * Move a chapter (by id) to a 1-indexed target position within the global reading order.
 * IDs are preserved; only `position` values change. Returns the full re-numbered list.
 * Example: moveToPosition(chapters, id17, 7) puts chapter 17 at reading position 7.
 */
export function moveToPosition<T extends Positioned>(items: T[], id: string, targetPosition: number): T[] {
  const sorted = sortByPosition(items)
  const fromIndex = sorted.findIndex((it) => it.id === id)
  if (fromIndex === -1) return normalizePositions(sorted)
  const toIndex = Math.max(0, Math.min(targetPosition - 1, sorted.length - 1))
  return renumberInOrder(arrayMove(sorted, fromIndex, toIndex))
}

/** Move an item up (−1) or down (+1) one slot in reading order. */
export function nudge<T extends Positioned>(items: T[], id: string, direction: -1 | 1): T[] {
  const sorted = sortByPosition(items)
  const idx = sorted.findIndex((it) => it.id === id)
  if (idx === -1) return sorted
  return renumberInOrder(arrayMove(sorted, idx, idx + direction))
}

/** Reorder sections by moving one section id before/after; returns re-numbered sections. */
export function reorderSections<T extends Positioned>(sections: T[], id: string, targetPosition: number): T[] {
  return moveToPosition(sections, id, targetPosition)
}

/**
 * Diff two positioned lists and return only the items whose position changed.
 * Used to persist the minimum set of updates.
 */
export function changedPositions<T extends Positioned>(before: T[], after: T[]): Array<{ id: string; position: number }> {
  const prev = new Map(before.map((b) => [b.id, b.position]))
  return after
    .filter((a) => prev.get(a.id) !== a.position)
    .map((a) => ({ id: a.id, position: a.position }))
}
