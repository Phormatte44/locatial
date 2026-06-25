# PRD: Locatial Spatial Reveal Engine

## 1. Executive Summary

The **Locatial Spatial Reveal Engine** is Locatial's core rendering and camera capability. It lets creators bind scenes to spatial targets at any scale — from country to block to POI to imported GeoJSON — and lets consumers experience those targets through a choreographed camera journey that blends cinematic Three.js expression with accurate MapLibre street-level geography.

This is not a general map feature. It is the product capability that makes Locatial feel like a place is being revealed rather than a map being opened.

The core product promise:

> A place is first experienced as a signal in the world, then revealed through authored camera movement, and finally resolved into accurate street-level geography and story context.

The core technical principle:

> Multiple renderers, one camera truth.

---

## 2. Capability Definition

The Spatial Reveal Engine combines:

- multi-scale spatial target selection;
- creator-side scene assignment;
- consumer-side playback;
- camera-directed spatial movement;
- Three.js cinematic globe/expression layer;
- MapLibre geographic accuracy layer;
- visual material, lighting, atmosphere, and preset architecture;
- debug tooling for tuning journey states;
- future-proof GeoJSON ingestion.

It must support both sides of the product:

### Creator / publisher side

Creators need to select what geography a scene is about.

A scene may target:

- United Kingdom;
- Manhattan;
- Brooklyn;
- Boys Town, Chicago;
- Soho, London;
- Chinatown, London;
- a city block;
- a stadium;
- a bridge;
- a venue;
- a route;
- a manually drawn area;
- an imported GeoJSON polygon.

Creators should be able to:

- search/select a spatial target;
- resolve ambiguous names;
- choose between region/POI candidates;
- assign a target to a scene;
- preview how that scene will be revealed;
- choose or accept a visual preset;
- eventually import or draw custom geometry.

### Citizen / consumer side

Consumers need to experience the selected spatial target at the correct scale.

Playback should:

- frame the selected target correctly;
- choose the right camera motion;
- reveal boundaries, POIs, labels, routes, or cards at the right time;
- move between scenes without hard visual cuts;
- use MapLibre for accurate street-level geography;
- use Three.js for cinematic globe and expressive effects;
- preserve readability and accessibility.

---

## 3. Product Principles

1. **Scenes are not bound to pins.**  
   Scenes are bound to `SpatialTarget` objects.

2. **MapLibre owns geographic truth.**  
   Roads, labels, POIs, boundaries, polygons, street context, and building extrusion MVP belong to MapLibre.

3. **Three.js owns cinematic expression.**  
   Globe, atmosphere, signal dots, arcs, lighting drama, and branded world feel belong to Three.js.

4. **CameraDirector owns movement.**  
   Renderers do not invent their own camera motion.

5. **JourneyFrame drives all renderers.**  
   Every renderer and layer reads from the same journey/camera state.

6. **Visual representation is authored.**  
   The same place can feel different depending on story subject, material preset, lighting, and camera grammar.

7. **The street must still be correct.**  
   Cinematic expression must not compromise geographic accuracy, label readability, or accessibility.

---

## 4. Core Architecture

```text
Creator selects scene geography
        ↓
SpatialTarget Resolver / Registry / Importer
        ↓
Canonical SpatialTarget
        ↓
Geometry + Source + Confidence + Scale Hint
        ↓
Camera Recommendation Engine
        ↓
JourneyModel
        ↓
JourneyFrame
        ↓
RendererOrchestrator
        ↓
Three.js Globe + MapLibre Map + UI
```

Recommended module ownership:

| Module | Responsibility |
|---|---|
| `SpatialTarget` | Single contract for all target types and geometries. |
| `SpatialTargetRegistry` | Static/test registry of known targets for MVP. |
| `GeoJSONImporter` | Validates and normalizes imported GeoJSON fixtures. |
| `JourneyModel` | Owns normalized journey value and transition lifecycle. |
| `CameraDirector` | Converts targets/modes into camera states and frames. |
| `RendererOrchestrator` | Controls renderer lifecycle, opacity, sync, and interaction. |
| `ThreeGlobeStage` | Renders globe, atmosphere, signals, arcs. |
| `MapLibreStage` | Renders accurate street map, labels, polygons, extrusions. |
| `StyleSystem` | Loads presets and translates style to renderer adapters. |
| `DebugPanel` | Shows journey, target, stage, owner, camera, preset. |

---

## 5. Core Data Contracts

### 5.1 SpatialTarget

Every scene must use this contract.

```ts
export type SpatialTargetType =
  | 'country'
  | 'region'
  | 'state'
  | 'county'
  | 'city'
  | 'borough'
  | 'district'
  | 'neighborhood'
  | 'block'
  | 'street'
  | 'poi'
  | 'landmark'
  | 'route'
  | 'custom_geometry';

export type SpatialGeometryType =
  | 'point'
  | 'polygon'
  | 'multipolygon'
  | 'line'
  | 'multiline'
  | 'bounding_box';

export type ScaleHint =
  | 'planetary'
  | 'national'
  | 'regional'
  | 'city'
  | 'neighborhood'
  | 'street'
  | 'building';

export type BoundaryStatus =
  | 'official'
  | 'commonly_used'
  | 'approximate'
  | 'editorial'
  | 'disputed';

export type SpatialTarget = {
  id: string;
  version: string;
  name: string;
  type: SpatialTargetType;
  geometryType: SpatialGeometryType;
  geometry?: GeoJSON.Geometry;
  displayGeometry?: GeoJSON.Geometry;
  centroid: { latitude: number; longitude: number };
  bbox?: [number, number, number, number];
  parentIds?: string[];
  scaleHint: ScaleHint;
  source: {
    sourceType:
      | 'official'
      | 'openstreetmap'
      | 'imported'
      | 'manual'
      | 'editorial'
      | 'partner'
      | 'computed'
      | 'canonical_registry';
    sourceName?: string;
    sourceUrl?: string;
    license?: string;
    attribution?: string;
  };
  confidence: number;
  boundaryStatus: BoundaryStatus;
  properties?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 5.2 SpatialCameraState

```ts
export type SpatialCameraState = {
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  zoom: number;
  pitchDegrees: number;
  bearingDegrees: number;
  fieldOfViewDegrees?: number;
  activeTargetId?: string;
};
```

### 5.3 JourneyFrame

```ts
export type StageName =
  | 'globe'
  | 'continent'
  | 'country'
  | 'region'
  | 'city'
  | 'neighborhood'
  | 'street';

export type MotionMode =
  | 'planetary_arc'
  | 'regional_hop'
  | 'urban_glide'
  | 'parade_float'
  | 'orbital_reveal';

export type RendererOwner = 'three' | 'overlap' | 'maplibre';
export type ProjectionMode = 'globe' | 'mercator';

export type JourneyFrame = {
  journey: number;
  stage: StageName;
  mode: MotionMode;
  camera: SpatialCameraState;
  target: SpatialTarget;
  rendererOwner: RendererOwner;
  projection: ProjectionMode;
  globeOpacity: number;
  mapOpacity: number;
  labelOpacity: number;
  boundaryOpacity: number;
  buildingOpacity: number;
  routeReveal: number;
  cardVisibility: 'hidden' | 'preview' | 'resolved';
  interactionState: 'locked' | 'limited' | 'enabled';
  activePresetId: string;
};
```

---

## 6. GeoJSON Ingestion

The system must account for future imported GeoJSON files.

### Supported MVP inputs

For MVP, support developer/admin fixture import only:

- `FeatureCollection`
- `Feature`
- `Point`
- `LineString`
- `MultiLineString`
- `Polygon`
- `MultiPolygon`

Creator-facing upload is future scope.

### Import pipeline

```text
Load GeoJSON fixture
→ Validate structure
→ Normalize coordinate expectations
→ Extract feature properties
→ Generate internal SpatialTarget IDs
→ Compute centroid
→ Compute bbox
→ Detect geometry type
→ Preserve original geometry
→ Generate simplified display geometry
→ Store attribution/source metadata
→ Make each feature selectable as SpatialTarget
```

### Validation requirements

The importer must check:

- valid GeoJSON object;
- supported geometry type;
- longitude/latitude coordinate order;
- closed polygon rings;
- manageable file size and feature count;
- non-empty geometry;
- invalid geometry fails safely;
- imported properties are preserved but do not overwrite canonical fields without explicit mapping.

### Storage requirement

Store both:

```text
geometry        = original geometry
displayGeometry = simplified geometry for fast rendering
```

Original geometry is for fidelity and reprocessing. Display geometry is for interactive rendering.

---

## 7. Journey Stages

| Journey | Stage | Owner | User sees |
|---:|---|---|---|
| 0.00–0.18 | globe | Three.js | Branded globe, selected place as signal. |
| 0.18–0.34 | continent | Three.js | Macro context, route/signal acquisition. |
| 0.34–0.58 | country/region | overlap | Boundary/context hint, map syncing hidden/behind. |
| 0.58–0.76 | city | overlap | Street grain begins, MapLibre fades in. |
| 0.76–0.90 | neighborhood | MapLibre dominant | Labels/routes/local context appear. |
| 0.90–1.00 | street | MapLibre | Accurate target, card, route, place context. |

### Stage rule

The map must already be in the correct place before it becomes visible.

Bad:

```text
Click target → hide globe → load map → jump to street
```

Good:

```text
Click target → acquire target → descend → overlap → resolve → reveal story
```

---

## 8. Camera Modes

### 8.1 Planetary Arc

Use for long-distance movement such as New York to Tokyo.

- Globe dominant during cruise.
- Great-circle route feel.
- Camera lifts early.
- Destination signal appears before arrival.
- MapLibre resolves late.

### 8.2 Regional Hop

Use for medium-distance movement such as San Francisco to Los Angeles.

- Partial lift.
- Context remains geographic.
- Map returns before street resolve.
- Useful for state/region/city transitions.

### 8.3 Urban Glide

Use for city-scale movement.

- Globe never appears.
- MapLibre stays dominant.
- Slight lift, glide, settle.
- Avoid default map pan.

### 8.4 Parade Float

Use for bar-to-bar, venue-to-venue, or nearby POI movement.

Feeling:

> A parade balloon or giant creature gliding above the road: high enough to understand the street, low enough to feel buildings passing by, wide enough to feel spatial drama, stable enough to remain readable.

Default values:

| Profile | Altitude | Pitch | FOV | Use |
|---|---:|---:|---:|---|
| `gentle_glide` | 120m | 48° | 45° | calm local movement |
| `parade_float` | 55m | 62° | 58° | bar-to-bar / venue-to-venue |
| `crane_move` | 180m → 70m | 50° → 65° | 50° | neighborhood to POI reveal |
| `street_skim` | 35m | 68° | 62° | short energetic movement |
| `orbital_reveal` | 90m | 58° | 52° | stadiums, bridges, landmarks |

These are starting values. They must live in `streetCameraProfiles.ts` for tuning.

---

## 9. Renderer Orchestration

### Ownership

Three.js owns:

- globe;
- atmosphere;
- signal dots;
- route arcs at planetary scale;
- cinematic acquisition;
- lighting drama;
- material expression.

MapLibre owns:

- streets;
- labels;
- roads;
- POIs;
- boundaries;
- polygons;
- imported GeoJSON rendering;
- building extrusion MVP;
- street-level truth.

RendererOrchestrator owns:

- lifecycle;
- opacity;
- handoff timing;
- interaction lock/unlock;
- render stage ownership;
- sync between renderers.

### Lifecycle

```text
1. User selects target.
2. SpatialTarget is resolved.
3. CameraDirector creates start/end camera states.
4. JourneyModel starts transition.
5. Three.js acquisition state begins.
6. MapLibre is moved/synced while hidden.
7. MapLibre opacity increases during overlap.
8. Three.js opacity decreases.
9. Projection, labels, boundaries, buildings, and cards reveal late.
10. Journey completes.
11. Consumer interaction is enabled.
```

---

## 10. Hard Architecture Rules

These are non-negotiable.

1. Renderers do not own journey state.
2. Renderers do not independently animate camera movement.
3. React components do not calculate camera paths.
4. `map.flyTo` / `map.easeTo` must not drive the core reveal.
5. Three.js must not be used as the source of street truth.
6. MapLibre must be initialized before it is visible.
7. Style presets must be loaded from config, not hardcoded into components.
8. Spatial targets must use one shared `SpatialTarget` contract.
9. Imported GeoJSON must not overwrite canonical target data.
10. Consumer playback must not care whether a target came from registry, OSM, manual drawing, or imported GeoJSON.
11. Every transition produces a `JourneyFrame`.
12. Every scene has a `SpatialTarget`.

---

## 11. Material, Lighting, Atmosphere, and Presets

Locatial should treat the map as a rendered scene, not merely a tile view.

### MVP style controls

MVP should include:

- base map style overrides;
- land/water color treatment;
- label density control;
- building extrusion color/opacity/height;
- simple globe lighting;
- tint;
- contrast;
- brightness;
- saturation;
- haze;
- optional subtle grain/vignette;
- simple atmosphere layer.

### Future style controls

Future scope may include:

- procedural clouds;
- weather-aware atmosphere;
- custom Three.js building mesh;
- soft clay/paper building shaders;
- Cesium;
- photorealistic 3D tiles;
- advanced post-processing;
- time-of-day simulation.

### Preset system

Presets must be configuration-driven JSON, not hardcoded.

Initial presets:

- `default`
- `urban-nightlife`
- `mountains`
- `natural-wonders`
- `political-geography`
- `music-venues`

Preset fallback chain:

```text
1. Scene-level explicit preset
2. Story-level preset
3. Subject-derived preset
4. Spatial target type preset
5. Default preset
```

If a preset fails to load:

```text
Use default.scene.json
Log warning
Do not block playback
```

### Preset shape

```ts
export type SceneVisualPreset = {
  id: string;
  name: string;
  description: string;
  subject:
    | 'default'
    | 'urban_nightlife'
    | 'food_and_drink'
    | 'mountains'
    | 'hiking'
    | 'natural_wonders'
    | 'coastal'
    | 'political_geography'
    | 'history'
    | 'transport'
    | 'climate'
    | 'music_venues'
    | 'sports'
    | 'custom';
  materialPresetId: string;
  lightingPresetId: string;
  cameraPresetId: string;
  mapStylePresetId: string;
  atmospherePresetId?: string;
  postProcessingPresetId?: string;
  labelPolicy: 'hidden' | 'sparse' | 'major_only' | 'full';
  terrainPolicy: 'hidden' | 'subtle' | 'emphasized';
  buildingPolicy: 'hidden' | 'subtle_extrusion' | 'editorial_extrusion';
  routePolicy: 'hidden' | 'hint' | 'revealed';
};
```

### Street-level building material direction

Desired feeling:

```text
soft clay
paper model
matte relief
editorial maquette
low-glare spatial object
```

MVP should approximate this using MapLibre fill-extrusion with restrained color, opacity, height, low contrast, and haze. Do not attempt full custom Three.js building mesh in MVP.

---

## 12. Accessibility and Reduced Motion

The system must support reduced motion.

If `prefers-reduced-motion` is true:

- do not run cinematic descent;
- use direct framed transition;
- allow simple opacity fade;
- preserve all geography and content;
- avoid essential information existing only in animation.

Labels, routes, cards, and boundaries must remain readable across presets.

---

## 13. Performance Tiers

```ts
export type PerformanceTier = 'low' | 'medium' | 'high';
```

Low:

- no heavy post-processing;
- simple map style;
- limited atmosphere;
- no complex building material;
- reduced particles/signals.

Medium:

- basic atmosphere;
- MapLibre extrusions;
- modest post-processing;
- simple cloud/haze layer.

High:

- richer lighting;
- higher-quality globe shader;
- stronger atmosphere;
- advanced building treatment later;
- smoother camera.

The experience must degrade gracefully.

---

## 14. MVP Scope

### Must include

- React + TypeScript implementation;
- Three.js branded globe stage;
- MapLibre map stage;
- one `SpatialTarget` contract;
- one `JourneyFrame` contract;
- one `CameraDirector`;
- one `RendererOrchestrator`;
- one `StyleSystem`;
- static/test target registry;
- developer/admin GeoJSON fixture import;
- JSON visual presets;
- local `parade_float` camera;
- long-distance `planetary_arc`;
- debug panel/timeline;
- scenario test fixtures.

### Should not include

- full creator studio;
- publishing workflow;
- AtlasStudio;
- visual preset editor;
- user accounts;
- monetization;
- ticketing;
- community boundary editing;
- Cesium;
- Google Photorealistic 3D Tiles;
- real weather;
- full routing engine;
- AR;
- advanced acoustic layer;
- production place graph.

---

## 15. Required File Structure

Codex/Claude Code should implement toward this structure:

```text
src/
  spatial/
    SpatialTarget.ts
    SpatialTargetRegistry.ts
    GeoJSONImporter.ts
    geometryUtils.ts
    testTargets.ts

  journey/
    JourneyFrame.ts
    JourneyModel.ts
    journeyStages.ts
    motionModes.ts

  camera/
    CameraDirector.ts
    cameraMath.ts
    streetCameraProfiles.ts
    arcCameraProfiles.ts

  style/
    StyleSystem.ts
    PresetResolver.ts
    MapLibreStyleAdapter.ts
    ThreeMaterialAdapter.ts
    PostProcessingAdapter.ts
    presets/
      default.scene.json
      urban-nightlife.scene.json
      mountains.scene.json
      natural-wonders.scene.json
      political-geography.scene.json
      music-venues.scene.json

  renderers/
    RendererOrchestrator.ts
    ThreeGlobeStage.ts
    MapLibreStage.ts

  debug/
    DescentTimelineDebugger.ts
    DebugPanel.tsx

  app/
    LocatialSpatialRevealDemo.tsx
```

Avoid one giant component.

---

## 16. Build Sequence

Each step must have a visible or testable result.

1. Create core TypeScript contracts.
2. Create static `SpatialTargetRegistry` with test targets.
3. Add `GeoJSONImporter` fixture support.
4. Create `JourneyModel` and stage calculation.
5. Create `CameraDirector` with motion mode selection.
6. Create `streetCameraProfiles.ts` and `arcCameraProfiles.ts`.
7. Render MapLibre map with editorial base style.
8. Render Three.js globe stage.
9. Add `RendererOrchestrator` for opacity and ownership.
10. Sync MapLibre camera from `JourneyFrame`.
11. Add target acquisition signal on globe.
12. Add globe-to-map overlap transition.
13. Add street-level `parade_float` transition.
14. Add JSON presets and `StyleSystem`.
15. Apply MapLibre style overrides from presets.
16. Apply Three.js material/lighting config from presets.
17. Add debug panel/timeline.
18. Add scenario test controls.
19. Verify all acceptance tests.

---

## 17. Scenario Test Matrix

### Scenario 1: Country target

Input: United Kingdom

Expected:

- target type = country;
- geometryType = polygon or multipolygon;
- camera frames full region;
- boundary highlight visible;
- labels sparse;
- macro/default or political-geography preset works.

### Scenario 2: Borough target

Input: Manhattan

Expected:

- target type = borough;
- bbox used for framing;
- MapLibre resolves before street level;
- boundary highlight visible;
- city/neighborhood labels appear late.

### Scenario 3: Neighborhood/cultural district

Input: Boys Town, Chicago

Expected:

- target type = neighborhood or district;
- confidence may be medium;
- boundaryStatus may be commonly_used or editorial;
- camera does not use planetary arc;
- MapLibre dominant earlier.

### Scenario 4: Ambiguous district

Input: Soho, London

Expected:

- ambiguous names handled in registry/test fixture;
- selected target resolves to London, not Manhattan;
- camera uses city/neighborhood framing;
- polygon or bbox highlighted.

### Scenario 5: POI / landmark

Input: Brooklyn Bridge or stadium

Expected:

- target type = poi or landmark;
- geometry may be point or line;
- orbital_reveal camera available;
- place card appears after settle.

### Scenario 6: Imported GeoJSON

Input: custom polygon FeatureCollection

Expected:

- file validates;
- original geometry preserved;
- display geometry generated;
- attribution stored;
- imported feature becomes SpatialTarget;
- playback frames geometry by bounds.

### Scenario 7: Long-distance motion

Input: New York to Tokyo

Expected:

- motion mode = planetary_arc;
- Three.js dominant during cruise;
- great-circle route visible or stubbed;
- MapLibre resolves late.

### Scenario 8: Local bar-to-bar motion

Input: Bar A to Bar B within same neighborhood

Expected:

- motion mode = urban_glide or parade_float;
- camera profile = parade_float;
- globe never appears;
- MapLibre stays dominant;
- movement feels like gliding down a street, not a default map pan.

### Scenario 9: Preset switch

Input A: Yosemite / mountains preset  
Input B: Williamsburg bars / urban-nightlife preset

Expected:

- same engine;
- different visual treatment;
- different camera defaults;
- different label/layer priorities.

### Scenario 10: Reduced motion

Input: `prefers-reduced-motion = true`

Expected:

- no cinematic descent;
- direct framed transition;
- opacity fade allowed;
- geography and content remain accessible.

### Scenario 11: Missing preset fallback

Input: unknown preset ID

Expected:

- default preset loads;
- warning logged;
- playback does not fail.

---

## 18. Acceptance Criteria

The MVP is complete only when:

1. The demo loads without console errors.
2. A Three.js globe is visible.
3. A MapLibre map is initialized behind/beneath it.
4. Selecting a `SpatialTarget` triggers a `JourneyFrame`-driven transition.
5. MapLibre is synced before becoming visible.
6. Long-distance and local transitions use different motion modes.
7. The `parade_float` camera works for local movement.
8. At least three visual presets load from JSON.
9. An imported GeoJSON fixture becomes a `SpatialTarget`.
10. The debug panel displays journey, stage, owner, preset, camera, and target.
11. Reduced motion fallback works.
12. The scenario tests above pass.
13. There is no hard visual cut between globe and street map.
14. Street-level view is geographically accurate.
15. The result feels like Locatial, not a default map demo.

---

## 19. Final Strategic Summary

Locatial should treat geography as accurate, but representation as authored.

The product capability is:

```text
SpatialTarget
+ JourneyFrame
+ CameraDirector
+ RendererOrchestrator
+ Material/Lighting Preset
+ MapLibre truth
+ Three.js expression
= Locatial Spatial Reveal
```

The long-term advantage is not simply a prettier map.

The advantage is a system where every place can be revealed with the right scale, mood, material, and movement.
