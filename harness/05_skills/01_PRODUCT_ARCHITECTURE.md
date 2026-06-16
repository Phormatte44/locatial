# Skill — Product Architecture

Use this when touching routes, object model, app structure, or persistence.

## Core objects

- Profile
- Channel
- Library Item
- Capture
- Place Node
- Dataset
- Dataset Feature
- Layer
- Project
- Stop / Project Item
- Content Block
- Publication

## Rules

- Place Node stores reusable truth.
- Stop stores project-specific meaning.
- Dataset stores imported source material.
- Layer stores visual presentation.
- Project references Library material.

## Do not

- Clone Place data into Stops.
- Treat every Stop as a Place.
- Treat every Dataset Feature as a Place.
- Create Story/Guide/Collection as entirely separate editors.
