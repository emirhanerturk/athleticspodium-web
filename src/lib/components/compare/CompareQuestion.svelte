<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import ShareLink from '#lib/components/tools/ShareLink.svelte';
	import SwapIcon from '#lib/components/ui/icons/SwapIcon.svelte';
	import Picker from '#lib/components/ui/Picker.svelte';
	import {
		parseRace,
		raceName,
		racesFor,
		raceValue,
		type CompareQuery
	} from '#lib/domain/compare.js';
	import { GENDER_LABELS, type Gender } from '#lib/domain/edition.js';
	import type { CatalogueEvent } from '#lib/domain/event.js';
	import type { FilterChamp } from '#lib/domain/medal-search.js';
	import { champPicks, eventPicks } from '#lib/domain/pick-list.js';
	import { compareUrl, PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		events
	}: { query: CompareQuery; champs: FilterChamp[]; events: CatalogueEvent[] } = $props();

	const champA = $derived(champs.find((champ) => champ.id === query.a));
	const champB = $derived(champs.find((champ) => champ.id === query.b));
	const event = $derived(events.find((item) => item.id === query.event));
	const shareUrl = $derived(
		champA && champB && event && query.gender ? new URL(compareUrl(query), PUBLIC_SITE_URL) : null
	);
	const races = $derived(
		racesFor(
			[champA, champB].filter((champ) => !!champ),
			events
		)
	);

	let raceTab = $derived<Gender>(query.gender ?? 'men');
	const shownRaces = $derived(races.find((group) => group.gender === raceTab) ?? races[0]);
	const raceFallback = $derived(
		races.map((group) => ({
			label: GENDER_LABELS[group.gender],
			options: group.events.map((item) => ({
				value: raceValue(group.gender, item.id),
				label: raceName(group.gender, item.name)
			}))
		}))
	);

	const number = (value: string) => (value ? Number(value) : null);

	function choose(change: Partial<CompareQuery>) {
		const next = { ...query, ...change };
		const chosen = champs.filter((champ) => champ.id === next.a || champ.id === next.b);
		const held = racesFor(chosen, events).some(
			(group) => group.gender === next.gender && group.events.some((item) => item.id === next.event)
		);
		goto(compareUrl(held ? next : { ...next, gender: null, event: null }), { reset: false });
	}
</script>

<form
	method="get"
	action={PAGES.compare}
	class="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[24px] leading-[1.3] font-bold sm:text-[34px]"
>
	<span>Compare</span>
	<Picker
		label="Championship A"
		name="a"
		value={query.a ? String(query.a) : ''}
		text={champA?.name ?? 'a championship'}
		placeholder="Search championships"
		groups={champPicks(champs.filter((champ) => champ.id !== query.b))}
		class="border-brand bg-brand text-ink hover:bg-brand/85"
		onchoose={(id) => choose({ a: number(id) })}
	/>
	<a
		href={compareUrl({ ...query, a: query.b, b: query.a })}
		aria-label="Swap championships"
		data-sveltekit-reset="false"
		class="grid size-11 shrink-0 place-items-center rounded-full border border-line-2 bg-bg hover:border-ink"
	>
		<SwapIcon />
	</a>
	<Picker
		label="Championship B"
		name="b"
		value={query.b ? String(query.b) : ''}
		text={champB?.name ?? 'another championship'}
		placeholder="Search championships"
		groups={champPicks(champs.filter((champ) => champ.id !== query.a))}
		class="border-ink bg-ink text-bg hover:bg-ink/85"
		onchoose={(id) => choose({ b: number(id) })}
	/>
	<span class="text-ink-3">in</span>
	<Picker
		label="Event"
		name="race"
		value={query.gender && query.event ? raceValue(query.gender, query.event) : ''}
		text={event && query.gender ? raceName(query.gender, event.name) : 'an event'}
		placeholder="Search events"
		groups={shownRaces
			? eventPicks(shownRaces.events, (item) => raceValue(shownRaces.gender, item.id))
			: []}
		fallback={raceFallback}
		tabs={races.map((group) => ({ value: group.gender, label: GENDER_LABELS[group.gender] }))}
		tab={shownRaces?.gender}
		ontab={(gender) => (raceTab = gender as Gender)}
		disabled={!races.length}
		onchoose={(value) => choose(parseRace(value) ?? { event: null })}
	/>
	<noscript>
		<button type="submit" class="h-11 rounded-xl bg-ink px-4 text-lg text-bg">Compare</button>
	</noscript>
</form>
{#if shareUrl}
	<p class="mt-4 flex flex-wrap items-center gap-2.5 text-[13.5px] text-ink-3">
		<span>The link is shareable:</span>
		<ShareLink url={shareUrl} />
	</p>
{/if}
