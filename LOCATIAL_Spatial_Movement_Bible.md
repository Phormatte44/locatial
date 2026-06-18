# LOCATIAL Spatial Movement Bible
## Camera Behavior, Motion Grammar, Arc Systems, and Renderer Choreography

### Purpose

This document defines how Locatial moves through space.

It is the universal reference for camera behavior, transition logic, arc selection, altitude, pitch, heading, timing, renderer ownership, and the emotional character of movement across every geographic scale.

The central principle is simple:

> **The arc is the brand. Locatial does not teleport between places. It travels.**

Locatial is not a conventional map interface with animated zoom. It is a composed spatial reveal system. The user is not operating a map; they are being taken somewhere.

---

## 1. Core Product Thesis

Most spatial products move the map.

Locatial moves the camera.

That distinction defines the product.

A conventional map treats location as a database query rendered on a surface. Locatial treats movement between places as authored cinematography. The transition is not a utility layer between two states. It is part of the story.

Three principles follow from this:

1. **Movement must feel intentional.**  
   The camera always appears to know where it is going.

2. **Scale determines emotional register.**  
   Two blocks, five kilometres, five hundred kilometres, and ten thousand kilometres must not feel like the same animation at different speeds.

3. **The destination must remain spatially stable.**  
   The camera moves toward the destination. The destination does not drift beneath the camera.

The experience should communicate:

> A map is not opened. A place is revealed.

---

## 2. The Non-Negotiable Laws

### 2.1 The camera travels; the anchor does not

The selected destination is sacred from the first frame.

The camera may change position, altitude, pitch, heading, projection, and renderer. The target itself must remain fixed.

This prevents the destination from appearing to slide or drift during the transition.

### 2.2 One canonical spatial contract

All renderers must subscribe to the same spatial truth:

- WGS84 longitude
- WGS84 latitude
- altitude in metres
- heading in degrees
- pitch in degrees
- active target longitude
- active target latitude
- transition progress
- motion mode

MapLibre zoom values, arbitrary Three.js units, and renderer-specific camera states are outputs—not sources of truth.

### 2.3 One transition clock

The journey must be controlled by one timeline.

MapLibre, Three.js, UI overlays, signal layers, labels, and route reveals may not run independent easing systems. If each renderer animates itself, the experience will drift apart.

The journey clock owns time. Renderers only apply the current frame.

### 2.4 Renderers do not invent behavior

Input changes journey state.

Journey state creates a frame.

The frame drives every renderer.

The renderer never decides:

- where to move,
- how quickly to move,
- when to change projection,
- when to appear,
- when to reveal labels,
- or how to ease.

### 2.5 Alignment before opacity

Crossfade is not a substitute for spatial correctness.

The globe and map must be aligned to the same target, heading, and camera logic before opacity is introduced. A slow fade only makes misalignment visible for longer.

### 2.6 Correctness before visual polish

The first working version should be visually crude but spatially correct:

- a white sphere,
- a default map,
- a slider,
- a fixed destination,
- a debug overlay.

Only after movement is correct should shaders, bloom, atmosphere, dot fields, cards, sound, and editorial styling be added.

---

## 3. The Universal Journey Model

Every transition is expressed as a normalized journey from `t = 0` to `t = 1`.

The journey produces a single frame:

```ts
export type JourneyFrame = {
  t: number
  stage: StageName
  mode: MotionMode
  owner: RendererOwner
  projection: ProjectionMode
  anchor: GeoPoint
  camera: CameraPose
  layerVisibility: LayerVisibility
  styleMix: StyleMix
  routeReveal: number
}
```

The processing model is:

```text
User Input
→ JourneyModel
→ CameraDirector
→ LayerOrchestrator
→ StyleSystem
→ JourneyFrame
→ Three.js / MapLibre / UI / Debugger
```

The frame is the universal subscription contract.

---

## 4. Motion Grammar

Locatial uses different movement modes based on geographic distance.

| Distance | Mode | Meaning | Emotional register |
|---|---|---|---|
| Under 35 km | Urban glide | Local movement inside one city or nearby area | Intimate, silky, continuous |
| 35–1,800 km | Regional hop | Movement between cities or regions | Lift, drift, context |
| Over 1,800 km | Planetary arc | Intercontinental movement | Departure, travel, arrival |

A more detailed reference:

| Scale | Example | Peak altitude | Duration | Ease | Globe | Feel |
|---|---|---:|---:|---|---|---|
| 2 blocks | Avenue A → Avenue B | ~1,500 m | ~1.5 s | sine | Never | Step |
| 5 km | LES → Chelsea | ~5,500 m | ~2.1 s | sine | Never | Glide |
| 50 km | NYC → Hamptons | ~55,000 m | ~3.1 s | sine | Never | Drift |
| 500 km | NYC → Boston | ~550,000 m | ~4.2 s | power2 | Partial | Lift |
| 5,000 km | NYC → Los Angeles | ~5.5M m | ~5.2 s | power2 | Full | Arc |
| 10,800 km | NYC → Tokyo | ~11.9M m | ~5.8 s | power2 | Full | Journey |

The user should feel the difference between:

- stepping,
- gliding,
- drifting,
- lifting,
- arcing,
- and journeying.

---

## 5. The Two Primary Arc Behaviors

## 5.1 Intra-City Glide

Example: Lower East Side to Chelsea.

This is not a planetary journey. It is a crane shot across the city.

The camera rises only enough to establish context, then moves laterally while preserving urban texture. Streets remain streets. The user never loses the city.

### Behavior

- No hard departure, cruise, and arrival phases
- Altitude rises gently
- Globe never appears
- Pitch opens slightly at the midpoint
- Movement remains readable at street and neighbourhood scale
- Duration is approximately two seconds
- Easing is `sine.inOut`

### Emotional character

The movement should feel like:

- a breath,
- a glide,
- a crane shot,
- moving through one continuous urban room.

The intra-city glide says:

> The city is one thing. You are moving through it.

---

## 5.2 Intercontinental Arc

Example: New York to Tokyo.

This is a full journey.

The camera departs the city, rises through the atmosphere, enters planetary space, follows a great-circle arc, then descends into the destination.

### Phase 1 — Departure

`0.00 → 0.18`

- Street altitude rises rapidly toward orbital scale
- Pitch drops from roughly 45° toward 6–8°
- The city shrinks beneath the camera
- Energy is fast and directional
- The user feels that they are leaving

### Phase 2 — Cruise

`0.18 → 0.82`

- The camera follows a great-circle path
- Heading continuously faces the direction of travel
- Pitch remains near the horizon
- The globe becomes the dominant renderer
- The journey feels steady and expansive
- The destination remains the fixed anchor

### Phase 3 — Arrival

`0.82 → 1.00`

- Altitude falls quickly
- Map detail returns
- Pitch rises toward the destination
- Arrival pitch may be slightly steeper than departure pitch
- The destination appears to rise and meet the camera
- The movement resolves rather than stops abruptly

The intercontinental arc says:

> The world is connected. You are crossing it.

---

## 6. Camera Behavior

### 6.1 Position

For local movement, linear geographic interpolation is sufficient.

For global movement, the camera follows the shortest great-circle path across the sphere using spherical interpolation.

### 6.2 Altitude

Peak altitude scales with journey distance:

```ts
peakAltitude = clamp(distance * 1.1, 3_000, 14_000_000)
```

Altitude follows a sine arc:

```ts
altitude =
  lerp(originAltitude, destinationAltitude, t)
  + sin(t * PI) * peakAltitude
```

This creates a smooth rise and fall while still respecting different start and end altitudes.

### 6.3 Heading

The camera always faces the direction of travel.

Heading is calculated from the current point to a point slightly ahead on the route. This small look-ahead gives the camera intentionality.

It should never feel as though the camera is sliding sideways or drifting without purpose.

### 6.4 Pitch

Pitch gives the movement its authored character.

For global arcs:

- departure begins around 40–50°,
- cruise flattens toward roughly 5–8°,
- arrival returns toward 45–50°.

Arrival can be slightly steeper than departure to create anticipation.

For local glides:

- start near 45°,
- open toward roughly 20° at the midpoint,
- return toward 45° on arrival.

### 6.5 Duration

Duration scales logarithmically with distance.

This prevents long-distance movement from becoming unbearably slow while still making vast journeys feel meaningfully longer than local movement.

```ts
duration = clamp(0.8 + log10(distance) * 0.9, 1.5, 7.0)
```

### 6.6 Easing

- Local glide: `sine.inOut`
- Global arc: `power2.inOut`

Local motion floats.

Global motion departs and arrives.

---

## 7. The Sacred Destination Anchor

The destination anchor must remain fixed throughout the transition.

```ts
activeTargetLng: to.activeTargetLng
activeTargetLat: to.activeTargetLat
```

The camera position may interpolate between origin and destination, but the active target must always be the final destination.

This creates the sensation that the system has already chosen where it is going and is now carrying the user there.

It also prevents:

- target drift,
- unstable centering,
- competing camera logic,
- visual disorientation,
- and renderer mismatch.

---

## 8. Renderer Choreography

### Three.js owns

- sculptural globe
- planetary motion
- atmosphere
- rim light
- globe material
- global dot fields
- orbital-scale movement

### MapLibre owns

- roads
- buildings
- neighbourhood geometry
- local labels
- semantic geography
- street-scale readability
- intra-city movement

### Cesium is optional

Cesium should only be introduced when real 3D terrain or building fidelity matters more than visual art direction.

It should not replace the core choreography layer.

### Handoff rule

Renderer visibility is based on altitude, not raw time.

```ts
const GLOBE_FADE_TOP = 2_000_000
const GLOBE_FADE_BOTTOM = 200_000
```

Below the lower threshold, MapLibre is fully visible.

Above the upper threshold, the globe is fully visible.

Between them, the renderers crossfade.

This means:

- short urban movement may never show the globe,
- regional travel may reveal it partially,
- intercontinental journeys reveal it fully.

The handoff should feel like one world changing representation—not two separate products crossfading.

---

## 9. Descent as Editorial Compression

Altitude is not only spatial.

It is editorial.

At planetary scale, the destination is compressed into a signal.

As the camera descends:

```text
World
→ Continent
→ Country
→ Region
→ City
→ Neighbourhood
→ Street
```

Information progressively decompresses.

At each altitude band, Locatial may reveal:

- historical context,
- one editorial sentence,
- sound,
- atmosphere,
- signals,
- labels,
- stories,
- route detail,
- or place-specific media.

The descent is therefore also a timeline.

---

## 10. Layer and Interface Behavior During Movement

Movement should control more than camera position.

The JourneyFrame should also drive:

- label visibility,
- signal visibility,
- route reveal,
- map detail,
- card appearance,
- place metadata,
- projection changes,
- sound mix,
- globe material,
- atmosphere,
- and editorial annotations.

Recommended behavior:

### During departure

- local labels fade
- signal dots reduce
- cards retract
- route begins revealing
- map detail simplifies
- globe representation emerges

### During cruise

- destination remains highlighted
- origin context falls away
- route or arc may remain visible
- UI is minimal
- sound emphasizes travel

### During arrival

- map is already aligned before it becomes visible
- destination labels appear late
- local signals return progressively
- route detail resolves
- place UI appears only after spatial orientation is stable

---

## 11. Visual Character

The spatial world should feel materially continuous.

The globe and map should appear to belong to the same visual system.

### Basemap direction

- near-black land
- darker water
- subtle buildings
- restrained roads
- no inherited transport colours
- no default POI icons
- no uncontrolled labels

Labels should return as editorial UI, not as generic map clutter.

### Signal colour

Colour is reserved for meaning.

- active signals may use magenta
- emergent signals may use lime
- the environment remains quiet and monochromatic

This keeps place signals alive against a controlled spatial field.

---

## 12. Sound and Movement

Movement can have an acoustic handoff.

The product should sound as though it is travelling and landing.

Possible behavior:

- globe score rises during departure
- local place sound fades
- transit sound occupies cruise
- destination frequency appears before visual arrival
- place audio resolves as the camera settles

The destination should have an acoustic identity, not only a visual one.

---

## 13. Interaction Rules

All interaction inputs change journey targets only.

Inputs may include:

- tapping a signal
- selecting a story stop
- choosing a route
- clicking a place
- scrolling
- scrubbing the journey debugger
- moving between chapters
- navigating from one recommendation to another

These interactions must not call renderer-specific movement methods directly.

For example:

- do not use independent `map.flyTo()`
- do not run a separate Three.js tween
- do not animate UI on unrelated clocks

One user action should create one journey.

---

## 14. Interruption and Re-Routing

If the user selects a new destination mid-journey:

1. capture the current tweened camera state,
2. use it as the new origin,
3. cancel the previous tween,
4. calculate a new distance and movement mode,
5. begin the new journey from the current visual state.

The camera should never snap back to the previous origin.

This preserves continuity and makes the system feel responsive rather than brittle.

---

## 15. Required Implementation Modules

```text
SpatialCameraState.ts
scaleConversion.ts
tangentPlane.ts
arcMath.ts
arc.ts
transition.ts
adapters/maplibre.ts
adapters/three.ts
hooks/useArcCamera.ts
JourneyModel.ts
CameraDirector.ts
LayerOrchestrator.ts
StyleSystem.ts
JourneyFrame.ts
```

### Responsibilities

- `SpatialCameraState.ts` — canonical spatial contract
- `arcMath.ts` — distance, interpolation, bearing, altitude, pitch, duration
- `arc.ts` — computes full camera state for any progress value
- `transition.ts` — non-arc state interpolation
- `maplibre.ts` — applies canonical state to MapLibre
- `three.ts` — applies canonical state to Three.js
- `useArcCamera.ts` — public movement API
- `JourneyModel.ts` — runtime journey state
- `CameraDirector.ts` — position, arc, heading, pitch, anchor
- `LayerOrchestrator.ts` — visibility and reveal rules
- `StyleSystem.ts` — materials, palette, atmosphere
- `JourneyFrame.ts` — universal renderer contract

---

## 16. Build Order

### Stage 1 — Camera synchronization

Build:

- basic globe,
- basic map,
- canonical state,
- transition slider,
- debug overlay,
- fixed target.

Acceptance:

- globe and map align,
- destination does not drift,
- map is visible at street state,
- globe is visible at planetary state.

### Stage 2 — Arc system

Build:

- great-circle movement,
- local glide,
- peak altitude,
- heading look-ahead,
- pitch curves,
- duration logic,
- interruption handling.

Acceptance:

- short movement stays local,
- Tokyo journey reveals globe,
- new input cancels the previous journey cleanly.

### Stage 3 — Renderer handoff

Build:

- altitude-driven crossfade,
- projection transition,
- late label reveal,
- synced map state before visibility.

Acceptance:

- no hard cuts,
- no renderer drift,
- no visible projection jump.

### Stage 4 — Spatial styling

Build:

- globe materials,
- dark editorial basemap,
- signals,
- route styling,
- atmosphere.

Acceptance:

- globe and map feel like the same world,
- colour remains reserved for signals,
- visual effects do not obscure spatial correctness.

### Stage 5 — Debugger

Build:

- scrubber,
- live frame readout,
- freeze,
- copy frame,
- snapshot capture.

Acceptance:

- exact points such as `t = 0.18`, `0.52`, `0.82`, and `1.00` can be inspected.

---

## 17. Acceptance Criteria

The system passes only when movement feels correct.

### Spatial correctness

- target remains fixed
- globe and map are aligned
- camera always faces travel direction
- local journeys stay local
- global journeys reach planetary scale
- map is synchronized before visible
- no renderer runs independent easing

### Emotional correctness

- two-block movement feels like a step
- five-kilometre movement feels like a glide
- regional movement feels like a lift
- intercontinental movement feels like a journey
- arrival feels anticipated rather than abrupt
- the user feels carried, not lost

### Technical correctness

- one transition clock
- one canonical spatial state
- no direct renderer animation
- interruption begins from current state
- visual verification accompanies type checking
- nonblank WebGL and map canvases
- no console errors

---

## 18. Future Direction

The movement system should remain independent from renderer implementation.

This makes possible:

### Spatial permalinks

A URL can encode not only a place, but a camera state or camera path.

```text
locatial.io/@37.8044,-122.2712,500m,45p
```

A story becomes a shareable journey through space.

### Predictive prefetching

Because the path is deterministic, map tiles, media, stories, labels, and destination assets can be loaded before arrival.

### Authored journeys

Creators may eventually control:

- approach direction,
- altitude,
- pitch,
- reveal timing,
- destination anchor,
- sound,
- route,
- and editorial stages.

### Place as frequency

Movement can connect location, history, sound, signal, and narrative into one spatial experience.

---

## Final Doctrine

Locatial should never feel like a map jumping between coordinates.

It should feel like a camera moving through a world that already exists.

The destination is chosen first.

The camera commits to it.

Scale determines the movement.

Altitude determines the renderer.

Pitch determines the emotion.

Heading determines the intention.

Time determines the choreography.

The result is not navigation alone.

It is arrival.
