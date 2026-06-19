// SectionList — create, rename, reorder, and delete named sections.
import { useState } from 'react'
import type { Section } from '../../domain/types'
import { Button, Input } from '../ui/primitives'

type Props = {
  sections: Section[]
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onNudge: (id: string, dir: -1 | 1) => void
}

export function SectionList({ sections, onAdd, onRename, onDelete, onNudge }: Props) {
  const [newName, setNewName] = useState('')

  return (
    <div data-testid="section-list">
      <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-mid">Sections ({sections.length})</h3>
      <ul className="space-y-1">
        {sections.map((s, i) => (
          <li key={s.id} className="flex items-center gap-1.5 rounded-lg border border-gray-rule bg-surface1 px-2 py-1.5">
            <span className="w-4 text-center text-[11px] font-bold tabular-nums text-gray-mid">{i + 1}</span>
            <Input
              value={s.name}
              onChange={(e) => onRename(s.id, e.target.value)}
              className="h-8 py-1"
              aria-label={`Section ${i + 1} name`}
            />
            <button
              type="button"
              aria-label={`Move section ${i + 1} up`}
              className="px-1 text-gray-mid hover:text-signal disabled:opacity-30"
              disabled={i === 0}
              onClick={() => onNudge(s.id, -1)}
            >
              ▲
            </button>
            <button
              type="button"
              aria-label={`Move section ${i + 1} down`}
              className="px-1 text-gray-mid hover:text-signal disabled:opacity-30"
              disabled={i === sections.length - 1}
              onClick={() => onNudge(s.id, 1)}
            >
              ▼
            </button>
            <button
              type="button"
              aria-label={`Delete section ${i + 1}`}
              className="px-1 text-gray-hi hover:text-red-400"
              onClick={() => onDelete(s.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <Input
          value={newName}
          placeholder="New section name"
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newName.trim()) {
              onAdd(newName.trim())
              setNewName('')
            }
          }}
          aria-label="New section name"
        />
        <Button
          type="button"
          onClick={() => {
            if (newName.trim()) {
              onAdd(newName.trim())
              setNewName('')
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}
