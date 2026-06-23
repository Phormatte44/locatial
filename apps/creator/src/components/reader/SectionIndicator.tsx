import type { Section } from '../../domain/types'

export function SectionIndicator({ section }: { section?: Section | null }) {
  if (!section) return <span className="text-[11px] font-bold text-white/40">Ungrouped</span>
  return (
    <span className="text-[11px] font-extrabold uppercase tracking-wide text-signal-pink" data-testid="section-indicator">
      {section.name}
    </span>
  )
}
