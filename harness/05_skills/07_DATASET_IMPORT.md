# Skill — Dataset Import

Use this for CSV, XLSX, GeoJSON, GPX, KML, JSON, APIs, and Google Sheets.

## Model

Dataset → Features / Rows → Layers → optional Place Nodes → Projects.

## Must do

- Import into Library first.
- Require attribution/source URL where applicable.
- Parse fields.
- Preview data.
- Let user decide meaning:
  - visual layer
  - place candidates
  - route
  - reference data
  - both

## Do not

- Assume one feature equals one Place.
- Dump huge files directly into a project.
- Expose raw GeoJSON as the primary UI.
- Build only for one use case like F1 circuits.
