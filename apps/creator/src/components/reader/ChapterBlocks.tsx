// ChapterBlocks — renders a chapter's structured content (matches locatial.io's reader):
// paragraphs, fact callouts (label + big value + caption), named sub-sections, and
// affiliate cards. Content comes as an ordered block array; for chapters that only have a
// plain `body` string we fall back to splitting it into paragraphs.

export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'fact'; label: string; value: string; caption?: string }
  | { type: 'subsection'; heading: string; text: string }
  | { type: 'affiliate'; label: string; url?: string; image?: string }

/** Parse a chapter body into blocks. A JSON array → typed blocks; else paragraphs. */
export function parseBlocks(body: string | null | undefined): Block[] {
  const raw = (body ?? '').trim()
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return arr as Block[]
    } catch {
      /* fall through to plain text */
    }
  }
  return raw
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'paragraph', text }))
}

export function ChapterBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.type === 'fact') {
          return (
            <div key={i} className="rounded-2xl bg-surface1 p-4">
              <div className="text-sm font-bold text-lime">{b.label}</div>
              <div className="mt-1 text-3xl font-extrabold leading-none text-chalk">{b.value}</div>
              {b.caption && <div className="mt-1 text-xs text-gray-mid">{b.caption}</div>}
            </div>
          )
        }
        if (b.type === 'subsection') {
          return (
            <div key={i} className="rounded-2xl bg-surface1 p-4">
              <div className="mb-1 text-sm font-bold text-lime">{b.heading}</div>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-lo">{b.text}</p>
            </div>
          )
        }
        if (b.type === 'affiliate') {
          const card = (
            <div className="overflow-hidden rounded-2xl border border-gray-rule bg-surface1">
              {b.image && <img src={b.image} alt="" className="aspect-[16/9] w-full object-cover" />}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-bold text-chalk">{b.label}</span>
                <span className="text-xs font-bold text-lime">›</span>
              </div>
            </div>
          )
          return b.url ? (
            <a key={i} href={b.url} target="_blank" rel="noopener noreferrer" className="block">
              {card}
            </a>
          ) : (
            <div key={i}>{card}</div>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-lo">
            {b.text}
          </p>
        )
      })}
    </div>
  )
}
