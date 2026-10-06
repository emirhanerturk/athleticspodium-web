<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { IsoDate } from '#lib/domain/date.js';
	import {
		meetingTiming,
		monthTicks,
		timelinePlacement,
		type MeetingSummary
	} from '#lib/domain/meeting.js';
	import { formatDateRange, formatDaysToGo } from '#lib/format/date.js';
	import { calendarUrl, meetingUrl } from '#lib/routing/urls.js';

	let {
		meetings,
		today,
		year,
		spanDays
	}: { meetings: MeetingSummary[]; today: IsoDate; year: number; spanDays: number } = $props();

	const placed = $derived(timelinePlacement(meetings, today, spanDays));
	const ticks = $derived(monthTicks(today, spanDays));
	const percent = (offset: number) => `${(offset * 100).toFixed(2)}%`;

	function countdown(meeting: MeetingSummary): string {
		const timing = meetingTiming(meeting, today);
		return timing.status === 'scheduled' ? formatDaysToGo(timing.daysToGo) : 'live now';
	}
</script>

<section class="page-container pt-[52px] pb-6">
	<div class="mb-[22px] flex flex-wrap items-baseline justify-between gap-3">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">
			Next six months
		</h2>
		<a href={calendarUrl(year)} class="text-sm font-semibold text-brand-ink hover:underline">
			Season calendar →
		</a>
	</div>
	<div class="overflow-x-auto pb-2">
		<div class="relative h-[240px] min-w-[900px]">
			<div class="absolute inset-x-0 top-[104px] h-[3px] rounded-[3px] bg-ink"></div>
			{#each ticks as tick (tick.label)}
				<span
					class="absolute top-[116px] font-data text-xs tracking-[0.1em] text-ink-3 uppercase"
					style:left={tick.offset ? percent(tick.offset) : '56px'}
				>
					{tick.label}
				</span>
			{/each}
			<span class="absolute top-24 left-0 size-[19px] rounded-full border-[3px] border-ink bg-brand"
			></span>
			<span class="absolute top-[116px] left-0 text-[13px] font-bold">Today</span>
			{#each placed as { item: meeting, offset, row } (meeting.slug)}
				<a
					href={meetingUrl(meeting.champ.slug, meeting.slug)}
					class="absolute flex w-[190px] flex-col gap-1 rounded-[10px] border border-line bg-surface px-3 py-2.5 hover:border-ink"
					style:left="clamp(0px, calc({percent(offset)} - 20px), calc(100% - 190px))"
					style:top={row === 0 ? '0px' : '150px'}
				>
					<span class="flex items-center gap-2">
						{#if meeting.countryCode}<Flag
								code={meeting.countryCode}
								class="h-[13.5px] w-[18px]"
							/>{/if}
						<span class="font-data text-xs font-semibold text-up">{countdown(meeting)}</span>
					</span>
					<strong class="text-sm leading-tight font-bold">{meeting.name}</strong>
					<span class="text-xs text-ink-3">
						{[
							meeting.city,
							meeting.startDate && formatDateRange(meeting.startDate, meeting.endDate)
						]
							.filter(Boolean)
							.join(' · ')}
					</span>
				</a>
				<span
					class="absolute top-[98px] size-[15px] rounded-full border-[3px] border-up bg-bg"
					style:left="calc({percent(offset)} - 7px)"
				></span>
			{/each}
		</div>
	</div>
</section>
