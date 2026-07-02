import type { ElementId } from './geo'

// beats: 0 = top of chapter, 1 = mid-read, 2 = end of chapter
export type Beat = 0 | 1 | 2
export type ElementState = 'active' | 'persistent' | 'dimmed'

export type SceneElement = {
  id: ElementId
  state: ElementState
  beat?: Beat
  /** once the reader reaches this beat, the element steps down to dimmed */
  dimAtBeat?: Beat
}

export type Scene = {
  id: string
  num: string
  timestamp: string
  clock: string
  title: string
  body: string[]
  mapSentence: string
  camera: {
    center: [number, number]
    zoom: number
    bearing?: number
    pitch?: number
    duration?: number
  }
  elements: SceneElement[]
}

export const STORY = {
  title: 'The Night the City Flooded',
  subtitle:
    'A storm did not simply hit the city. It revealed the hidden geography underneath it.',
  note: 'A fictional story told on real geography.',
}

export const SCENES: Scene[] = [
  // ── 01 ────────────────────────────────────────────────────────────────────
  {
    id: 'storm-turns',
    num: '01',
    timestamp: '42 hours before landfall',
    clock: 'T−42 HRS',
    title: 'A Storm Begins to Turn',
    body: [
      'Far offshore, over warm ocean water, a loose pressure system began turning toward itself.',
      'At first it barely looked like a storm. The satellite image showed a faint spiral, a blur of cloud and pressure hundreds of miles from the coast. Forecasters logged it, gave it a number, and went back to their other charts. The ocean produces a dozen systems like this every season, and most of them die quietly at sea.',
      'Harrow Bay was not watching it yet. The city was still traffic, ferry schedules, school pickups, restaurant bookings, and late-summer humidity.',
      'The water between the storm and the city was warm, open, and uninterrupted — hundreds of miles of fuel laid out in a straight line.',
      'But out over the water, the first actor had entered the story.',
    ],
    mapSentence: 'The first actor is offshore.',
    camera: { center: [-88.35, 28.1], zoom: 5.35, duration: 0 },
    elements: [
      { id: 'label-gulf', state: 'active' },
      { id: 'label-city-far', state: 'active' },
      { id: 'storm-core-1', state: 'active', beat: 1 },
      { id: 'pressure-1', state: 'active', beat: 2 },
    ],
  },

  // ── 02 ────────────────────────────────────────────────────────────────────
  {
    id: 'cone-widens',
    num: '02',
    timestamp: '36 hours before landfall',
    clock: 'T−36 HRS',
    title: 'The Forecast Cone Widens',
    body: [
      'By morning, the storm had a name, but not a certain path.',
      'Forecast models disagreed. Some carried it into open water. Others bent it back toward the coast. The official cone widened across the sea like an admission of uncertainty.',
      'This is the honest shape of a forecast: not a line but a field of possibilities. Each model run redrew the future a few degrees left or right, and every version described a different week for a different city.',
      'Harrow Bay sat near the edge of that cone. Not safe. Not central. Suspended in the kind of ambiguity that makes cities wait too long.',
      'The storm was still a possibility field.',
    ],
    mapSentence: 'The threat is still a possibility field.',
    camera: { center: [-88.7, 28.7], zoom: 5.7, duration: 3200 },
    elements: [
      { id: 'label-city-far', state: 'active' },
      { id: 'storm-core-2', state: 'active' },
      { id: 'pressure-2', state: 'persistent' },
      { id: 'cone-wide', state: 'active' },
      { id: 'model-tracks', state: 'active', beat: 1 },
      { id: 'track-early', state: 'active', beat: 1 },
    ],
  },

  // ── 03 ────────────────────────────────────────────────────────────────────
  {
    id: 'track-narrows',
    num: '03',
    timestamp: '18 hours before landfall',
    clock: 'T−18 HRS',
    title: 'The Track Narrows Toward the Coast',
    body: [
      'Over the next eighteen hours, the storm strengthened and curved toward land.',
      'The forecast cone narrowed. Ports issued advisories. Ferry routes were cancelled along the outer coast. Weather alerts moved from background noise to civic instruction.',
      'On the map the change looked small — a family of scattered lines collapsing into one confident stroke. In the harbourmaster’s office it looked like paperwork. On the water it looked like fishing boats running early for the docks.',
      'Harrow Bay was still not predicted to take the direct hit. But the city had moved from unlikely to exposed.',
      'That distinction would matter less than people thought.',
    ],
    mapSentence: 'Uncertainty narrows into exposure.',
    camera: { center: [-89.15, 29.25], zoom: 6.7, duration: 3400 },
    elements: [
      { id: 'label-city-far', state: 'active' },
      { id: 'label-bay', state: 'active', beat: 2 },
      { id: 'storm-core-3', state: 'active' },
      { id: 'wind-ring-3', state: 'active' },
      { id: 'track-mid', state: 'active' },
      { id: 'cone-narrow', state: 'active', beat: 1 },
      { id: 'exposure-band', state: 'active', beat: 2 },
      { id: 'port-markers-1', state: 'active', beat: 2 },
      { id: 'port-markers-2', state: 'active', beat: 2 },
    ],
  },

  // ── 04 ────────────────────────────────────────────────────────────────────
  {
    id: 'the-angle',
    num: '04',
    timestamp: 'Late afternoon',
    clock: 'T−9 HRS',
    title: 'The Angle Matters',
    body: [
      'The storm did not need to hit Harrow Bay directly.',
      'Its angle pushed water into the bay, then into the river mouth, then back against the low eastern districts.',
      'From above, the danger was obvious. The coastline curved like a funnel. The river mouth pointed straight into the older parts of the city. The lowest streets sat behind an embankment wall that had always seemed taller in memory than it was in fact.',
      'Water that is pushed has to go somewhere. Here, the somewhere had streets, tram lines and classrooms on it.',
      'The storm was not aiming at the city.',
      'The geography was catching it.',
    ],
    mapSentence: 'The city is threatened by direction, not direct impact.',
    camera: { center: [-89.88, 29.9], zoom: 9.1, pitch: 42, bearing: -18, duration: 4200 },
    elements: [
      { id: 'storm-core-4', state: 'dimmed' },
      { id: 'track-late', state: 'dimmed' },
      { id: 'label-bay', state: 'active' },
      { id: 'label-city-far', state: 'active' },
      { id: 'surge-arrows', state: 'active', beat: 1 },
      { id: 'bay-funnel', state: 'active', beat: 2 },
      { id: 'river-mouth-glow', state: 'active', beat: 2 },
      { id: 'low-districts', state: 'active', beat: 2 },
      { id: 'embankment', state: 'active', beat: 2 },
    ],
  },

  // ── 05 ────────────────────────────────────────────────────────────────────
  {
    id: 'official-zone',
    num: '05',
    timestamp: '5:40 p.m.',
    clock: '5:40 P.M.',
    title: 'The Official Zone',
    body: [
      'At 5:40 p.m., the city emergency office issued a voluntary evacuation notice for the waterfront blocks below Canal Street.',
      'The message appeared on phones, local radio, and the city website. It used a boundary few residents recognized: Zone C-2.',
      'On the map, Zone C-2 looked precise. On the ground, it was less clear. People knew streets, schools, shops, churches, corners, and shortcuts. They did not know whether they were inside a municipal risk polygon.',
      'Behind the warehouses on Ferry Road, the southern pump station had already lost one of its three pumps.',
      'The public map still looked calm. The hidden system had started failing.',
    ],
    mapSentence: 'The official map is clean, but incomplete.',
    camera: { center: [-90.0405, 29.9635], zoom: 12.35, pitch: 0, bearing: 0, duration: 3800 },
    elements: [
      { id: 'zone-c2', state: 'active' },
      { id: 'low-districts', state: 'dimmed' },
      { id: 'embankment', state: 'persistent' },
      { id: 'label-dockside', state: 'active', beat: 1 },
      { id: 'label-eastbank', state: 'active', beat: 1 },
      { id: 'label-canal-q', state: 'active', beat: 1 },
      { id: 'label-market', state: 'active', beat: 1 },
      { id: 'label-ferry-rd', state: 'active', beat: 2 },
      { id: 'pump-station', state: 'active', beat: 2 },
    ],
  },

  // ── 06 ────────────────────────────────────────────────────────────────────
  {
    id: 'first-breach',
    num: '06',
    timestamp: '8:03 p.m.',
    clock: '8:03 P.M.',
    title: 'The First Breach',
    body: [
      'At 8:03 p.m., water crossed the river wall near Pier 14.',
      'It did not arrive like a wave. It entered through gaps: first beside the ferry terminal, then under the loading doors of the fish market, then across the tram tracks that ran along the waterfront.',
      'Within twenty minutes, three blocks of Dockside were under ankle-deep water.',
      'At the same time, rainwater from the hills was pouring downhill through the old canal quarter. The storm drains could not handle both the river surge and the runoff.',
      'The official evacuation strip still looked clean.',
      'The real flood was splitting into two arms.',
    ],
    mapSentence: 'Water enters through weak points.',
    camera: { center: [-90.0435, 29.9645], zoom: 13.5, pitch: 32, bearing: -12, duration: 3200 },
    elements: [
      { id: 'breach-pier14', state: 'active' },
      { id: 'zone-c2', state: 'dimmed' },
      { id: 'embankment', state: 'dimmed' },
      { id: 'label-dockside', state: 'persistent' },
      { id: 'label-market', state: 'persistent' },
      { id: 'pump-station', state: 'dimmed' },
      { id: 'flood-1', state: 'active', beat: 1 },
      { id: 'flood-2', state: 'active', beat: 2 },
      { id: 'canal-low-point', state: 'active', beat: 2 },
      { id: 'label-runoff', state: 'active', beat: 2 },
      { id: 'traffic-knot-early', state: 'active', beat: 2 },
    ],
  },

  // ── 07 ────────────────────────────────────────────────────────────────────
  {
    id: 'road-fails',
    num: '07',
    timestamp: '9:37 p.m.',
    clock: '9:37 P.M.',
    title: 'The Road to the Bridge Fails',
    body: [
      'The West Gate Bridge was still open.',
      'The road to reach it was not.',
      'Police directed traffic toward the bridge even as water rose on Harbour Avenue. Cars continued forward because the instruction still made sense in language. It no longer made sense in space.',
      'Buses were sent to Dockside Library, Eastbank High School, and St. Anne’s Church. But the Dockside bus stalled before it reached the library.',
      'By 10:05 p.m., traffic was redirected north toward Old Iron Bridge.',
      'The turn came too late. Cars were trapped between rising water and roads that no longer led anywhere.',
    ],
    mapSentence: 'The bridge is open, but access collapses.',
    camera: { center: [-90.049, 29.9545], zoom: 12.4, pitch: 20, bearing: 0, duration: 3200 },
    elements: [
      { id: 'flood-3', state: 'persistent' },
      { id: 'zone-c2', state: 'dimmed' },
      { id: 'west-gate-bridge', state: 'active' },
      { id: 'route-intended', state: 'active', dimAtBeat: 1 },
      { id: 'underpass-block', state: 'active', beat: 1 },
      { id: 'route-broken-tail', state: 'active', beat: 1 },
      { id: 'bus-route-school', state: 'active', beat: 1 },
      { id: 'bus-route-library', state: 'active', beat: 1 },
      { id: 'label-library', state: 'active', beat: 1 },
      { id: 'school-pickup', state: 'active', beat: 1 },
      { id: 'congestion', state: 'active', beat: 2 },
      { id: 'reroute-north', state: 'active', beat: 2 },
      { id: 'old-iron-bridge', state: 'active', beat: 2 },
    ],
  },

  // ── 08 ────────────────────────────────────────────────────────────────────
  {
    id: 'school-island',
    num: '08',
    timestamp: '11:20 p.m.',
    clock: '11:20 P.M.',
    title: 'The School Becomes an Island',
    body: [
      'By 11:20 p.m., Eastbank High School had become an island.',
      'The school was not on high ground, but it stood on a slight rise above the surrounding streets. Families arrived on foot carrying children, medication, pets, and plastic bags of clothes.',
      'The gym was supposed to be a pickup point, not a shelter.',
      'At 11:46 p.m., power failed across Eastbank. People switched on phone flashlights.',
      'Outside, the floodwater continued rising from three directions. The football field disappeared first. Then the staff car park. Then the ground-floor classrooms.',
      'A rescue team launched boats from the dry side of Old Iron Bridge just after midnight, but the route south was blocked by floating cars and submerged traffic signals.',
    ],
    mapSentence: 'A pickup point becomes a shelter.',
    camera: { center: [-90.0328, 29.9655], zoom: 14.35, pitch: 46, bearing: 18, duration: 3600 },
    elements: [
      { id: 'school-shelter', state: 'active' },
      { id: 'old-iron-bridge', state: 'persistent' },
      { id: 'flood-4', state: 'active', beat: 1 },
      { id: 'isolation-ring', state: 'active', beat: 1 },
      { id: 'flood-arrows-school', state: 'active', beat: 1 },
      { id: 'seq-field', state: 'active', beat: 1 },
      { id: 'seq-carpark', state: 'active', beat: 1 },
      { id: 'seq-classrooms', state: 'active', beat: 1 },
      { id: 'outage-zone', state: 'active', beat: 2 },
      { id: 'rescue-origin', state: 'active', beat: 2 },
      { id: 'boat-route', state: 'active', beat: 2 },
      { id: 'boat-obstruction', state: 'active', beat: 2 },
    ],
  },

  // ── 09 ────────────────────────────────────────────────────────────────────
  {
    id: 'hospital-visible',
    num: '09',
    timestamp: '12:30 a.m.',
    clock: '12:30 A.M.',
    title: 'The Hospital Is Visible',
    body: [
      'Harrow General Hospital sat on the western hill, above the flood line.',
      'It was safe. Getting there was the problem.',
      'At 12:30 a.m., an ambulance was dispatched to Eastbank High for a woman in premature labour. The direct route was impossible. The second route through Mercer Road was blocked near the canal. Dispatch sent the ambulance north, across Old Iron Bridge, then south along Ridge Road.',
      'But Ridge Road ended at a collapsed retaining wall where stormwater had undercut the slope.',
      'The ambulance stopped less than half a mile from the school. Paramedics continued on foot with a stretcher.',
      'From the upper windows, the hospital was visible as a glow on the hill. It was less than two miles away.',
      'It might as well have been another city.',
    ],
    mapSentence: 'Close is not reachable.',
    camera: { center: [-90.0538, 29.9592], zoom: 12.3, pitch: 18, bearing: 0, duration: 3600 },
    elements: [
      { id: 'school-shelter', state: 'persistent' },
      { id: 'flood-4', state: 'persistent' },
      { id: 'outage-zone', state: 'dimmed' },
      { id: 'isolation-ring', state: 'dimmed' },
      { id: 'hospital', state: 'active' },
      { id: 'distance-line', state: 'active', beat: 1 },
      { id: 'amb-fail-1', state: 'active', beat: 1 },
      { id: 'amb-fail-2', state: 'active', beat: 1 },
      { id: 'label-mercer', state: 'active', beat: 1 },
      { id: 'amb-reroute', state: 'active', beat: 1 },
      { id: 'wall-collapse', state: 'active', beat: 1 },
      { id: 'old-iron-bridge', state: 'dimmed' },
      { id: 'walk-path', state: 'active', beat: 2 },
      { id: 'visibility-line', state: 'active', beat: 2 },
      { id: 'label-visible', state: 'active', beat: 2 },
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    id: 'morning-line',
    num: '10',
    timestamp: '5:52 a.m.',
    clock: '5:52 A.M.',
    title: 'The Morning Line',
    body: [
      'At dawn, the rain stopped.',
      'The city had a new map.',
      'Dockside was underwater from the ferry terminal to Market Square. Eastbank High stood in a brown lake. The canal quarter had become disconnected rooftops and traffic lights.',
      'The official evacuation boundary from the night before looked almost meaningless against the actual flood line.',
      'The highest water mark reached six blocks farther inland than the city’s worst-case public map had shown.',
      'The broken pump station. The underpass. The bridge approach. The low canal crossing. The school on a slight rise. The hospital on the hill.',
      'The city had not simply flooded.',
      'Its hidden geography had been exposed.',
    ],
    mapSentence: 'The flood followed weakness.',
    camera: { center: [-90.047, 29.9638], zoom: 11.9, pitch: 0, bearing: 0, duration: 4200 },
    elements: [
      { id: 'zone-c2', state: 'active' },
      { id: 'school-final', state: 'persistent' },
      { id: 'hospital-final', state: 'persistent' },
      { id: 'flood-final', state: 'active', beat: 1 },
      { id: 'high-water-line', state: 'active', beat: 2 },
      { id: 'cq-1', state: 'active', beat: 2 },
      { id: 'cq-2', state: 'active', beat: 2 },
      { id: 'cq-3', state: 'active', beat: 2 },
      { id: 'cq-4', state: 'active', beat: 2 },
      { id: 'cq-5', state: 'active', beat: 2 },
      { id: 'cq-6', state: 'active', beat: 2 },
      { id: 'cq-7', state: 'active', beat: 2 },
      { id: 'cq-8', state: 'active', beat: 2 },
    ],
  },
]
