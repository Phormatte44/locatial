# Locatial Spatial Reveal Engine

This folder is the self-contained product and implementation harness for the **Locatial Spatial Reveal Engine**.

Claude Code, Codex, Cursor, or any equivalent implementation agent should treat this folder as the primary source of truth for this specific scope of work.

## Purpose

The Spatial Reveal Engine is Locatial's core rendering and camera capability. It lets creators bind scenes to spatial targets at any scale, then lets consumers experience those targets through a choreographed camera journey that blends cinematic Three.js expression with accurate MapLibre geography.

This scope covers:

- multi-scale spatial targets: country, city, borough, neighborhood, block, POI, route, custom GeoJSON;
- creator/publisher scene targeting;
- citizen/consumer playback;
- Three.js globe and cinematic expression;
- MapLibre street-level geographic truth;
- renderer orchestration;
- camera grammar and motion modes;
- material, lighting, atmosphere, and preset architecture;
- a constrained MVP implementation plan;
- Codex/Claude guardrails and acceptance tests.

## Documents

1. `PRD_Spatial_Reveal_Engine.md`
   - The full technical PRD.
   - Use this as the main source of truth.

2. `IMPLEMENTATION_HARNESS_PROMPT.md`
   - Prompt to give Claude Code or Codex before implementation.
   - It explicitly prevents the agent from pulling in unrelated context.

3. `CODEX_READINESS_EVAL.md`
   - Eval rubric and acceptance standard.
   - Use this to critique implementation plans and code output.

## Important instruction for implementation agents

Do not pull product requirements from elsewhere in the repo unless the user explicitly says to do so.

For this scope, this folder overrides older Locatial notes, previous prototypes, previous prompts, and broader brand documents.

The implementation target is not the whole Locatial product. It is a working, disciplined prototype of the Spatial Reveal Engine.

## MVP summary

The MVP should prove:

- one `SpatialTarget` contract;
- one `JourneyFrame` contract;
- one `CameraDirector`;
- one `RendererOrchestrator`;
- one `StyleSystem`;
- Three.js globe;
- MapLibre street map;
- static/test spatial targets;
- developer/admin GeoJSON fixture import;
- JSON visual presets;
- street-level `parade_float` movement;
- debug timeline/panel;
- scenario-based tests.

## Non-goal reminder

Do not build the full creator studio, AtlasStudio, full routing, real weather, user accounts, monetization, Cesium, AR, ticketing, or a production place graph for this scope.

The job is to build the spatial reveal capability cleanly enough that future systems can plug into it later.
