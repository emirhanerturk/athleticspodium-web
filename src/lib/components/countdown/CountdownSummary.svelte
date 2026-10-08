<script lang="ts">
	import type { EditionRef } from '#lib/domain/championship.js';
	import {
		countdownFacts,
		medalLine,
		type CountdownEdition,
		type MedalEntry,
		type NationStanding
	} from '#lib/domain/countdown.js';
	import { addTallies } from '#lib/domain/country.js';
	import { formatCount, formatOrdinal } from '#lib/format/number.js';

	type Milestone = { edition: EditionRef; record: MedalEntry | null } | undefined;

	let {
		editions,
		standing,
		nations,
		withdrawn,
		firstMedal,
		firstGold
	}: {
		editions: CountdownEdition[];
		standing: NationStanding | undefined;
		nations: number;
		withdrawn: number;
		firstMedal: Milestone;
		firstGold: Milestone;
	} = $props();

	const total = $derived(addTallies(editions.flatMap((item) => item.tally ?? [])));
	const facts = $derived(countdownFacts(editions));

	const placeOf = (edition: EditionRef) => edition.city ?? edition.name;
	const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;
	const milestone = (item: Milestone, withMedal: boolean) =>
		item
			? {
					value: String(item.edition.year),
					note: [placeOf(item.edition), item.record && medalLine(item.record, { withMedal })]
						.filter(Boolean)
						.join(' · ')
				}
			: { value: '–', note: withMedal ? 'no medal yet' : 'no gold yet' };

	const cards = $derived(
		[
			{
				title: 'On the podium',
				value: `${facts.onPodium} of ${facts.held}`,
				note: [
					facts.since && `editions since ${facts.since}`,
					facts.streakFrom &&
						(facts.streakFrom === facts.since ? 'every one' : `every one since ${facts.streakFrom}`)
				]
					.filter(Boolean)
					.join(' · ')
			},
			{ title: 'First medal', ...milestone(firstMedal, true) },
			{ title: 'First gold', ...milestone(firstGold, false) },
			facts.best?.tally && {
				title: 'Best edition',
				value: `${placeOf(facts.best.edition)} ${facts.best.edition.year}`,
				note: `${plural(facts.best.tally.total, 'medal')}, ${facts.best.tally.gold} of them gold`
			},
			standing && {
				title: 'All-time table',
				value: formatOrdinal(standing.rank),
				note: `of ${nations} nations, ranked by golds`
			}
		].flatMap((card) => (card ? [card] : []))
	);
</script>

<div class="grid grid-cols-1 gap-[18px] md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
	<div class="flex flex-col gap-3.5 rounded-[20px] bg-ink px-6 py-[22px] text-night-ink">
		<h2 class="font-data text-xs tracking-[0.14em] text-night-ink-4 uppercase">All-time haul</h2>
		<p class="flex items-baseline gap-3">
			<strong class="font-display text-[80px] leading-[0.85] font-bold text-brand sm:text-[96px]">
				{formatCount(total.total)}
			</strong>
			<span class="font-semibold">{total.total === 1 ? 'medal' : 'medals'}</span>
		</p>
		<p class="flex flex-wrap gap-[18px] font-data text-[17px] font-semibold">
			<span class="inline-flex items-center gap-1.5">
				<span aria-hidden="true" class="size-3.5 rounded-full bg-gold"></span>{total.gold} gold
			</span>
			<span class="inline-flex items-center gap-1.5">
				<span aria-hidden="true" class="size-3.5 rounded-full bg-silver"></span>{total.silver} silver
			</span>
			<span class="inline-flex items-center gap-1.5">
				<span aria-hidden="true" class="size-3.5 rounded-full bg-bronze"></span>{total.bronze} bronze
			</span>
		</p>
		<p class="border-t border-night-line-2 pt-3 text-[13px] text-night-ink-3">
			{#if withdrawn}
				{plural(withdrawn, 'medal')} withdrawn for doping {withdrawn === 1 ? 'is' : 'are'} not counted.
			{/if}
			Relays count once.
		</p>
	</div>
	<div class="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
		{#each cards as card (card.title)}
			<section
				class="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-4 sm:px-[18px]"
			>
				<h3 class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">{card.title}</h3>
				<strong class="font-display text-[28px] leading-none font-bold sm:text-[34px]">
					{card.value}
				</strong>
				<span class="text-[13px] leading-[1.45] text-ink-2">{card.note}</span>
			</section>
		{/each}
	</div>
</div>
