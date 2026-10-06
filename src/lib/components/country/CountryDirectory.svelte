<script lang="ts">
	import type { Snippet } from 'svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import SearchIcon from '#lib/components/ui/icons/SearchIcon.svelte';
	import {
		AREA_TABS,
		groupByInitial,
		inArea,
		matchesCountry,
		type AreaTab,
		type CountryListing
	} from '#lib/domain/country.js';
	import { countriesUrl, countryUrl } from '#lib/routing/urls.js';

	let {
		countries,
		olympicMedals,
		active,
		aside
	}: {
		countries: CountryListing[];
		olympicMedals: Map<string, number>;
		active: AreaTab;
		aside: Snippet;
	} = $props();

	let query = $state('');
	let sort = $state<'name' | 'olympic'>('name');

	const searching = $derived(query.trim().length > 0);
	const shown = $derived(
		countries.filter((country) =>
			searching ? matchesCountry(country, query) : inArea(country, active)
		)
	);
	const medalsOf = (country: CountryListing) => olympicMedals.get(country.code) ?? 0;
	const groups = $derived.by(() => {
		if (sort === 'name' || searching) return groupByInitial(shown);
		const ranked = [...shown].sort((a, b) => medalsOf(b) - medalsOf(a));
		return [
			{ initial: 'OG', items: ranked.filter((country) => medalsOf(country) > 0) },
			{ initial: '—', items: ranked.filter((country) => medalsOf(country) === 0) }
		].filter((group) => group.items.length);
	});
	const countIn = (tab: AreaTab) => countries.filter((country) => inArea(country, tab)).length;

	function revealInStrip(tab: HTMLElement) {
		const strip = tab.parentElement;
		if (!strip) return;
		const offset = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left;
		strip.scrollLeft += offset - strip.clientWidth / 2 + tab.clientWidth / 2;
	}
</script>

<section class="page-container pt-12 pb-7">
	<div class="grid grid-cols-1 items-end gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
		<div class="flex flex-col gap-3.5">
			<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
				{countries.length} nations & territories · 5 areas
			</span>
			<h1 class="font-display text-[56px] leading-[0.86] font-bold sm:text-[120px]">Countries</h1>
			<p class="max-w-[560px] text-base leading-[1.55] text-ink-2">
				Every federation that has stood on a podium in the archive, with its medals by championship,
				its most decorated athletes and the stories behind them.
			</p>
		</div>
		<div class="flex flex-col gap-3">
			<label
				class="flex h-[60px] items-center gap-3 rounded-2xl border-2 border-ink bg-surface px-5 text-ink-3"
			>
				<SearchIcon class="size-5" />
				<input
					type="search"
					bind:value={query}
					aria-label="Find a country"
					placeholder="Find a country or code, e.g. Kenya, JAM"
					class="min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none"
				/>
				<span class="font-data text-[13.5px] whitespace-nowrap" aria-live="polite">
					{shown.length} shown
				</span>
			</label>
			<span class="text-[13px] text-ink-3">
				Tip: type an IOC code to jump straight to it. Teams and neutral entries are listed
				separately.
			</span>
		</div>
	</div>
</section>

<div class="sticky top-0 z-[5] border-b border-line bg-bg">
	<div class="page-container flex items-center gap-1.5">
		<nav
			aria-label="Areas"
			class="flex min-w-0 flex-1 [scrollbar-width:none] gap-1.5 overflow-x-auto"
		>
			{#each AREA_TABS as tab (tab.label)}
				{@const current = tab === active && !searching}
				<a
					href={countriesUrl(tab.slug ?? undefined)}
					aria-current={current ? 'page' : undefined}
					{@attach current && revealInStrip}
					data-sveltekit-noscroll
					data-sveltekit-replacestate
					data-sveltekit-keepfocus
					class="inline-flex flex-none items-baseline gap-2 border-b-[3px] px-3.5 pt-4 pb-3.5 text-[15px] font-bold hover:text-ink {current
						? 'border-brand text-ink'
						: 'border-transparent text-ink-2'}"
				>
					{tab.label}
					<span class="font-data text-[13.5px] font-semibold text-ink-3">{countIn(tab)}</span>
				</a>
			{/each}
		</nav>
		<label class="hidden flex-none items-center gap-2 text-[13.5px] text-ink-2 sm:inline-flex">
			Sort
			<select
				bind:value={sort}
				class="h-[34px] rounded-[10px] border border-line-2 bg-surface px-2.5 font-semibold"
			>
				<option value="name">A–Z</option>
				<option value="olympic">Most Olympic medals</option>
			</select>
		</label>
	</div>
</div>

<section class="page-container pt-8">
	<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
		<div class="flex flex-col gap-7">
			{#if !shown.length}
				<p class="rounded-[20px] border border-dashed border-line-2 p-10 text-center text-ink-2">
					No country matches “{query.trim()}”. Try the IOC code, or the name in English.
				</p>
			{/if}
			{#each groups as group (group.initial)}
				<div
					class="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-4"
				>
					<span
						class="sticky top-16 font-display text-[36px] leading-[0.9] font-bold text-ink-3 sm:text-5xl"
					>
						{group.initial}
					</span>
					<ul class="grid grid-cols-[repeat(auto-fill,minmax(min(210px,100%),1fr))] gap-2.5">
						{#each group.items as country (country.code)}
							<li>
								<a
									href={countryUrl(country.code)}
									class="flex min-w-0 items-center gap-3 rounded-[14px] border border-line bg-surface px-3.5 py-3 hover:border-ink"
								>
									<Flag
										code={country.code}
										class="h-[30px] w-10 shadow-[0_0_0_1px_var(--color-line)]"
									/>
									<span class="flex min-w-0 flex-col gap-px">
										<strong class="truncate text-[14.5px] leading-tight font-semibold">
											{country.name}
										</strong>
										<span class="font-data text-[13px] tracking-[0.04em] text-ink-3">
											{country.code}{#if medalsOf(country)}&nbsp;· <span
													class="font-bold text-brand-ink">{medalsOf(country)}</span
												> OG medals{/if}
										</span>
									</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		<aside class="flex flex-col gap-5 lg:sticky lg:top-[72px]">
			{@render aside()}
		</aside>
	</div>
</section>
