// Shared spatial scene contract — used by player, studio, and public app.

import type { Geometry } from 'geojson'

export type SceneType =
  | 'access_failure'
  | 'route_journey'
  | 'boundary_reveal'
  | 'spread'
  | 'before_after'
  | 'proximity'
  | 'isolation'
  | 'descent'
  | 'cluster'
  | 'conflict'
  | 'sightline'

export type ActorType =
  | 'bridge'
  | 'route'
  | 'blocked_road'
  | 'flood_glow'
  | 'traffic_flow'
  | 'alternate_route'
  | 'label'
  | 'boundary'
  | 'area'
  | 'place'
  | 'image_card'
  | 'camera_move'

export type ActorState =
  | 'hidden'
  | 'enter'
  | 'active'
  | 'persistent'
  | 'dimmed'
  | 'ghost'
  | 'broken'
  | 'exit'

export type Easing = 'linear' | 'cinematic' | 'documentary_glide' | 'slow_in_fast_out'

export type ActorStyle = {
  color?: string
  emphasis?: 'normal' | 'critical' | 'subtle'
  opacity?: number
  pulse?: boolean
  labelText?: string
}

export type SpatialActor = {
  id: string
  type: ActorType
  name: string
  geometry: Geometry
  properties: Record<string, unknown>
  defaultStyle: ActorStyle
}

export type Beat = {
  id: string
  index: number
  title: string
  headline?: string
  description?: string
  durationMs?: number
}

export type ActorKeyframe = {
  beatId: string
  state: ActorState
  animationPreset?: string
  styleOverrides?: Partial<ActorStyle>
}

export type ActorTrack = {
  actorId: string
  keyframes: ActorKeyframe[]
}

export type SpatialCameraKeyframe = {
  beatId: string
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
  durationMs: number
  easing: Easing
  focusTarget?: string
}

export type CameraTrack = {
  keyframes: SpatialCameraKeyframe[]
}

export type MapLook = {
  id: string
  name: string
  baseStyle: 'paper' | 'dark_editorial' | 'topo_noir' | 'flood_analysis'
  labelMode: 'default' | 'reduced' | 'locatial_only' | 'off'
  terrain?: { enabled: boolean; exaggeration?: number }
  buildings?: { enabled: boolean; extrusion?: boolean }
  atmosphere?: { enabled: boolean; fog?: number; glow?: number }
  actorDefaults?: Partial<Record<ActorType, Partial<ActorStyle>>>
}

export type SpatialScene = {
  id: string
  title: string
  sceneType: SceneType
  mapSentence: string
  body?: string
  cameraTrack: CameraTrack
  beatTrack: Beat[]
  actorTracks: ActorTrack[]
  mapLookId: string
}

export type SpatialStory = {
  id: string
  title: string
  description?: string
  scenes: SpatialScene[]
  actors: Record<string, SpatialActor>
  mapLooks: Record<string, MapLook>
}

/** Resolved runtime snapshot for one beat. */
export type ResolvedBeat = {
  beat: Beat
  camera: SpatialCameraKeyframe
  actors: Array<{
    actor: SpatialActor
    state: ActorState
    style: ActorStyle
    animationPreset?: string
  }>
}
