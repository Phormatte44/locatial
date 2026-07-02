// ---------------------------------------------------------------------------
// All story actors are anchored to REAL geographic coordinates.
// Substrate: New Orleans, Louisiana / Gulf of Mexico.
// Names are fictional (Harrow Bay, Dockside, Eastbank…) — the geometry is real.
// ---------------------------------------------------------------------------

export type LngLat = [number, number]

export type ElementDef =
  // atmospheric actors
  | { kind: 'stormCore'; at: LngLat; km: number }
  | { kind: 'pressureField'; at: LngLat; km: number }
  | { kind: 'windRing'; at: LngLat; km: number }
  // uncertainty actors
  | { kind: 'cone'; ring: LngLat[] }
  | { kind: 'modelTracks'; paths: LngLat[][] }
  // movement actors
  | { kind: 'stormTrack'; path: LngLat[] }
  | {
      kind: 'route'
      path: LngLat[]
      tone: 'intended' | 'failed' | 'reroute' | 'bus' | 'boat' | 'walk'
      blockAtEnd?: boolean
      delay?: number
    }
  // geographic force actors
  | { kind: 'arrows'; paths: LngLat[][]; scale?: number }
  | {
      kind: 'area'
      ring: LngLat[]
      tone: 'funnel' | 'district' | 'zone' | 'flood' | 'outage'
      label?: string
      labelAt?: LngLat
    }
  | {
      kind: 'line'
      path: LngLat[]
      tone: 'embankment' | 'highwater' | 'distance' | 'visibility' | 'exposure' | 'bridge'
      label?: string
      labelAt?: LngLat
    }
  | { kind: 'glowPoint'; at: LngLat; km: number; color?: string }
  // institutional / human / failure actors
  | {
      kind: 'marker'
      at: LngLat
      icon:
        | 'pump'
        | 'breach'
        | 'block'
        | 'wall'
        | 'port'
        | 'school'
        | 'shelter'
        | 'hospital'
        | 'seq'
        | 'origin'
      label?: string
      sub?: string
      dx?: number
      dy?: number
    }
  | { kind: 'ring'; at: LngLat; km: number }
  | { kind: 'dots'; path: LngLat[]; n: number }
  | {
      kind: 'label'
      at: LngLat
      text: string
      size?: 'xs' | 'sm' | 'md'
      tone?: 'water' | 'city' | 'quiet' | 'warm'
      dx?: number
      dy?: number
    }
  | { kind: 'consequence'; at: LngLat; n: number; text: string; dx?: number; dy?: number }

// ---- key fictional places on real ground -----------------------------------

export const PLACES = {
  city: [-90.0605, 29.9595] as LngLat, // "Harrow Bay" city — French Quarter riverfront
  pier14: [-90.0405, 29.9581] as LngLat, // riverfront wharf, Bywater
  ferryTerminal: [-90.0442, 29.9578] as LngLat,
  marketSquare: [-90.0585, 29.9598] as LngLat, // French Market
  school: [-90.0335, 29.9643] as LngLat, // "Eastbank High" — real school site, St. Claude Ave
  hospital: [-90.0742, 29.9538] as LngLat, // "Harrow General" — CBD medical district
  pump: [-90.037, 29.9563] as LngLat, // "southern pump station", Ferry Road
  underpass: [-90.0645, 29.9492] as LngLat, // blocked approach to West Gate Bridge
  wall: [-90.0296, 29.9663] as LngLat, // collapsed retaining wall on Ridge Road
  oldIronBridge: [-90.0234, 29.9698] as LngLat, // canal crossing, north
  canalLow: [-90.049, 29.9702] as LngLat, // canal quarter low point
  boatStop: [-90.0292, 29.9669] as LngLat,
}

const STORM_1: LngLat = [-87.1, 26.9]
const STORM_2: LngLat = [-87.7, 27.55]
const STORM_3: LngLat = [-88.5, 28.45]
const STORM_4: LngLat = [-89.05, 29.1]

// ---- the actor registry ----------------------------------------------------

export const ELEMENTS: Record<string, ElementDef> = {
  // ······ scene 1–4 · ocean scale ······
  'label-gulf': { kind: 'label', at: [-87.6, 25.9], text: 'Open water', size: 'sm', tone: 'water' },
  'label-city-far': { kind: 'label', at: PLACES.city, text: 'Harrow Bay', size: 'xs', tone: 'city', dy: -8 },
  'label-bay': { kind: 'label', at: [-89.58, 30.06], text: 'The Bay', size: 'xs', tone: 'water' },

  'storm-core-1': { kind: 'stormCore', at: STORM_1, km: 46 },
  'pressure-1': { kind: 'pressureField', at: STORM_1, km: 150 },
  'storm-core-2': { kind: 'stormCore', at: STORM_2, km: 55 },
  'pressure-2': { kind: 'pressureField', at: STORM_2, km: 170 },
  'storm-core-3': { kind: 'stormCore', at: STORM_3, km: 62 },
  'wind-ring-3': { kind: 'windRing', at: STORM_3, km: 130 },
  'storm-core-4': { kind: 'stormCore', at: STORM_4, km: 60 },

  'cone-wide': {
    kind: 'cone',
    ring: [
      STORM_2,
      [-89.2, 28.35],
      [-90.9, 29.1],
      [-91.9, 29.85],
      [-90.9, 30.25],
      [-89.3, 30.32],
      [-87.9, 30.5],
      [-86.5, 30.35],
      [-86.35, 29.3],
      [-86.9, 28.2],
    ],
  },
  'model-tracks': {
    kind: 'modelTracks',
    paths: [
      [STORM_2, [-88.7, 28.3], [-89.8, 29.0], [-90.9, 29.6]],
      [STORM_2, [-88.35, 28.4], [-88.95, 29.35], [-89.35, 30.05]],
      [STORM_2, [-87.9, 28.5], [-88.0, 29.5], [-88.1, 30.3]],
      [STORM_2, [-87.3, 28.4], [-86.9, 29.3], [-86.65, 30.05]],
      [STORM_2, [-88.95, 28.05], [-90.3, 28.55], [-91.5, 29.15]],
    ],
  },
  'track-early': { kind: 'stormTrack', path: [[-86.55, 26.35], [-87.1, 26.9], STORM_2] },
  'track-mid': {
    kind: 'stormTrack',
    path: [[-86.55, 26.35], [-87.1, 26.9], STORM_2, [-88.1, 28.0], STORM_3],
  },
  'cone-narrow': {
    kind: 'cone',
    ring: [STORM_3, [-90.15, 29.35], [-89.85, 30.15], [-88.85, 30.42], [-88.35, 29.65]],
  },
  'exposure-band': {
    kind: 'line',
    tone: 'exposure',
    path: [
      [-90.25, 29.1],
      [-89.65, 29.3],
      [-89.15, 29.65],
      [-88.85, 30.05],
      [-88.45, 30.3],
    ],
  },
  'port-markers-1': { kind: 'marker', at: [-89.35, 29.28], icon: 'port', label: 'Port advisory', dy: 12 },
  'port-markers-2': { kind: 'marker', at: [-89.09, 30.34], icon: 'port', label: 'Ferries cancelled', dy: 14 },

  'track-late': { kind: 'stormTrack', path: [STORM_3, [-88.8, 28.8], STORM_4] },
  'surge-arrows': {
    kind: 'arrows',
    scale: 1,
    paths: [
      [
        [-89.48, 29.93],
        [-89.7, 29.95],
        [-89.88, 29.955],
        [-90.0, 29.96],
      ],
      [
        [-89.46, 29.78],
        [-89.68, 29.85],
        [-89.88, 29.905],
        [-89.995, 29.945],
      ],
      [
        [-89.42, 29.6],
        [-89.6, 29.71],
        [-89.8, 29.82],
        [-89.95, 29.9],
      ],
    ],
  },
  'bay-funnel': {
    kind: 'area',
    tone: 'funnel',
    ring: [
      [-89.72, 30.08],
      [-89.5, 30.03],
      [-89.4, 29.88],
      [-89.55, 29.74],
      [-89.82, 29.83],
      [-89.98, 29.92],
      [-90.005, 29.965],
      [-89.9, 30.03],
    ],
  },
  'river-mouth-glow': { kind: 'glowPoint', at: [-90.005, 29.955], km: 3.2 },
  'low-districts': {
    kind: 'area',
    tone: 'district',
    ring: [
      [-90.058, 29.958],
      [-90.055, 29.9705],
      [-90.044, 29.977],
      [-90.03, 29.979],
      [-90.019, 29.9725],
      [-90.018, 29.96],
      [-90.028, 29.9545],
      [-90.045, 29.953],
    ],
  },
  'embankment': {
    kind: 'line',
    tone: 'embankment',
    path: [
      [-90.0655, 29.9555],
      [-90.055, 29.953],
      [-90.043, 29.9525],
      [-90.031, 29.9525],
      [-90.021, 29.9555],
      [-90.0165, 29.9605],
    ],
  },

  // ······ scene 5 · the official zone ······
  'zone-c2': {
    kind: 'area',
    tone: 'zone',
    ring: [
      [-90.0585, 29.958],
      [-90.052, 29.9625],
      [-90.044, 29.966],
      [-90.034, 29.9685],
      [-90.026, 29.9695],
      [-90.0235, 29.9645],
      [-90.0235, 29.9585],
      [-90.03, 29.955],
      [-90.04, 29.9535],
      [-90.05, 29.9535],
    ],
    label: 'Official Zone C-2',
    labelAt: [-90.0405, 29.9702],
  },
  'label-dockside': { kind: 'label', at: [-90.0405, 29.9608], text: 'Dockside', size: 'sm', tone: 'city' },
  'label-eastbank': { kind: 'label', at: [-90.0265, 29.9682], text: 'Eastbank', size: 'sm', tone: 'city' },
  'label-canal-q': { kind: 'label', at: [-90.0535, 29.9728], text: 'Canal Quarter', size: 'xs', tone: 'city' },
  'label-market': { kind: 'label', at: PLACES.marketSquare, text: 'Market Sq.', size: 'xs', tone: 'quiet', dy: -8 },
  'label-ferry-rd': { kind: 'label', at: [-90.0352, 29.9572], text: 'Ferry Rd.', size: 'xs', tone: 'quiet' },
  'pump-station': { kind: 'marker', at: PLACES.pump, icon: 'pump', label: 'Pump Stn. S-1', sub: '1 of 3 pumps down', dy: 14 },

  // ······ scene 6 · first breach ······
  'breach-pier14': { kind: 'marker', at: PLACES.pier14, icon: 'breach', label: 'Pier 14', sub: '8:03 p.m. — water crosses', dy: 14 },
  'flood-1': {
    kind: 'area',
    tone: 'flood',
    ring: [
      [-90.046, 29.9572],
      [-90.0455, 29.9612],
      [-90.0405, 29.9635],
      [-90.0345, 29.9628],
      [-90.0325, 29.9585],
      [-90.0375, 29.9557],
      [-90.043, 29.9555],
    ],
  },
  'flood-2': {
    kind: 'area',
    tone: 'flood',
    ring: [
      [-90.055, 29.9745],
      [-90.049, 29.977],
      [-90.0435, 29.9745],
      [-90.0435, 29.9685],
      [-90.049, 29.9662],
      [-90.0535, 29.969],
    ],
  },
  'canal-low-point': { kind: 'marker', at: PLACES.canalLow, icon: 'seq', label: 'Canal low point', dy: -10 },
  'label-runoff': { kind: 'label', at: [-90.0398, 29.9762], text: 'Hill runoff', size: 'xs', tone: 'water', dy: -4 },
  'traffic-knot-early': { kind: 'dots', n: 8, path: [[-90.05, 29.9575], [-90.056, 29.9555], [-90.061, 29.953]] },

  // ······ scene 7 · access fails ······
  'west-gate-bridge': {
    kind: 'line',
    tone: 'bridge',
    path: [
      [-90.0742, 29.9422],
      [-90.0578, 29.9346],
    ],
    label: 'West Gate Bridge — open',
    labelAt: [-90.0705, 29.9375],
  },
  'route-intended': {
    kind: 'route',
    tone: 'intended',
    path: [
      [-90.036, 29.9625],
      [-90.043, 29.9595],
      [-90.0525, 29.956],
      [-90.0605, 29.952],
      [-90.0645, 29.9492],
      [-90.0695, 29.9455],
      [-90.0742, 29.9422],
    ],
  },
  'underpass-block': { kind: 'marker', at: PLACES.underpass, icon: 'block', label: 'Underpass', sub: 'flooded 9:37 p.m.', dx: 10, dy: -6 },
  'route-broken-tail': {
    kind: 'route',
    tone: 'failed',
    path: [
      [-90.0645, 29.9492],
      [-90.0695, 29.9455],
      [-90.0742, 29.9422],
    ],
  },
  'congestion': {
    kind: 'dots',
    n: 16,
    path: [
      [-90.0525, 29.956],
      [-90.0605, 29.952],
      [-90.0642, 29.9494],
    ],
  },
  'bus-route-school': {
    kind: 'route',
    tone: 'bus',
    path: [
      [-90.052, 29.9665],
      [-90.0445, 29.9682],
      [-90.038, 29.967],
      [-90.0335, 29.9643],
    ],
  },
  'bus-route-library': {
    kind: 'route',
    tone: 'failed',
    blockAtEnd: true,
    path: [
      [-90.052, 29.9645],
      [-90.0485, 29.9635],
      [-90.046, 29.9622],
    ],
  },
  'label-library': { kind: 'label', at: [-90.0448, 29.9612], text: 'Dockside Library', size: 'xs', tone: 'quiet', dy: 10 },
  'school-pickup': { kind: 'marker', at: PLACES.school, icon: 'school', label: 'Eastbank High', sub: 'pickup point', dy: -12 },
  'reroute-north': {
    kind: 'route',
    tone: 'reroute',
    delay: 0.7,
    path: [
      [-90.0525, 29.956],
      [-90.047, 29.962],
      [-90.0405, 29.9665],
      [-90.0335, 29.9702],
      [-90.0275, 29.9713],
      [-90.0234, 29.9698],
    ],
  },
  'old-iron-bridge': {
    kind: 'line',
    tone: 'bridge',
    path: [
      [-90.0248, 29.969],
      [-90.0221, 29.9707],
    ],
    label: 'Old Iron Bridge',
    labelAt: [-90.027, 29.9724],
  },
  'flood-3': {
    kind: 'area',
    tone: 'flood',
    ring: [
      [-90.056, 29.9605],
      [-90.0555, 29.9695],
      [-90.049, 29.9735],
      [-90.0395, 29.9745],
      [-90.031, 29.9705],
      [-90.0285, 29.9625],
      [-90.034, 29.9565],
      [-90.045, 29.955],
      [-90.053, 29.9565],
    ],
  },

  // ······ scene 8 · the island ······
  'school-shelter': { kind: 'marker', at: PLACES.school, icon: 'shelter', label: 'Eastbank High', sub: 'shelter of last resort', dx: -20, dy: -18 },
  'isolation-ring': { kind: 'ring', at: PLACES.school, km: 0.55 },
  'flood-4': {
    kind: 'area',
    tone: 'flood',
    ring: [
      [-90.056, 29.9605],
      [-90.055, 29.972],
      [-90.047, 29.977],
      [-90.037, 29.978],
      [-90.027, 29.9745],
      [-90.021, 29.968],
      [-90.0215, 29.96],
      [-90.028, 29.9555],
      [-90.04, 29.954],
      [-90.051, 29.9555],
    ],
  },
  'flood-arrows-school': {
    kind: 'arrows',
    scale: 0.5,
    paths: [
      [
        [-90.0335, 29.959],
        [-90.0335, 29.9615],
        [-90.0335, 29.963],
      ],
      [
        [-90.0272, 29.9652],
        [-90.0295, 29.9648],
        [-90.0315, 29.9645],
      ],
      [
        [-90.039, 29.968],
        [-90.037, 29.9668],
        [-90.0352, 29.9655],
      ],
    ],
  },
  'outage-zone': {
    kind: 'area',
    tone: 'outage',
    ring: [
      [-90.042, 29.9755],
      [-90.028, 29.978],
      [-90.018, 29.9715],
      [-90.019, 29.9605],
      [-90.03, 29.9555],
      [-90.042, 29.9575],
      [-90.044, 29.967],
    ],
    label: 'Grid down 11:46 p.m.',
    labelAt: [-90.0262, 29.9738],
  },
  'seq-field': { kind: 'marker', at: [-90.0348, 29.9654], icon: 'seq', label: 'Field 11:52', dx: -46, dy: 2 },
  'seq-carpark': { kind: 'marker', at: [-90.0321, 29.9633], icon: 'seq', label: 'Car park 12:07', dx: 52, dy: 6 },
  'seq-classrooms': { kind: 'marker', at: [-90.0338, 29.9636], icon: 'seq', label: 'Ground floor 12:31', dx: -4, dy: 22 },
  'rescue-origin': { kind: 'marker', at: PLACES.oldIronBridge, icon: 'origin', label: 'Boats 12:04', dx: -26, dy: -10 },
  'boat-route': {
    kind: 'route',
    tone: 'boat',
    path: [
      [-90.0234, 29.9698],
      [-90.0262, 29.9686],
      [-90.0292, 29.9669],
    ],
  },
  'boat-obstruction': { kind: 'marker', at: PLACES.boatStop, icon: 'block', label: 'Blocked', sub: 'floating cars', dx: 10, dy: 6 },

  // ······ scene 9 · visible, unreachable ······
  'hospital': { kind: 'marker', at: PLACES.hospital, icon: 'hospital', label: 'Harrow General', sub: 'on the hill · dry', dx: 18, dy: -14 },
  'distance-line': {
    kind: 'line',
    tone: 'distance',
    path: [PLACES.school, PLACES.hospital],
    label: '2 miles direct',
    labelAt: [-90.0545, 29.9575],
  },
  'amb-fail-1': {
    kind: 'route',
    tone: 'failed',
    blockAtEnd: true,
    path: [
      [-90.0742, 29.9538],
      [-90.068, 29.958],
      [-90.0605, 29.9612],
      [-90.0528, 29.9636],
    ],
  },
  'amb-fail-2': {
    kind: 'route',
    tone: 'failed',
    blockAtEnd: true,
    delay: 0.6,
    path: [
      [-90.0742, 29.9538],
      [-90.0705, 29.9618],
      [-90.063, 29.9672],
      [-90.0558, 29.9694],
    ],
  },
  'label-mercer': { kind: 'label', at: [-90.0592, 29.9705], text: 'Mercer Rd.', size: 'xs', tone: 'quiet', dy: -6 },
  'amb-reroute': {
    kind: 'route',
    tone: 'reroute',
    delay: 1.2,
    path: [
      [-90.0742, 29.9538],
      [-90.072, 29.964],
      [-90.062, 29.972],
      [-90.048, 29.9765],
      [-90.035, 29.9752],
      [-90.0275, 29.9718],
      [-90.0234, 29.9698],
      [-90.0262, 29.9682],
      [-90.0296, 29.9663],
    ],
  },
  'wall-collapse': { kind: 'marker', at: PLACES.wall, icon: 'wall', label: 'Retaining wall', sub: 'Ridge Rd. ends here', dx: -44, dy: -6 },
  'walk-path': {
    kind: 'route',
    tone: 'walk',
    delay: 1.6,
    path: [
      [-90.0296, 29.9663],
      [-90.0315, 29.9654],
      [-90.0335, 29.9643],
    ],
  },
  'visibility-line': { kind: 'line', tone: 'visibility', path: [PLACES.school, PLACES.hospital] },
  'label-visible': { kind: 'label', at: [-90.0505, 29.9548], text: 'Visible. Unreachable.', size: 'sm', tone: 'warm', dy: 14 },

  // ······ scene 10 · the morning line ······
  'flood-final': {
    kind: 'area',
    tone: 'flood',
    ring: [
      [-90.064, 29.9595],
      [-90.062, 29.9665],
      [-90.056, 29.9755],
      [-90.046, 29.9805],
      [-90.034, 29.982],
      [-90.024, 29.979],
      [-90.0165, 29.9725],
      [-90.0155, 29.9635],
      [-90.0225, 29.9575],
      [-90.034, 29.9545],
      [-90.048, 29.954],
      [-90.059, 29.9555],
    ],
    label: 'Actual flood extent',
    labelAt: [-90.0335, 29.984],
  },
  'high-water-line': {
    kind: 'line',
    tone: 'highwater',
    path: [
      [-90.064, 29.9595],
      [-90.062, 29.9665],
      [-90.056, 29.9755],
      [-90.046, 29.9805],
      [-90.034, 29.982],
      [-90.024, 29.979],
      [-90.0165, 29.9725],
    ],
    label: 'High-water line 5:52 a.m.',
    labelAt: [-90.0555, 29.9788],
  },
  'school-final': { kind: 'marker', at: PLACES.school, icon: 'school' },
  'hospital-final': { kind: 'marker', at: PLACES.hospital, icon: 'hospital' },
  'cq-1': { kind: 'consequence', at: PLACES.pump, n: 1, text: 'Pump S-1 failed early', dy: 14 },
  'cq-2': { kind: 'consequence', at: PLACES.pier14, n: 2, text: 'First breach — Pier 14', dy: 14, dx: 6 },
  'cq-3': { kind: 'consequence', at: PLACES.underpass, n: 3, text: 'Underpass drowned the route', dx: 8 },
  'cq-4': { kind: 'consequence', at: [-90.07, 29.9452], n: 4, text: 'Bridge approach gridlock', dy: 12 },
  'cq-5': { kind: 'consequence', at: PLACES.canalLow, n: 5, text: 'Canal overflow', dx: -12, dy: 16 },
  'cq-6': { kind: 'consequence', at: PLACES.school, n: 6, text: 'School on a rise', dx: 12, dy: 14 },
  'cq-7': { kind: 'consequence', at: PLACES.wall, n: 7, text: 'Wall cut Ridge Rd.', dx: -12, dy: -8 },
  'cq-8': { kind: 'consequence', at: PLACES.hospital, n: 8, text: 'Hospital dry — unreachable', dy: -12 },
}

export type ElementId = keyof typeof ELEMENTS
