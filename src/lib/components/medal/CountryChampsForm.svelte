<script lang="ts">
	import {
		champsFor,
		countriesFor,
		type FilterChamp,
		type FilterCountry
	} from '#lib/domain/medal-search.js';
	import { PAGES } from '#lib/routing/urls.js';

	let {
		champs,
		countries,
		champId,
		countryCode
	}: {
		champs: FilterChamp[];
		countries: FilterCountry[];
		champId: number | null;
		countryCode: string | null;
	} = $props();

	let champ = $derived(champId ? String(champId) : '');
	let country = $derived(countryCode ?? '');

	const selectedChamp = $derived(champs.find((item) => String(item.id) === champ));
	const selectedCountry = $derived(countries.find((item) => item.code === country));
	const SELECT =
		'h-12 w-full rounded-xl border border-line-2 bg-surface px-3 text-[15px] font-semibold';
</script>

<form
	method="get"
	action={PAGES.medalCountdown}
	class="grid grid-cols-1 items-end gap-3 rounded-[20px] border border-line bg-surface p-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto]"
>
	<label class="flex flex-col gap-1.5">
		<span class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">Country</span>
		<select name="country" required bind:value={country} class={SELECT}>
			<option value="">Select a country</option>
			{#each countriesFor(selectedChamp, countries) as item (item.code)}
				<option value={item.code}>{item.name} ({item.code})</option>
			{/each}
		</select>
	</label>
	<span class="hidden pb-3 text-center font-display text-2xl font-bold text-ink-3 md:block">×</span>
	<label class="flex flex-col gap-1.5">
		<span class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">Championship</span>
		<select name="champ" required bind:value={champ} class={SELECT}>
			<option value="">Select a championship</option>
			{#each champsFor(selectedCountry, champs) as item (item.id)}
				<option value={String(item.id)}>{item.name}</option>
			{/each}
		</select>
	</label>
	<button
		type="submit"
		disabled={!champ || !country}
		class="h-12 rounded-xl bg-ink px-6 text-[15px] font-bold text-bg hover:opacity-90 disabled:opacity-40"
	>
		Show medals
	</button>
</form>
