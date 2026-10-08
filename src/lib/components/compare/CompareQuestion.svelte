<script lang="ts">
	import { goto } from '$app/navigation';
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import SwapIcon from '#lib/components/ui/icons/SwapIcon.svelte';
	import {
		parseRace,
		raceName,
		racesFor,
		raceValue,
		type CompareQuery
	} from '#lib/domain/compare.js';
	import { GENDER_LABELS } from '#lib/domain/edition.js';
	import type { CatalogueEvent } from '#lib/domain/event.js';
	import type { FilterChamp } from '#lib/domain/medal-search.js';
	import { compareUrl, PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		events
	}: { query: CompareQuery; champs: FilterChamp[]; events: CatalogueEvent[] } = $props();

	const champA = $derived(champs.find((champ) => champ.id === query.a));
	const champB = $derived(champs.find((champ) => champ.id === query.b));
	const event = $derived(events.find((item) => item.id === query.event));
	const races = $derived(
		racesFor(
			[champA, champB].filter((champ) => !!champ),
			events
		)
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

	const CHIP =
		'relative inline-flex h-11 max-w-full items-center gap-2 rounded-xl border-2 px-3 text-[20px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-ink sm:h-[50px] sm:text-[26px]';
	const MENU = 'absolute inset-0 cursor-pointer opacity-0 disabled:cursor-default';
</script>

{#snippet face(text: string)}
	<span class="truncate">{text}</span>
	<ChevronDownIcon class="size-3.5 shrink-0" />
{/snippet}

<form
	method="get"
	action={PAGES.compare}
	class="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[24px] leading-[1.3] font-bold sm:text-[34px]"
>
	<span>Compare</span>
	<label class="{CHIP} border-brand bg-brand text-ink hover:bg-brand/85">
		{@render face(champA?.name ?? 'a championship')}
		<select
			name="a"
			aria-label="Championship A"
			class={MENU}
			onchange={(change) => choose({ a: number(change.currentTarget.value) })}
		>
			<option value="">a championship</option>
			{#each champs as champ (champ.id)}
				{#if champ.id !== query.b}
					<option value={champ.id} selected={champ.id === query.a}>{champ.name}</option>
				{/if}
			{/each}
		</select>
	</label>
	<a
		href={compareUrl({ ...query, a: query.b, b: query.a })}
		aria-label="Swap championships"
		data-sveltekit-noscroll
		class="grid size-11 shrink-0 place-items-center rounded-full border border-line-2 bg-bg hover:border-ink"
	>
		<SwapIcon />
	</a>
	<label class="{CHIP} border-ink bg-ink text-bg hover:bg-ink/85">
		{@render face(champB?.name ?? 'another championship')}
		<select
			name="b"
			aria-label="Championship B"
			class={MENU}
			onchange={(change) => choose({ b: number(change.currentTarget.value) })}
		>
			<option value="">another championship</option>
			{#each champs as champ (champ.id)}
				{#if champ.id !== query.a}
					<option value={champ.id} selected={champ.id === query.b}>{champ.name}</option>
				{/if}
			{/each}
		</select>
	</label>
	<span class="text-ink-3">in</span>
	<label class="{CHIP} border-ink bg-bg hover:bg-brand-soft has-disabled:opacity-50">
		{@render face(event && query.gender ? raceName(query.gender, event.name) : 'an event')}
		<select
			name="race"
			aria-label="Event"
			disabled={!races.length}
			class={MENU}
			onchange={(change) => choose(parseRace(change.currentTarget.value) ?? { event: null })}
		>
			<option value="">an event</option>
			{#each races as group (group.gender)}
				<optgroup label={GENDER_LABELS[group.gender]}>
					{#each group.events as item (item.id)}
						<option
							value={raceValue(group.gender, item.id)}
							selected={group.gender === query.gender && item.id === query.event}
							>{raceName(group.gender, item.name)}</option
						>
					{/each}
				</optgroup>
			{/each}
		</select>
	</label>
	<noscript>
		<button type="submit" class="h-11 rounded-xl bg-ink px-4 text-lg text-bg">Compare</button>
	</noscript>
</form>
