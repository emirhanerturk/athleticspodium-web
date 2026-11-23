# Story page: athlete links in the text and share buttons

- **Date:** 2026-11-23
- **Status:** Approved by the owner on 2026-11-23 (the two items); the calls below are the builder's
- **Project:** `athleticspodium-web` only; neither item needs the backend

## Athlete links

The text of a story names the athletes the editors related to it, as plain text. `linkNames` in `lib/utils/link-names.ts` links the first mention of each to the athlete's page; `parseArticleDetail` applies it after the byline is lifted out.

- Only the story's related athletes are linked, by their whole name: at least two words, whatever the case or the spacing, never part of a longer word. A surname alone is not linked.
- Text inside a link, a heading or a caption is left alone, and each athlete is linked once.
- Where one name holds another, the longer takes the mention.
- No accent folding: the database writes "Tero Pitkamaki" where a story writes "Pitkämäki", and such a mention stays plain. On 2026-11-23 the rule links 915 of the 1,167 athletes related to published stories; folding would add about 37.

**Not chosen:** links written by the editors in the CMS (work for every story, old ones included), and matching surnames (wrong athletes among namesakes).

## Share buttons

`ShareStory.svelte` sits at the right of the byline row, in line with the photo's edge, as two round icon buttons: "Copy link" writes the story's address to the clipboard, turns to a check on the brand colour and says "Link copied" for two seconds, and "Share" opens the device's share sheet where the browser has one. No network buttons and no package.
