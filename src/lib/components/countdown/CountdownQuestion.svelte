<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import Flag from '#lib/components/ui/Flag.svelte';
	import Picker from '#lib/components/ui/Picker.svelte';
	import { COUNTDOWN_PRESETS, type CountdownQuery } from '#lib/domain/countdown.js';
	import { champPicks, nationPicks } from '#lib/domain/pick-list.js';
	import {
		champsFor,
		countriesFor,
		type FilterChamp,
		type FilterCountry
	} from '#lib/domain/medal-search.js';
	import { medalCountdownUrl, PAGES } from '#lib/routing/urls.js';

	let {
		query,
		champs,
		countries
	}: { query: CountdownQuery; champs: FilterChamp[]; countries: FilterCountry[] } = $props();

	const champ = $derived(champs.find((item) => item.id === query.champ));
	const country = $derived(countries.find((item) => item.code === query.country));
	const presets = $derived(
		COUNTDOWN_PRESETS.flatMap((preset) => {
			const presetChamp = champs.find((item) => item.id === preset.champ);
			const presetCountry = countries.find((item) => item.code === preset.country);
			const current = preset.champ === query.champ && preset.country === query.country;
			return presetChamp && presetCountry && !current
				? [{ ...preset, label: `${presetCountry.name} · ${presetChamp.name}` }]
				: [];
		})
	);
	const shareUrl = $derived(
		query.country && query.champ
			? new URL(medalCountdownUrl(query.country, query.champ), PUBLIC_SITE_URL)
			: null
	);

	function choose(next: CountdownQuery) {
		const nextCountry = countries.find((item) => item.code === next.country);
		const nextChamp = champs.find((item) => item.id === next.champ);
		const eligible =
			!nextCountry || !nextChamp || champsFor(nextCountry, champs).includes(nextChamp);
		goto(medalCountdownUrl(next.country, eligible ? next.champ : null), { reset: false });
	}
</script>

<form
	method="get"
	action={PAGES.medalCountdown}
	class="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-display text-[24px] leading-[1.3] font-bold sm:text-[34px]"
>
	<span>Count</span>
	<Picker
		label="Nation"
		name="country"
		value={query.country ?? ''}
		text={country?.name ?? 'a nation'}
		flag={country?.code}
		placeholder="Search nations or codes"
		groups={nationPicks(countriesFor(champ, countries))}
		onchoose={(code) => choose({ ...query, country: code || null })}
	/>
	<span class="text-ink-3">’s medals at every</span>
	<Picker
		label="Championship"
		name="champ"
		value={query.champ ? String(query.champ) : ''}
		text={champ?.name ?? 'championship'}
		placeholder="Search championships"
		groups={champPicks(champsFor(country, champs))}
		class="border-brand bg-brand text-ink hover:bg-brand/85"
		onchoose={(id) => choose({ ...query, champ: Number(id) || null })}
	/>
	<noscript>
		<button type="submit" class="h-11 rounded-xl bg-ink px-4 text-lg text-bg">Count</button>
	</noscript>
</form>
<div class="mt-4 flex flex-wrap items-center gap-2">
	<span class="text-[13px] text-ink-3">Also try</span>
	{#each presets as preset (preset.label)}
		<a
			href={medalCountdownUrl(preset.country, preset.champ)}
			class="inline-flex h-[30px] items-center gap-[7px] rounded-full border border-line-2 bg-bg pr-3 pl-1.5 text-[13.5px] font-semibold hover:border-ink"
		>
			<Flag code={preset.country} class="h-[13.5px] w-[18px]" />{preset.label}
		</a>
	{/each}
	{#if shareUrl}
		<code
			class="rounded-md bg-surface-2 px-2 py-[3px] font-data text-[13px] break-all text-ink-2 sm:ml-auto"
		>
			{shareUrl.host}{shareUrl.pathname}{shareUrl.search}
		</code>
	{/if}
</div>
