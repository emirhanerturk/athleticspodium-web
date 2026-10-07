<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import SeasonCalendar from '#lib/components/calendar/SeasonCalendar.svelte';
	import UpNextCard from '#lib/components/calendar/UpNextCard.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { calendarUrl } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const path = $derived(calendarUrl(data.season));
	const seasons = $derived(
		Array.from({ length: 8 }, (_, index) => data.season + 3 - index).filter(
			(season) =>
				(data.previousSeason === null ? season >= data.season : true) &&
				(data.nextSeason === null ? season <= data.season : true)
		)
	);
	const LEGEND = [
		{
			label: 'Results',
			note: 'held, podiums are in the archive',
			style: 'bg-surface-2 text-ink-2'
		},
		{ label: 'in 24 days', note: 'upcoming', style: 'border border-up text-up' },
		{
			label: 'TBA',
			note: 'host known, dates not yet',
			style: 'border border-dashed border-line-2 text-ink-3'
		}
	];
</script>

<SeoHead
	title="Athletics calendar {data.season} – every championship"
	description="Every athletics championship of {data.season}: dates, host cities, levels and results, from global and continental championships to road races."
	{path}
	fallbackImage="calendar"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: `Calendar ${data.season}`, path }])]} />

<SeasonCalendar
	year={data.season}
	meetings={data.meetings}
	today={data.today}
	currentYear={data.year}
	previousYear={data.previousSeason}
	nextYear={data.nextSeason}
>
	{#snippet aside()}
		<UpNextCard meetings={data.upNext} today={data.today} />
		<nav
			aria-labelledby="seasons"
			class="flex flex-col gap-2.5 rounded-[20px] bg-surface-2 px-5 py-[18px]"
		>
			<h2 id="seasons" class="text-sm font-bold">Every season</h2>
			<ul class="grid grid-cols-4 gap-1.5">
				{#each seasons as season (season)}
					<li>
						<a
							href={calendarUrl(season)}
							aria-current={season === data.season ? 'page' : undefined}
							class="grid h-[34px] place-items-center rounded-lg border font-data text-[14.5px] font-semibold hover:border-ink {season ===
							data.season
								? 'border-ink bg-ink text-bg'
								: 'border-line bg-surface'}"
						>
							{season}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<ul class="flex flex-col gap-2 px-1 pt-1 text-[12.5px] text-ink-3">
			{#each LEGEND as item (item.label)}
				<li class="flex items-center gap-2">
					<span class="inline-flex h-5 items-center rounded-[10px] px-2 font-bold {item.style}"
						>{item.label}</span
					>
					{item.note}
				</li>
			{/each}
		</ul>
	{/snippet}
</SeasonCalendar>
