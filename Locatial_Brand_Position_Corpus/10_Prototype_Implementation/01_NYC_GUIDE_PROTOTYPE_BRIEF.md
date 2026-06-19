# NYC Guide Prototype Brief

## Objective

Build a mobile-first prototype that demonstrates the connection between:

- Locatial brand;
- editorial place descriptions;
- structured place data;
- the Locatial graph;
- nightlife intelligence layers;
- individual venue pages.

## Technology baseline

- React
- Tailwind
- shadcn/ui
- dark mode for the first pass
- MapLibre GL JS
- deploy through Vercel
- repository hosted on GitHub

Use the purchased Obra shadcn_ui Pro system where its components are available, but do not let visual polish obscure the interaction test.

## Core screen

The screen should contain:

- a map occupying the upper portion;
- content and controls occupying the lower portion;
- a small experiential-layer selector;
- a clear current neighborhood or area;
- horizontally navigable neighborhood states;
- map boundaries and relevant venue patterns;
- place cards that connect directly to map behavior.

## Required prototype states

1. Default NYC guide
2. After-work layer
3. Budget layer
4. Date-night layer
5. Sports layer
6. Late-night layer
7. Neighborhood focus
8. Street-level relevant bars
9. Individual place detail
10. Evidence/confidence explanation

## Interaction principles

- Keep no more than three conceptual layers visible at once.
- Use progressive disclosure.
- Avoid power-user GIS controls.
- Let the map answer the question visually before exposing detailed data.
- Make confidence legible but not dominant.
- Keep the map and editorial content synchronized.

## Data fixture

For the first prototype, use a curated fixture rather than waiting for a production pipeline.

The fixture should include:

- 100–150 NYC bars;
- coordinates;
- neighborhood;
- five layer scores;
- five confidence values;
- applicable time bands;
- practical place facts;
- short editorial description;
- image references;
- before-and-after relationships.

## Prototype success test

A user should be able to answer within seconds:

- Which areas fit my intended night?
- Why is this area highlighted?
- Which bars are driving the pattern?
- What changes if I change time or intention?
- Why should I trust the recommendation?
