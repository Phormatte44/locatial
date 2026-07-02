import type {
  ActorState,
  ActorStyle,
  ActorTrack,
  Beat,
  CameraTrack,
  ResolvedBeat,
  SpatialActor,
  SpatialCameraKeyframe,
  SpatialScene,
  SpatialStory,
} from '../types'

function mergeStyle(base: ActorStyle, overrides?: Partial<ActorStyle>): ActorStyle {
  return { ...base, ...overrides }
}

function keyframeForBeat<T extends { beatId: string }>(items: T[], beatId: string): T | undefined {
  return items.find((k) => k.beatId === beatId)
}

export function getBeatById(scene: SpatialScene, beatId: string): Beat | undefined {
  return scene.beatTrack.find((b) => b.id === beatId)
}

export function getCameraForBeat(cameraTrack: CameraTrack, beatId: string): SpatialCameraKeyframe | undefined {
  return keyframeForBeat(cameraTrack.keyframes, beatId)
}

export function getActorStateAtBeat(track: ActorTrack, beatId: string): {
  state: ActorState
  animationPreset?: string
  styleOverrides?: Partial<ActorStyle>
} {
  const kf = keyframeForBeat(track.keyframes, beatId)
  return kf ? { state: kf.state, animationPreset: kf.animationPreset, styleOverrides: kf.styleOverrides } : { state: 'hidden' as const }
}

export function resolveBeat(story: SpatialStory, scene: SpatialScene, beatId: string): ResolvedBeat | null {
  const beat = getBeatById(scene, beatId)
  const camera = getCameraForBeat(scene.cameraTrack, beatId)
  if (!beat || !camera) return null

  const actors = scene.actorTracks
    .map((track) => {
      const actor = story.actors[track.actorId]
      if (!actor) return null
      const { state, animationPreset, styleOverrides } = getActorStateAtBeat(track, beatId)
      return {
        actor,
        state,
        style: mergeStyle(actor.defaultStyle, styleOverrides),
        animationPreset,
      }
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)

  return { beat, camera, actors }
}

export function resolveSceneAtBeatIndex(story: SpatialStory, scene: SpatialScene, index: number): ResolvedBeat | null {
  const beat = scene.beatTrack[index]
  if (!beat) return null
  return resolveBeat(story, scene, beat.id)
}

export function easingToMapLibre(easing: SpatialCameraKeyframe['easing']): (t: number) => number {
  switch (easing) {
    case 'linear':
      return (t) => t
    case 'slow_in_fast_out':
      return (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    case 'cinematic':
      return (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    case 'documentary_glide':
    default:
      return (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2)
  }
}

export function isActorVisible(state: ActorState): boolean {
  return state !== 'hidden' && state !== 'exit'
}

export function actorOpacity(state: ActorState, base = 1): number {
  switch (state) {
    case 'hidden':
    case 'exit':
      return 0
    case 'ghost':
      return base * 0.35
    case 'dimmed':
      return base * 0.5
    case 'enter':
      return base * 0.85
    default:
      return base
  }
}
