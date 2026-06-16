# PRD — Profiles & Channels

## Purpose

Channels represent publishing identities.

A Profile may own multiple Channels. Each Channel may publish multiple Projects.

## Object relationship

Profile → Channels → Projects → Published artifacts

## Requirements

- A Profile can create/select a Channel.
- A Project can be associated with a Channel.
- A Project can later render byline information from its Channel.
- Channel selection should not block early prototyping if authentication is not implemented.
- Channel support should be represented in the data model early enough to avoid retrofit pain.

## Non-goals for now

- Public follower system
- Social feed
- Channel analytics
- Monetization
- Comments
