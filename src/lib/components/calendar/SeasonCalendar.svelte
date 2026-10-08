<script lang="ts">
	import type { Snippet } from 'svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import {
		groupByMonth,
		isVisible,
		LEVEL_FILTERS,
		monthCounts,
		seasonCounts,
		type CalendarMeeting,
		type LevelFilter
	} from '#lib/domain/calendar.js';
	import { areaName, levelOf, type Level } from '#lib/domain/championship.js';
	import { daysBetween, type IsoDate } from '#lib/domain/date.js';
	import { meetingTiming } from '#lib/domain/meeting.js';
	import { formatDateRange, formatDayMonth, formatDaysToGo } from '#lib/format/date.js';
	import { calendarUrl, meetingUrl } from '#lib/routing/urls.js';

	let {
		year,
		meetings,
		today,
		currentYear,
		previousYear,
		nextYear,
		aside
	}: {
		year: number;
		meetings: CalendarMeeting[];
		today: IsoDate;
		currentYear: number;
		previousYear: number | null;
		nextYear: number | null;
		aside: Snippet;
	} = $props();

	const MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const TAGS: Record<Level, string> = {
		global: 'bg-brand text-ink',
		continental: 'bg-info-soft text-info',
		regional: 'bg-surface-2 text-ink-2',
		road: 'border border-up text-up',
		national: 'border border-dashed border-line-2 text-ink-3'
	};
	const FILTER_DOTS: Record<LevelFilter, string> = {
		all: 'bg-ink',
		global: 'bg-brand',
		continental: 'bg-info',
		regional: 'bg-ink-3',
		road: 'border-2 border-up'
	};

	let filter = $state<LevelFilter>('all');
	let showNational = $state(false);

	const isCurrentSeason = $derived(year === currentYear);
	const currentMonth = $derived(Number(today.slice(5, 7)));
	const visible = $derived(meetings.filter((meeting) => isVisible(meeting, filter, showNational)));
	const grouped = $derived(groupByMonth(visible));
	const counts = $derived(seasonCounts(visible, today));
	const perMonth = $derived(monthCounts(visible));
	const busiest = $derived(Math.max(1, ...perMonth));
	const nationalCount = $derived(
		meetings.filter((meeting) => levelOf(meeting.champ.category) === 'national').length
	);
	const countFor = (key: LevelFilter) =>
		key === 'all'
			? meetings.filter((meeting) => isVisible(meeting, 'all', showNational)).length
			: meetings.filter((meeting) => levelOf(meeting.champ.category) === key).length;
	const figures = $derived(
		isCurrentSeason
			? [
					{ value: counts.shown, label: 'championships shown', accent: false },
					{ value: counts.held, label: 'held · results in', accent: false },
					{ value: counts.toCome, label: 'still to come', accent: true }
				]
			: [
					{ value: counts.shown, label: 'championships shown', accent: false },
					{ value: counts.dated, label: 'dated', accent: false },
					{ value: counts.undated, label: 'dates TBA', accent: false }
				]
	);

	const monthId = (month: number) => `m-${String(month).padStart(2, '0')}`;
	const isPastMonth = (month: number) =>
		year < currentYear || (isCurrentSeason && month < currentMonth);
	const todayIndex = (list: CalendarMeeting[]) => {
		const index = list.findIndex((meeting) => meeting.startDate! > today);
		return index === -1 ? list.length : index;
	};

	function tagLabel(meeting: CalendarMeeting): string {
		const level = levelOf(meeting.champ.category);
		if (level === 'continental') return areaName(meeting.champ.category);
		return { global: 'Global', regional: 'Regional', road: 'Road', national: 'National' }[level];
	}

	function status(meeting: CalendarMeeting): { label: string; style: string; past: boolean } {
		const timing = meetingTiming(meeting, today);
		if (timing.status === 'live')
			return { label: 'Live now', style: 'bg-dq text-surface', past: false };
		if (timing.status === 'scheduled') {
			return {
				label: formatDaysToGo(timing.daysToGo),
				style: 'border border-up text-up',
				past: false
			};
		}
		if (timing.status === 'unscheduled') {
			return { label: 'TBA', style: 'border border-dashed border-line-2 text-ink-3', past: false };
		}
		return meeting.hasResults
			? { label: 'Results →', style: 'bg-surface-2 text-ink-2', past: true }
			: { label: 'No results yet', style: 'text-ink-3', past: true };
	}

	function duration(meeting: CalendarMeeting): string {
		const days = meeting.endDate ? daysBetween(meeting.startDate!, meeting.endDate) + 1 : 1;
		return days === 1 ? '1 day' : `${days} days`;
	}
</script>

{#snippet row(meeting: CalendarMeeting)}
	{@const state = status(meeting)}
	<a
		href={meetingUrl(meeting.champ.slug, meeting.slug)}
		class="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-line py-3.5 hover:bg-surface sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:gap-[18px] {state.past
			? 'text-ink-2'
			: ''}"
	>
		<span class="flex flex-col gap-0.5">
			<strong class="font-display text-[34px] leading-[0.9] font-bold">
				{meeting.startDate ? Number(meeting.startDate.slice(8, 10)) : '—'}
			</strong>
			<span class="font-data text-xs whitespace-nowrap text-ink-3">
				{meeting.startDate ? formatDateRange(meeting.startDate, meeting.endDate) : 'dates TBA'}
			</span>
		</span>
		<span class="flex min-w-0 flex-col gap-1.5">
			<strong class="text-[16.5px] leading-tight font-semibold">{meeting.champ.name}</strong>
			<span class="flex flex-wrap items-center gap-2 text-[13px] text-ink-3">
				{#if meeting.countryCode}<Flag
						code={meeting.countryCode}
						class="h-[15px] w-5 shadow-[0_0_0_1px_var(--color-line)]"
					/>{/if}
				<span>{meeting.city ?? 'Venue TBA'}</span>
				<span class="text-line-2">·</span>
				<span
					class="inline-flex h-5 items-center rounded-full px-2 font-data text-[11px] font-bold tracking-[0.06em] uppercase {TAGS[
						levelOf(meeting.champ.category)
					]}">{tagLabel(meeting)}</span
				>
				{#if meeting.startDate}<span class="font-data text-xs">{duration(meeting)}</span>{/if}
			</span>
		</span>
		<span
			class="col-start-2 inline-flex h-8 items-center justify-self-start rounded-[10px] px-3 text-[13.5px] font-bold whitespace-nowrap sm:col-start-auto sm:justify-self-end {state.style}"
		>
			{state.label}
		</span>
	</a>
{/snippet}

<section class="page-container pt-11 pb-6">
	<div class="grid grid-cols-1 items-end gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
		<div class="flex flex-col gap-3">
			<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
				Championship calendar · today is {formatDayMonth(today)}
				{today.slice(0, 4)}
			</span>
			<div class="flex flex-wrap items-center gap-[18px]">
				<h1 class="font-display text-[88px] leading-[0.84] font-bold sm:text-[140px]">{year}</h1>
				<div class="flex flex-col gap-1.5">
					<nav aria-label="Seasons" class="inline-flex gap-1.5">
						{#each [{ target: previousYear, label: 'Previous season', glyph: '←', rel: 'prev' }, { target: nextYear, label: 'Next season', glyph: '→', rel: 'next' }] as link (link.rel)}
							{#if link.target}
								<a
									href={calendarUrl(link.target)}
									aria-label="{link.label}: {link.target}"
									rel={link.rel}
									class="grid size-11 place-items-center rounded-xl border border-line-2 bg-surface text-lg hover:border-ink"
									>{link.glyph}</a
								>
							{/if}
						{/each}
					</nav>
					<span class="text-[13px] text-ink-3">
						{isCurrentSeason
							? 'Current season'
							: year > currentYear
								? 'Coming season'
								: 'Past season'}
					</span>
				</div>
			</div>
		</div>
		<dl class="grid grid-cols-3 border-t-2 border-ink">
			{#each figures as figure (figure.label)}
				<div class="flex flex-col-reverse gap-1 pt-3.5 pr-3">
					<dt class="text-[13px] text-ink-2">{figure.label}</dt>
					<dd
						class="font-display text-[40px] leading-none font-bold sm:text-[52px] {figure.accent
							? 'text-up'
							: ''}"
					>
						{figure.value}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<section class="page-container pt-2">
	<ol class="grid grid-cols-[repeat(12,minmax(44px,1fr))] gap-1.5 overflow-x-auto pb-1">
		{#each perMonth as count, index (index)}
			{@const month = index + 1}
			{@const current = isCurrentSeason && month === currentMonth}
			<li>
				<a
					href="#{monthId(month)}"
					title="{MONTHS[index]}: {count} championships"
					class="flex flex-col justify-end gap-1.5 rounded-xl border px-1.5 py-2 hover:border-ink {current
						? 'border-brand bg-brand-soft'
						: 'border-line bg-surface'}"
				>
					<span class="flex h-11 items-end">
						<span
							class="min-h-[3px] flex-1 rounded-t-[3px] {current
								? 'bg-brand'
								: isPastMonth(month)
									? 'bg-line-2'
									: 'bg-ink'}"
							style:height="{Math.round((count / busiest) * 44)}px"
						></span>
					</span>
					<span class="flex items-baseline justify-between gap-1">
						<strong class="font-data text-[13px] tracking-[0.08em] uppercase"
							>{MONTHS[index].slice(0, 3)}</strong
						>
						<span class="font-data text-xs text-ink-3">{count || '·'}</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</section>

<div class="sticky top-0 z-[5] mt-6 border-b border-line bg-bg">
	<div class="page-container flex flex-wrap items-center gap-2 py-3">
		<div class="flex flex-wrap gap-2" role="group" aria-label="Level">
			{#each LEVEL_FILTERS as option (option.key)}
				<button
					type="button"
					aria-pressed={filter === option.key}
					onclick={() => (filter = option.key)}
					class="inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold hover:border-ink {filter ===
					option.key
						? 'border-ink bg-ink text-bg'
						: 'border-line-2 bg-surface text-ink'}"
				>
					<span class="size-[9px] rounded-full {FILTER_DOTS[option.key]}"></span>
					{option.label}
					<span class="font-data text-[13px] opacity-85">{countFor(option.key)}</span>
				</button>
			{/each}
		</div>
		<span class="flex-1"></span>
		<label class="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink-2">
			<input type="checkbox" bind:checked={showNational} class="peer sr-only" />
			<span
				class="relative h-[22px] w-[38px] rounded-full bg-line-2 transition-colors peer-checked:bg-up peer-focus-visible:outline-2 peer-focus-visible:outline-brand-ink after:absolute after:top-[3px] after:left-[3px] after:size-4 after:rounded-full after:bg-surface after:shadow-[0_1px_2px_rgba(0,0,0,.25)] after:transition-[left] peer-checked:after:left-[19px]"
			></span>
			National championships
			<span class="font-data text-[13px] text-ink-3">{nationalCount}</span>
		</label>
	</div>
</div>

<section class="page-container pt-7 pb-16">
	<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
		<div class="flex flex-col gap-8">
			{#if !visible.length}
				<p class="rounded-[20px] border border-dashed border-line-2 p-10 text-center text-ink-2">
					{meetings.length
						? `Nothing in this filter for ${year}. Turn on national championships or pick another level.`
						: `No championships of ${year} are in the archive yet.`}
				</p>
			{/if}
			{#each grouped.months as { month, meetings: list } (month)}
				{@const marker = isCurrentSeason && month === currentMonth ? todayIndex(list) : -1}
				<div
					id={monthId(month)}
					class="grid scroll-mt-20 grid-cols-1 items-start gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5"
				>
					<div class="flex flex-col gap-0.5 sm:sticky sm:top-[76px]">
						<h2
							class="font-display text-[36px] leading-[0.95] font-bold {isPastMonth(month)
								? 'text-ink-3'
								: ''}"
						>
							{MONTHS[month - 1]}
						</h2>
						<span class="font-data text-[13px] text-ink-3">
							{list.length}
							{list.length === 1 ? 'championship' : 'championships'}
						</span>
					</div>
					<div class="flex flex-col border-t-2 {marker >= 0 ? 'border-brand' : 'border-ink'}">
						{#each list as meeting, index (meeting.slug)}
							{#if index === marker}
								{@render todayLine()}
							{/if}
							{@render row(meeting)}
						{/each}
						{#if marker === list.length}{@render todayLine()}{/if}
					</div>
				</div>
			{/each}
			{#if grouped.undated.length}
				<div class="grid grid-cols-1 items-start gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
					<div class="flex flex-col gap-0.5">
						<h2 class="font-display text-[36px] leading-[0.95] font-bold text-ink-3">Dates TBA</h2>
						<span class="font-data text-[13px] text-ink-3">{grouped.undated.length} announced</span>
					</div>
					<div class="flex flex-col border-t-2 border-line-2">
						{#each grouped.undated as meeting (meeting.slug)}{@render row(meeting)}{/each}
					</div>
				</div>
			{/if}
		</div>
		<aside class="flex flex-col gap-4 lg:sticky lg:top-[76px]">{@render aside()}</aside>
	</div>
</section>

{#snippet todayLine()}
	<div class="flex items-center gap-2.5 border-b border-line py-2.5">
		<span
			class="inline-flex h-[22px] items-center rounded-md bg-ink px-2 font-data text-[11.5px] font-bold tracking-[0.1em] text-bg uppercase"
		>
			Today · {formatDayMonth(today)}
		</span>
		<span class="h-0.5 flex-1 bg-ink"></span>
	</div>
{/snippet}
