// ChapterTagsField — add/remove contextual tags (bar, restaurant, good vibes, chill…).
import { useState } from 'react'
import { Badge, Button, Input } from '../ui/primitives'

const SUGGESTIONS = ['bar', 'restaurant', 'good vibes', 'chill', 'family', 'history', 'late-night', 'date']

export function ChapterTagsField({
  tags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const t = raw.trim().toLowerCase()
    if (!t || tags.includes(t)) return
    onChange([...tags, t])
    setDraft('')
  }
  const remove = (t: string) => onChange(tags.filter((x) => x !== t))

  return (
    <div data-testid="chapter-tags">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tags.length === 0 && <span className="text-xs text-gray-hi">No tags yet</span>}
        {tags.map((t) => (
          <button key={t} type="button" onClick={() => remove(t)} className="group">
            <Badge tone="signal">
              {t} <span className="ml-1 text-signal/70 group-hover:text-white">×</span>
            </Badge>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="Add a tag and press Enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(draft)
            }
          }}
          aria-label="Add tag"
        />
        <Button type="button" onClick={() => add(draft)}>
          Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTIONS.filter((s) => !tags.includes(s)).map((s) => (
          <button key={s} type="button" onClick={() => add(s)} className="text-[11px] text-gray-hi hover:text-signal">
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}
