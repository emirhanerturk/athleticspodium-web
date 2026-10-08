<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { navigating, page } from '$app/state';
	import CountryAthletesFilters from '#lib/components/country/CountryAthletesFilters.svelte';
	import CountryAthletesHero from '#lib/components/country/CountryAthletesHero.svelte';
	import CountryAthleteTable from '#lib/components/country/CountryAthleteTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import PageNumbers from '#lib/components/ui/PageNumbers.svelte';
	import { isNarrowed } from '#lib/domain/country-athletes.js';
	import { formatCount } from '#lib/format/number.js';
	import { countryAthletesUrl, countryUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import { countryAthletesTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const country = $derived(data.country);
	const query = $derived(data.query);
	const crumbs = $derived([
		{ name: 'Countries', path: PAGES.countries },
		{ name: country.name, path: countryUrl(country.code) },
		{ name: 'Athletes', path: countryAthletesUrl(country.code) }
	]);
	const shown = $derived(
		`Showing ${formatCount(data.offset + 1)}–${formatCount(data.offset + data.rows.length)} of ${formatCount(data.matched)}`
	);
	const busy = $derived(navigating.to?.url.pathname === page.url.pathname);
</script>

<SeoHead
	title={countryAthletesTitle(country, query.page)}
	description="Athletes from {country.name} ranked by international medals: gold, silver and bronze at global, continental and regional championships."
	path={countryAthletesUrl(country.code, query)}
	fallbackImage="countries"
	noindex={isNarrowed(query)}
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<CountryAthletesHero
	{country}
	counts={data.counts}
	crumbs={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

{#if data.counts.medallists}
	<div id="athletes"></div>
	<CountryAthletesFilters code={country.code} {query} />
	<section class="page-container pt-[22px] pb-16">
		<h2 class="sr-only">Athletes</h2>
		<div
			aria-busy={busy}
			class="rounded-[18px] border border-line bg-surface transition-opacity duration-150 {busy
				? 'opacity-60'
				: ''}"
		>
			{#if data.rows.length}
				<CountryAthleteTable
					athletes={data.rows}
					offset={data.offset}
					mostMedals={data.counts.mostMedals}
					today={data.today}
				/>
				<div class="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3.5 sm:px-5">
					<span class="text-[13.5px] text-ink-3">{shown}</span>
					<PageNumbers
						page={query.page}
						pageCount={data.pageCount}
						href={(number) =>
							`${countryAthletesUrl(country.code, { ...query, page: number })}#athletes`}
					/>
				</div>
			{:else}
				<p class="px-6 py-9 text-center text-ink-2">
					No medallist from {country.name} matches these filters.
					<a
						href={countryAthletesUrl(country.code, { sort: query.sort })}
						data-sveltekit-reset="false"
						class="font-semibold text-ink underline underline-offset-4 hover:text-brand-ink"
						>Clear filters</a
					>
				</p>
			{/if}
		</div>
		<p class="mt-3.5 text-[13px] text-ink-3">
			Only international medals count: national championship titles are left out.
		</p>
	</section>
{:else}
	<section class="page-container pt-7 pb-16">
		<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
			No international medallists from {country.name} are in the archive yet.
		</p>
	</section>
{/if}
