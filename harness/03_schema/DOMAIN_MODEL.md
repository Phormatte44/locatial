# Domain Model

## Main objects

- Profile
- Channel
- Library Item
- Capture
- Place Node
- Dataset
- Dataset Feature
- Layer
- Project
- Project Item / Stop
- Stop Camera
- Content Block
- Publication

## Relationships

Profile → Channels → Projects → Published artifacts

Library contains reusable source material.

Project references source material and creates project-specific meaning.

## Separation

Place Node stores reusable spatial truth.

Project Item / Stop stores project-specific meaning.

Dataset stores reusable imported data.

Layer stores visual presentation of dataset features.

Stop Camera stores how the audience views a located stop.
