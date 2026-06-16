# PRD — Internal Agent Seeding

## Purpose

Internal agent seeding is a Locatial/admin capability for generating initial draft content and populating the platform during prototyping.

This is not a creator-facing feature.

## Requirements

- Agent output may create draft Projects, Stops, Place references, and Dataset references.
- Agent-created content must remain draft-only until a human publishes it.
- Agent output must use the same schema as human-created content.
- Agent output should pass through duplicate-place detection.
- Agent output must not silently create public content.

## Non-goals

- Creator-facing AI copilot
- Auto-publish
- AI-generated creator voice as a product feature
- Public agent personas
