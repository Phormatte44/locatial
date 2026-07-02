import type { SpatialStory } from '../types'
import { MAP_LOOKS } from '../mapLooks'

/**
 * Scene 07 — Access Failure on a real corridor.
 * Golden Gate Bridge: open. Lower Doyle Drive approach: not.
 * Real coordinates; editorial geometry is simplified for the prototype.
 */
export const ACCESS_FAILURE_STORY: SpatialStory = {
  id: 'story_access_failure_01',
  title: 'The Road to the Bridge Fails',
  description: 'The bridge is open, but the road to reach it is not.',
  mapLooks: MAP_LOOKS,
  actors: {
    actor_bridge: {
      id: 'actor_bridge',
      type: 'bridge',
      name: 'Golden Gate Bridge',
      geometry: { type: 'Point', coordinates: [-122.4783, 37.8199] },
      properties: { landmark: true },
      defaultStyle: { color: '#ff2d7a', emphasis: 'normal' },
    },
    actor_route: {
      id: 'actor_route',
      type: 'route',
      name: 'Intended Route',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4468, 37.8012],
          [-122.4512, 37.8045],
          [-122.4558, 37.8078],
          [-122.4605, 37.8105],
          [-122.4655, 37.8132],
          [-122.4720, 37.8168],
          [-122.4783, 37.8199],
        ],
      },
      properties: { role: 'intended' },
      defaultStyle: { color: '#f5f0e6', emphasis: 'normal' },
    },
    actor_blocked: {
      id: 'actor_blocked',
      type: 'blocked_road',
      name: 'Blocked Underpass',
      geometry: { type: 'Point', coordinates: [-122.4558, 37.8078] },
      properties: { severity: 'closed', label: 'Underpass flooded' },
      defaultStyle: { color: '#ff6b35', emphasis: 'critical', pulse: true },
    },
    actor_flood: {
      id: 'actor_flood',
      type: 'flood_glow',
      name: 'Flood Glow',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.4585, 37.8062],
            [-122.4532, 37.8062],
            [-122.4532, 37.8095],
            [-122.4585, 37.8095],
            [-122.4585, 37.8062],
          ],
        ],
      },
      properties: { depth: 'high' },
      defaultStyle: { color: '#4ecdc4', emphasis: 'subtle', opacity: 0.42 },
    },
    actor_traffic: {
      id: 'actor_traffic',
      type: 'traffic_flow',
      name: 'Traffic Flow',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4468, 37.8012],
          [-122.4495, 37.8028],
          [-122.4520, 37.8040],
          [-122.4545, 37.8055],
        ],
      },
      properties: { density: 'building' },
      defaultStyle: { color: '#fde68a', emphasis: 'subtle', opacity: 0.65 },
    },
    actor_alt: {
      id: 'actor_alt',
      type: 'alternate_route',
      name: 'Alternate Route',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4468, 37.8012],
          [-122.4420, 37.8055],
          [-122.4385, 37.8090],
          [-122.4425, 37.8125],
          [-122.4480, 37.8155],
          [-122.4550, 37.8175],
          [-122.4650, 37.8188],
          [-122.4783, 37.8199],
        ],
      },
      properties: { role: 'alternate', slower: true },
      defaultStyle: { color: '#c8c4bc', emphasis: 'subtle', opacity: 0.55 },
    },
    actor_label: {
      id: 'actor_label',
      type: 'label',
      name: 'Final Label',
      geometry: { type: 'Point', coordinates: [-122.4620, 37.8120] },
      properties: {},
      defaultStyle: {
        color: '#f2f2f2',
        labelText: 'The bridge is open. The road to reach it is not.',
      },
    },
  },
  scenes: [
    {
      id: 'scene_07',
      title: 'The Road to the Bridge Fails',
      sceneType: 'access_failure',
      mapSentence: 'The bridge is open, but access collapses.',
      body: 'An access failure scene — the landmark remains reachable in theory, not in practice.',
      mapLookId: 'dark_editorial',
      beatTrack: [
        {
          id: 'beat_0',
          index: 0,
          title: 'Setup',
          headline: 'The bridge stays open',
          description: 'From above, the crossing reads as normal. The city still expects access.',
        },
        {
          id: 'beat_1',
          index: 1,
          title: 'Route Draws',
          headline: 'The intended corridor',
          description: 'Traffic assumes the familiar approach — straight toward the span.',
        },
        {
          id: 'beat_2',
          index: 2,
          title: 'Failure',
          headline: 'The low road fails',
          description: 'Water fills the underpass. The route breaks before the bridge.',
        },
        {
          id: 'beat_3',
          index: 3,
          title: 'Consequence',
          headline: 'Open, but unreachable',
          description: 'The bridge is open. The road to reach it is not.',
        },
      ],
      cameraTrack: {
        keyframes: [
          {
            beatId: 'beat_0',
            center: [-122.465, 37.812],
            zoom: 11.2,
            pitch: 28,
            bearing: -18,
            durationMs: 2200,
            easing: 'documentary_glide',
            focusTarget: 'actor_bridge',
          },
          {
            beatId: 'beat_1',
            center: [-122.458, 37.808],
            zoom: 13.8,
            pitch: 52,
            bearing: -22,
            durationMs: 2400,
            easing: 'documentary_glide',
            focusTarget: 'actor_route',
          },
          {
            beatId: 'beat_2',
            center: [-122.456, 37.8075],
            zoom: 14.8,
            pitch: 58,
            bearing: -14,
            durationMs: 2000,
            easing: 'cinematic',
            focusTarget: 'actor_blocked',
          },
          {
            beatId: 'beat_3',
            center: [-122.468, 37.814],
            zoom: 12.4,
            pitch: 44,
            bearing: -20,
            durationMs: 2600,
            easing: 'documentary_glide',
            focusTarget: 'actor_bridge',
          },
        ],
      },
      actorTracks: [
        {
          actorId: 'actor_bridge',
          keyframes: [
            { beatId: 'beat_0', state: 'active' },
            { beatId: 'beat_1', state: 'persistent' },
            { beatId: 'beat_2', state: 'persistent' },
            { beatId: 'beat_3', state: 'dimmed' },
          ],
        },
        {
          actorId: 'actor_route',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'enter', animationPreset: 'draw' },
            { beatId: 'beat_2', state: 'broken', animationPreset: 'break' },
            { beatId: 'beat_3', state: 'ghost' },
          ],
        },
        {
          actorId: 'actor_blocked',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'hidden' },
            { beatId: 'beat_2', state: 'active', animationPreset: 'pulse' },
            { beatId: 'beat_3', state: 'persistent' },
          ],
        },
        {
          actorId: 'actor_flood',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'hidden' },
            { beatId: 'beat_2', state: 'enter', animationPreset: 'fade' },
            { beatId: 'beat_3', state: 'active' },
          ],
        },
        {
          actorId: 'actor_traffic',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'enter', animationPreset: 'flow' },
            { beatId: 'beat_2', state: 'active', animationPreset: 'jam' },
            { beatId: 'beat_3', state: 'dimmed' },
          ],
        },
        {
          actorId: 'actor_alt',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'hidden' },
            { beatId: 'beat_2', state: 'hidden' },
            { beatId: 'beat_3', state: 'ghost', animationPreset: 'draw' },
          ],
        },
        {
          actorId: 'actor_label',
          keyframes: [
            { beatId: 'beat_0', state: 'hidden' },
            { beatId: 'beat_1', state: 'hidden' },
            { beatId: 'beat_2', state: 'hidden' },
            { beatId: 'beat_3', state: 'enter', animationPreset: 'fade' },
          ],
        },
      ],
    },
  ],
}

export function getAccessFailureScene() {
  return ACCESS_FAILURE_STORY.scenes[0]
}
