<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { describeEvent, type CatalogueEvent } from '#lib/domain/event.js';
	import {
		champsFor,
		countriesFor,
		eventsFor,
		GENDER_CODES,
		yearsFor,
		type FilterChamp,
		type FilterCountry,
		type MedalQuery
	} from '#lib/domain/medal-search.js';
	import { medalSearchUrl, PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		countries,
		events,
		currentYear
	}: {
		query: MedalQuery;
		champs: FilterChamp[];
		countries: FilterCountry[];
		events: CatalogueEvent[];
		currentYear: number;
	} = $props();

	const champ = $derived(champs.find((item) => item.id === query.champ));
	const country = $derived(countries.find((item) => item.code === query.country));
	const event = $derived(events.find((item) => item.id === query.event));
	const shareUrl = $derived(new URL(medalSearchUrl(query), PUBLIC_SITE_URL));

	const number = (value: string) => (value ? Number(value) : null);

	function choose(change: Partial<MedalQuery>) {
		goto(medalSearchUrl({ ...query, ...change, page: 1 }), { reset: false });
	}

	function chooseChamp(id: number | null) {
		const next = champs.find((item) => item.id === id);
		const keepsEvent = eventsFor(next, query.gender, events).some(
			(item) => item.id === query.event
		);
		const keepsYear = !query.year || yearsFor(next, currentYear).includes(query.year);
		choose({
			champ: id,
			event: keepsEvent ? query.event : null,
			year: keepsYear ? query.year : null
		});
	}

	const CHIP =
		'relative inline-flex h-11 max-w-full items-center gap-2 rounded-xl border-2 border-ink bg-bg pr-3 pl-2.5 text-[20px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-ink hover:bg-brand-soft sm:text-[26px]';
	const MENU = 'absolute inset-0 cursor-pointer opacity-0';
</script>

{#snippet face(text: string, flag?: string)}
	{#if flag}<Flag code={flag} class="h-[21px] w-7 rounded-[3px]" />{/if}
	<span class="truncate">{text}</span>
	<ChevronDownIcon class="size-3.5 shrink-0" />
{/snippet}

<form
	method="get"
	action={PAGES.medalSearch}
	class="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[24px] leading-[1.3] font-bold sm:text-[30px]"
>
	{#if query.medal}<input type="hidden" name="medal" value={query.medal} />{/if}
	{#if query.gender}<input type="hidden" name="gender" value={GENDER_CODES[query.gender]} />{/if}
	<span>Show medals</span>
	<span class="text-ink-3">won by</span>
	<label class={CHIP}>
		{@render face(country?.name ?? 'any nation', country?.code)}
		<select
			name="country"
			aria-label="Nation"
			class={MENU}
			onchange={(change) => choose({ country: change.currentTarget.value || null })}
		>
			<option value="">any nation</option>
			{#each countriesFor(champ, countries) as item (item.code)}
				<option value={item.code} selected={item.code === query.country}>{item.name}</option>
			{/each}
		</select>
	</label>
	<span class="text-ink-3">at the</span>
	<label class={CHIP}>
		{@render face(champ?.name ?? 'any championship')}
		<select
			name="champs"
			aria-label="Championship"
			class={MENU}
			onchange={(change) => chooseChamp(number(change.currentTarget.value))}
		>
			<option value="">any championship</option>
			{#each champsFor(country, champs) as item (item.id)}
				<option value={item.id} selected={item.id === query.champ}>{item.name}</option>
			{/each}
		</select>
	</label>
	<span class="text-ink-3">in</span>
	<label class={CHIP}>
		{@render face(event ? describeEvent(event.name).longName : 'any event')}
		<select
			name="event"
			aria-label="Event"
			class={MENU}
			onchange={(change) => choose({ event: number(change.currentTarget.value) })}
		>
			<option value="">any event</option>
			{#each eventsFor(champ, query.gender, events) as item (item.id)}
				<option value={item.id} selected={item.id === query.event}
					>{describeEvent(item.name).longName}</option
				>
			{/each}
		</select>
	</label>
	<span class="text-ink-3">·</span>
	<label class={CHIP}>
		{@render face(query.year ? String(query.year) : 'all years')}
		<select
			name="year"
			aria-label="Year"
			class={MENU}
			onchange={(change) => choose({ year: number(change.currentTarget.value) })}
		>
			<option value="">all years</option>
			{#each yearsFor(champ, currentYear) as year (year)}
				<option value={year} selected={year === query.year}>{year}</option>
			{/each}
		</select>
	</label>
	<noscript>
		<button type="submit" class="h-11 rounded-xl bg-ink px-4 text-lg text-bg">Show</button>
	</noscript>
</form>
<p class="mt-4 flex flex-wrap items-center gap-2.5 text-[13.5px] text-ink-3">
	<span
		>Each box is a menu — the sentence rewrites itself as you change it. The link is shareable:</span
	>
	<code class="rounded-md bg-surface-2 px-2 py-[3px] font-data text-[13px] break-all text-ink-2">
		{shareUrl.host}{shareUrl.pathname}{shareUrl.search}
	</code>
</p>
