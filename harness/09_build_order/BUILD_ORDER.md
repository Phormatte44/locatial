# Locatial Build Order

This build order is prototype-first.

## Phase 0 — Harness sanity check

Goal: Codex understands the product before coding.

Codex reads:

- `harness/00_start_here/LOCATIAL_CANONICAL_TRUTHS.md`
- `CHANGELOG.md`
- `harness/06_decisions/DECISION_LOG.md`
- `harness/05_skills/00_GLOBAL_LOCATIAL_RULES.md`

Output:

- 1-page architecture summary.
- No code.

## Phase 1 — Rich visual prototype with dummy data

Goal: feel the product.

Build only:

- One Creator Studio route.
- Three-column editor.
- Dummy project.
- Dummy Story Stops.
- Dummy Stop Editor.
- Dummy Research Tray.
- Dummy Library.
- Spatial Context drawer.
- Basic Preview mode.
- No backend.

Relevant skills:

- `02_VISUAL_PROTOTYPE.md`
- `03_EDITOR_EXPERIENCE.md`
- `04_LIBRARY_CAPTURE.md`
- `06_SPATIAL_CONTEXT_CAMERA.md`
- `09_PREVIEW_CONSUMER.md`
- `13_UI_KIT_IMPLEMENTATION.md`
- `18_DO_NOT_BUILD.md`

Success criteria:

- Michael can click through the full authoring loop.
- UI is visually rich enough to judge direction.
- Dummy data feels like a real spatial story.
- No Supabase required.
- No map API required unless trivial/free.

## Phase 2 — Interaction refinement

Add:

- Better Story Stop states.
- Stop grouping.
- Library → Context → Editor interactions.
- Used / unused note states.
- Place assignment states.
- Camera controls as simple sliders/inputs.
- Preview jump-back-to-edit.

## Phase 3 — Data model alignment

Add:

- TypeScript types.
- Fixture data shaped like future schema.
- Domain model review.
- Schema draft update.

## Phase 4 — Supabase persistence

Add:

- Projects.
- Stops.
- Content blocks.
- Library items.
- Place Nodes.
- Channels if auth path is clear.

## Phase 5 — Dataset / Layer prototype

Add:

- CSV / GeoJSON dummy import.
- Dataset detail view.
- Feature table.
- Layer styling inspector.
- Attribution/source fields.
- Add dataset layer to project.

## Phase 6 — Preview / Published renderer

Add:

- Phone-first reader preview.
- Stop progression.
- Map/camera synchronization.
- Layer visibility.
- Published artifact route.

## Phase 7 — Publish, auth, maintenance

Add:

- Auth.
- Channels.
- Draft/publish.
- RLS.
- Publish checks.
- Place freshness / trust warnings.
