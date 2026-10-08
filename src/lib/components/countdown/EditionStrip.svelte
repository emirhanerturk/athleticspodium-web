<script lang="ts">
	import type { EditionRef } from '#lib/domain/championship.js';
	import { DOT_LIMIT, type CountdownEdition } from '#lib/domain/countdown.js';
	import { meetingUrl } from '#lib/routing/urls.js';
	import MedalDots from './MedalDots.svelte';

	let {
		editions,
		next,
		champSlug,
		open = $bindable()
	}: {
		editions: CountdownEdition[];
		next: EditionRef | null;
		champSlug: string;
		open: string | null;
	} = $props();

	const chronological = $derived(editions.toReversed());
	const most = $derived(Math.max(1, ...editions.map((item) => item.tally?.total ?? 0)));
	const from = $derived(chronological[0]?.edition.year);
	const to = $derived(next?.year ?? editions[0]?.edition.year);

	const label = (item: CountdownEdition) =>
		`${item.edition.year} ${item.edition.city ?? item.edition.name}: ${
			item.tally ? `${item.tally.total} ${item.tally.total === 1 ? 'medal' : 'medals'}` : 'no medal'
		}`;
	const YEAR = 'mt-1.5 h-10 rotate-180 font-data text-[11.5px] [writing-mode:vertical-rl]';
	const COLUMN =
		'flex h-[230px] flex-col items-center justify-end gap-[3px] rounded-[10px] pt-1.5 pb-1';
</script>

<section class="rounded-[20px] border border-line bg-surface px-5 pt-[18px] pb-3.5">
	<div class="mb-3 flex flex-wrap items-baseline justify-between gap-2.5">
		<h2 class="font-display text-[26px] leading-none font-bold">Every edition, {from}–{to}</h2>
		<span class="text-[13px] text-ink-3">
			{most <= DOT_LIMIT ? 'One dot per medal' : 'Bars grow with the medals won'} · empty column = no
			medal · click a year
		</span>
	</div>
	<div class="overflow-x-auto">
		<ol class="grid auto-cols-[minmax(26px,1fr)] grid-flow-col items-end gap-1">
			{#each chronological as item (item.edition.slug)}
				{@const tally = item.tally}
				{@const current = open === item.edition.slug}
				<li>
					<a
						href="#edition-{item.edition.slug}"
						aria-label={label(item)}
						title={label(item)}
						onclick={() => (open = tally ? item.edition.slug : null)}
						class="{COLUMN} hover:bg-brand-soft {current
							? 'bg-brand-soft ring-2 ring-brand ring-inset'
							: tally
								? 'bg-bg'
								: ''}"
					>
						{#if tally}
							<MedalDots {tally} {most} vertical />
						{:else}
							<span class="h-[3px] w-[13px] rounded-sm bg-line-2"></span>
						{/if}
						<span class="{YEAR} {tally ? 'font-bold text-ink' : 'font-medium text-ink-3'}">
							{item.edition.year}
						</span>
					</a>
				</li>
			{/each}
			{#if next}
				<li>
					<a
						href={meetingUrl(champSlug, next.slug)}
						title="{next.year} {next.city ?? next.name}: next edition"
						class="{COLUMN} hover:bg-brand-soft"
					>
						<span class="size-[13px] rounded-full border-2 border-dashed border-up"></span>
						<span class="{YEAR} font-semibold text-up">{next.year}</span>
					</a>
				</li>
			{/if}
		</ol>
	</div>
</section>
