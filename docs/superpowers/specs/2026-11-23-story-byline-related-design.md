# Story page: byline, reading time and related stories

- **Date:** 2026-11-23
- **Status:** Approved by the owner on 2026-11-23 (the two items); the calls below are the builder's
- **Projects:** `athleticspodium-web`, `athleticspodium-backend` (`feat/related-stories`, on the `migration` branch)

## Intent

A story's header showed only its dates, and "More stories" showed the same three latest stories under every story. The header now names the writer and the reading time, and the stories below are the ones closest to the story.

## Byline

Stories are entered by one or two accounts whoever wrote them, so the account is not the author. The editors write the author as the first paragraph of the text, a bold or italic "By <name>" (143 of 349 published stories on 2026-11-23, guests included).

- `splitByline` in `lib/domain/article.ts` lifts that paragraph out of the text: the page shows "By <name>" in the header and the text without it. A first paragraph that isn't bold or italic, or that goes on after the name, stays in the text.
- A story without such a paragraph shows no byline.
- The Article JSON-LD names a `Person` for a signed story, and the site as before for the desk ("Athleticspodium.com", "Editorial - Athleticspodium.com") or no byline.

**Not chosen:** the account's name as the author. It would sign guests' stories with the editor who entered them.

## Reading time

The words of the text at 220 a minute, rounded, one minute at least, shown as "N min read" after the dates.

## Related stories

`GET /articles?related_to=<id>` (new backend) leaves the story out and orders the rest by what they share with it: an edition counts 4, an athlete 2, a championship 1, the latest first among equals. Countries don't count: most stories of a large country share nothing else. Stories that share nothing follow, the latest first, so the three cards always fill.

The web asks for one more story than it shows and drops the story itself, because the legacy backend ignores the parameter and answers the latest stories, the story among them. The section keeps its "More stories" title, since the cards may be unrelated.

**Not chosen:** a route of its own (`/articles/:id/related`), which the legacy backend would answer with a 404.
