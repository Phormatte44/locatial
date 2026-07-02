import type { Beat } from '../types'

type Props = {
  beat: Beat
  beatIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function StoryPanel({ beat, beatIndex, total, onPrev, onNext }: Props) {
  return (
    <div className="flex h-full flex-col bg-paper text-ink">
      <div className="border-b border-paper-rule px-5 pb-3 pt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-stone">
          <span>{beat.title}</span>
          <span className="tabular-nums">
            {beatIndex + 1} · {total}
          </span>
        </div>
        {beat.headline && (
          <h2 className="text-xl font-extrabold leading-tight tracking-tight text-ink">{beat.headline}</h2>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {beat.description && <p className="text-sm leading-relaxed text-stone">{beat.description}</p>}
      </div>

      <nav className="flex items-center border-t border-paper-rule px-4 py-3 text-xs font-bold" aria-label="Beat navigation">
        <button
          type="button"
          onClick={onPrev}
          disabled={beatIndex === 0}
          className="min-w-0 flex-1 truncate text-left text-stone transition hover:text-ink disabled:opacity-0"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={beatIndex >= total - 1}
          className="min-w-0 flex-1 truncate text-right text-stone transition hover:text-ink disabled:opacity-0"
        >
          Next →
        </button>
      </nav>
    </div>
  )
}
