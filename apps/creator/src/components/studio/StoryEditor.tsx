// StoryEditor — the top-level Studio screen. Three columns: structure · chapter editor · map.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoryEditor } from '../../hooks/useStoryEditor'
import { Button, Input } from '../ui/primitives'
import { StoryStructure } from './StoryStructure'
import { ChapterEditor } from './ChapterEditor'
import { StoryMap } from './StoryMap'
import { PublishPanel } from './PublishPanel'

export function StoryEditor({ storyId }: { storyId: string }) {
  const ed = useStoryEditor(storyId)
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [tab, setTab] = useState<'editor' | 'publish'>('editor')

  // Keep an active chapter selected.
  useEffect(() => {
    if (!ed.bundle) return
    const ids = ed.bundle.chapters.map((c) => c.id)
    if (!activeChapterId || !ids.includes(activeChapterId)) setActiveChapterId(ids[0] ?? null)
  }, [ed.bundle, activeChapterId])

  if (ed.loading) return <div className="p-6 text-sm text-gray-mid">Loading…</div>
  if (!ed.bundle) return <div className="p-6 text-sm text-red-400">Story not found.</div>

  const { bundle } = ed
  const sections = bundle.sections
  const chapters = bundle.chapters
  const activeChapter = chapters.find((c) => c.id === activeChapterId) ?? null

  const nudgeSection = (id: string, dir: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === id)
    if (idx === -1) return
    ed.moveSectionTo(id, idx + 1 + dir)
  }

  return (
    <div className="flex h-screen flex-col bg-root text-chalk">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-rule bg-night px-4 py-2.5">
        <Link to="/studio" className="text-xs font-bold text-gray-mid hover:text-signal">
          ← Stories
        </Link>
        <Input
          defaultValue={bundle.story.title}
          onBlur={(e) => e.target.value !== bundle.story.title && ed.setTitle(e.target.value)}
          className="max-w-md font-extrabold"
          placeholder="Untitled story"
          aria-label="Story title"
        />
        <div className="ml-auto flex items-center gap-2">
          {ed.busy && <span className="text-[11px] text-gray-hi">Saving…</span>}
          <div className="flex overflow-hidden rounded-lg border border-gray-rule">
            <button
              className={`px-3 py-1.5 text-xs font-bold ${tab === 'editor' ? 'bg-surface2 text-chalk' : 'text-gray-mid'}`}
              onClick={() => setTab('editor')}
            >
              Edit
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-bold ${tab === 'publish' ? 'bg-surface2 text-chalk' : 'text-gray-mid'}`}
              onClick={() => setTab('publish')}
            >
              Publish
            </button>
          </div>
          <Link
            to={`/studio/${storyId}/preview`}
            className="rounded-lg border border-gray-rule bg-surface2 px-3 py-1.5 text-xs font-bold text-chalk hover:bg-[#222]"
          >
            Preview
          </Link>
        </div>
      </header>

      {ed.error && <div className="bg-red-950 px-4 py-1.5 text-xs text-red-300">{ed.error}</div>}

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_1fr]">
        {/* Left: structure */}
        <aside className="overflow-y-auto border-r border-gray-rule bg-night p-3">
          <StoryStructure
            chapters={chapters}
            sections={sections}
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            onNudgeChapter={ed.nudgeChapter}
            onAddChapter={() => ed.addChapter()}
            onAddSection={ed.addSection}
            onRenameSection={ed.renameSection}
            onDeleteSection={ed.deleteSection}
            onNudgeSection={nudgeSection}
          />
        </aside>

        {/* Center: chapter editor OR publish */}
        <main className="overflow-y-auto border-r border-gray-rule p-4">
          {tab === 'publish' ? (
            <PublishPanel
              bundle={bundle}
              busy={ed.busy}
              onSlugChange={(slug) => ed.setSlug(slug)}
              onPublish={ed.publish}
              onUnpublish={ed.unpublish}
            />
          ) : activeChapter ? (
            <ChapterEditor
              chapter={activeChapter}
              sections={sections}
              totalChapters={chapters.length}
              onUpdate={ed.updateChapter}
              onUpload={ed.uploadImage}
              onMoveToPosition={ed.moveChapterTo}
              onDelete={(id) => {
                ed.deleteChapter(id)
                setActiveChapterId(null)
              }}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-gray-mid">
              <p>No chapter selected.</p>
              <Button variant="primary" onClick={() => ed.addChapter()}>
                + Add your first chapter
              </Button>
            </div>
          )}
        </main>

        {/* Right: map */}
        <section className="min-h-0">
          <StoryMap
            chapters={chapters}
            activeChapterId={activeChapterId}
            onMapClick={(lng, lat) => {
              if (activeChapterId) ed.updateChapter(activeChapterId, { longitude: lng, latitude: lat })
            }}
          />
        </section>
      </div>
    </div>
  )
}
