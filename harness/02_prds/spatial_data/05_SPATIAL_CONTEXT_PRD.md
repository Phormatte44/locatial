# PRD — Spatial Context

## Purpose

Spatial Context handles location assignment, lightweight map validation, and reader camera framing for a selected stop.

## Required functionality

- Search location
- Assign Place Node
- Keep stop unassigned
- Candidate location state
- Map preview
- Show referenced layers
- Add quick markup
- Open full Dataset / Layer workspace when needed

## Camera framing

A located Stop may define how the audience camera views that location.

Minimum camera fields:

- Zoom
- Pitch
- Bearing

Later camera fields may include:

- Altitude
- Field of view
- Duration / transition timing
- Focus target

## Principle

Location assignment and camera framing should be powerful but should not dominate writing.
