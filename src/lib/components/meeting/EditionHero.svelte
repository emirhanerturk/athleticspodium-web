<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { areaName, LEVEL_LABELS, levelOf } from '#lib/domain/championship.js';
	import { yearOf } from '#lib/domain/date.js';
	import type { EditionMeeting, EditionStats } from '#lib/domain/edition.js';
	import { formatDateRange } from '#lib/format/date.js';
	import { formatCount } from '#lib/format/number.js';

	let {
		meeting,
		firstYear,
		stats
	}: { meeting: EditionMeeting; firstYear: number | null; stats: EditionStats } = $props();

	const place = $derived([meeting.city, meeting.country?.name].filter(Boolean).join(', '));
	const dates = $derived(
		meeting.startDate
			? `${formatDateRange(meeting.startDate, meeting.endDate)} ${yearOf(meeting.endDate ?? meeting.startDate)}`
			: null
	);
	const level = $derived(LEVEL_LABELS[levelOf(meeting.champ.category)]);
	const figures = $derived([
		{ value: stats.events, label: stats.events === 1 ? 'event' : 'events' },
		{ value: stats.medals, label: 'medals awarded' },
		{ value: stats.nations, label: 'nations on the podium' },
		{
			value: stats.worldRecords,
			label: stats.worldRecords === 1 ? 'world record' : 'world records'
		}
	]);
</script>

<section class="page-container pt-7 pb-10">
	<div class="flex max-w-[900px] flex-col gap-5">
		<span
			class="inline-flex items-center gap-2.5 font-data text-xs tracking-[0.14em] text-ink-3 uppercase"
		>
			<span class="rounded-[5px] bg-brand-soft px-2 py-[3px] font-bold text-brand-ink">
				{areaName(meeting.champ.category)}
			</span>
			{level} championships{#if firstYear}&nbsp;· since {firstYear}{/if}
		</span>
		<h1 class="font-display text-[52px] leading-[0.94] font-bold text-balance sm:text-[84px]">
			{meeting.name}
		</h1>
		<div class="flex flex-wrap items-center gap-x-[22px] gap-y-2.5 text-base text-ink-2">
			{#if place}
				<span class="inline-flex items-center gap-2.5">
					{#if meeting.country}<Flag code={meeting.country.code} class="h-[18px] w-6" />{/if}
					{place}
				</span>
			{/if}
			{#if dates}<span class="font-data text-[16.5px]">{dates}</span>{/if}
		</div>
		<dl class="mt-2 grid grid-cols-2 border-t-2 border-b border-t-ink border-b-line sm:grid-cols-4">
			{#each figures as figure (figure.label)}
				<div class="flex flex-col-reverse gap-1 py-4 pr-4">
					<dt class="text-[13.5px] text-ink-2">{figure.label}</dt>
					<dd class="font-display text-5xl leading-none font-bold tabular">
						{formatCount(figure.value)}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>
