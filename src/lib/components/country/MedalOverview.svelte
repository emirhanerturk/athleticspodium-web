<script lang="ts">
	import { LEVEL_LABELS, levelOf, type Level } from '#lib/domain/championship.js';
	import {
		addTallies,
		LEVEL_ORDER,
		medalsByLevel,
		type ChampionshipMedals
	} from '#lib/domain/country.js';
	import type { MedalTally } from '#lib/domain/result.js';
	import { formatCount } from '#lib/format/number.js';
	import { countryChampsUrl } from '#lib/routing/urls.js';

	let {
		countryCode,
		medals,
		international,
		nationalTitles
	}: {
		countryCode: string;
		medals: ChampionshipMedals[];
		international: MedalTally;
		nationalTitles: number;
	} = $props();

	const GROUP_LABELS: Record<Level, string> = {
		...LEVEL_LABELS,
		regional: 'Regional & multi-sport',
		road: 'Road races'
	};
	const DISCS = [
		{ key: 'gold', letter: 'G', fill: 'bg-gold' },
		{ key: 'silver', letter: 'S', fill: 'bg-silver' },
		{ key: 'bronze', letter: 'B', fill: 'bg-bronze' }
	] as const;

	let selected = $state<Level | 'all'>('all');

	const groups = $derived(medalsByLevel(medals));
	const totals = $derived(
		Object.fromEntries(
			LEVEL_ORDER.map((level) => [level, addTallies(groups[level].map((row) => row.tally))])
		) as Record<Level, MedalTally>
	);
	const internationalLevels = $derived(
		LEVEL_ORDER.filter((level) => level !== 'national' && totals[level].total > 0)
	);
	const levelMax = $derived(
		Math.max(1, ...internationalLevels.map((level) => totals[level].total))
	);
	const rowMax = $derived(
		Math.max(
			1,
			...medals
				.filter((row) => levelOf(row.champ.category) !== 'national')
				.map((row) => row.tally.total)
		)
	);
	const visibleLevels = $derived(
		LEVEL_ORDER.filter(
			(level) => groups[level].length && (selected === 'all' || selected === level)
		)
	);
	const tabs = $derived(
		(['all', ...LEVEL_ORDER] as const).filter((level) => level === 'all' || groups[level].length)
	);

	const percent = (part: number, whole: number) => `${(part / whole) * 100}%`;
	const cell = (value: number) => (value ? formatCount(value) : '–');
	const toggle = (level: Level) => (selected = selected === level ? 'all' : level);
</script>

<section class="page-container py-12">
	<div class="mb-[22px] flex flex-wrap items-baseline justify-between gap-3">
		<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-5xl">Medals</h2>
		<span class="text-sm text-ink-3">
			{medals.length}
			{medals.length === 1 ? 'championship' : 'championships'} · senior, age-group, multi-sport and road
		</span>
	</div>
	<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
		<div class="flex flex-col gap-4">
			<div class="rounded-[20px] bg-ink p-6 text-night-ink">
				<span class="font-data text-xs tracking-[0.14em] text-night-ink-4 uppercase">
					International · all levels
				</span>
				<div class="mt-4 grid grid-cols-3 gap-3">
					{#each DISCS as disc (disc.key)}
						<div class="flex flex-col items-start gap-2.5">
							<span
								class="grid size-[34px] place-items-center rounded-full font-data text-[13.5px] font-bold text-ink shadow-[inset_0_-3px_0_rgba(0,0,0,.18)] {disc.fill}"
							>
								{disc.letter}
							</span>
							<span class="font-display text-[44px] leading-[0.9] font-bold tabular sm:text-[56px]">
								{formatCount(international[disc.key])}
							</span>
						</div>
					{/each}
				</div>
				{#if international.total}
					<div class="mt-[18px] flex h-2 overflow-hidden rounded">
						<span class="bg-gold" style:width={percent(international.gold, international.total)}
						></span>
						<span class="bg-silver" style:width={percent(international.silver, international.total)}
						></span>
						<span class="bg-bronze" style:width={percent(international.bronze, international.total)}
						></span>
					</div>
				{/if}
			</div>
			<div class="rounded-[20px] border border-line bg-surface p-5">
				<strong class="mb-1 block text-sm font-bold">By level</strong>
				<span class="mb-3 block text-[13px] text-ink-3">
					Bar length is total medals (square-root scale). Pick a level to filter the table.
				</span>
				{#each internationalLevels as level (level)}
					{@const tally = totals[level]}
					<button
						type="button"
						aria-pressed={selected === level}
						onclick={() => toggle(level)}
						class="-mx-2 grid w-[calc(100%+16px)] grid-cols-[112px_minmax(0,1fr)_48px] items-center gap-3 rounded-[10px] px-2 py-2.5 text-left hover:bg-surface-2 {selected ===
						level
							? 'bg-brand-soft'
							: ''}"
					>
						<span class="text-sm font-semibold">{GROUP_LABELS[level]}</span>
						<span
							class="flex h-3 overflow-hidden rounded-[3px]"
							style:width="{Math.max(6, Math.round(Math.sqrt(tally.total / levelMax) * 100))}%"
						>
							<span class="bg-gold" style:width={percent(tally.gold, tally.total)}></span>
							<span class="bg-silver" style:width={percent(tally.silver, tally.total)}></span>
							<span class="bg-bronze" style:width={percent(tally.bronze, tally.total)}></span>
						</span>
						<span class="text-right font-data text-[14.5px] font-bold"
							>{formatCount(tally.total)}</span
						>
					</button>
				{/each}
				{#if nationalTitles}
					<div
						class="mt-2.5 flex justify-between gap-3 border-t border-dashed border-line-2 pt-3 text-[13.5px] text-ink-2"
					>
						<span>National titles</span>
						<strong class="font-data text-[14.5px]">{formatCount(nationalTitles)}</strong>
					</div>
				{/if}
			</div>
		</div>

		<div class="overflow-hidden rounded-[20px] border border-line bg-surface">
			<div
				class="flex [scrollbar-width:none] gap-1 overflow-x-auto border-b border-line px-3 pt-2.5"
				role="group"
				aria-label="Level"
			>
				{#each tabs as level (level)}
					<button
						type="button"
						aria-pressed={selected === level}
						onclick={() => (selected = level)}
						class="flex-none border-b-[3px] px-3 pt-2.5 pb-[11px] text-sm font-bold hover:text-ink {selected ===
						level
							? 'border-brand text-ink'
							: 'border-transparent text-ink-3'}"
					>
						{level === 'all' ? 'All' : LEVEL_LABELS[level]}
					</button>
				{/each}
			</div>
			<div
				class="grid grid-cols-[minmax(0,1fr)_40px_40px_40px_52px] gap-2 border-b border-line px-5 py-2.5 font-data text-[11.5px] tracking-[0.1em] text-ink-3 uppercase sm:grid-cols-[minmax(0,1fr)_44px_44px_44px_56px]"
			>
				<span>Championship</span><span class="text-center">G</span><span class="text-center">S</span
				><span class="text-center">B</span><span class="text-right">Total</span>
			</div>
			{#each visibleLevels as level (level)}
				{@const tally = totals[level]}
				<div class="flex items-baseline justify-between gap-2.5 bg-surface-2 px-5 pt-3.5 pb-1.5">
					<strong class="font-data text-xs tracking-[0.14em] uppercase"
						>{GROUP_LABELS[level]}</strong
					>
					<span class="font-data text-[13px] text-ink-3">
						{formatCount(tally.gold)} · {formatCount(tally.silver)} · {formatCount(tally.bronze)}
					</span>
				</div>
				{#each groups[level] as row (row.champ.id)}
					<a
						href={countryChampsUrl(countryCode, row.champ.id)}
						class="grid grid-cols-[minmax(0,1fr)_40px_40px_40px_52px] items-center gap-2 border-t border-line px-5 py-2.5 hover:bg-brand-soft sm:grid-cols-[minmax(0,1fr)_44px_44px_44px_56px]"
					>
						<span class="flex min-w-0 flex-col gap-[5px]">
							<span class="truncate text-[14.5px] font-semibold">{row.champ.name}</span>
							<span class="block h-[3px] overflow-hidden rounded-sm bg-line">
								<span
									class="block h-full bg-ink-3"
									style:width={level === 'national'
										? '100%'
										: `${Math.max(2, Math.round((row.tally.total / rowMax) * 100))}%`}
								></span>
							</span>
						</span>
						<span
							class="text-center font-data text-[14.5px] font-bold {row.tally.gold
								? 'text-brand-ink'
								: 'text-line-2'}">{cell(row.tally.gold)}</span
						>
						<span
							class="text-center font-data text-[14.5px] {row.tally.silver
								? 'text-ink-2'
								: 'text-line-2'}">{cell(row.tally.silver)}</span
						>
						<span
							class="text-center font-data text-[14.5px] {row.tally.bronze
								? 'text-ink-2'
								: 'text-line-2'}">{cell(row.tally.bronze)}</span
						>
						<span class="text-right font-data text-[15px] font-bold"
							>{formatCount(row.tally.total)}</span
						>
					</a>
				{/each}
			{/each}
		</div>
	</div>
</section>
