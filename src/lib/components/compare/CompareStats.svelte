<script lang="ts">
	import { winnerOf, type ChampStats, type Winner } from '#lib/domain/compare.js';
	import type { MarkKind } from '#lib/domain/event.js';
	import type { MedalRecord } from '#lib/domain/medal-search.js';
	import { formatWind } from '#lib/format/mark.js';

	let {
		stats,
		names,
		kind
	}: { stats: [ChampStats, ChampStats]; names: [string, string]; kind: MarkKind } = $props();

	const BEST_TITLES: Record<MarkKind, string> = {
		time: 'Fastest winning time',
		distance: 'Best winning mark',
		points: 'Highest winning score'
	};
	const LEGAL_WIND = 2;

	const bestNote = (record: MedalRecord) =>
		[
			`${winnerOf(record).name}, ${record.meeting.year}`,
			record.wind !== null && record.wind > LEGAL_WIND ? `wind ${formatWind(record.wind)}` : null
		]
			.filter(Boolean)
			.join(' · ');
	const winnersNote = (winners: Winner[]) =>
		winners.length > 3
			? `shared by ${winners.length} winners`
			: winners.map((winner) => winner.name).join(' · ');

	const cards = $derived([
		{
			title: 'Editions',
			values: stats.map((side) => ({
				value: side.editions ? String(side.editions) : '–',
				note: side.since ? `since ${side.since}` : 'no medals yet'
			}))
		},
		{
			title: BEST_TITLES[kind],
			values: stats.map((side) => ({
				value: side.best?.mark ?? '–',
				note: side.best ? bestNote(side.best) : ''
			}))
		},
		{
			title: 'Most titles',
			values: stats.map((side) => ({
				value: side.titles ? String(side.titles.count) : '–',
				note: side.titles ? winnersNote(side.titles.winners) : ''
			}))
		},
		{
			title: 'Winning nations',
			values: stats.map((side) => ({
				value: String(side.nations),
				note: 'different flags on top'
			}))
		}
	]);
</script>

<div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
	{#each cards as card (card.title)}
		<section class="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface px-[18px] py-4">
			<h3 class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">{card.title}</h3>
			<div class="grid grid-cols-2 gap-2.5">
				{#each card.values as item, index (index)}
					<p
						class="flex flex-col gap-[3px] border-l-4 pl-2.5 {index
							? 'border-ink'
							: 'border-brand'}"
					>
						<span class="sr-only">{names[index]}:</span>
						<strong class="font-display text-[32px] leading-none font-bold tabular">
							{item.value}
						</strong>
						<span class="text-xs leading-[1.35] text-ink-3">{item.note}</span>
					</p>
				{/each}
			</div>
		</section>
	{/each}
</div>
