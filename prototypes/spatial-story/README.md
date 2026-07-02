# The Night the City Flooded

A touch-based interactive spatial story — the Locatial Spatial Storyteller prototype.

A real MapLibre map performs as a cinematic infographic canvas while a
magazine-style chapter panel below it carries the narration. The reader
**scrolls vertically** to read within a chapter (scroll position reveals map
sub-beats) and **swipes horizontally** to move between the 10 scenes (each
swipe re-choreographs the camera and the coordinate-anchored map actors).

The story is fictional. The geography is real: New Orleans / Gulf of Mexico,
with fictional names (Harrow Bay, Dockside, Eastbank…) placed over real
coordinates.

## Run it

```sh
npm install
npm run dev        # open the printed URL on a phone, or use devtools mobile view
```

Production build (a single self-contained `dist/index.html` — open it directly
on any device with network access for tiles/fonts):

```sh
npm run build
```

A prebuilt `dist/index.html` is checked in so the prototype can be experienced
without a toolchain: download the file and open it.

## Stack (free / open-source only)

- **MapLibre GL JS** — live vector map, real coordinates, authored camera
  choreography (`flyTo` per scene). Base style: CARTO dark-matter-nolabels
  (OpenStreetMap data); every label on the map is ours.
- **React + TypeScript + Vite**
- **Tailwind CSS 4** — editorial monochrome chrome
- **Framer Motion** — swipe track, element enter/exit, insight crossfades
- **SVG overlay engine** (`src/components/MapOverlay.tsx`) — every story actor
  (storm core, forecast cone, model tracks, surge arrows, flood polygons,
  official boundary, routes, breach/block/wall markers, isolation ring,
  visibility line, high-water line, consequence markers) is projected from
  lng/lat to screen space on every camera frame via `map.project`.

## Scene model

`src/data/scenes.ts` — 10 scenes, each with camera, story copy, map sentence,
and an element list with lifecycle states (`active | persistent | dimmed`) and
scroll-beat gates (`0 = chapter top, 1 = mid-read, 2 = chapter end`). The map
remembers: elements persist and dim across scenes instead of resetting.

`src/data/geo.ts` — the actor registry: every element anchored to real
New Orleans coordinates.

## Interaction grammar

- vertical scroll = read; beats ratchet forward and reveal map sub-beats
- horizontal swipe (or tapping the end-of-chapter cue) = next/previous scene
- backward swipe restores the prior scene's camera and element states
- scene 1 shows a one-time gesture hint; progress rail + `NN / 10` throughout
- arrow keys work for desktop review
