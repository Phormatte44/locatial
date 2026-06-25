# Codex Readiness Eval: Locatial Spatial Reveal Engine

## Purpose

This eval determines whether the Spatial Reveal Engine PRD and any implementation output are sufficiently clear, constrained, and testable for Claude Code, Codex, Cursor, or an equivalent engineering agent.

The work is acceptable only if an implementation agent can answer:

1. What is the capability?
2. What is the first build?
3. What files/modules should exist?
4. What data contracts should be used?
5. What is explicitly out of scope?
6. How should rendering be orchestrated?
7. How should camera movement work?
8. How should presets work?
9. How should spatial targets work?
10. How will success be verified?

---

## Rubric

Score each category from 0–3.

```text
0 = missing
1 = mentioned but vague
2 = clear enough to implement with some inference
3 = explicit, testable, and implementation-ready
```

The PRD or implementation plan is acceptable only if:

```text
Total score >= 30 / 36
No category scores 0
No more than two categories score 1
Architecture, data model, build sequence, and acceptance criteria must each score 3
```

---

## A. Product Capability Definition

Must clearly define:

> Locatial's Spatial Reveal Engine lets creators assign scenes to spatial targets at any scale, then lets consumers experience those targets through a choreographed camera journey from globe/context to accurate street-level map.

Score: ___ / 3

---

## B. User Roles and Use Cases

Must distinguish:

Creator side:

- search/select spatial targets;
- import or eventually draw geometry;
- assign targets to scenes;
- select or accept visual presets;
- preview reveal.

Consumer side:

- experience scene playback;
- see correct geographic framing;
- transition between scenes;
- receive accurate street-level context.

Score: ___ / 3

---

## C. Spatial Target Data Model

Must define a single `SpatialTarget` contract for:

- countries;
- cities;
- boroughs;
- neighborhoods;
- blocks;
- POIs;
- landmarks;
- routes;
- imported GeoJSON.

Score: ___ / 3

---

## D. Geometry and GeoJSON Handling

Must include:

- original geometry is preserved;
- display geometry is simplified;
- attribution is stored;
- feature properties are preserved;
- invalid GeoJSON fails safely;
- imported features become `SpatialTarget` objects;
- MVP is developer/admin fixture import first, creator upload later.

Score: ___ / 3

---

## E. Journey and Camera Architecture

Must state:

```text
Input changes target.
Target creates SpatialCameraState.
SpatialCameraState creates JourneyFrame.
JourneyFrame drives all renderers.
Renderers never invent camera behavior.
```

Score: ___ / 3

---

## F. Renderer Orchestration

Must define:

```text
Three.js = cinematic globe/expression layer.
MapLibre = accurate street/map layer.
RendererOrchestrator = opacity, ownership, sync, lifecycle.
MapLibre initializes before visible handoff.
No hard visual cut.
```

Score: ___ / 3

---

## G. Preset and Style System

Must define:

```text
PresetResolver chooses preset.
StyleSystem loads preset config.
Adapters translate preset into Three.js, MapLibre, post-processing, atmosphere, and camera settings.
Presets are JSON files.
No preset editor in MVP.
```

Score: ___ / 3

---

## H. Materials, Lighting, Atmosphere

Must split MVP from future:

MVP:

- base color;
- opacity;
- contrast;
- saturation;
- tint;
- haze;
- simple globe lighting;
- MapLibre style overrides;
- basic building extrusion styling.

Future:

- procedural clouds;
- real weather;
- custom Three.js building mesh;
- advanced shaders;
- Cesium/3D Tiles.

Score: ___ / 3

---

## I. Street-Level Cinematic Movement

Must include named camera profiles:

- `gentle_glide`;
- `parade_float`;
- `crane_move`;
- `street_skim`;
- `orbital_reveal`.

Nearby POI-to-POI transitions should use `parade_float` by default.

Score: ___ / 3

---

## J. Implementation Sequence

Must include a numbered build plan where each step has a visible or testable outcome.

Score: ___ / 3

---

## K. Acceptance Criteria and Tests

Must include scenario tests for:

- United Kingdom;
- Manhattan;
- Boys Town, Chicago;
- Soho, London;
- Brooklyn Bridge or stadium;
- imported GeoJSON polygon;
- New York to Tokyo;
- Bar A to Bar B;
- mountains vs urban nightlife preset;
- reduced motion;
- missing preset fallback.

Score: ___ / 3

---

## L. Non-Goals and Guardrails

Must clearly say not to build:

- full creator studio;
- AtlasStudio;
- Cesium;
- real weather;
- full routing;
- monetization;
- user accounts;
- preset editor;
- Google Maps;
- Three.js as source of street truth.

Score: ___ / 3

---

## Final Score

```text
A. Product Capability Definition: ___
B. User Roles and Use Cases: ___
C. Spatial Target Data Model: ___
D. Geometry and GeoJSON Handling: ___
E. Journey and Camera Architecture: ___
F. Renderer Orchestration: ___
G. Preset and Style System: ___
H. Materials, Lighting, Atmosphere: ___
I. Street-Level Cinematic Movement: ___
J. Implementation Sequence: ___
K. Acceptance Criteria and Tests: ___
L. Non-Goals and Guardrails: ___

Total: ___ / 36
```

## Verdict

- 30–36: acceptable for implementation.
- 24–29: strategy is strong but implementation plan needs tightening.
- 0–23: not ready for Claude Code/Codex implementation.

## Failure modes to watch

1. Beautiful but geographically useless Three.js demo.
2. Accurate but visually dead MapLibre prototype.
3. One giant React component.
4. Camera movement scattered across renderers and event handlers.
5. Presets hardcoded inside components.
6. GeoJSON treated as one-off file instead of spatial target source.
7. Street-level movement falling back to default map pan.
8. Overbuilding full creator studio instead of constrained reveal engine.
