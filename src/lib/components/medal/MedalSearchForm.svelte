<script lang="ts">
	import type { Gender } from '#lib/domain/edition.js';
	import type { CatalogueEvent } from '#lib/domain/event.js';
	import { describeEvent } from '#lib/domain/event.js';
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
	import { PAGES } from '#lib/routing/urls.js';

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

	const GENDERS: { value: Gender; label: string }[] = [
		{ value: 'men', label: 'Men' },
		{ value: 'women', label: 'Women' },
		{ value: 'mixed', label: 'Mixed' }
	];
	const MEDALS = [
		{ value: 1, label: 'Gold' },
		{ value: 2, label: 'Silver' },
		{ value: 3, label: 'Bronze' }
	];

	let champ = $derived(query.champ ? String(query.champ) : '');
	let country = $derived(query.country ?? '');
	let gender = $derived(query.gender ? String(GENDER_CODES[query.gender]) : '');
	let missing = $state(false);

	const selectedChamp = $derived(champs.find((item) => String(item.id) === champ));
	const selectedCountry = $derived(countries.find((item) => item.code === country));
	const genderKey = $derived(
		GENDERS.find((item) => String(GENDER_CODES[item.value]) === gender)?.value ?? null
	);

	function validate(event: SubmitEvent) {
		missing = !champ && !country;
		if (missing) event.preventDefault();
	}

	const FIELD = 'flex flex-col gap-1.5';
	const LABEL = 'font-data text-xs tracking-[0.12em] text-ink-3 uppercase';
	const SELECT =
		'h-11 w-full rounded-xl border border-line-2 bg-surface px-3 text-[15px] font-semibold';
</script>

<form
	method="get"
	action={PAGES.medalSearch}
	onsubmit={validate}
	class="grid grid-cols-1 gap-4 rounded-[20px] border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr_auto] lg:items-end"
>
	<label class={FIELD}>
		<span class={LABEL}>Championship{champ || country ? '' : ' *'}</span>
		<select name="champs" bind:value={champ} class={SELECT}>
			<option value="">All championships</option>
			{#each champsFor(selectedCountry, champs) as item (item.id)}
				<option value={String(item.id)}>{item.name}</option>
			{/each}
		</select>
	</label>
	<label class={FIELD}>
		<span class={LABEL}>Country{champ || country ? '' : ' *'}</span>
		<select name="country" bind:value={country} class={SELECT}>
			<option value="">All countries</option>
			{#each countriesFor(selectedChamp, countries) as item (item.code)}
				<option value={item.code}>{item.name} ({item.code})</option>
			{/each}
		</select>
	</label>
	<label class={FIELD}>
		<span class={LABEL}>Event</span>
		<select name="event" class={SELECT}>
			<option value="">All events</option>
			{#each eventsFor(selectedChamp, genderKey, events) as item (item.id)}
				<option value={String(item.id)} selected={item.id === query.event}
					>{describeEvent(item.name).longName}</option
				>
			{/each}
		</select>
	</label>
	<label class={FIELD}>
		<span class={LABEL}>Year</span>
		<select name="year" class={SELECT}>
			<option value="">All</option>
			{#each yearsFor(selectedChamp, currentYear) as year (year)}
				<option value={String(year)} selected={year === query.year}>{year}</option>
			{/each}
		</select>
	</label>
	<label class={FIELD}>
		<span class={LABEL}>Gender</span>
		<select name="gender" bind:value={gender} class={SELECT}>
			<option value="">All</option>
			{#each GENDERS as item (item.value)}
				<option value={String(GENDER_CODES[item.value])}>{item.label}</option>
			{/each}
		</select>
	</label>
	<label class={FIELD}>
		<span class={LABEL}>Medal</span>
		<select name="medal" class={SELECT}>
			<option value="">All</option>
			{#each MEDALS as item (item.value)}
				<option value={String(item.value)} selected={item.value === query.medal}
					>{item.label}</option
				>
			{/each}
		</select>
	</label>
	<button
		type="submit"
		class="h-11 rounded-xl bg-ink px-5 text-[15px] font-bold text-bg hover:opacity-90"
	>
		Search
	</button>
	{#if missing}
		<p role="alert" class="text-sm font-semibold text-dq sm:col-span-2 lg:col-span-7">
			Pick a championship or a country.
		</p>
	{/if}
</form>
