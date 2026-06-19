# Repository Understanding

> Written during Stage 1 of the Creator Studio + Reader build. Concise by design.

## 1. What LOCATIAL is
A mobile-first **editorial place-discovery product** built on a spatial map. Curators
publish opinionated, ordered guides as interactive experiences: a pitched MapLibre map
(45° pitch, −10° bearing, OpenFreeMap Positron tiles) stays in sync with a swipeable
card carousel. Documented vision grows from a single NYC neighbourhood prototype into a
multi-city **Channel platform** where operators (Eater, Time Out, individual creators)
curate ranked lists of Places. Brand: Signal Pink `#FF2D7A`, Manrope type, dark "Night"
panels.

## 2. What Creator Studio is
The authoring tool where a curator builds and publishes a guide. The canonical docs
describe it loosely (PRD §9 / ROADMAP Phase 1): a place-list manager with ranking,
descriptions, image upload, tags, and draft/published status. **This build gives it a
concrete content model:** a *Story* (the publishable unit) containing ordered *Chapters*
(the editorial stops) optionally grouped into named *Sections*. This maps onto the
documented Channel → Place concepts (see SOURCE_OF_TRUTH_MAP).

## 3. What the public Reader is
A mobile-first consumer experience served at `/story/:slug`. Upper half = map, lower half
= content. Each Chapter is a horizontal carousel item; swiping advances Chapters and the
map flies to each Chapter's location; within a Chapter the content scrolls vertically
(image → headline → body → tags). The documented prototype already implements this shape
for Neighbourhoods × Bars (`locatial-neighbourhood-test`).

## 4. Current domain & database model
- **Documented current (MVP):** `Neighborhood { id, name, borough, center, boundary, bars[] }`
  and `Bar { id, rank, name, neighborhoodId, coordinates, image, description, category,
  activityScore }`. Static TypeScript data, no backend.
- **Documented future:** `City`, `Neighborhood (expanded)`, `Place`, `Channel`,
  `ChannelOperator`, `User`, `SavedList`, `RealTimeSignal`, `PlaceMedia`. Target DB is
  PostgreSQL + PostGIS.
- **This build adds the authoring tables:** `stories`, `sections`, `chapters` in Supabase
  Postgres. `chapters` ≈ a Channel-curated Place (image, headline, body, tags, location,
  optional canonical `place_id`, optional camera intent). See DATABASE section of the
  PROTOTYPE_BUILD_PLAN.

## 5. Current code architecture (documented prototypes)
- `locatial-neighbourhood-test/` — **React 18 + TS + Vite + Tailwind v3 + MapLibre v5**,
  no Supabase, no component library. `App.tsx` owns `ExperienceState`; `MapView.tsx`
  (imperative MapLibre, HTML markers, GeoJSON boundary, `fitBounds`/`easeTo` camera);
  `ContentFeed.tsx` (transform-based horizontal carousel + native touch listeners);
  `BarCard.tsx`. This is the reusable reference for the Reader and the map layer.
- `locatial-bre/` — vanilla JS boundary-resolution engine (Nominatim/Overpass provider
  fan-out). Reference for place search and multi-geometry rendering.
- Other dirs (`locatial-cesium`, `locatial-deckgl`, `locatial-island`, `locatial-atlas`,
  `paper-globe`, `stage0-*`) are renderer experiments — historical for this task.

## 6. What is already working
- The consumer Reader shape (map + carousel + camera sync) in `locatial-neighbourhood-test`.
- Boundary/place resolution against OSM in `locatial-bre`.
- A complete, frozen **design system** and **data-schema spec** in the docs bundle.

## 7. What is only documented (not built)
- Any **Creator/authoring/publishing** flow (PRD §9 is prose only).
- Supabase persistence, RLS, storage, migrations (DATA-SCHEMA shows target SQL only).
- Sections, persisted ordering, drafts, slugs, multi-Story.
- The Channel platform, operators, users, real-time signals.

## 8. What is missing (and this build supplies)
Creator Studio (Story/Section/Chapter editing, map placement, image upload, reorder,
preview, publish), Supabase schema + repository/service layer, the public Reader by slug,
and tests. See PROTOTYPE_BUILD_PLAN.

## 9. Duplicated / contradictory
- `Bar` (current) vs `Place` (future) — intentional evolution, not a true conflict.
- `borough` (string) vs `cityId` (FK) — evolution.
- The **task's Story/Section/Chapter model is not in the docs**; it is a new, more concrete
  authoring vocabulary. Treated as the operative spec for this build. See
  DECISIONS_AND_CONFLICTS.
- Fonts: docs say **Manrope**; `locatial-neighbourhood-test` tailwind config says Inter.
  Docs win (Manrope).

## 10. Does the repository need reorganizing?
No structural reorg of existing prototypes. They are independent experiments and moving
them risks build breakage for zero source-of-truth gain. This build is delivered as a new
self-contained app (`locatial/`) so the working vertical slice is unambiguous and
deployable on its own, with the canonical docs cited as its spec.
