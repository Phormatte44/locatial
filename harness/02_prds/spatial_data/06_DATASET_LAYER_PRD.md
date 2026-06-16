# PRD — Dataset & Layer System

## Purpose

Datasets are uploaded or connected sources of spatial or tabular data.

Datasets live in Library.

## Supported sources

- CSV
- XLSX
- GeoJSON
- JSON
- KML/KMZ
- GPX
- Google Sheets
- API feeds later
- Shapefile later

## Data model

Dataset → Features / Rows → Layers → optional Place Nodes → Projects

## Import flow

1. Upload or connect dataset
2. Require source URL and attribution where applicable
3. Parse fields and geometry
4. Preview data
5. Decide use:
   - Visual layer
   - Place candidates
   - Route
   - Reference dataset
   - Both layer and Place Nodes
6. Style layer
7. Save to Library

## Dataset layer styling

- Single color
- Color by category
- Color by numeric value
- Fixed size
- Size by numeric value
- Point shape: circle, square, pin, icon
- Line: color, width, solid/dashed/dotted
- Polygon: fill, border, opacity
- Label mapped to field
- Presets: Walkability, Food Trail, Transit, History, Sports, Nightlife

## Do not

- Assume one GeoJSON feature equals one Place
- Import directly into a Story without saving dataset to Library
- Expose raw GeoJSON as the primary UI
- Conflate Places with overlays
