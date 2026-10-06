<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import { areaName, LEVEL_LABELS, levelOf } from '#lib/domain/championship.js';
	import type { SearchAthlete, SearchChamp, SearchCountry, TopResult } from '#lib/domain/search.js';
	import { athleteUrl, champUrl, countryUrl } from '#lib/routing/urls.js';

	let { result }: { result: NonNullable<TopResult<SearchAthlete, SearchChamp, SearchCountry>> } =
		$props();

	const CARD = 'rounded-3xl bg-ink text-night-ink hover:shadow-[0_0_0_3px_var(--color-brand)]';
	const KICKER = 'font-data text-xs tracking-[0.14em] text-brand uppercase';
	const TITLE = 'font-display text-[44px] leading-[0.94] font-bold sm:text-[60px]';
</script>

{#if result.kind === 'athlete'}
	{@const athlete = result.item}
	<a
		href={athleteUrl(athlete)}
		class="grid overflow-hidden sm:grid-cols-[220px_minmax(0,1fr)] {CARD}"
	>
		{#if athlete.image}
			<MediaImage
				image={athlete.image}
				alt=""
				width={440}
				height={520}
				class="block h-full min-h-[220px] w-full object-cover object-top sm:min-h-[260px]"
			/>
		{:else}
			<span class="hidden bg-night-surface sm:block"></span>
		{/if}
		<span class="flex flex-col gap-3.5 px-7 py-[26px]">
			<span class="flex items-center gap-2.5 {KICKER}">
				Top result · Athlete
				{#if athlete.olympian}
					<span
						class="inline-flex h-5 items-center rounded-full border border-brand px-[7px] tracking-[0.08em]"
						>Olympian</span
					>
				{/if}
			</span>
			<strong class={TITLE}>{fullName(athlete)}</strong>
			<span class="flex flex-wrap items-center gap-2.5 text-[14.5px] text-night-ink-3">
				{#if athlete.countryCode}<Flag code={athlete.countryCode} class="h-[18px] w-6" />{/if}
				{[
					athlete.countryCode,
					athlete.birthDate && `born ${athlete.birthDate.slice(0, 4)}`,
					...athlete.events.slice(0, 2)
				]
					.filter(Boolean)
					.join(' · ')}
			</span>
			<span
				class="mt-auto flex items-center gap-[18px] border-t border-night-line-2 pt-3.5 font-data text-[15.5px]"
			>
				<span class="inline-flex items-center gap-1.5"
					><span class="size-3 rounded-full bg-gold"></span><strong>{athlete.medals.gold}</strong
					></span
				>
				<span class="inline-flex items-center gap-1.5"
					><span class="size-3 rounded-full bg-silver"></span>{athlete.medals.silver}</span
				>
				<span class="inline-flex items-center gap-1.5"
					><span class="size-3 rounded-full bg-bronze"></span>{athlete.medals.bronze}</span
				>
				<span class="flex-1"></span>
				<span class="font-text text-sm font-bold text-brand">Open profile →</span>
			</span>
		</span>
	</a>
{:else if result.kind === 'champ'}
	{@const champ = result.item}
	<a href={champUrl(champ.slug)} class="flex min-h-[220px] flex-col justify-end gap-3 p-7 {CARD}">
		<span class={KICKER}>Top result · Championship</span>
		<strong class={TITLE}>{champ.name}</strong>
		<span class="flex flex-wrap gap-[18px] text-[14.5px] text-night-ink-2">
			<span>{areaName(champ.category)} · {LEVEL_LABELS[levelOf(champ.category)]}</span>
			<span class="font-bold text-brand">Open championship →</span>
		</span>
	</a>
{:else}
	{@const country = result.item}
	<a
		href={countryUrl(country.code)}
		class="flex flex-wrap items-center gap-7 px-7 py-[26px] {CARD}"
	>
		<Flag code={country.code} class="h-[100px] w-[150px] rounded-[10px]" />
		<span class="flex min-w-0 flex-1 flex-col gap-2.5">
			<span class={KICKER}
				>Top result · {country.isCountry ? 'Country' : 'Team'} · {country.code}</span
			>
			<strong class={TITLE}>{country.name}</strong>
		</span>
		<span class="text-sm font-bold text-brand">Open country →</span>
	</a>
{/if}
