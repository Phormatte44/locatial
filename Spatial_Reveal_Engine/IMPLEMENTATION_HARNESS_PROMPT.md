# Implementation Harness Prompt for Claude Code / Codex

Use this prompt when starting implementation work for the Locatial Spatial Reveal Engine.

---

You are working in the `Phormatte44/locatial` repository.

For this task, use only the documents inside:

```text
Locatial_Brand_Position_Corpus/Spatial_Reveal_Engine/
```

Treat this folder as the source of truth for this scope.

Do not pull requirements from older Locatial conversations, other repo documents, previous prototypes, brand strategy docs, or assumptions from adjacent work unless I explicitly instruct you to do so.

Your task is to implement the **Locatial Spatial Reveal Engine** as defined in:

```text
Locatial_Brand_Position_Corpus/Spatial_Reveal_Engine/PRD_Spatial_Reveal_Engine.md
```

Also use:

```text
Locatial_Brand_Position_Corpus/Spatial_Reveal_Engine/CODEX_READINESS_EVAL.md
```

to check whether your plan and implementation are acceptable.

## Core instruction

Build a constrained prototype of the Spatial Reveal Engine.

Do not build the whole Locatial product.

The prototype must prove:

- one `SpatialTarget` contract;
- one `JourneyFrame` contract;
- one `CameraDirector`;
- one `RendererOrchestrator`;
- one `StyleSystem`;
- Three.js globe stage;
- MapLibre map stage;
- static/test spatial targets;
- developer/admin GeoJSON fixture import;
- JSON visual presets;
- street-level `parade_float` movement;
- long-distance `planetary_arc` movement;
- debug timeline/panel;
- scenario test controls.

## Critical architecture rules

1. Renderers do not own journey state.
2. Renderers do not independently animate camera movement.
3. React components do not calculate camera paths.
4. `map.flyTo` / `map.easeTo` must not drive the core reveal.
5. Three.js is not the source of street truth.
6. MapLibre must initialize before it is visible.
7. Presets must be JSON/config-driven.
8. Imported GeoJSON must not overwrite canonical target data.
9. Every transition must produce a `JourneyFrame`.
10. Every scene must have a `SpatialTarget`.

## Expected implementation structure

Aim for this structure unless there is a strong technical reason to adjust:

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

Avoid a single giant component.

## Non-goals

Do not build:

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
- production-grade place graph.

## Required scenarios

Build toward these test scenarios:

1. United Kingdom: country/multipolygon/macro framing.
2. Manhattan: borough/bbox framing.
3. Boys Town, Chicago: cultural district/medium confidence.
4. Soho, London: ambiguous place resolved correctly.
5. Brooklyn Bridge or stadium: POI/landmark/orbital reveal.
6. Imported GeoJSON polygon: import and frame by bounds.
7. New York to Tokyo: planetary arc.
8. Bar A to Bar B: parade float / urban glide, no globe.
9. Yosemite mountains preset vs Williamsburg nightlife preset.
10. Reduced motion fallback.
11. Missing preset fallback.

## Before coding

First produce a short implementation plan with:

- files to create;
- data contracts to implement;
- first visible milestone;
- what is out of scope;
- how you will verify success.

Then implement in small passes.

Do not overbuild. Keep the architecture clean and extensible.
