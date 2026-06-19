// ChapterSlide — one chapter as a vertically scrolling reader page (matches locatial.io):
// hero image → lime chapter label + "n / total" → headline → structured blocks.
import type { Chapter } from '../../domain/types'
import { ChapterBlocks, parseBlocks } from './ChapterBlocks'

export function ChapterSlide({
  chapter,
  index,
  total,
}: {
  chapter: Chapter
  index?: number
  total?: number
}) {
  const blocks = parseBlocks(chapter.body)
  return (
    <div className="chapter-scroll bg-night" data-testid="chapter-slide">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-3">
        {chapter.imageUrl ? (
          <img
            src={chapter.imageUrl}
            alt={chapter.name}
            className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-surface1 text-xs text-gray-hi">
            No image
          </div>
        )}

        <div className="flex items-baseline justify-between gap-3">
          <div className="text-sm font-bold text-lime">{chapter.name || 'Chapter'}</div>
          {typeof index === 'number' && typeof total === 'number' && (
            <div className="shrink-0 text-xs font-bold text-gray-mid">
              {index + 1} <span className="text-gray-hi">/{total}</span>
            </div>
          )}
        </div>

        {chapter.headline && (
          <h2 className="mb-3 mt-1 text-xl font-extrabold leading-tight text-chalk">{chapter.headline}</h2>
        )}

        <ChapterBlocks blocks={blocks} />
      </div>
    </div>
  )
}
