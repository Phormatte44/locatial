// ChapterList — the ordered reading sequence. Select active, nudge up/down, add.
import type { Chapter, Section } from '../../domain/types'
import { Badge, Button, cx } from '../ui/primitives'

type Props = {
  chapters: Chapter[]
  sections: Section[]
  activeChapterId: string | null
  onSelect: (id: string) => void
  onNudge: (id: string, dir: -1 | 1) => void
  onAdd: () => void
}

export function ChapterList({ chapters, sections, activeChapterId, onSelect, onNudge, onAdd }: Props) {
  const sectionName = (id: string | null) => (id ? sections.find((s) => s.id === id)?.name ?? '—' : null)

  return (
    <div data-testid="chapter-list">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wide text-gray-mid">Chapters ({chapters.length})</h3>
        <Button size="sm" variant="primary" onClick={onAdd}>
          + Add chapter
        </Button>
      </div>
      <ul className="space-y-1">
        {chapters.map((c, i) => {
          const located = typeof c.longitude === 'number'
          const sec = sectionName(c.sectionId)
          return (
            <li
              key={c.id}
              className={cx(
                'flex items-center gap-2 rounded-lg border px-2 py-1.5',
                c.id === activeChapterId ? 'border-signal bg-signal/10' : 'border-gray-rule bg-surface1',
              )}
            >
              <span className="w-5 shrink-0 text-center text-[11px] font-bold tabular-nums text-gray-mid">{c.position}</span>
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect(c.id)}>
                <div className="truncate text-sm font-bold text-chalk">{c.name || `Untitled #${c.position}`}</div>
                <div className="flex items-center gap-1.5">
                  {sec && <Badge tone="muted">{sec}</Badge>}
                  <span className={cx('text-[10px] font-bold', located ? 'text-gray-hi' : 'text-amber-500')}>
                    {located ? '📍 located' : '⚠ no location'}
                  </span>
                </div>
              </button>
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Move chapter ${c.position} up`}
                  className="px-1 text-gray-mid hover:text-signal disabled:opacity-30"
                  disabled={i === 0}
                  onClick={() => onNudge(c.id, -1)}
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label={`Move chapter ${c.position} down`}
                  className="px-1 text-gray-mid hover:text-signal disabled:opacity-30"
                  disabled={i === chapters.length - 1}
                  onClick={() => onNudge(c.id, 1)}
                >
                  ▼
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
