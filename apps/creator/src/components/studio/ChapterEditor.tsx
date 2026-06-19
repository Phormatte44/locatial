// ChapterEditor — edit one chapter: name, headline, body, tags, image, place, section,
// and its reading position. Text fields persist on blur; the rest persist immediately.
import { useEffect, useState } from 'react'
import type { Chapter, ChapterDraft, Section } from '../../domain/types'
import { Button, Field, Input, Textarea } from '../ui/primitives'
import { ChapterTagsField } from './ChapterTagsField'
import { ChapterMediaField } from './ChapterMediaField'
import { PlacePicker } from './PlacePicker'

type Props = {
  chapter: Chapter
  sections: Section[]
  totalChapters: number
  onUpdate: (id: string, draft: ChapterDraft) => void
  onUpload: (id: string, file: File) => Promise<void>
  onMoveToPosition: (id: string, position: number) => void
  onDelete: (id: string) => void
}

export function ChapterEditor({ chapter, sections, totalChapters, onUpdate, onUpload, onMoveToPosition, onDelete }: Props) {
  const [name, setName] = useState(chapter.name)
  const [headline, setHeadline] = useState(chapter.headline)
  const [body, setBody] = useState(chapter.body)
  const [posInput, setPosInput] = useState(String(chapter.position))

  // Resync when the selected chapter changes.
  useEffect(() => {
    setName(chapter.name)
    setHeadline(chapter.headline)
    setBody(chapter.body)
    setPosInput(String(chapter.position))
  }, [chapter.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-3" data-testid="chapter-editor">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-chalk">Chapter {chapter.position}</h3>
        <Button size="sm" variant="danger" onClick={() => onDelete(chapter.id)}>
          Delete
        </Button>
      </div>

      <Field label="Chapter name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name !== chapter.name && onUpdate(chapter.id, { name })}
          placeholder="e.g. Employees Only"
          aria-label="Chapter name"
        />
      </Field>

      <Field label="Headline">
        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          onBlur={() => headline !== chapter.headline && onUpdate(chapter.id, { headline })}
          placeholder="A short editorial headline"
          aria-label="Headline"
        />
      </Field>

      <Field label="Body copy">
        <Textarea
          value={body}
          rows={5}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => body !== chapter.body && onUpdate(chapter.id, { body })}
          placeholder="The story for this stop…"
          aria-label="Body copy"
        />
      </Field>

      <Field label="Image">
        <ChapterMediaField imageUrl={chapter.imageUrl} onUpload={(f) => onUpload(chapter.id, f)} />
      </Field>

      <Field label="Tags">
        <ChapterTagsField tags={chapter.tags} onChange={(tags) => onUpdate(chapter.id, { tags })} />
      </Field>

      <Field label="Location">
        <PlacePicker
          longitude={chapter.longitude}
          latitude={chapter.latitude}
          placeName={chapter.placeName}
          onPick={(r) => onUpdate(chapter.id, { longitude: r.lng, latitude: r.lat, placeName: r.label, placeId: r.placeId })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Section">
          <select
            value={chapter.sectionId ?? ''}
            onChange={(e) => onUpdate(chapter.id, { sectionId: e.target.value || null })}
            className="w-full rounded-lg border border-gray-rule bg-surface1 px-3 py-2 text-sm text-chalk focus:border-signal focus:outline-none"
            aria-label="Section"
          >
            <option value="">Ungrouped</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || 'Untitled section'}
              </option>
            ))}
          </select>
        </Field>

        <Field label={`Reading position (1–${totalChapters})`}>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={totalChapters}
              value={posInput}
              onChange={(e) => setPosInput(e.target.value)}
              aria-label="Reading position"
            />
            <Button
              type="button"
              onClick={() => {
                const p = parseInt(posInput, 10)
                if (!Number.isNaN(p)) onMoveToPosition(chapter.id, p)
              }}
            >
              Move
            </Button>
          </div>
        </Field>
      </div>
    </div>
  )
}
