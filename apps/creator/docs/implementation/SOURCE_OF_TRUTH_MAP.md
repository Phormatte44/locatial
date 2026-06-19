# Source-of-Truth Map

Classification of the important files found in the workspace, and what this build treats
as authoritative.

## Canonical source of truth (binding)
| File | Why |
|---|---|
| `…/locatial-docs-bundle/docs/DESIGN-SYSTEM.md` | Frozen design tokens: Signal Pink `#FF2D7A`, Night `#0a0a0b`, Manrope 700/800, 42/58 split, pin specs, motion curves, map pitch/bearing/zoom. |
| `…/locatial-docs-bundle/docs/DATA-SCHEMA.md` | Type vocabulary + target PostgreSQL/PostGIS shapes, `[lng, lat]` axis order, slug/publish concepts. |
| `…/locatial-docs-bundle/docs/CHANNEL-MODEL.md` | The platform model (operators, channels, ranked places, draft/publishedAt) that Story/Section/Chapter maps onto. |
| The **task brief** (this run) | The operative spec for *what to build now*: Story → Section → Chapter, the 20 Studio requirements, Reader behaviour, publish rules. Where it conflicts with the docs' future vocabulary, the brief wins for this prototype. |

## Current supporting specification
| File | Role |
|---|---|
| `docs/PRD.md` (v2.0, 2026-06-18) | Product context; Creator Studio described in prose only. |
| `docs/ARCHITECTURE.md` | MapLibre v5 quirks, camera coordination, touch handling — reused. |
| `docs/ROADMAP.md`, `docs/OPEN-QUESTIONS.md` | Scope/sequencing; flags that draft/publish & sections are undecided — this build picks defaults. |
| `…/locatial-docs-bundle/src/types.ts` | Reference type names (`Channel`, `Place`, `ChannelType`…). |

## Working implementation (reference to reuse)
| File | Reused for |
|---|---|
| `locatial-neighbourhood-test/src/components/MapView.tsx` | MapLibre init, HTML markers, boundary layers, `fitBounds`/`easeTo` camera. |
| `locatial-neighbourhood-test/src/components/ContentFeed.tsx` | Transform-based horizontal carousel + native `touchmove {passive:false}` swipe. |
| `locatial-neighbourhood-test/src/index.css` | MapLibre v5 `canvas-container` positioning fix; pin/scroll-snap CSS. |
| `locatial-bre/src/providers/nominatim.js`, `resolver.js` | Nominatim place-search pattern. |

## Historical / superseded (not used)
`locatial-cesium`, `locatial-deckgl`, `locatial-island`, `locatial-atlas`, `paper-globe`,
`stage0-registration-rig*`, `my-app`, root `Carousel.tsx`, `Event Cards.html`, the
`*.zip`/`*.tar.gz` snapshots. Renderer experiments and backups; out of scope.

## Duplicate
`locatial-docs-bundle.zip` duplicates the `…locatial-docs-bundle/` folder. The folder is
canonical; the zip is ignored.

## Contradictory / unclear (resolved in DECISIONS_AND_CONFLICTS)
- Font: Manrope (docs) vs Inter (neighbourhood-test config) → **Manrope**.
- `Bar` vs `Place`, `borough` vs `cityId` → evolution, not conflict.
- No `Story`/`Section`/`Chapter` in docs → introduced by this build, documented as decisions.
- No real `Phormatte44/locatial` git clone present locally → build greenfield in `locatial/`.
