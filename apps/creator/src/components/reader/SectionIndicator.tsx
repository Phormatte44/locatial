// SectionIndicator — shows the active chapter's section name (if any).
import type { Section } from '../../domain/types'

export function SectionIndicator({ section }: { section?: Section | null }) {
  if (!section) return <span className="text-[11px] font-bold text-gray-hi">Ungrouped</span>
  return (
    <span className="text-[11px] font-extrabold uppercase tracking-wide text-signal" data-testid="section-indicator">
      {section.name}
    </span>
  )
}
