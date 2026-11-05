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

	const CARD = 'flex flex-col gap-1 rounded-[10px] border border-line bg-surface px-3 py-2.5';
	const DOT = 'size-[15px] rounded-full border-[3px] border-up bg-bg';
	const TODAY_DOT = 'size-[19px] rounded-full border-[3px] border-ink bg-brand';
	const MONTH = 'font-data text-xs tracking-[0.1em] text-ink-3 uppercase';

	const placed = $derived(timelinePlacement(meetings, today, spanDays));
	const ticks = $derived(monthTicks(today, spanDays));
	const percent = (offset: number) => `${(offset * 100).toFixed(2)}%`;

	function countdown(meeting: MeetingSummary): string {
		const timing = meetingTiming(meeting, today);
		return timing.status === 'scheduled' ? formatDaysToGo(timing.daysToGo) : 'live now';
	}

	function placeAndDates(meeting: MeetingSummary): string {
		return [meeting.city, meeting.startDate && formatDateRange(meeting.startDate, meeting.endDate)]
			.filter(Boolean)
			.join(' · ');
	}
</script>

{#snippet details(meeting: MeetingSummary)}
	<span class="flex items-center gap-2">
		{#if meeting.countryCode}<Flag code={meeting.countryCode} class="h-[13.5px] w-[18px]" />{/if}
		<span class="font-data text-xs font-semibold text-up">{countdown(meeting)}</span>
	</span>
	<strong class="text-sm leading-tight font-bold">{meeting.name}</strong>
	<span class="text-xs text-ink-3">{placeAndDates(meeting)}</span>
{/snippet}

<section class="page-container pt-[52px] pb-6">
	<div class="mb-[22px] flex flex-wrap items-baseline justify-between gap-3">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">
			Next six months
		</h2>
		<a href={calendarUrl(year)} class="text-sm font-semibold text-brand-ink hover:underline">
			Season calendar <span class="nudge-on-link-hover">→</span>
		</a>
	</div>

	<div class="relative h-[240px] max-md:hidden">
		<div class="absolute inset-x-0 top-[104px] h-[3px] rounded-[3px] bg-ink"></div>
		{#each ticks as tick (tick.label)}
			<span
				class="absolute top-[116px] {MONTH}"
				style:left={tick.offset ? percent(tick.offset) : '56px'}
			>
				{tick.label}
			</span>
		{/each}
		<span class="absolute top-24 left-0 {TODAY_DOT}"></span>
		<span class="absolute top-[116px] left-0 text-[13px] font-bold">Today</span>
		<ol>
			{#each placed as { item: meeting, offset, row } (meeting.slug)}
				<li class="group">
					<a
						href={meetingUrl(meeting.champ.slug, meeting.slug)}
						class="absolute w-[190px] transition duration-150 ease-out group-hover:z-10 group-hover:-translate-y-0.5 group-hover:border-ink group-hover:shadow-[0_1px_2px_rgba(18,19,22,.05),0_8px_24px_rgba(18,19,22,.12)] focus-visible:z-10 motion-reduce:transition-none {CARD}"
						style:left="clamp(0px, calc({percent(offset)} - 20px), calc(100% - 190px))"
						style:top={row === 0 ? '0px' : '150px'}
					>
						{@render details(meeting)}
					</a>
					<span
						class="absolute top-[98px] group-hover:z-10 group-hover:bg-up {DOT}"
						style:left="calc({percent(offset)} - 7px)"
					></span>
				</li>
			{/each}
		</ol>
	</div>

	<div class="relative md:hidden">
		<span class="absolute top-2 bottom-0 left-2 w-[3px] rounded-[3px] bg-ink"></span>
		<p class="relative grid grid-cols-[19px_minmax(0,1fr)] items-center gap-x-4">
			<span class={TODAY_DOT}></span>
			<span class="text-[13px] font-bold">Today</span>
		</p>
		<ol class="mt-4 flex flex-col gap-3">
			{#each placed as { item: meeting, opensMonth } (meeting.slug)}
				<li class="grid grid-cols-[19px_minmax(0,1fr)] gap-x-4 gap-y-2">
					{#if opensMonth}<span class="col-start-2 {MONTH}">{opensMonth}</span>{/if}
					<span class="relative col-start-1 mt-3 justify-self-center {DOT}"></span>
					<a
						href={meetingUrl(meeting.champ.slug, meeting.slug)}
						class="col-start-2 hover:border-ink {CARD}"
					>
						{@render details(meeting)}
					</a>
				</li>
			{/each}
		</ol>
	</div>
</section>
