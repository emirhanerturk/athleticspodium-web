<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { ageOn, fullName, type AthleteSummary, type OnThisDay } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatDayMonth } from '#lib/format/date.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { born, died, today }: { born: OnThisDay; died: OnThisDay; today: IsoDate } = $props();

	const lifeYears = (athlete: AthleteSummary) =>
		athlete.deathDate
			? `${athlete.birthDate?.slice(0, 4) ?? '?'}–${athlete.deathDate.slice(0, 4)}`
			: athlete.birthDate
				? `b. ${athlete.birthDate.slice(0, 4)}`
				: '';
	const age = (athlete: AthleteSummary, index: number) => {
		if (athlete.deathDate || !athlete.birthDate) return '';
		const years = ageOn(athlete.birthDate, today);
		return index === 0 ? `turns ${years}` : String(years);
	};
	const H3 = 'text-[15px] font-bold tracking-[0.06em] uppercase';
	const ROW = 'border-b border-line-2 py-[11px] hover:text-brand-ink';
</script>

<section class="mt-6 border-y border-line bg-surface-2">
	<div
		class="page-container grid grid-cols-1 items-start gap-8 py-14 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,4fr)]"
	>
		<div class="flex flex-col gap-3">
			<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">On this day</span>
			<span class="font-display text-[80px] leading-[0.86] font-bold sm:text-[120px]">
				{formatDayMonth(today)}
			</span>
			<p class="max-w-[280px] text-[15px] leading-[1.55] text-ink-2">
				{born.count}
				{born.count === 1 ? 'medallist was' : 'medallists were'} born on this day, {died.count} died on
				it. The most decorated come first.
			</p>
		</div>
		<div class="flex flex-col">
			<div class="flex items-baseline justify-between border-b-2 border-ink pb-2.5">
				<h2 class={H3}>Born today</h2>
				<span class="font-data text-[13.5px] text-ink-3">{born.count}</span>
			</div>
			{#each born.athletes as athlete, index (athlete.id)}
				<a
					href={athleteUrl(athlete)}
					class="grid grid-cols-[20px_minmax(0,1fr)_auto_auto] items-center gap-3 {ROW}"
				>
					{#if athlete.countryCode}<Flag code={athlete.countryCode} />{:else}<span></span>{/if}
					<span class="flex min-w-0 items-center gap-2">
						<strong class="truncate text-[15px] font-semibold">{fullName(athlete)}</strong>
						{#if athlete.olympicChampion}
							<span
								title="Olympic champion"
								class="flex-none rounded bg-brand px-[5px] py-0.5 font-data text-[10.5px] font-bold text-ink"
								>OG</span
							>
						{/if}
					</span>
					<span class="font-data text-[13.5px] text-ink-3">{lifeYears(athlete)}</span>
					<span class="min-w-16 text-right font-data text-[13.5px] font-semibold"
						>{age(athlete, index)}</span
					>
				</a>
			{/each}
		</div>
		<div class="flex flex-col">
			<div class="flex items-baseline justify-between border-b-2 border-ink pb-2.5">
				<h2 class={H3}>Remembered today</h2>
				<span class="font-data text-[13.5px] text-ink-3">{died.count}</span>
			</div>
			{#each died.athletes as athlete (athlete.id)}
				<a
					href={athleteUrl(athlete)}
					class="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 {ROW}"
				>
					{#if athlete.countryCode}<Flag code={athlete.countryCode} />{:else}<span></span>{/if}
					<strong class="truncate text-[15px] font-medium">{fullName(athlete)}</strong>
					<span class="font-data text-[13.5px] text-ink-3">{lifeYears(athlete)}</span>
				</a>
			{/each}
		</div>
	</div>
</section>
