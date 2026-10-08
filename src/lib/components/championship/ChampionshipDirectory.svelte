<script lang="ts">
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import ChevronDownIcon from '#lib/components/ui/icons/ChevronDownIcon.svelte';
	import {
		archiveExtent,
		CATEGORY_GROUPS,
		filterByName,
		SORT_LABELS,
		sortChampionships,
		timelineRange,
		type CategoryGroup,
		type ChampionshipSort,
		type ChampionshipSummary
	} from '#lib/domain/championship.js';
	import { PAGES } from '#lib/routing/urls.js';
	import ChampionshipCard from './ChampionshipCard.svelte';

	let {
		champs,
		active,
		currentYear
	}: { champs: ChampionshipSummary[]; active: CategoryGroup; currentYear: number } = $props();

	let query = $state('');
	let sort = $state<ChampionshipSort>('rank');

	const extent = $derived(archiveExtent(champs));
	const range = $derived(
		extent ? timelineRange(extent) : { from: currentYear - 100, to: currentYear + 5 }
	);
	const matching = $derived(filterByName(champs, query));
	const countOf = (group: CategoryGroup) =>
		matching.filter((champ) => champ.category === group.category).length;
	const shown = $derived(
		sortChampionships(
			matching.filter((champ) => champ.category === active.category),
			sort
		)
	);

	const tabHref = (group: CategoryGroup) =>
		group === CATEGORY_GROUPS[0] ? PAGES.champs : `${PAGES.champs}?category=${group.slug}`;
	const sorts = Object.entries(SORT_LABELS) as [ChampionshipSort, string][];

	function revealInStrip(tab: HTMLElement) {
		const strip = tab.parentElement;
		if (!strip) return;
		const offset = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left;
		strip.scrollLeft += offset - strip.clientWidth / 2 + tab.clientWidth / 2;
	}
</script>

<section class="page-container pt-12 pb-6">
	<div class="grid grid-cols-1 items-end gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
		<div class="flex flex-col gap-4">
			{#if extent}
				<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
					{champs.length} championships · {extent.first.year} – {extent.last.year}
				</span>
			{/if}
			<h1 class="font-display text-[52px] leading-[0.94] font-bold sm:text-8xl">Championships</h1>
			{#if extent}
				<p class="max-w-[640px] text-lg leading-[1.55] text-ink-2">
					From the {extent.first.year}
					{extent.first.name} to the {extent.last.year}
					{extent.last.name}. Every dot below is an edition in the archive.
				</p>
			{/if}
		</div>
		<div class="flex flex-wrap justify-end gap-2.5">
			<label
				class="flex h-12 flex-[1_1_260px] items-center gap-2.5 rounded-xl border border-line-2 bg-surface px-3.5 text-ink-3 focus-within:border-ink"
			>
				<SearchIcon />
				<input
					type="search"
					bind:value={query}
					aria-label="Filter championships"
					placeholder="Filter by name"
					class="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none"
				/>
			</label>
			<label class="relative inline-flex items-center">
				<span class="sr-only">Sort</span>
				<select
					bind:value={sort}
					class="h-12 appearance-none rounded-xl border border-line-2 bg-surface pr-10 pl-3.5 text-[15px] font-semibold"
				>
					{#each sorts as [value, label] (value)}
						<option {value}>Sort: {label}</option>
					{/each}
				</select>
				<ChevronDownIcon class="pointer-events-none absolute right-3.5 size-3.5" />
			</label>
		</div>
	</div>
</section>

<div class="border-b border-line">
	<nav
		aria-label="Categories"
		class="page-container flex [scrollbar-width:none] gap-1 overflow-x-auto"
	>
		{#each CATEGORY_GROUPS as group (group.slug)}
			{@const current = group === active}
			<a
				href={tabHref(group)}
				aria-current={current ? 'page' : undefined}
				{@attach current && revealInStrip}
				data-sveltekit-reset="false"
				data-sveltekit-replacestate
				class="inline-flex h-[52px] flex-none items-center gap-2 px-3.5 text-[15px] {current
					? 'font-bold text-ink shadow-[inset_0_-3px_0_var(--color-brand)]'
					: 'font-medium text-ink-2 hover:text-ink'}"
			>
				{group.label}
				<span
					class="rounded-full px-[7px] py-0.5 font-data text-xs {current
						? 'bg-ink text-brand'
						: 'bg-surface-2 text-ink-3'}"
				>
					{countOf(group)}
				</span>
			</a>
		{/each}
	</nav>
</div>

<section class="page-container pt-7">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
		<span class="text-sm text-ink-2" aria-live="polite">
			<strong class="text-ink">{shown.length}</strong>
			{active.label}
			{shown.length === 1 ? 'championship' : 'championships'}{query.trim()
				? ` matching “${query.trim()}”`
				: ''}
		</span>
		<span class="flex flex-wrap items-center gap-4 text-[12.5px] text-ink-3">
			<span class="font-data">Timeline {range.from} → {range.to}</span>
			<span class="inline-flex items-center gap-1.5">
				<span class="size-2 rounded-full bg-ink-3"></span>held
			</span>
			<span class="inline-flex items-center gap-1.5">
				<span class="size-2 rounded-full border-[1.5px] border-ink bg-brand"></span>latest
			</span>
			<span class="inline-flex items-center gap-1.5">
				<span class="size-2 rounded-full border-[1.5px] border-up"></span>scheduled
			</span>
		</span>
	</div>
	{#if shown.length}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(min(380px,100%),1fr))] gap-3.5">
			{#each shown as champ (champ.id)}
				<ChampionshipCard {champ} {currentYear} {range} />
			{/each}
		</div>
	{:else}
		<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
			No {active.label.toLowerCase()} championship matches “{query.trim()}”.
		</p>
	{/if}
</section>
