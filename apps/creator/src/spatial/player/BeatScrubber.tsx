import type { Beat } from '../types'

type Props = {
  beats: Beat[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function BeatScrubber({ beats, activeIndex, onSelect }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2" aria-label="Beat scrubber">
      {beats.map((beat, i) => (
        <button
          key={beat.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${beat.title}${i === activeIndex ? ' (current)' : ''}`}
          aria-current={i === activeIndex ? 'step' : undefined}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === activeIndex ? 'w-8 bg-signal-pink' : 'w-2 bg-paper-rule hover:bg-stone'
          }`}
        />
      ))}
    </div>
  )
}
