import type { Chapter } from '../../domain/types'
import { ChapterBlocks, parseBlocks } from './ChapterBlocks'

export function ChapterSlide({ chapter }: { chapter: Chapter }) {
  const blocks = parseBlocks(chapter.body)
  return (
    <div className="chapter-scroll bg-paper" data-testid="chapter-slide">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-3">
        {chapter.imageUrl ? (
          <img
            src={chapter.imageUrl}
            alt={chapter.name}
            className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="mb-4 flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-paper-card text-xs text-stone">
            No image
          </div>
        )}

        <div className="text-sm font-bold text-signal-pink">{chapter.name || 'Chapter'}</div>

        {chapter.headline && (
          <h2 className="mb-3 mt-1 text-xl font-extrabold leading-tight text-ink">{chapter.headline}</h2>
        )}

        <ChapterBlocks blocks={blocks} />
      </div>
    </div>
  )
}
