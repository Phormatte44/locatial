import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { ACCESS_FAILURE_STORY } from '../spatial/fixtures/accessFailureScene'
import type {
  ActorState,
  SpatialCameraKeyframe,
  SpatialStory,
  SpatialScene,
  SpatialActor,
} from '../spatial/types'
import { getBeatById } from '../spatial/engine/timeline'

export type DirectorMode = 'author' | 'preview'

type DirectorState = {
  story: SpatialStory
  activeSceneId: string
  activeBeatId: string
  selectedActorId: string | null
  mode: DirectorMode
  mapLookId: string
  showJson: boolean
  showAi: boolean
}

type DirectorContextValue = DirectorState & {
  activeScene: SpatialScene
  activeBeatIndex: number
  setActiveBeat: (beatId: string) => void
  selectActor: (actorId: string | null) => void
  setMode: (mode: DirectorMode) => void
  setMapLook: (id: string) => void
  setShowJson: (open: boolean) => void
  setShowAi: (open: boolean) => void
  updateActor: (actorId: string, patch: Partial<SpatialActor>) => void
  updateActorKeyframe: (actorId: string, beatId: string, state: ActorState) => void
  captureCamera: (camera: Omit<SpatialCameraKeyframe, 'beatId'>) => void
  applyAiDirectorDraft: () => void
  resetStory: () => void
}

const DirectorContext = createContext<DirectorContextValue | null>(null)

function cloneStory(): SpatialStory {
  return structuredClone(ACCESS_FAILURE_STORY)
}

export function DirectorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DirectorState>(() => {
    const story = cloneStory()
    const scene = story.scenes[0]
    return {
      story,
      activeSceneId: scene.id,
      activeBeatId: scene.beatTrack[0].id,
      selectedActorId: null,
      mode: 'author',
      mapLookId: scene.mapLookId,
      showJson: false,
      showAi: false,
    }
  })

  const activeScene = useMemo(
    () => state.story.scenes.find((s) => s.id === state.activeSceneId) ?? state.story.scenes[0],
    [state.story.scenes, state.activeSceneId],
  )

  const activeBeatIndex = useMemo(
    () => activeScene.beatTrack.findIndex((b) => b.id === state.activeBeatId),
    [activeScene.beatTrack, state.activeBeatId],
  )

  const setActiveBeat = useCallback((beatId: string) => {
    setState((s) => ({ ...s, activeBeatId: beatId }))
  }, [])

  const selectActor = useCallback((actorId: string | null) => {
    setState((s) => ({ ...s, selectedActorId: actorId }))
  }, [])

  const setMode = useCallback((mode: DirectorMode) => {
    setState((s) => ({ ...s, mode }))
  }, [])

  const setMapLook = useCallback((id: string) => {
    setState((s) => {
      const scenes = s.story.scenes.map((sc) =>
        sc.id === s.activeSceneId ? { ...sc, mapLookId: id } : sc,
      )
      return { ...s, mapLookId: id, story: { ...s.story, scenes } }
    })
  }, [])

  const setShowJson = useCallback((open: boolean) => setState((s) => ({ ...s, showJson: open })), [])
  const setShowAi = useCallback((open: boolean) => setState((s) => ({ ...s, showAi: open })), [])

  const updateActor = useCallback((actorId: string, patch: Partial<SpatialActor>) => {
    setState((s) => ({
      ...s,
      story: {
        ...s.story,
        actors: {
          ...s.story.actors,
          [actorId]: { ...s.story.actors[actorId], ...patch },
        },
      },
    }))
  }, [])

  const updateActorKeyframe = useCallback((actorId: string, beatId: string, actorState: ActorState) => {
    setState((s) => {
      const scenes = s.story.scenes.map((sc) => {
        if (sc.id !== s.activeSceneId) return sc
        const actorTracks = sc.actorTracks.map((track) => {
          if (track.actorId !== actorId) return track
          const exists = track.keyframes.some((k) => k.beatId === beatId)
          const keyframes = exists
            ? track.keyframes.map((k) => (k.beatId === beatId ? { ...k, state: actorState } : k))
            : [...track.keyframes, { beatId, state: actorState }]
          return { ...track, keyframes }
        })
        return { ...sc, actorTracks }
      })
      return { ...s, story: { ...s.story, scenes } }
    })
  }, [])

  const captureCamera = useCallback(
    (camera: Omit<SpatialCameraKeyframe, 'beatId'>) => {
      setState((s) => {
        const scenes = s.story.scenes.map((sc) => {
          if (sc.id !== s.activeSceneId) return sc
          const exists = sc.cameraTrack.keyframes.some((k) => k.beatId === s.activeBeatId)
          const keyframes = exists
            ? sc.cameraTrack.keyframes.map((k) =>
                k.beatId === s.activeBeatId ? { ...k, ...camera, beatId: s.activeBeatId } : k,
              )
            : [...sc.cameraTrack.keyframes, { ...camera, beatId: s.activeBeatId }]
          return { ...sc, cameraTrack: { keyframes } }
        })
        return { ...s, story: { ...s.story, scenes } }
      })
    },
    [],
  )

  const applyAiDirectorDraft = useCallback(() => {
    setState((s) => {
      const story = cloneStory()
      const scene = story.scenes[0]
      return {
        ...s,
        story,
        activeSceneId: scene.id,
        activeBeatId: scene.beatTrack[0].id,
        selectedActorId: null,
        mapLookId: scene.mapLookId,
      }
    })
  }, [])

  const resetStory = useCallback(() => applyAiDirectorDraft(), [applyAiDirectorDraft])

  const value = useMemo<DirectorContextValue>(
    () => ({
      ...state,
      activeScene,
      activeBeatIndex,
      setActiveBeat,
      selectActor,
      setMode,
      setMapLook,
      setShowJson,
      setShowAi,
      updateActor,
      updateActorKeyframe,
      captureCamera,
      applyAiDirectorDraft,
      resetStory,
    }),
    [
      state,
      activeScene,
      activeBeatIndex,
      setActiveBeat,
      selectActor,
      setMode,
      setMapLook,
      setShowJson,
      setShowAi,
      updateActor,
      updateActorKeyframe,
      captureCamera,
      applyAiDirectorDraft,
      resetStory,
    ],
  )

  return <DirectorContext.Provider value={value}>{children}</DirectorContext.Provider>
}

export function useDirector() {
  const ctx = useContext(DirectorContext)
  if (!ctx) throw new Error('useDirector must be used within DirectorProvider')
  return ctx
}

export function useDirectorBeat() {
  const d = useDirector()
  const beat = getBeatById(d.activeScene, d.activeBeatId)
  return beat
}
