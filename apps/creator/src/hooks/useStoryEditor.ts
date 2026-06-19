// useStoryEditor — the Studio controller. Holds the StoryBundle and exposes mutations,
// each of which goes through the repository/service layer (never Supabase directly).
import { useCallback, useEffect, useState } from 'react'
import type { ChapterDraft, StoryBundle } from '../domain/types'
import { changedPositions, moveToPosition, normalizePositions, nudge, reorderSections } from '../domain/ordering'
import { sortByPosition } from '../domain/ordering'
import { getStoryRepository } from '../repositories'
import { getMediaRepository } from '../repositories/mediaRepository'
import { publishStory, unpublishStory } from '../services/publishService'

export function useStoryEditor(storyId: string) {
  const repo = getStoryRepository()
  const [bundle, setBundle] = useState<StoryBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    const b = await repo.getStoryById(storyId)
    setBundle(
      b ? { ...b, chapters: sortByPosition(b.chapters), sections: sortByPosition(b.sections) } : null,
    )
  }, [repo, storyId])

  useEffect(() => {
    let alive = true
    setLoading(true)
    repo
      .getStoryById(storyId)
      .then((b) => {
        if (!alive) return
        setBundle(b ? { ...b, chapters: sortByPosition(b.chapters), sections: sortByPosition(b.sections) } : null)
      })
      .catch((e) => alive && setError(String(e?.message ?? e)))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [repo, storyId])

  const run = useCallback(
    async (fn: () => Promise<unknown>) => {
      setBusy(true)
      setError(null)
      try {
        await fn()
        await reload()
      } catch (e) {
        setError(String((e as Error)?.message ?? e))
        throw e
      } finally {
        setBusy(false)
      }
    },
    [reload],
  )

  const setTitle = useCallback((title: string) => run(() => repo.updateStory(storyId, { title })), [run, repo, storyId])

  const setSlug = useCallback((slug: string) => run(() => repo.updateStory(storyId, { slug })), [run, repo, storyId])

  const addChapter = useCallback(
    (draft?: ChapterDraft) => run(() => repo.createChapter(storyId, draft)),
    [run, repo, storyId],
  )

  const updateChapter = useCallback(
    (id: string, draft: ChapterDraft) => run(() => repo.updateChapter(id, draft)),
    [run, repo],
  )

  const deleteChapter = useCallback(
    async (id: string) => {
      await run(async () => {
        await repo.deleteChapter(id)
        const remaining = (bundle?.chapters ?? []).filter((c) => c.id !== id)
        const renumbered = normalizePositions(remaining)
        await repo.persistOrder({ chapters: changedPositions(remaining, renumbered) })
      })
    },
    [run, repo, bundle],
  )

  const moveChapterTo = useCallback(
    async (id: string, position: number) => {
      if (!bundle) return
      const after = moveToPosition(bundle.chapters, id, position)
      await run(() => repo.persistOrder({ chapters: changedPositions(bundle.chapters, after) }))
    },
    [run, repo, bundle],
  )

  const nudgeChapter = useCallback(
    async (id: string, dir: -1 | 1) => {
      if (!bundle) return
      const after = nudge(bundle.chapters, id, dir)
      await run(() => repo.persistOrder({ chapters: changedPositions(bundle.chapters, after) }))
    },
    [run, repo, bundle],
  )

  const assignSection = useCallback(
    (chapterId: string, sectionId: string | null) =>
      run(() => repo.updateChapter(chapterId, { sectionId })),
    [run, repo],
  )

  const addSection = useCallback(
    (name: string) => run(() => repo.createSection(storyId, name)),
    [run, repo, storyId],
  )

  const renameSection = useCallback(
    (id: string, name: string) => run(() => repo.updateSection(id, { name })),
    [run, repo],
  )

  const deleteSection = useCallback((id: string) => run(() => repo.deleteSection(id)), [run, repo])

  const moveSectionTo = useCallback(
    async (id: string, position: number) => {
      if (!bundle) return
      const after = reorderSections(bundle.sections, id, position)
      await run(() => repo.persistOrder({ sections: changedPositions(bundle.sections, after) }))
    },
    [run, repo, bundle],
  )

  const uploadImage = useCallback(
    async (chapterId: string, file: File) => {
      const media = getMediaRepository()
      await run(async () => {
        const url = await media.uploadChapterImage(storyId, chapterId, file)
        await repo.updateChapter(chapterId, { imageUrl: url })
      })
    },
    [run, repo, storyId],
  )

  const publish = useCallback(
    () => run(() => publishStory(repo, storyId, 'human')),
    [run, repo, storyId],
  )

  const unpublish = useCallback(() => run(() => unpublishStory(repo, storyId)), [run, repo, storyId])

  return {
    bundle,
    loading,
    busy,
    error,
    reload,
    setTitle,
    setSlug,
    addChapter,
    updateChapter,
    deleteChapter,
    moveChapterTo,
    nudgeChapter,
    assignSection,
    addSection,
    renameSection,
    deleteSection,
    moveSectionTo,
    uploadImage,
    publish,
    unpublish,
  }
}
