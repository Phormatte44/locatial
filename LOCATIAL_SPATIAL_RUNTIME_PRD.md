# LOCATIAL Spatial Runtime PRD
## The Universal System for Camera Movement, Map Rendering, Materials, Signals, and Spatial Storytelling

**Document type:** Product Requirements Document  
**Status:** Canonical source of truth  
**Version:** 1.0  
**Primary audience:** Product, design, frontend engineering, spatial engineering, technical prototyping, Codex/Claude agents  
**Scope:** Locatial’s consumer-facing spatial canvas and the runtime system that moves from planet to street  

---

# 1. Executive Summary

Locatial is a spatial storytelling platform in which places are not merely plotted. They are revealed through movement, material, narrative, and progressively disclosed context.

The spatial runtime must feel like one continuous world from planetary scale to street level, even when multiple rendering technologies are used underneath. The camera, map, overlays, labels, signals, routes, materials, and interface must all be directed by one shared journey model.

The defining product principle is:

> **Locatial does not teleport between coordinates. It travels between places.**

The platform must support:

- a tactile planetary view;
- cinematic movement between distant places;
- fluid local movement within cities and neighborhoods;
- an editorial MapLibre map surface;
- deck.gl overlays for signals, routes, arcs, and attention;
- reusable visual materials;
- controlled renderer handoffs;
- stage-aware labels, buildings, and interface;
- mobile-first interaction;
- a debug and tuning harness;
- future authored and shareable camera journeys.

This PRD replaces separate movement, MapLibre, deck.gl, material, adapter, and transition documents as the canonical implementation reference.

---

# 2. Product Thesis

Most digital maps are databases with geography rendered behind them.

Locatial is different.

Locatial treats geography as a continuous spatial medium and movement as editorial composition. The map is not a passive background. It is the stage on which place, history, stories, activity, and cultural meaning are revealed.

The system has four core layers:

```text
World Surface
+ Locatial Knowledge
+ Directed Movement
+ Editorial Interface
```

These correspond to:

```text
MapLibre / Three.js
+ deck.gl overlays
+ JourneyFrame
+ React UI
```

The experience should communicate:

> A map is not opened. A place is revealed.

---

# 3. Product Outcomes

The first production-ready spatial runtime must prove that Locatial can:

1. Render an immediately useful spatial surface.
2. Move smoothly from planetary scale to street scale.
3. Distinguish local movement from long-distance travel.
4. Keep the selected destination visually stable.
5. Reveal labels, signals, routes, buildings, and cards progressively.
6. Maintain one visual identity across renderers and scales.
7. Let creators and product systems author spatial journeys later.
8. Run well on modern mobile devices.
9. Fail gracefully when map tiles or advanced graphics are unavailable.
10. Remain understandable and tunable by product and engineering teams.

---

# 4. Non-Goals

This release is not intended to become:

- a generic GIS platform;
- a replacement for Google Maps navigation;
- a photorealistic Earth simulator;
- a Cesium terrain showcase;
- a dashboard full of permanent controls;
- an enterprise geospatial analysis tool;
- a universal shader editor;
- a fully featured map-style authoring application;
- a backend or CMS implementation;
- a complete creator journey-authoring tool.

Those may be supported later, but the runtime must first prove the core spatial experience.

---

# 5. Canonical Architecture Decision

Several source documents proposed different renderer combinations. This PRD resolves them into one phased architecture.

## 5.1 Production MVP stack

Use:

- **React**
- **TypeScript**
- **Vite**
- **MapLibre GL JS**
- **deck.gl**
- **GSAP or one equivalent timeline engine**
- **Plain CSS, CSS modules, or the agreed Locatial design system**

MapLibre is the primary production surface from world/map scale through street scale.

deck.gl provides Locatial-authored overlays.

## 5.2 Optional planetary renderer

Three.js may be used as an isolated planetary renderer when the tactile paperwhite globe becomes a required product feature.

Three.js must not become a second independent product architecture. It must subscribe to the same JourneyFrame and camera contract.

## 5.3 Cesium decision

Cesium is excluded from the MVP.

It may be introduced later only where real terrain or building fidelity provides unique product value that MapLibre terrain, hillshade, and stylized massing cannot provide.

## 5.4 Architecture summary

```text
JourneyModel
    ↓
CameraDirector
LayerOrchestrator
MaterialSystem
    ↓
JourneyFrame
    ↓
MapLibreStage
DeckOverlay
OptionalThreeGlobeStage
ReactInterface
DebugDirector
```

---

# 6. Core Laws

## 6.1 The camera travels; the anchor does not

The destination is sacred from the first frame.

The camera may change:

- longitude;
- latitude;
- altitude;
- zoom;
- pitch;
- bearing;
- roll;
- projection;
- renderer;
- opacity;
- visual detail.

The active target must not drift.

```ts
activeTargetLng: destination.longitude
activeTargetLat: destination.latitude
```

## 6.2 One canonical spatial contract

The source of truth must use:

- WGS84 longitude;
- WGS84 latitude;
- altitude in meters;
- heading/bearing in degrees;
- pitch in degrees;
- optional roll;
- field of view where applicable;
- active target;
- normalized transition progress.

MapLibre zoom and arbitrary Three.js units are derived values.

## 6.3 One transition clock

MapLibre, deck.gl, Three.js, React UI, route reveals, labels, cards, and sound must not animate independently.

One timeline produces one JourneyFrame per tick.

## 6.4 Renderers do not direct the experience

Renderers apply state. They do not decide state.

Do not scatter `flyTo`, `easeTo`, tweens, timeouts, and independent animation loops throughout click handlers and components.

## 6.5 Spatial alignment precedes opacity

Crossfade may only hide a renderer handoff after both renderers are synchronized to the same destination, heading, and apparent scale.

## 6.6 Correctness before polish

A white sphere, default map, slider, and debug readout are preferable to a visually beautiful but spatially incorrect prototype.

---

# 7. The Universal Journey Model

Every spatial transition is represented by a normalized progress value:

```text
t = 0.0 → journey origin
t = 1.0 → journey destination
```

## 7.1 Core types

```ts
export type StageName =
  | 'world'
  | 'continent'
  | 'country'
  | 'region'
  | 'city'
  | 'neighborhood'
  | 'block'
  | 'street';

export type MotionMode =
  | 'step'
  | 'urban-glide'
  | 'regional-drift'
  | 'regional-hop'
  | 'planetary-arc';

export type ProjectionMode = 'mercator' | 'globe';

export interface GeoPoint {
  longitude: number;
  latitude: number;
}

export interface CameraPose {
  longitude: number;
  latitude: number;
  altitudeMeters: number;
  zoom: number;
  pitchDegrees: number;
  headingDegrees: number;
  rollDegrees?: number;
  fieldOfViewDegrees?: number;
  activeTarget: GeoPoint;
}

export interface LayerVisibility {
  base: number;
  terrain: number;
  roads: number;
  labels: number;
  buildings: number;
  signals: number;
  routes: number;
  arcs: number;
  cards: number;
  texture: number;
  atmosphere: number;
}

export interface OverlayState {
  signalScale: number;
  signalOpacity: number;
  selectedSignalBoost: number;
  routeReveal: number;
  arcReveal: number;
  heatIntensity: number;
  labelDensity: 'none' | 'low' | 'medium' | 'high';
}

export interface MaterialMix {
  scalePresetId: string;
  fromPresetId?: string;
  toPresetId?: string;
  mix: number;
}

export interface JourneyFrame {
  t: number;
  stage: StageName;
  mode: MotionMode;
  projection: ProjectionMode;
  camera: CameraPose;
  layerVisibility: LayerVisibility;
  overlay: OverlayState;
  material: MaterialMix;
  activePlaceId?: string;
  activeChapterId?: string;
  routeReveal: number;
}
```

## 7.2 Required frame generator

```ts
getJourneyFrame(
  journey: JourneyDefinition,
  t: number
): JourneyFrame
```

All renderer, UI, material, and overlay state must be derived from this result.

---

# 8. Scale and Stage Model

The user moves through the following spatial ladder:

```text
World
→ Continent
→ Country
→ Region
→ City
→ Neighborhood
→ Block
→ Street
```

Suggested MapLibre zoom mapping:

| Stage | Zoom | Product intent |
|---|---:|---|
| World | 0–2 | Planetary signal field |
| Continent | 2–4 | Macro geography and arcs |
| Country | 4–6 | National context and major boundaries |
| Region | 6–8.5 | Terrain and selected region |
| City | 8.5–11.5 | City grain and districts |
| Neighborhood | 11.5–14.5 | Story routes and editorial labels |
| Block | 14.5–16.5 | Building mass and precise route |
| Street | 16.5+ | Place identity, cards, and actions |

The ladder controls:

- camera behavior;
- projection;
- label density;
- route reveal;
- arc visibility;
- building visibility;
- signal density;
- card visibility;
- material detail;
- texture;
- terrain intensity;
- interface density.

---

# 9. Motion Grammar

Distance must determine the movement’s emotional register.

| Distance | Motion mode | Feel |
|---:|---|---|
| Under 1 km | Step | Small spatial reposition |
| 1–35 km | Urban glide | Silky movement within one urban world |
| 35–500 km | Regional drift | Contextual rise and settle |
| 500–1,800 km | Regional hop | Atmospheric lift |
| Over 1,800 km | Planetary arc | Departure, journey, arrival |

Reference values:

| Scale | Example | Peak altitude | Duration | Ease | Globe |
|---|---|---:|---:|---|---|
| 2 blocks | Avenue A → Avenue B | ~1,500 m | ~1.5 s | sine | Never |
| 5 km | LES → Chelsea | ~5,500 m | ~2.1 s | sine | Never |
| 50 km | NYC → Hamptons | ~55,000 m | ~3.1 s | sine | Never |
| 500 km | NYC → Boston | ~550,000 m | ~4.2 s | power2 | Partial |
| 5,000 km | NYC → Los Angeles | ~5.5M m | ~5.2 s | power2 | Full |
| 10,800 km | NYC → Tokyo | ~11.9M m | ~5.8 s | power2 | Full |

---

# 10. Local Movement Behavior

## 10.1 Urban glide

A local journey is a crane move, not a launch.

Behavior:

- remains in MapLibre;
- does not reveal the globe;
- rises only enough to establish context;
- preserves roads and urban texture;
- uses gentle sine easing;
- opens pitch near the midpoint;
- settles rather than lands;
- lasts approximately 1.5–3 seconds.

The system should communicate:

> The city is one continuous place. You are moving through it.

## 10.2 Local interpolation

Linear coordinate interpolation is acceptable for short distances.

Pitch curve:

```ts
pitch =
  departurePitch
  + (peakPitch - departurePitch) * Math.sin(t * Math.PI)
```

Recommended values:

```text
departure: 40–50°
midpoint: 18–25°
arrival: 40–50°
```

---

# 11. Planetary Movement Behavior

A planetary journey has three phases.

## 11.1 Departure

```text
t = 0.00 → 0.18
```

- fast altitude gain;
- city shrinks;
- pitch flattens;
- local labels and cards retract;
- map detail simplifies;
- globe emerges;
- the user feels a departure.

## 11.2 Cruise

```text
t = 0.18 → 0.82
```

- camera follows a great-circle path;
- heading tracks the direction of travel;
- pitch stays near the horizon;
- planetary renderer dominates;
- route/arc remains legible;
- UI is minimal;
- destination remains fixed.

## 11.3 Arrival

```text
t = 0.82 → 1.00
```

- altitude falls;
- destination detail resolves;
- pitch tilts toward the destination;
- MapLibre is aligned before becoming visible;
- labels return late;
- local signals return;
- card appears only after orientation is stable.

The system should communicate:

> The world is connected. You are crossing it.

---

# 12. Camera Mathematics

## 12.1 Distance

Use Haversine distance in meters.

## 12.2 Geographic interpolation

Use spherical interpolation for global travel.

Use linear interpolation only for sufficiently local travel.

## 12.3 Peak altitude

```ts
peakAltitudeMeters =
  clamp(distanceMeters * 1.1, 3_000, 14_000_000)
```

## 12.4 Altitude curve

```ts
altitude =
  lerp(fromAltitude, toAltitude, t)
  + Math.sin(t * Math.PI) * peakAltitude
```

## 12.5 Duration

```ts
durationSeconds =
  clamp(0.8 + Math.log10(distanceMeters) * 0.9, 1.5, 7.0)
```

## 12.6 Heading

Heading must face a point slightly ahead on the route.

This creates intentional travel rather than sideways drift.

## 12.7 Global pitch

Recommended:

- departure: 45°;
- cruise: 5–8°;
- arrival: 48–52°.

Arrival may be slightly steeper to create anticipation.

---

# 13. Renderer Responsibilities

## 13.1 MapLibre owns

- base map;
- land;
- water;
- roads;
- boundaries;
- labels;
- building extrusions;
- hillshade;
- optional DEM terrain;
- local gestures;
- local camera application;
- street and city legibility.

## 13.2 deck.gl owns

- signal points;
- signal pulses;
- selected-place emphasis;
- story routes;
- chapter paths;
- animated route reveals;
- long-distance arcs;
- attention/heat fields;
- custom editorial labels where necessary;
- large Locatial-owned spatial datasets.

## 13.3 Optional Three.js globe owns

- tactile planetary globe;
- raised relief;
- atmospheric rim;
- globe-specific material behavior;
- planetary arcs if not rendered in deck.gl;
- globe lighting;
- paperwhite/clay/ink visual modes.

## 13.4 React UI owns

- brand and stage readout;
- selected place card;
- story/chapter interface;
- temporary bottom sheets;
- debug tools;
- accessibility controls;
- reduced-motion state.

---

# 14. Renderer Handoff

## 14.1 Altitude-based visibility

Renderer opacity must be altitude-driven.

Recommended thresholds:

```ts
const GLOBE_FADE_BOTTOM = 200_000
const GLOBE_FADE_TOP = 2_000_000
```

Behavior:

- below 200 km: MapLibre fully visible;
- above 2,000 km: globe fully visible;
- between them: synchronized crossfade.

## 14.2 Handoff methods

Supported methods:

1. **Crossfade handoff**  
   Both renderers exist briefly.

2. **Cut-on-motion handoff**  
   Renderer switch happens during rapid movement when necessary.

3. **Overlay handoff**  
   One renderer remains while another contributes selected layers.

4. **Semantic handoff**  
   Different systems own different visual meanings.

The preferred MVP behavior is synchronized crossfade.

## 14.3 Handoff configuration

```ts
export interface RendererHandoff {
  fromStage: StageName;
  toStage: StageName;
  fromRenderer: 'maplibre' | 'three';
  toRenderer: 'maplibre' | 'three';
  handoffAltitudeMeters: number;
  durationMs: number;
  method: 'crossfade-camera-sync' | 'cut-on-motion' | 'overlay';
  easing: string;
  visualMatchTargets: MaterialTokenName[];
}
```

---

# 15. Visual Continuity Requirements

The user must perceive:

```text
one continuous Locatial world
```

not:

```text
one rendering demo followed by another
```

Continuity depends on:

- shared color;
- shared contrast;
- shared light direction;
- shared terrain brightness;
- water darkness;
- coastline behavior;
- atmospheric edge treatment;
- label timing;
- building material;
- camera motion;
- transition timing;
- texture;
- UI overlays.

Critical acceptance statement:

> Planet → continent → region → city → street feels like one system.

---

# 16. Visual Direction: Paperwhite Spatial Systems

The canonical aesthetic direction is derived from the supplied paperwhite terrain reference.

## 16.1 Core characteristics

- warm paperwhite field;
- tactile raised terrain;
- monochrome geographic body;
- restrained black typography;
- fine technical marks;
- editorial rather than decorative layout;
- luminous route or story thread;
- sparse lime and magenta accents;
- material depth created through relief and shadow;
- visual calm with high information precision.

## 16.2 Product translation

The reference is not a literal screen template.

It establishes a visual system:

```text
Physical terrain = quiet tactile substrate
Locatial information = controlled luminous layer
Stories = threads
Places = nodes
UI = technical editorial annotation
```

## 16.3 Avoid

- bright blue water;
- green default parks;
- generic pin markers;
- neon sci-fi HUD;
- heavy glass panels;
- excessive bloom;
- rainbow data visualization;
- default provider labels;
- photorealistic Earth;
- permanent toolbars over the world.

---

# 17. Material System

## 17.1 Purpose

Materials provide reusable visual definitions that can be assigned by scale and semantic layer.

Assignment model:

```text
Scale + Semantic Layer = Material Preset
```

Example:

```text
Planet / Water → Paperwhite Recessed Water
Planet / Land → Raised Paper Terrain
City / Water → Quiet Frosted Water
Street / Land → Warm Ground Plane
```

## 17.2 Initial editable semantic layers

V1:

- water;
- land.

Visible but initially locked:

- roads;
- buildings;
- labels;
- signals;
- terrain.

## 17.3 Shared material schema

```ts
export interface MaterialPreset {
  id: string;
  name: string;
  semanticType: 'water' | 'land' | 'road' | 'building' | 'label' | 'signal' | 'terrain';
  baseColor: string;
  opacity: number;
  diffuseStrength: number;
  ambientColor?: string;
  emissiveColor?: string;
  emissiveStrength?: number;
  roughness?: number;
  reflectivity?: number;
  fresnelStrength?: number;
  bumpStrength?: number;
  heightStrength?: number;
  surfaceGrain?: number;
  edgeSoftness?: number;
  textureScale?: number;
  textureRotation?: number;
  textureOffset?: [number, number];
  textures?: MaterialTextures;
  rendererOverrides?: RendererOverrides;
}
```

## 17.4 Texture slots

Support:

- base color map;
- normal map;
- bump map;
- height/displacement map;
- roughness map;
- specular map;
- opacity map;
- mask map.

Each texture supports:

- enabled;
- strength;
- scale;
- rotation;
- offset;
- invert;
- contrast;
- blur;
- removal.

## 17.5 Inheritance

Materials inherit from larger scales unless overridden.

```text
Planet
→ Continent
→ Region
→ City
→ Street
```

UI states:

- inherited;
- custom;
- override active;
- reset to inherited.

---

# 18. Renderer Material Adapters

A universal shader is explicitly prohibited.

Use:

```text
Renderer-neutral MaterialPreset
→ renderer-specific adapter
→ renderer implementation
```

## 18.1 Required adapters

- `ThreeMaterialAdapter`
- `MapLibreStyleAdapter`
- future `CesiumMaterialAdapter`

## 18.2 MapLibre mapping examples

```text
water baseColor → fill-color
water opacity → fill-opacity
land baseColor → background/fill-color
roads → line-color / width / opacity
buildings → fill-extrusion color / opacity
labels → text-color / halo / visibility
terrain → hillshade / raster DEM settings
```

## 18.3 Three.js mapping examples

```text
baseColor → material color or uniform
roughness → MeshStandardMaterial roughness
bumpStrength → bumpScale or shader uniform
heightStrength → displaced geometry
fresnelStrength → custom rim/fresnel uniform
texture slots → renderer textures
```

## 18.4 Adapter diagnostics

Each adapter should report:

```ts
export interface MaterialAdapterReport {
  renderer: string;
  materialId: string;
  matchScore: number;
  supported: string[];
  approximated: string[];
  unsupported: string[];
}
```

This enables future visual-match diagnostics.

---

# 19. MapLibre Requirements

## 19.1 Base style

The MapLibre surface must be custom and restrained.

Two supported presentation families:

### Paperwhite mode

- warm off-white base;
- subtle warm gray land;
- recessed or lightly embossed water;
- fine charcoal roads;
- minimal labels;
- soft relief;
- luminous Locatial overlays.

### Ink mode

- near-black base;
- dark water;
- warm gray land;
- quiet roads;
- pale labels;
- controlled lime/magenta signals.

The production system may support both, but a single canonical theme must be selected for each shipped experience.

## 19.2 Labels

Labels are stage-aware.

- world/continent: none or extremely sparse;
- country/region: major geography;
- city: city and district;
- neighborhood: selected neighborhood and major roads;
- street: local labels.

Labels appear progressively, never all at once.

## 19.3 Buildings

Building extrusions:

- hidden below neighborhood/block threshold;
- fade in gradually;
- use paper/clay massing;
- remain non-photorealistic;
- selected area may receive subtle emphasis.

## 19.4 Camera application

Use `jumpTo()` for frame-driven rendering.

Do not use MapLibre’s internal `flyTo()` as part of the shared JourneyFrame loop.

MapLibre may only use its own easing for isolated interactions not directed by the canonical journey system, and only with explicit architectural approval.

---

# 20. deck.gl Requirements

## 20.1 Integration mode

Start with overlaid mode synchronized to the MapLibre view.

Do not use interleaved mode unless a real requirement emerges for placing deck.gl layers between MapLibre style layers.

## 20.2 Signal layer

Use `ScatterplotLayer`.

Signals are not pins.

```ts
export interface SignalPoint {
  id: string;
  title: string;
  subtitle?: string;
  coordinates: [number, number];
  category: 'story' | 'guide' | 'collection' | 'chapter' | 'event' | 'place';
  importance: number;
  selected?: boolean;
}
```

Behavior:

- radius based on importance;
- opacity based on JourneyFrame;
- selected signal receives restrained emphasis;
- hover shows lightweight information;
- click selects and creates a journey;
- mobile targets remain usable.

## 20.3 Story route layer

Use `PathLayer`.

Routes reveal according to `routeReveal`.

At low scales, geometry may be simplified.

At street scale, it becomes precise.

## 20.4 Arc layer

Use `ArcLayer` for meaningful long-distance relationships.

Do not create arc clutter.

One strong arc is preferable to a globe covered in connections.

## 20.5 Attention layer

`HeatmapLayer` is optional.

It must feel atmospheric, not analytical.

## 20.6 Animation

All deck.gl animation values derive from JourneyFrame.

No independent timers per layer.

---

# 21. Spatial Data Separation

Do not create one giant object.

Separate:

1. basemap data;
2. terrain data;
3. Locatial place/story data;
4. overlay geometry;
5. UI state;
6. JourneyFrame;
7. material presets;
8. renderer capability state.

Coordinates use:

```text
[lng, lat]
```

unless an external API explicitly requires otherwise.

---

# 22. Story and Place Runtime Models

```ts
export interface RuntimePlace {
  id: string;
  title: string;
  subtitle?: string;
  coordinates: [number, number];
  type: 'place' | 'story' | 'guide' | 'collection' | 'event';
  importance: number;
  summary?: string;
}

export interface RuntimeChapter {
  id: string;
  storyId: string;
  title: string;
  coordinates: [number, number];
  arrivalCamera?: Partial<CameraPose>;
  summary?: string;
}

export interface RuntimeStory {
  id: string;
  title: string;
  summary: string;
  chapters: RuntimeChapter[];
  route?: [number, number][];
}
```

These are runtime presentation models, not the full canonical CMS schema.

---

# 23. UI Requirements

## 23.1 Mobile-first

The spatial canvas occupies the majority of the screen.

Mobile rules:

- no permanent side panel;
- controls hidden by default;
- temporary bottom sheets;
- minimum 44 px touch targets;
- safe-area support;
- selected-place card near bottom;
- active location remains visible;
- one-thumb operation where possible.

## 23.2 Desktop

Desktop may show:

- small brand marker;
- stage readout;
- selected place card;
- stage rail;
- explicit debug toggle.

It must not become a dashboard.

## 23.3 Cards

Cards are editorial objects.

They should feel like suspended paper:

- restrained depth;
- soft directional shadow;
- limited text;
- no heavy borders;
- clear hierarchy;
- subtle magnetic settling.

## 23.4 Technical marks

The paperwhite visual system may use:

- coordinate labels;
- index numbers;
- registration crosses;
- fine rules;
- stage markers;
- route nodes;
- small monospaced system labels.

These must remain secondary to place and story.

---

# 24. Interaction Requirements

Inputs include:

- tapping a place;
- selecting a signal;
- advancing a chapter;
- choosing a route;
- selecting a recommendation;
- scrubbing debug progress;
- navigating back to a wider scale;
- interrupting an active journey.

Each input updates JourneyModel.

It must not animate individual renderers directly.

---

# 25. Journey Interruption

When a new destination is selected mid-transition:

1. capture the currently rendered camera state;
2. cancel the previous journey;
3. set the captured state as the new origin;
4. calculate distance and motion mode;
5. create a new journey;
6. continue without snapping backward.

The system must feel responsive and continuous.

---

# 26. Reduced Motion and Accessibility

Support a reduced-motion mode.

In reduced motion:

- shorten long arcs;
- reduce altitude peaks;
- avoid dramatic pitch changes;
- replace some travel with synchronized crossfade;
- preserve spatial context;
- never remove necessary orientation.

Additional requirements:

- keyboard-accessible controls;
- readable contrast;
- non-color signal differentiation where necessary;
- screen-reader labels for places and journey controls;
- motion pause where applicable.

---

# 27. Sound Direction

Sound is not required for MVP acceptance, but architecture must leave room for it.

Potential future behavior:

- origin ambience fades during departure;
- transit bed occupies cruise;
- destination audio begins before arrival;
- selected place resolves acoustically as camera settles.

Sound must subscribe to JourneyFrame rather than run independently.

---

# 28. Debug and Tuning Harness

Toggle using the backtick key in development.

Required controls:

- journey slider 0–1;
- current stage;
- motion mode;
- renderer owner;
- projection;
- longitude/latitude;
- altitude;
- zoom;
- pitch;
- heading;
- route reveal;
- arc reveal;
- label density;
- material preset;
- selected place;
- freeze;
- copy frame;
- snapshot;
- jump to stage buttons.

The debugger controls the real runtime state.

---

# 29. Failure and Fallback States

The product must never show an unexplained blank screen.

If tiles fail:

- show a styled local fallback surface;
- retain local route and signal data;
- show retry;
- retain selected-place state;
- avoid a permanent black canvas.

If WebGL globe fails:

- continue in MapLibre;
- use world-scale MapLibre projection;
- preserve route and signal behavior.

If deck.gl fails:

- render basic GeoJSON/circle/line fallbacks in MapLibre where feasible.

---

# 30. Performance Requirements

## 30.1 Mobile

Target:

- smooth interaction on current mainstream iOS and Android devices;
- adaptive pixel ratio;
- reduced point counts when needed;
- limited post-processing;
- no uncontrolled per-frame React updates;
- memoized deck.gl layers;
- no duplicate map instances;
- proper cleanup on unmount.

## 30.2 Loading strategy

- visible map first;
- Locatial overlays second;
- advanced texture and terrain later;
- globe renderer loaded only when needed;
- predictively prefetch destination tiles where practical.

---

# 31. Suggested File Structure

```text
src/
  app/
    App.tsx
    main.tsx

  spatial/
    JourneyFrame.ts
    JourneyModel.ts
    JourneyDefinition.ts
    CameraDirector.ts
    LayerOrchestrator.ts
    stages.ts
    math.ts
    arcMath.ts
    arc.ts
    transition.ts
    scaleConversion.ts

  map/
    MapLibreStage.tsx
    mapStyle.ts
    applyMapFrame.ts
    layerVisibility.ts

  globe/
    ThreeGlobeStage.tsx
    applyGlobeFrame.ts
    globeGeometry.ts
    globeLighting.ts

  overlays/
    DeckOverlay.tsx
    createDeckLayers.ts
    signalLayer.ts
    routeLayer.ts
    arcLayer.ts
    pathReveal.ts

  materials/
    MaterialPreset.ts
    MaterialRegistry.ts
    MaterialInheritance.ts
    adapters/
      MapLibreStyleAdapter.ts
      ThreeMaterialAdapter.ts

  data/
    sampleLocatialData.ts

  ui/
    StageRail.tsx
    PlaceCard.tsx
    JourneyControls.tsx
    DebugPanel.tsx

  styles/
    tokens.css
    spatial-runtime.css
```

---

# 32. Build Plan

## Phase 0 — Environment

Deliver:

- Vite app;
- unique local port;
- visible route;
- clean console;
- MapLibre and deck.gl dependencies;
- optional Three.js isolated.

Pass when:

- exact URL loads;
- canvas is visible;
- no blank screen;
- no runtime errors.

## Phase 1 — Canonical JourneyFrame

Deliver:

- types;
- stage ladder;
- camera model;
- slider;
- debug readout.

Pass when:

- one frame drives all visible values;
- stage changes are inspectable;
- no scattered camera state.

## Phase 2 — MapLibre surface

Deliver:

- custom style;
- selected default place;
- labels by stage;
- building fade;
- mobile canvas.

Pass when:

- map is immediately useful;
- style does not look default;
- mobile has no blocking permanent panel.

## Phase 3 — deck.gl story layer

Deliver:

- signals;
- selection;
- route reveal;
- one long-distance arc;
- selected place card.

Pass when:

- overlays synchronize with JourneyFrame;
- signal selection creates a journey;
- route reveal is progressive.

## Phase 4 — Movement grammar

Deliver:

- step;
- urban glide;
- regional movement;
- planetary arc;
- distance-based duration;
- heading;
- pitch;
- interruption.

Pass when:

- local and global journeys feel categorically different;
- destination does not drift;
- new selection interrupts cleanly.

## Phase 5 — Optional globe and handoff

Deliver:

- tactile paperwhite globe;
- synchronized camera;
- altitude crossfade;
- aligned target;
- fallback to MapLibre.

Pass when:

- globe and map feel like one world;
- no hard cut;
- no visible target jump;
- short journeys never invoke globe.

## Phase 6 — Material system

Deliver:

- material presets;
- scale inheritance;
- MapLibre adapter;
- Three adapter;
- paperwhite and ink starter themes.

Pass when:

- one shared preset creates coherent renderer outputs;
- unsupported properties are reported;
- material changes do not break camera behavior.

## Phase 7 — Polish and performance

Deliver:

- mobile tuning;
- reduced motion;
- loading states;
- tile failure state;
- prefetch;
- visual continuity review.

---

# 33. Acceptance Criteria

## 33.1 Product acceptance

1. User understands where the active place is.
2. User understands how the current story or route unfolds.
3. User can move between global and local scale without feeling lost.
4. Local movement feels like a glide.
5. Global movement feels like a journey.
6. The destination remains visually stable.
7. Signals feel like Locatial—not generic pins.
8. The visual system feels editorial and materially coherent.
9. The interface stays subordinate to the spatial surface.
10. Mobile controls do not block the map.

## 33.2 Technical acceptance

1. One JourneyFrame directs camera, overlays, visibility, and UI.
2. MapLibre uses frame application rather than independent animation.
3. deck.gl layers derive values from JourneyFrame.
4. Optional Three.js subscribes to the same spatial contract.
5. Renderer crossfade is altitude-based.
6. Map and globe align before opacity handoff.
7. Mid-journey interruption starts from the current frame.
8. Coordinates consistently use `[lng, lat]`.
9. No Cesium in MVP.
10. No blank failure state.
11. No renderer-specific state duplicated as canonical state.
12. Debugger can inspect exact journey frames.

## 33.3 Visual acceptance

1. Paperwhite terrain feels tactile, not photorealistic.
2. Route and signal color is sparse and meaningful.
3. Labels appear gradually.
4. Roads and buildings emerge by hierarchy.
5. No provider-default palette remains.
6. Globe and map share material intent.
7. Planet-to-street transition feels continuous.
8. Visual effects do not conceal spatial errors.

---

# 34. Test Matrix

| Test | Expected result |
|---|---|
| Two-block movement | Small step; no globe |
| LES → Chelsea | Smooth urban glide; city texture retained |
| Oakland → San Francisco | Regional/local lift depending threshold |
| NYC → Boston | Partial planetary context |
| NYC → Tokyo | Full globe arc with departure/cruise/arrival |
| Scrub t from 0 to 1 | All layers remain synchronized |
| Select new place mid-arc | Journey redirects from current frame |
| Disable deck.gl | Map remains functional |
| Disable globe | MapLibre world path remains usable |
| Tile service fails | Styled fallback appears |
| Reduced motion enabled | Shorter, calmer transition |
| Mobile viewport | No permanent sidebar; usable bottom card |
| High-DPI phone | Pixel ratio capped appropriately |
| Labels by stage | No sudden label flood |
| Material theme switch | Visual identity changes without state drift |

---

# 35. Product Metrics

Initial prototype metrics:

- percentage of test journeys completed without camera or target discontinuity;
- frame rate on target mobile devices;
- time to first useful map;
- user-reported sense of orientation after movement;
- user distinction between local glide and global journey;
- percentage of users who understand the active place and route;
- renderer handoff visual defect count;
- blank-screen/error rate;
- interaction success rate for selecting signals on mobile.

---

# 36. Risks and Mitigations

## Risk: Renderer soup

**Mitigation:** One JourneyFrame and strict adapter boundaries.

## Risk: Beautiful but unusable motion

**Mitigation:** Orientation and target stability are acceptance criteria.

## Risk: Mobile performance collapse

**Mitigation:** Progressive enhancement, capped pixel ratio, restrained overlays, lazy globe.

## Risk: Visual mismatch between globe and map

**Mitigation:** Shared material tokens, synchronized lighting intent, altitude-based handoff, visual-match review.

## Risk: Map provider defaults leak through

**Mitigation:** Explicit style walk and stage-aware label control.

## Risk: Scope expands into GIS tooling

**Mitigation:** Prioritize story comprehension and movement over analytical controls.

## Risk: Three.js delays MVP

**Mitigation:** Ship MapLibre + deck.gl runtime first; globe remains optional phase.

---

# 37. Future Extensions

The architecture should later support:

- shareable spatial camera URLs;
- authored journey paths;
- story-specific arrival angles;
- journey timelines;
- destination prefetch;
- sound choreography;
- historical-time layers;
- live activity frequencies;
- creator-authored material presets;
- persistent spatial permalinks;
- PMTiles place packs;
- offline guide journeys;
- richer terrain;
- spatial recommendations;
- camera paths as story objects.

Example future URL:

```text
locatial.io/@37.8044,-122.2712,500m,45p
```

A place URL may eventually encode not just a point, but an approach and an experience.

---

# 38. Canonical Product Statement

Locatial is a composed spatial reveal system.

MapLibre provides the readable world surface.

deck.gl provides the living story and signal layer.

The optional paperwhite globe provides planetary material presence.

The material system keeps every scale visually related.

JourneyFrame directs the camera, layers, renderer handoff, and interface.

The destination is selected first.

The camera commits to it.

Distance determines the movement.

Altitude determines the representation.

Pitch determines the emotion.

Heading determines the intention.

Time determines the choreography.

The result is not merely navigation.

It is arrival.

---

# Appendix A — Canonical Build Rules

- Build mobile-first.
- Use one shared journey state.
- Never animate renderers independently.
- Use MapLibre as the primary production renderer.
- Use deck.gl for Locatial-authored overlays.
- Treat Three.js as an optional isolated globe renderer.
- Do not add Cesium in MVP.
- Do not use generic map pins.
- Do not leave the default basemap style.
- Do not create permanent mobile side panels.
- Do not use opacity to hide alignment errors.
- Do not begin visual polish until camera synchronization passes.
- Do not overload the world with arcs, labels, or glow.
- Always provide a useful fallback state.
- Always verify movement visually, not only through typechecking.

---

# Appendix B — Source Consolidation

This PRD consolidates and supersedes:

- Spatial Camera System Harness
- Arc Camera System
- Spatial Movement Bible
- MapLibre + deck.gl Spatial Stack PRD
- Material System
- Renderer Adapters
- Visual Continuity and Transitions
- Paperwhite Terrain Globe prototype
- Locatial Claude skills pack
- supplied paperwhite terrain visual direction
