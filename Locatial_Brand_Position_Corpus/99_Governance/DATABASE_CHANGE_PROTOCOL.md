# Database Change and Preservation Protocol

## Purpose

This protocol governs all changes to Supabase and any database supporting Locatial.

The objective is to extend the system without destroying working product behavior, existing data, historical relationships or the ability to roll back.

## Non-negotiable rule

No structural database change begins until the current state has been inspected, documented and checkpointed.

## Required pre-change inventory

Capture:

- schemas;
- tables;
- columns;
- data types;
- primary keys;
- foreign keys;
- indexes;
- constraints;
- views;
- functions;
- triggers;
- row-level security;
- storage buckets;
- authentication dependencies;
- migration history;
- application dependencies;
- data volumes;
- known inconsistencies;
- backup or restore method.

## Change classification

### Additive

Examples:

- new table;
- new nullable column;
- new index;
- new view;
- new mapping table.

Usually preferred.

### Transitional

Examples:

- dual-write period;
- compatibility view;
- staged backfill;
- shadow table;
- ID mapping.

Requires explicit migration and rollback plans.

### Destructive

Examples:

- dropping data;
- renaming depended-on fields;
- changing primary identity;
- truncating tables;
- replacing IDs;
- removing policies or constraints.

Requires explicit user approval.

## Migration sequence

1. Inspect.
2. Back up or branch.
3. Create checkpoint.
4. Write migration.
5. Test on non-production data.
6. Validate row counts and relationships.
7. Deploy additively.
8. Backfill in controlled batches.
9. Verify application compatibility.
10. Switch reads and writes only when validated.
11. Retain rollback compatibility for an agreed period.
12. Remove legacy structures only through a separately approved change.

## Locatial-specific preservation rules

Never destroy:

- place genesis;
- external source identifiers;
- source provenance;
- claim history;
- occupancy history;
- creator attribution;
- confidence history;
- historical names;
- geographic identity;
- relationship edges;
- media ownership and rights metadata.

## Required decision record

Every material database change must state:

- current state;
- proposed state;
- reason;
- alternatives considered;
- affected application areas;
- data migration method;
- test method;
- rollback method;
- unresolved questions;
- approval status.

## Questions that require user input

Ask before proceeding when uncertain about:

- whether current data is production or disposable;
- which table is canonical;
- whether IDs may change;
- whether historical records must remain queryable;
- whether external source data may be persisted;
- whether the migration can cause downtime;
- whether an old application path still needs compatibility;
- whether the change belongs in the corpus repository or application repository.
