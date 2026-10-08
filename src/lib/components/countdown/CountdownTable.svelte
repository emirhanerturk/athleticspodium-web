<script lang="ts">
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import { countdownFacts, type CountdownEdition } from '#lib/domain/countdown.js';
	import { addTallies } from '#lib/domain/country.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatOrdinal } from '#lib/format/number.js';
	import { editionMedalsUrl, medalSearchUrl, meetingUrl } from '#lib/routing/urls.js';
	import EditionMedallists from './EditionMedallists.svelte';
	import MedalDots from './MedalDots.svelte';

	let {
		editions,
		champ,
		countryCode,
		today,
		open = $bindable()
	}: {
		editions: CountdownEdition[];
		champ: { id: number; slug: string };
		countryCode: string;
		today: IsoDate;
		open: string | null;
	} = $props();

	const VIEWS = [
		{ key: 'all', label: 'All editions' },
		{ key: 'medals', label: 'Medal editions only' }
	] as const;
	const MEDALS = [
		{ key: 'gold', letter: 'G', title: 'Gold' },
		{ key: 'silver', letter: 'S', title: 'Silver' },
		{ key: 'bronze', letter: 'B', title: 'Bronze' }
	] as const;

	let view = $state<(typeof VIEWS)[number]['key']>('all');

	const rows = $derived(view === 'medals' ? editions.filter((item) => item.tally) : editions);
	const total = $derived(addTallies(editions.flatMap((item) => item.tally ?? [])));
	const facts = $derived(countdownFacts(editions));

	const most = $derived(Math.max(1, ...editions.map((item) => item.tally?.total ?? 0)));
	const details = (year: number) => medalSearchUrl({ champ: champ.id, country: countryCode, year });

	const COUNT = 'text-center font-data text-[15px] max-sm:hidden';
	const DOTS = 'sm:max-lg:hidden';
</script>

<section>
	<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
		<h2 class="font-display text-[32px] leading-none font-bold">Edition by edition</h2>
		<div class="inline-flex rounded-full bg-surface-2 p-[3px]">
			{#each VIEWS as item (item.key)}
				<button
					type="button"
					aria-pressed={view === item.key}
					onclick={() => (view = item.key)}
					class="h-8 rounded-full px-3.5 text-[13.5px] font-bold {view === item.key
						? 'bg-surface text-ink shadow-[0_1px_3px_rgba(18,19,22,.12)]'
						: 'text-ink-3 hover:text-ink'}"
				>
					{item.label}
				</button>
			{/each}
		</div>
	</div>
	<div class="overflow-hidden rounded-[18px] border border-line bg-surface">
		<table class="w-full border-collapse">
			<thead>
				<tr
					class="border-b border-line font-data text-xs tracking-[0.12em] text-ink-3 uppercase *:font-normal"
				>
					<th scope="col" class="w-14 py-3 pl-4 text-left sm:w-[76px] sm:pl-5">Year</th>
					<th scope="col" class="text-left">Edition</th>
					<th scope="col" class="w-24 text-left lg:w-[170px] {DOTS}">Medals</th>
					{#each MEDALS as medal (medal.key)}
						<th scope="col" class="w-11 text-center max-sm:hidden">
							<abbr title={medal.title} class="no-underline">{medal.letter}</abbr>
						</th>
					{/each}
					<th scope="col" class="w-14 text-center">Total</th>
					<th scope="col" class="w-14 pr-4 sm:w-[130px] sm:pr-5">
						<span class="sr-only">Medallists</span>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as item (item.edition.slug)}
					{@const { edition, tally } = item}
					{@const expanded = open === edition.slug}
					<tr
						id="edition-{edition.slug}"
						class="scroll-mt-4 {expanded ? 'bg-brand-soft' : 'border-b border-line'} {tally
							? ''
							: 'text-ink-3'}"
					>
						<th
							scope="row"
							class="py-[11px] pr-2 pl-4 text-left font-display text-[22px] leading-none font-bold sm:pl-5 sm:text-[26px]"
						>
							{edition.year}
						</th>
						<td class="py-[11px] pr-2">
							<a
								href={meetingUrl(champ.slug, edition.slug)}
								class="flex min-w-0 flex-col gap-px hover:text-brand-ink"
							>
								<strong class="text-[14.5px] font-semibold">{edition.city ?? edition.name}</strong>
								<span class="text-xs text-ink-3">{formatOrdinal(item.ordinal)} edition</span>
							</a>
						</td>
						<td class={DOTS}>
							{#if tally}
								<span class="flex flex-wrap gap-[3px] pr-3">
									<MedalDots {tally} {most} />
								</span>
							{:else}
								<span class="text-[12.5px]">No medal</span>
							{/if}
						</td>
						{#each MEDALS as medal (medal.key)}
							{@const count = tally?.[medal.key] ?? 0}
							<td
								class="{COUNT} {medal.key === 'gold' ? 'font-bold' : ''} {count
									? medal.key === 'gold'
										? 'text-brand-ink'
										: 'text-ink-2'
									: 'text-ink-3'}"
							>
								{tally ? count : '–'}
							</td>
						{/each}
						<td class="text-center font-data text-[17px] font-bold">{tally?.total ?? '–'}</td>
						<td class="pr-4 sm:pr-5">
							{#if tally}
								<button
									type="button"
									aria-expanded={expanded}
									aria-label="Medallists, {edition.year}"
									onclick={() => (open = expanded ? null : edition.slug)}
									class="ml-auto flex h-[30px] items-center gap-1.5 rounded-lg border px-2 text-[12.5px] font-bold sm:px-2.5 {expanded
										? 'border-ink bg-surface'
										: 'border-line-2 hover:border-ink'}"
								>
									<span aria-hidden="true" class="max-sm:hidden">Medallists</span>
									<ChevronDownIcon class="size-3 {expanded ? 'rotate-180' : ''}" />
								</button>
							{/if}
						</td>
					</tr>
					{#if expanded}
						<tr class="border-b border-line bg-brand-soft">
							<td colspan="8" class="px-4 pt-1 pb-3.5 sm:pr-5 lg:pl-[96px]">
								<EditionMedallists
									url={editionMedalsUrl(champ.id, countryCode, edition.year)}
									details={details(edition.year)}
									{today}
								/>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
			<tfoot>
				<tr class="bg-ink text-night-ink">
					<th scope="row" class="py-3.5 pl-4 text-left font-display text-[22px] font-bold sm:pl-5">
						Total
					</th>
					<td class="text-[13px] text-night-ink-3">
						{facts.onPodium} of {facts.held} editions on the podium
					</td>
					<td class={DOTS}></td>
					{#each MEDALS as medal (medal.key)}
						<td
							class="text-center font-data text-base font-bold max-sm:hidden {medal.key === 'gold'
								? 'text-brand'
								: ''}"
						>
							{total[medal.key]}
						</td>
					{/each}
					<td class="text-center font-data text-[19px] font-bold text-brand">{total.total}</td>
					<td></td>
				</tr>
			</tfoot>
		</table>
	</div>
</section>
