// StoryStructure — the outline: sections manager + ordered chapter list.
import type { Chapter, Section } from '../../domain/types'
import { ChapterList } from './ChapterList'
import { SectionList } from './SectionList'

type Props = {
  chapters: Chapter[]
  sections: Section[]
  activeChapterId: string | null
  onSelectChapter: (id: string) => void
  onNudgeChapter: (id: string, dir: -1 | 1) => void
  onAddChapter: () => void
  onAddSection: (name: string) => void
  onRenameSection: (id: string, name: string) => void
  onDeleteSection: (id: string) => void
  onNudgeSection: (id: string, dir: -1 | 1) => void
}

export function StoryStructure(props: Props) {
  return (
    <div className="space-y-5" data-testid="story-structure">
      <SectionList
        sections={props.sections}
        onAdd={props.onAddSection}
        onRename={props.onRenameSection}
        onDelete={props.onDeleteSection}
        onNudge={props.onNudgeSection}
      />
      <ChapterList
        chapters={props.chapters}
        sections={props.sections}
        activeChapterId={props.activeChapterId}
        onSelect={props.onSelectChapter}
        onNudge={props.onNudgeChapter}
        onAdd={props.onAddChapter}
      />
    </div>
  )
}
