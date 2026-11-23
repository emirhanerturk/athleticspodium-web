# Story page: the "In this story" column

- **Date:** 2026-11-23
- **Status:** Approved by the owner on 2026-11-23
- **Projects:** `athleticspodium-web` (the column), `athleticspodium-backend` (`feat/story-athlete-medals`, on the `migration` branch)

## Intent

The right column of a story listed its championships, athletes and countries as plain name chips. It used none of the site's data: no photo, no flag (the backend left the athlete's country out) and no link between an athlete and what they won at the edition the story is about. The column becomes a set of cards that show it.

## Goals

- An edition shows its city and leads to its results.
- An athlete shows a portrait, a flag and the medals won at the story's editions.
- The page works against the legacy backend, which answers none of the new fields, and fills in by itself after the backend cutover.

## Non-goals

"More stories" picked by topic, a byline in the header, share buttons and reading time. Each is a separate piece of work.

## Approaches

1. **The backend answers the athletes of a story with what the column shows** (chosen). `GET /articles/:id` adds `country_code`, `image` (the first photo) and `medals` to each athlete of `related_athletes_map`. One request, as today.
2. **The web asks `/medals` once per athlete.** No backend change, but eight more requests for a story with eight athletes, and still no photo or country.

The change is made on the new backend only (`migration`), so it isn't written twice.

## Design

**Backend.** Each athlete of `related_athletes_map` comes with `country_code`, `image` and `medals`: `{ meeting_id, medal, event: { id, name, rank } }` for places 1–3 at the editions in `related_meetings`, without withdrawn medals, ordered by edition, place and event rank. A story that names no edition answers empty lists.

**Web.**

- `ArticleDetail.related.meetings` gains `city`; `athletes` become `StoryAthlete`: an `AthleteRef` with `image` and `medals` (`{ place, event }`). The DTO reads `image` and `medals` as optional.
- `RelatedTopics.svelte` renders:
  - each edition as a row with its name, its city and an arrow (the name already holds the year), linking to the edition;
  - a championship only when none of the story's editions belongs to it;
  - each athlete as a row with portrait, flag, name and, where there are medals, a line of medal discs with their events;
  - countries as flag chips, as before.
- A story without an edition shows its athletes without a medal line.

## Release

The web change can be merged before the backend cutover: against the legacy backend the athletes show initials and a name. The backend change reaches production with the merge of `migration`.
