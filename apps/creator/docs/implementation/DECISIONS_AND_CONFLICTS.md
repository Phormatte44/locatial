# Decisions & Conflicts

Decisions taken to unblock the build. Where the task brief and the documented vocabulary
diverge, the brief is authoritative for this prototype; the mapping back to the docs is
recorded so this work feeds the documented platform later.

## D1 — Story / Section / Chapter is the authoring model
The docs use Channel → Place; the brief uses **Story → Section → Chapter**. Mapping:
- **Story** ≈ Channel (a named, slugged, publishable, ordered curation).
- **Chapter** ≈ a channel-curated Place (image, headline≈name, body≈description, tags,
  location `[lng,lat]`, optional canonical `place_id`, optional camera intent, position≈rank).
- **Section** = a new, optional named grouping of Chapters (e.g. "West London", "Morning").
  No direct doc equivalent; closest is a neighbourhood grouping. Kept as a soft label.

## D2 — Ordering model (decoupled, single source of truth per axis)
- `chapters.position`: **global 1..N reading order** within a Story. This is the carousel
  order and the target of "reorder chapters" and "move Chapter 17 → position 7".
- `chapters.section_id`: optional grouping tag (nullable FK).
- `sections.position`: order of Sections in the outline / Reader section indicator.
- Reading order = chapters sorted by `position`. Section membership and section order are
  **decoupled** from reading order, because the brief lists "reorder Chapters" (#14),
  "move between Sections" (#17), and "reorder Sections" (#18) as *distinct* operations.
  This keeps each operation a single, testable mutation and avoids contiguity edge-cases.
- Positions are persisted integers, kept contiguous by `orderingUtilities`. IDs are stable
  and never recreated on move.

## D3 — Persistence: real Supabase, with a documented local fallback
- Primary repository talks to **Supabase Postgres + Storage** (`SupabaseStoryRepository`).
- The **service-role key is unavailable**, so this agent cannot create tables/buckets or
  seed. Migrations + storage setup are written and documented for the user to run.
- To keep the slice runnable and testable *today*, a `LocalStoryRepository`
  (localStorage-backed, same interface) is the fallback when `VITE_SUPABASE_URL` is unset.
  Selection is automatic in `repositories/index.ts`. This is a dev aid, not a substitute:
  the Supabase path is fully implemented and is used as soon as env + migrations exist.

## D4 — Auth deferred; temporary RLS
Per the brief, all routes are open and no auth is built. Migration `0002` enables RLS with
**permissive anon policies** (anon can read/write `stories`/`sections`/`chapters` and the
`chapter-images` bucket). This is explicitly a prototype posture. `0003_secure_rls.sql.example`
shows the authenticated, owner-scoped replacement (adds `owner_id`, restricts writes to
`auth.uid()`). Product logic never reads auth, so adding Supabase Auth later is additive.

## D5 — "Agents may create drafts but may never publish"
`publishService.publish()` requires `actor: 'human'`. Calls with `actor: 'agent'` throw
`AgentPublishForbiddenError`. Draft creation/editing is allowed for any actor.

## D6 — Place search via Nominatim (no keys)
`placeSearchService` calls Nominatim (`/search`) for geocoding and returns
`{ label, lng, lat, placeId }`. OSM `osm_type/osm_id` → canonical `place_id`. Map click
sets/adjusts coordinates directly; reverse geocoding (`/reverse`) fills the place name.

## D7 — Camera intent
Optional per-Chapter `camera { zoom, pitch, bearing }` (jsonb). When absent the
`cameraDirector` derives motion from inter-chapter distance: short hop → `easeTo` with a
gentle zoom; long hop → `flyTo` that zooms out over the journey. Respects
`prefers-reduced-motion` (instant `jumpTo`).

## D8 — Stack
React 18 + TypeScript + Vite + Tailwind v3 + MapLibre GL v5 + `@supabase/supabase-js` +
`react-router-dom` + Vitest/Testing-Library. Tailwind tokens carry the documented design
system (Manrope, Signal Pink, Night). No bespoke visual identity — neutral, semantic
components so the look can be replaced later. shadcn/Obra not present in the repo, so a tiny
local primitive set (`components/ui`) is used instead; components are shadcn-shaped
(className-driven) for easy later swap.

## D9 — Reordering UX
Deterministic controls (move up/down, "move to position", section selector, section
reorder) rather than drag-and-drop. Reason: the brief prioritises *persisted, correct
ordering* over polish, and explicit controls are robust + directly unit-testable
(satisfies "move Chapter 17 to position 7"). Drag-and-drop can be layered on later over the
same `orderingUtilities`.

## D10 — Font conflict
Docs (Manrope) override the neighbourhood-test Tailwind config (Inter). Manrope is loaded
from Google Fonts.

## Open questions deferred (from OPEN-QUESTIONS.md, not blocking)
Channel editions/issues, multi-channel place ownership, ranking algorithm, real-time
signals, operator tiers — all out of scope for this vertical slice.
