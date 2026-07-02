import type { MapLook } from './types'

export const MAP_LOOKS: Record<string, MapLook> = {
  dark_editorial: {
    id: 'dark_editorial',
    name: 'Dark Editorial',
    baseStyle: 'paper',
    labelMode: 'locatial_only',
    buildings: { enabled: true, extrusion: true },
    atmosphere: { enabled: true, fog: 0.15, glow: 0.2 },
    actorDefaults: {
      route: { color: '#f5f0e6', emphasis: 'normal' },
      blocked_road: { color: '#ff6b35', emphasis: 'critical', pulse: true },
      flood_glow: { color: '#4ecdc4', emphasis: 'subtle', opacity: 0.45 },
      alternate_route: { color: '#c8c4bc', emphasis: 'subtle', opacity: 0.5 },
      label: { color: '#f2f2f2', emphasis: 'normal' },
      bridge: { color: '#ff2d7a', emphasis: 'normal' },
    },
  },
  topo_noir: {
    id: 'topo_noir',
    name: 'Topo Noir',
    baseStyle: 'paper',
    labelMode: 'off',
    terrain: { enabled: true, exaggeration: 1.2 },
    buildings: { enabled: false, extrusion: false },
    atmosphere: { enabled: true, fog: 0.25, glow: 0.1 },
  },
  flood_analysis: {
    id: 'flood_analysis',
    name: 'Flood Analysis',
    baseStyle: 'paper',
    labelMode: 'reduced',
    buildings: { enabled: true, extrusion: true },
    atmosphere: { enabled: true, fog: 0.3, glow: 0.35 },
    actorDefaults: {
      flood_glow: { color: '#2dd4bf', emphasis: 'critical', opacity: 0.55 },
      blocked_road: { color: '#ff6b35', emphasis: 'critical' },
      route: { color: '#fde68a', emphasis: 'normal' },
    },
  },
}
