<script lang="ts">
	import type { CompareQuery } from '#lib/domain/compare.js';
	import { GENDER_LABELS, type Gender } from '#lib/domain/edition.js';
	import { describeEvent, type CatalogueEvent } from '#lib/domain/event.js';
	import { eventsFor, type FilterChamp } from '#lib/domain/medal-search.js';
	import { PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		events
	}: { query: CompareQuery; champs: FilterChamp[]; events: CatalogueEvent[] } = $props();

	let a = $derived(query.a ? String(query.a) : '');
	let b = $derived(query.b ? String(query.b) : '');
	let gender = $derived<string>(query.gender ?? 'men');

	const champA = $derived(champs.find((champ) => String(champ.id) === a));
	const champB = $derived(champs.find((champ) => String(champ.id) === b));
	const options = $derived.by(() => {
		const genderKey = gender as Gender;
		const ids = new Set([
			...eventsFor(champA, genderKey, champA ? events : []).map((event) => event.id),
			...eventsFor(champB, genderKey, champB ? events : []).map((event) => event.id)
		]);
		return events.filter((event) => ids.has(event.id));
	});

	const LABEL = 'font-data text-xs tracking-[0.12em] text-ink-3 uppercase';
	const SELECT =
		'h-12 w-full rounded-xl border border-line-2 bg-surface px-3 text-[15px] font-semibold';
</script>

<form
	method="get"
	action={PAGES.compare}
	class="grid grid-cols-1 items-end gap-3 rounded-[20px] border border-line bg-surface p-5 md:grid-cols-[minmax(0,2fr)_auto_minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_auto]"
>
	<label class="flex flex-col gap-1.5">
		<span class={LABEL}>Championship A</span>
		<select name="a" required bind:value={a} class={SELECT}>
			<option value="">Select a championship</option>
			{#each champs as champ (champ.id)}<option value={String(champ.id)}>{champ.name}</option
				>{/each}
		</select>
	</label>
	<span class="hidden pb-3 text-center font-display text-xl font-bold text-ink-3 md:block">vs</span>
	<label class="flex flex-col gap-1.5">
		<span class={LABEL}>Championship B</span>
		<select name="b" required bind:value={b} class={SELECT}>
			<option value="">Select a championship</option>
			{#each champs as champ (champ.id)}<option value={String(champ.id)}>{champ.name}</option
				>{/each}
		</select>
	</label>
	<label class="flex flex-col gap-1.5">
		<span class={LABEL}>Gender</span>
		<select name="gender" bind:value={gender} class={SELECT}>
			{#each Object.entries(GENDER_LABELS) as [value, label] (value)}<option {value}>{label}</option
				>{/each}
		</select>
	</label>
	<label class="flex flex-col gap-1.5">
		<span class={LABEL}>Event</span>
		<select
			name="event"
			required
			disabled={!champA && !champB}
			class="{SELECT} disabled:opacity-50"
		>
			<option value="">Select an event</option>
			{#each options as event (event.id)}
				<option value={String(event.id)} selected={event.id === query.event}
					>{describeEvent(event.name).longName}</option
				>
			{/each}
		</select>
	</label>
	<button
		type="submit"
		class="h-12 rounded-xl bg-ink px-6 text-[15px] font-bold text-bg hover:opacity-90"
	>
		Compare
	</button>
</form>
