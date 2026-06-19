# Micro-PRD: NYC Nightlife Intelligence

**Status:** Draft  
**Initial market:** New York City  
**Product area:** Locatial Graph, Explore Map and Place Intelligence

## 1. Summary

Locatial will create a spatial intelligence system that helps users understand not only where bars are, but what kinds of nights different places and areas support.

Each bar will have a canonical location, operational facts, sourced experiential claims, derived attributes and confidence values.

Locatial will combine nearby venue attributes to reveal broader patterns such as after-work zones, sports corridors, affordable clusters, date-night pockets and late-night districts.

## 2. User problem

Users currently combine maps, reviews, social media, venue websites and local knowledge to decide where to go.

Existing products show places but do not reliably explain:

- what they feel like;
- who and what they suit;
- when they work;
- how they change;
- how multiple nearby places form a destination.

## 3. Product question

> What kind of night is this part of New York good for?

## 4. MVP goals

- reveal meaningful nightlife patterns;
- support exploration by occasion;
- preserve evidence and uncertainty;
- support time-sensitive classifications;
- demonstrate the value of the Locatial graph;
- establish a reusable architecture for other place categories.

## 5. MVP layers

1. After work
2. Budget drinking
3. Date night
4. Sports viewing
5. Late-night energy

## 6. MVP geography

Select five to eight contrasting areas, including:

- East Village;
- Lower East Side;
- West Village;
- Williamsburg;
- Greenpoint;
- Chelsea;
- Midtown East.

## 7. Coverage target

- broad registry: 1,000–2,000 candidate venues;
- resolved core: approximately 300 venues;
- deeply researched set: 100–150 venues.

## 8. Functional requirements

- canonical place registry;
- physical site and operating entity separation;
- external ID resolution;
- sourced claim records;
- score and confidence calculation;
- time-aware attributes;
- one active layer at a time;
- city, neighborhood, street and place states;
- individual venue detail;
- provenance and freshness;
- internal review tools.

## 9. User flow

1. User opens NYC bars guide.
2. User selects an experiential layer.
3. Irrelevant pins recede.
4. Fields, clusters or corridors appear.
5. Meaningful areas receive concise labels.
6. Relevant bars appear as the user zooms.
7. User selects a place.
8. Place page explains why it matches, when it works, how confident Locatial is and what sits around it.

## 10. Acceptance criteria

The MVP succeeds when:

- all five layers are usable;
- patterns are visibly more meaningful than pins;
- representation changes by scale;
- every highlighted venue has score and confidence;
- every score is traceable to evidence;
- attributes vary by day and time;
- low-confidence information is visually distinct;
- contradictions can coexist through context;
- at least 100 bars support editorial-grade classification;
- the system feels like Locatial rather than a generic heatmap dashboard.

## 11. Risks

- false authority;
- stereotyping;
- stale data;
- venue manipulation;
- sparse coverage;
- provider licensing restrictions.

## 12. Strategic outcome

The prototype should prove that Locatial can turn structured observations about individual places into a readable map of how a city behaves.
