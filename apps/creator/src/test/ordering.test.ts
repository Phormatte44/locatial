import { describe, expect, it } from 'vitest'
import {
  arrayMove,
  changedPositions,
  moveToPosition,
  normalizePositions,
  nudge,
  reorderSections,
  sortByPosition,
} from '../domain/ordering'

type Item = { id: string; position: number }
const mk = (n: number): Item[] => Array.from({ length: n }, (_, i) => ({ id: `c${i + 1}`, position: i + 1 }))

describe('ordering', () => {
  it('sorts and normalizes positions to contiguous 1..N', () => {
    const items = [
      { id: 'a', position: 5 },
      { id: 'b', position: 2 },
      { id: 'c', position: 9 },
    ]
    expect(normalizePositions(items).map((i) => [i.id, i.position])).toEqual([
      ['b', 1],
      ['a', 2],
      ['c', 3],
    ])
  })

  it('arrayMove moves an element', () => {
    expect(arrayMove(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c'])
  })

  it('moves Chapter 17 to position 7, preserving ids and shifting others', () => {
    const items = mk(20)
    const after = moveToPosition(items, 'c17', 7)
    // c17 now at position 7
    expect(after.find((i) => i.id === 'c17')!.position).toBe(7)
    // positions remain contiguous and unique 1..20
    expect(sortByPosition(after).map((i) => i.position)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    expect(new Set(after.map((i) => i.id)).size).toBe(20)
    // c6 (originally at 6) is pushed to 8, c7 -> 9, etc; chapter formerly at 7 shifts down
    const order = sortByPosition(after).map((i) => i.id)
    expect(order[6]).toBe('c17') // index 6 == position 7
    // ids 1..6 unchanged at the front
    expect(order.slice(0, 6)).toEqual(['c1', 'c2', 'c3', 'c4', 'c5', 'c6'])
  })

  it('nudge moves up and down one slot', () => {
    const items = mk(4)
    const up = nudge(items, 'c3', -1)
    expect(sortByPosition(up).map((i) => i.id)).toEqual(['c1', 'c3', 'c2', 'c4'])
    const down = nudge(items, 'c1', 1)
    expect(sortByPosition(down).map((i) => i.id)).toEqual(['c2', 'c1', 'c3', 'c4'])
  })

  it('reorderSections renumbers sections', () => {
    const secs = mk(3)
    const after = reorderSections(secs, 'c3', 1)
    expect(sortByPosition(after).map((i) => i.id)).toEqual(['c3', 'c1', 'c2'])
  })

  it('changedPositions returns only moved items', () => {
    const before = mk(3)
    const after = moveToPosition(before, 'c1', 3)
    const changed = changedPositions(before, after)
    // c1 moved 1->3, c2 1->? etc — at least c1 changed
    expect(changed.find((c) => c.id === 'c1')!.position).toBe(3)
    expect(changed.every((c) => before.find((b) => b.id === c.id)!.position !== c.position)).toBe(true)
  })
})
