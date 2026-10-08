<script lang="ts">
	import { goto } from '$app/navigation';
	import { todayFor } from '#lib/components/layout/visitor-today.svelte.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { dayOf, dayOfDate, daysIn, shiftDay, type DayOfYear } from '#lib/domain/day.js';
	import { formatDay, formatMonth } from '#lib/format/date.js';
	import { onThisDayUrl, PAGES } from '#lib/routing/urls.js';

	let { day, born, died, today }: { day: DayOfYear; born: number; died: number; today: IsoDate } =
		$props();

	const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

	const previous = $derived(shiftDay(day, -1));
	const next = $derived(shiftDay(day, 1));
	const todayDay = $derived(dayOfDate(todayFor(today)));
	const isToday = $derived(day.month === todayDay.month && day.day === todayDay.day);

	function choose(month: number, date: number) {
		goto(onThisDayUrl(dayOf(month, Math.min(date, daysIn(month))) ?? day));
	}

	const STEP =
		'inline-flex h-10 items-center rounded-full border border-line-2 bg-surface px-4 text-sm font-semibold hover:border-ink';
	const SELECT =
		'h-10 rounded-[10px] border border-line-2 bg-surface px-3 text-[15px] font-semibold';
</script>

<section class="border-b border-line bg-surface-2">
	<div
		class="page-container grid grid-cols-1 items-end gap-8 py-12 md:grid-cols-[minmax(0,1fr)_auto]"
	>
		<div class="flex flex-col gap-3">
			<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
				On this day{isToday ? ' · today' : ''}
			</span>
			<h1 class="font-display text-[80px] leading-[0.86] font-bold sm:text-[120px]">
				{formatDay(day, 'short')}<span class="sr-only">
					– athletes born and died on {formatDay(day)}</span
				>
			</h1>
			<p class="max-w-[520px] text-[15px] leading-[1.55] text-ink-2">
				{born}
				{born === 1 ? 'athlete in the archive was' : 'athletes in the archive were'} born on
				{formatDay(day)} and {died} died on it. The most decorated come first.
			</p>
		</div>
		<div class="flex flex-col items-start gap-3 md:items-end">
			<nav aria-label="Other days" class="flex flex-wrap gap-2">
				<a href={onThisDayUrl(previous)} class={STEP}>← {formatDay(previous, 'short')}</a>
				{#if !isToday}<a href={onThisDayUrl(todayDay)} class={STEP}>Today</a>{/if}
				<a href={onThisDayUrl(next)} class={STEP}>{formatDay(next, 'short')} →</a>
			</nav>
			<form method="get" action={PAGES.onThisDay} class="flex flex-wrap items-center gap-2">
				<select
					name="day"
					aria-label="Day"
					class={SELECT}
					onchange={(change) => choose(day.month, Number(change.currentTarget.value))}
				>
					{#each Array.from({ length: daysIn(day.month) }, (_, index) => index + 1) as date (date)}
						<option value={date} selected={date === day.day}>{date}</option>
					{/each}
				</select>
				<select
					name="month"
					aria-label="Month"
					class={SELECT}
					onchange={(change) => choose(Number(change.currentTarget.value), day.day)}
				>
					{#each MONTHS as month (month)}
						<option value={month} selected={month === day.month}>{formatMonth(month)}</option>
					{/each}
				</select>
				<noscript>
					<button type="submit" class="h-10 rounded-[10px] bg-ink px-4 text-sm font-bold text-bg">
						Go
					</button>
				</noscript>
			</form>
		</div>
	</div>
</section>
