# Locatial Camera: Advanced Movement Grammar

## Purpose

This document defines how Locatial should move the camera with variety, restraint, and cinematic quality.

The previous camera documents define **why** the camera moves: to explain relationships between places.

This document defines **how** the camera moves: speed, easing, orbiting, pacing, transitions, distance handling, and anti-repetition rules.

## Core Law

> Camera movement should feel authored, not automated.

The camera should never feel like a GPS app snapping between pins.

It should feel like an editor, cinematographer, and cartographer deciding:

> This is the relationship. This is how your eye should travel through it.

## Non-Negotiable Rules

1. Never move the camera just because a pin is selected.
2. Every move must explain a relationship.
3. Movement must preserve spatial comprehension.
4. Most scene changes should use highlight changes, not camera moves.
5. Camera movement should vary across a story, but never become decorative.
6. Long movements need acceleration, glide, and slow arrival.
7. Group frames should support subtle orbital or parallax motion when static context would feel dead.
8. Repeated identical `flyTo` movements are forbidden.
9. Motion must account for mobile safe viewport.
10. Uncertainty should never be made to look more precise through camera motion.

---

# 1. Movement Intensity Scale

Locatial should classify every movement by intensity.

## Level 0: Static Highlight

No camera movement.

Use for:

- moving between sibling scenes
- active pin changes inside a chapter
- pattern/cluster exploration
- reading mode

Behavior:

```txt
camera stays fixed
active object changes style
related objects remain visible
```

## Level 1: Breathing Frame

Very subtle motion around a stable composition.

Use for:

- group selection
- chapter overview
- idle reading
- visually rich scenes that should not feel frozen

Behavior:

```txt
camera remains centered on relationship frame
bearing or pitch changes very slightly
movement is slow and almost imperceptible
```

## Level 2: Soft Pan

Small adjustment to keep active target visible.

Use for:

- active target near edge
- bottom sheet obstruction
- label collision
- small context correction

Behavior:

```txt
easeTo with small center change
no zoom drama
short duration
soft ending
```

## Level 3: Fit / Reframe

Camera fits a new relationship frame.

Use for:

- chapter change
- new relationship
- source + target pair
- route overview
- contrast frame

Behavior:

```txt
fitBounds with safe padding
duration based on distance/scale change
slow arrival
```

## Level 4: Narrative Move

Camera expresses story progression.

Use for:

- trace sequence
- wide-to-detail
- reveal consequence
- origin to outcome
- timeline progression

Behavior:

```txt
multi-phase movement
controlled acceleration/deceleration
visual overlays animate with camera
```

## Level 5: Cinematic Move

Reserved for premium moments.

Use for:

- opening shot
- major chapter transition
- descent into crash site
- reveal of final consequence
- terrain/building-aware moment

Behavior:

```txt
orchestrated zoom/pitch/bearing/path
never repeated too often
requires strong editorial reason
```

MVP should mostly use Levels 0-3.

---

# 2. Distance-Based Movement Logic

Camera movement should change based on how far the relationship spans.

## Tiny Distance

Examples:

```txt
same block
same venue cluster
under 200 meters
```

Preferred movement:

```txt
hold frame
highlight only
soft pan if necessary
```

Avoid:

```txt
dramatic flyTo
large zoom change
```

Reason:

At tiny distances, camera movement creates noise. The relationship is better shown through styling, labels, and local overlays.

## Walkable Distance

Examples:

```txt
200 meters to 2 km
3 to 25 minute walk
```

Preferred movement:

```txt
fit frame
show walk time
use soft pan between active targets only if needed
```

Optional movement:

```txt
slow lateral glide along route
```

Reason:

This is the sweet spot for Locatial guides. The user should understand practical proximity.

## Neighborhood Distance

Examples:

```txt
2 km to 8 km
across neighborhood / borough section
```

Preferred movement:

```txt
fit relationship frame
use chapter frame
show boundary or corridor
```

Optional movement:

```txt
wide-to-detail on chapter entry
```

Reason:

At this scale, centering one place destroys context.

## City Distance

Examples:

```txt
8 km to 40 km
across town
```

Preferred movement:

```txt
regional frame
split into chapters if story has phases
show route/distance if relationship matters
```

Movement:

```txt
slower zoom out
hold
then zoom in only for important detail
```

Reason:

A single continuous fly can feel disorienting. Use staged movement.

## Regional / Country Distance

Examples:

```txt
40 km+
intercity / cross-country
```

Preferred movement:

```txt
overview map
chapter split
arc / route line
then local chapter frame
```

Movement:

```txt
do not fly continuously from one place to another unless travel itself is the story
use cut or staged transition
```

Reason:

At large scale, continuous movement becomes meaningless unless the journey is the content.

---

# 3. Arrival Easing and Slowdown

Every meaningful move should have an arrival shape.

Bad movement:

```txt
constant speed -> sudden stop
```

Good movement:

```txt
accelerate gently -> glide -> slow arrival -> settle
```

## Recommended Easing Types

### Soft Ease

Use for:

- small pans
- safe viewport corrections
- UI-driven adjustments

Feel:

```txt
quiet, practical, invisible
```

### Editorial Glide

Use for:

- chapter frames
- distance frames
- pattern frames

Feel:

```txt
calm, composed, readable
```

### Narrative Drift

Use for:

- timeline movement
- route trace
- story sequence

Feel:

```txt
directed, not rushed
```

### Cinematic Descent

Use for:

- wide-to-detail
- crash site
- landmark reveal
- arrival at major story beat

Feel:

```txt
slow approach, controlled finish
```

## Arrival Rules

1. Slow down more when the destination is emotionally or narratively important.
2. Slow down less for utility corrections.
3. Never overshoot unless deliberately simulating a reveal.
4. Labels/pins should resolve during the final 20-30% of the movement.
5. If the move ends on a group, settle into a stable composition, not a single pin.

## Practical Timing

```txt
Small pan: 300-700ms
Chapter reframe: 900-1400ms
Distance frame: 1200-2000ms
Narrative trace: 1800-4000ms
Cinematic descent: 2500-6000ms
```

Duration should depend on:

```txt
distance
zoom delta
pitch delta
bearing delta
story importance
user interaction speed
```

---

# 4. Group Selection and Slow Orbit

When a group is selected, Locatial can use subtle motion to make the frame feel alive without losing comprehension.

## Group Orbit

Use when:

- a chapter contains several related places
- the user is reading but not actively scrubbing
- all places should remain in view
- map composition is stable

Behavior:

```txt
center remains fixed on group centroid or weighted center
bearing changes slowly by 2-8 degrees
pitch may change by 0-3 degrees
zoom remains stable
all targets remain visible
```

The orbit must be subtle. It should feel like a living editorial map, not a 3D demo.

## Orbit Rules

1. Do not orbit if labels become harder to read.
2. Do not orbit if north-up orientation matters.
3. Do not orbit during dense urban wayfinding.
4. Do not orbit if the user is actively scrolling quickly.
5. Stop orbit when user touches or drags the map.
6. Resume only after idle delay.
7. Never complete a fast full circle.
8. Prefer partial arc, not spinning.

## Orbit Types

### Micro Orbit

```txt
bearing: +/- 2 degrees
duration: 8-12 seconds
```

Use for:

- quiet chapter frame
- editorial reading
- small group

### Slow Parallax Orbit

```txt
bearing: +/- 6 degrees
pitch: +0 to +3 degrees
duration: 12-20 seconds
```

Use for:

- 3D buildings
- terrain
- skyline
- venue clusters

### Weighted Orbit

Orbit around a relationship, not geometric center.

Examples:

```txt
group of venues + transit anchor
crash site + intended route
old venue + new development
```

Camera center is weighted toward the relationship that matters.

---

# 5. Anti-Repetition Rules

Camera variety should be deliberate.

Bad:

```txt
flyTo
flyTo
flyTo
flyTo
flyTo
```

Good:

```txt
establish
hold
highlight
soft pan
trace
hold
reveal
settle
```

## Repetition Limits

1. Do not use the same movement type more than 2 times in a row.
2. Do not use cinematic descent more than once per chapter.
3. Do not use orbit on every group.
4. Do not zoom in/out repeatedly for adjacent scenes.
5. Do not change pitch/bearing unless the view benefits from it.
6. Do not move on scroll if highlight is sufficient.

## Movement Variety Palette

For a chapter with multiple scenes:

```txt
Chapter enter: fit frame
Scene 1: highlight
Scene 2: highlight
Scene 3: soft pan if hidden
Scene 4: highlight + label reveal
Scene 5: reveal secondary anchor
Chapter exit: transition to next frame
```

For a narrative incident:

```txt
Establish origin/destination
Trace intended path
Reveal event site
Descend into local context
Hold while details update
```

For a culture guide:

```txt
Establish cluster
Hold
Filter similar places
Highlight active venue
Optional slow orbit
No repeated flyTo
```

---

# 6. Camera Presets

Locatial should define named movement presets.

## Editorial Stable

Default for most Locatial content.

Traits:

- few camera moves
- strong chapter frames
- active highlights
- restrained motion
- high readability

Use for:

- articles
- guides
- explainers
- neighborhood stories

## Cinematic Descent

Traits:

- wide-to-detail movement
- pitch/bearing allowed
- slower arrival
- major moments only

Use for:

- crash site
- natural wonder
- landmark reveal
- opening scene

## Route Trace

Traits:

- line reveal
- step sequence
- previous/current/next state
- movement follows known path only

Use for:

- walking guide
- timeline
- journey
- incident path

## Pattern Drift

Traits:

- stable frame
- category styling
- similarity glow
- optional slow orbit

Use for:

- music venues
- bars
- restaurants
- culture clusters

## Contrast Reveal

Traits:

- hold frame
- toggle layers
- before/after
- old/new
- intended/actual

Use for:

- displacement
- history
- redevelopment
- environmental change

## Practical Guide

Traits:

- minimal drama
- distance labels
- time labels
- fallback anchors
- safe viewport

Use for:

- family day out
- travel logistics
- dog-friendly plan
- transit-heavy guide

---

# 7. Movement Decision Engine

The AI Spatial Director should output both a relationship plan and a movement plan.

```ts
type CameraMovementPlan = {
  movementType:
    | "hold"
    | "breathing-frame"
    | "soft-pan"
    | "fit-frame"
    | "trace"
    | "descent"
    | "reveal"
    | "contrast-toggle"
    | "split";

  intensity: 0 | 1 | 2 | 3 | 4 | 5;

  durationMs: number;

  easing:
    | "soft-ease"
    | "editorial-glide"
    | "narrative-drift"
    | "cinematic-descent";

  targetBehavior:
    | "single-target"
    | "multi-target"
    | "relationship-weighted"
    | "route-weighted"
    | "boundary-weighted";

  cameraOptions?: {
    center?: [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    padding?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };

  orbit?: {
    enabled: boolean;
    bearingAmplitudeDeg: number;
    pitchAmplitudeDeg: number;
    durationMs: number;
    pauseOnInteraction: boolean;
  };

  reason: string;
};
```

## Example: Group Selection

```ts
{
  movementType: "breathing-frame",
  intensity: 1,
  durationMs: 14000,
  easing: "editorial-glide",
  targetBehavior: "relationship-weighted",
  orbit: {
    enabled: true,
    bearingAmplitudeDeg: 4,
    pitchAmplitudeDeg: 2,
    durationMs: 14000,
    pauseOnInteraction: true
  },
  reason: "This chapter contains a stable group of related venues, so the camera should hold context while adding subtle life."
}
```

## Example: Long Distance Consequence

```ts
{
  movementType: "reveal",
  intensity: 3,
  durationMs: 2200,
  easing: "narrative-drift",
  targetBehavior: "multi-target",
  reason: "The arrest location occurs 10 days later and should be revealed as a consequence, not treated as part of the same immediate scene."
}
```

---

# 8. MapLibre Implementation Notes

## Fit Frame

Use:

```ts
map.fitBounds(bounds, {
  padding,
  maxZoom,
  duration,
  easing
});
```

## Soft Pan

Use:

```ts
map.easeTo({
  center,
  duration: 500,
  easing: softEase
});
```

## Slow Arrival

Use easing functions that decelerate strongly at the end.

Example:

```ts
function editorialGlide(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
```

For more cinematic arrival:

```ts
function cinematicDescent(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
```

## Orbit

Orbit should be a controlled idle behavior, not a camera transition.

Pseudo-logic:

```ts
function startGroupOrbit(map, frame) {
  if (!frame.orbit.enabled) return;
  if (userIsInteracting) return;
  if (labelsAreDense) return;

  const baseBearing = map.getBearing();
  const basePitch = map.getPitch();

  animate({
    duration: frame.orbit.durationMs,
    onFrame: (t) => {
      const wave = Math.sin(t * Math.PI * 2);
      map.easeTo({
        bearing: baseBearing + wave * frame.orbit.bearingAmplitudeDeg,
        pitch: basePitch + wave * frame.orbit.pitchAmplitudeDeg,
        duration: 0
      });
    }
  });
}
```

Stop conditions:

```txt
user drag
user pinch
user scroll speed high
active scene changes rapidly
labels collide
map performance drops
```

---

# 9. Quality Bar

A movement is good if:

1. The user understands more after the move.
2. The move does not break spatial memory.
3. The move has a clear start, glide, and arrival.
4. The arrival feels composed, not abrupt.
5. The movement type matches the relationship.
6. The same movement is not repeated mechanically.
7. It works with bottom sheets and mobile safe areas.
8. It does not imply false certainty.
9. It feels editorial, not gimmicky.
10. It can be explained in one sentence.

A movement is bad if:

1. It centers every selected pin.
2. It feels like Google Maps navigation.
3. It spins or orbits without purpose.
4. It zooms too much for tiny distances.
5. It flies across large distances without story reason.
6. It loses the relationship being explained.
7. It adds pitch/bearing just because it can.
8. It makes labels unreadable.
9. It repeats the same transition pattern.
10. It hides uncertainty.

---

# 10. Final Principle

Camera variety is necessary, but only quality variety.

The hierarchy should be:

```txt
Meaning first
Readability second
Motion third
Spectacle last
```

Locatial should not become a motion demo.

It should become spatial direction with taste.
