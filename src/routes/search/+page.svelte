<script lang="ts">
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import AthleteResults from '#lib/components/search/AthleteResults.svelte';
	import Highlighted from '#lib/components/search/Highlighted.svelte';
	import RecentSearches from '#lib/components/search/RecentSearches.svelte';
	import RefineAthletes from '#lib/components/search/RefineAthletes.svelte';
	import SearchQueryBar from '#lib/components/search/SearchQueryBar.svelte';
	import TopResult from '#lib/components/search/TopResult.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { areaName } from '#lib/domain/championship.js';
	import { PAGE_SIZE, topResultOf, type SearchScope } from '#lib/domain/search.js';
	import { formatCount } from '#lib/format/number.js';
	import { champUrl, countryUrl, PAGES, searchUrl } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const request = $derived(data.request);
	const overview = $derived(data.overview);
	const results = $derived(data.scoped ?? overview);
	const counts = $derived(
		overview && {
			athletes: overview.athletes?.count ?? 0,
			champs: overview.champs?.count ?? 0,
			countries: overview.countries?.count ?? 0,
			articles: overview.articles?.count ?? 0
		}
	);
	const total = $derived(counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : 0);
	const top = $derived(
		overview && request.scope === 'all' ? topResultOf(request.query, overview) : null
	);
	const shows = (scope: Exclude<SearchScope, 'all'>) =>
		(request.scope === 'all' || request.scope === scope) && !!results?.[scope]?.rows.length;
	const lastPage = $derived(
		request.scope === 'all' || !counts
			? 1
			: Math.max(1, Math.ceil(counts[request.scope] / PAGE_SIZE))
	);
	const moreLink = (scope: Exclude<SearchScope, 'all'>, label: string) =>
		request.scope === 'all' && counts && counts[scope] > (results?.[scope]?.rows.length ?? 0)
			? {
					href: searchUrl({ ...request, scope, page: 1 }),
					label: `Show all ${formatCount(counts[scope])} ${label}`
				}
			: null;

	const H2 = 'font-display text-[32px] leading-none font-bold';
	const COUNT = 'font-data text-[15.5px] font-semibold text-ink-3';
	const HEAD = 'mb-3.5 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2.5';
	const IDLE = [
		{
			title: 'Athletes',
			note: 'Every medallist in the archive, by name, country or era.',
			href: PAGES.athletes
		},
		{
			title: 'Championships',
			note: 'Global, continental, regional, national and road.',
			href: PAGES.champs
		},
		{
			title: 'Countries',
			note: 'Nations and territories with their medal history.',
			href: PAGES.countries
		}
	];
</script>

<SeoHead
	title={request.query ? `Search: ${request.query}` : 'Search'}
	description="Search every athlete, championship, country and story in the Athletics Podium archive."
	path={PAGES.search}
	noindex
/>

<SearchQueryBar {request} {counts} />

{#snippet more(link: { href: string; label: string } | null)}
	{#if link}
		<a
			href={link.href}
			class="mt-3.5 inline-flex h-10 items-center rounded-xl border border-line-2 bg-surface px-4 text-sm font-semibold hover:border-ink"
			>{link.label}</a
		>
	{/if}
{/snippet}

<section class="page-container pt-8 pb-[72px]">
	{#if !overview}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
			{#each IDLE as card (card.href)}
				<a
					href={card.href}
					class="flex flex-col gap-2 rounded-[20px] border border-line bg-surface p-[22px] hover:border-ink"
				>
					<strong class="font-display text-[30px] leading-none font-bold">{card.title}</strong>
					<span class="text-sm text-ink-2">{card.note}</span>
				</a>
			{/each}
			<a
				href={PAGES.medalSearch}
				class="flex flex-col gap-2 rounded-[20px] bg-ink p-[22px] text-night-ink hover:shadow-[0_0_0_2px_var(--color-brand)]"
			>
				<strong class="font-display text-[30px] leading-none font-bold text-brand"
					>Medal search</strong
				>
				<span class="text-sm text-night-ink-3"
					>Filter every podium by event, year, championship and nation.</span
				>
			</a>
		</div>
	{:else if !total}
		<div class="flex max-w-[760px] flex-col gap-5 py-10">
			<strong class="font-display text-[44px] leading-[0.94] font-bold sm:text-[56px]"
				>Nothing for “{request.query}”</strong
			>
			<p class="text-base leading-relaxed text-ink-2">
				Names in the archive are spelled as they appear on the start list: try the surname alone,
				drop accents, or use an IOC code like <strong>KEN</strong>. Looking for a performance rather
				than a person? The medal search filters by event, year and championship.
			</p>
			<div class="flex flex-wrap gap-2.5">
				<a
					href={PAGES.medalSearch}
					class="inline-flex h-11 items-center rounded-xl bg-ink px-[18px] font-bold text-bg"
					>Open medal search →</a
				>
				<a
					href={PAGES.search}
					class="inline-flex h-11 items-center rounded-xl border border-line-2 bg-surface px-[18px] font-semibold"
					>Start over</a
				>
			</div>
		</div>
	{:else}
		<div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
			<div class="flex min-w-0 flex-col gap-10">
				{#if top}<TopResult result={top} />{/if}

				{#if shows('athletes') && results?.athletes}
					<div>
						<div class={HEAD}>
							<h2 class={H2}>
								Athletes <span class={COUNT}>{formatCount(results.athletes.count)}</span>
							</h2>
						</div>
						<AthleteResults athletes={results.athletes.rows} query={request.query} />
						{@render more(moreLink('athletes', 'athletes'))}
					</div>
				{/if}

				{#if shows('champs') && results?.champs}
					<div>
						<div class={HEAD}>
							<h2 class={H2}>
								Championships <span class={COUNT}>{formatCount(results.champs.count)}</span>
							</h2>
						</div>
						<ul class="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-2.5">
							{#each results.champs.rows as champ (champ.id)}
								<li>
									<a
										href={champUrl(champ.slug)}
										class="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 hover:border-ink"
									>
										<span
											class="inline-flex h-5 items-center self-start rounded-full bg-surface-2 px-2 font-data text-[11px] font-bold tracking-[0.06em] text-ink-2 uppercase"
											>{areaName(champ.category)}</span
										>
										<strong class="text-base leading-snug font-semibold"
											><Highlighted text={champ.name} query={request.query} /></strong
										>
									</a>
								</li>
							{/each}
						</ul>
						{@render more(moreLink('champs', 'championships'))}
					</div>
				{/if}

				{#if shows('countries') && results?.countries}
					<div>
						<div class={HEAD}>
							<h2 class={H2}>
								Countries & teams <span class={COUNT}>{formatCount(results.countries.count)}</span>
							</h2>
						</div>
						<ul class="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-2.5">
							{#each results.countries.rows as country (country.code)}
								<li>
									<a
										href={countryUrl(country.code)}
										class="flex items-center gap-3 rounded-[14px] border border-line bg-surface px-3.5 py-3 hover:border-ink"
									>
										<Flag
											code={country.code}
											class="h-[27px] w-9 shadow-[0_0_0_1px_var(--color-line)]"
										/>
										<span class="flex min-w-0 flex-col gap-px">
											<strong class="truncate text-[14.5px] font-semibold"
												><Highlighted text={country.name} query={request.query} /></strong
											>
											<span class="font-data text-xs text-ink-3">{country.code}</span>
										</span>
									</a>
								</li>
							{/each}
						</ul>
						{@render more(moreLink('countries', 'countries'))}
					</div>
				{/if}

				{#if shows('articles') && results?.articles}
					<div>
						<div class={HEAD}>
							<h2 class={H2}>
								Stories <span class={COUNT}>{formatCount(results.articles.count)}</span>
							</h2>
						</div>
						<StoryCards stories={results.articles.rows} />
						{@render more(moreLink('articles', 'stories'))}
					</div>
				{/if}

				{#if request.scope !== 'all' && !results?.[request.scope]?.rows.length}
					<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
						No {request.scope === 'articles'
							? 'stories'
							: request.scope === 'champs'
								? 'championships'
								: request.scope} on this page for “{request.query}”.
					</p>
				{/if}

				{#if request.scope !== 'all' && lastPage > 1}
					<Pagination
						page={request.page}
						{lastPage}
						href={(page) => searchUrl({ ...request, page })}
					/>
				{/if}
			</div>
			<aside class="flex flex-col gap-4 lg:sticky lg:top-6">
				<RefineAthletes {request} />
				<RecentSearches current={request.query} />
				<div class="flex flex-col gap-2 px-1 py-0.5 text-[13px] leading-normal text-ink-3">
					<strong class="text-ink-2">Search tips</strong>
					<span
						>Type an IOC code (<strong>KEN</strong>, <strong>JAM</strong>) to jump to a country.</span
					>
					<span>Accents are optional: <strong>ozturk</strong> finds Öztürk.</span>
					<span
						>Looking for results, not people? <a
							href={PAGES.medalSearch}
							class="font-semibold text-brand-ink">Medal search →</a
						></span
					>
				</div>
			</aside>
		</div>
	{/if}
</section>
