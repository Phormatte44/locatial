// ChapterSlide — one chapter rendered as a vertically scrolling card.
// Content order per brief: image → headline → body → tags/metadata.
import type { Chapter, Section } from '../../domain/types'
import { Badge } from '../ui/primitives'

export function ChapterSlide({ chapter, section }: { chapter: Chapter; section?: Section | null }) {
  return (
    <div className="chapter-scroll bg-night" data-testid="chapter-slide">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-3">
        {chapter.imageUrl ? (
          <img
            src={chapter.imageUrl}
            alt={chapter.name}
            className="mb-4 aspect-[4/3] w-full rounded-xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-surface1 text-xs text-gray-hi">
            No image
          </div>
        )}

        {section && (
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-signal">{section.name}</div>
        )}

        <h2 className="text-xl font-extrabold leading-tight text-chalk">{chapter.headline || chapter.name}</h2>
        {chapter.name && chapter.headline && (
          <div className="mt-0.5 text-sm font-bold text-gray-mid">{chapter.name}</div>
        )}

        {chapter.placeName && (
          <div className="mt-2 text-[12px] text-gray-lo">📍 {chapter.placeName}</div>
        )}

        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-gray-lo">{chapter.body}</p>

        {chapter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {chapter.tags.map((t) => (
              <Badge key={t} tone="muted">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
