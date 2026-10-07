<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import CountryAthleteTable from '#lib/components/country/CountryAthleteTable.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { countryAthletesUrl, countryUrl, flagUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import { countryAthletesTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const country = $derived(data.country);
	const path = $derived(countryAthletesUrl(country.code, data.page));
	const crumbs = $derived([
		{ name: 'Countries', path: PAGES.countries },
		{ name: country.name, path: countryUrl(country.code) },
		{ name: 'Athletes', path }
	]);
</script>

<SeoHead
	title={countryAthletesTitle(country, data.page)}
	description="Athletes from {country.name} ranked by international medals: gold, silver and bronze at global, continental and regional championships."
	{path}
	fallbackImage="countries"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

<section class="page-container pt-7 pb-16">
	<div class="mb-7 flex flex-wrap items-center gap-5">
		<img
			src={flagUrl(country.code)}
			alt=""
			width="84"
			height="56"
			class="h-14 w-[84px] rounded-lg object-cover shadow-[0_0_0_1px_var(--color-line)]"
		/>
		<div class="flex flex-col gap-1.5">
			<h1 class="font-display text-[44px] leading-[0.94] font-bold sm:text-[64px]">
				{country.name} athletes
			</h1>
			<span class="text-[15px] text-ink-2">Ranked by international medals</span>
		</div>
	</div>
	{#if data.athletes.length}
		<CountryAthleteTable athletes={data.athletes} offset={data.offset} today={data.today} />
		<div class="mt-6">
			<Pagination
				page={data.page}
				lastPage={data.hasMore ? null : data.page}
				href={(page) => countryAthletesUrl(country.code, page)}
			/>
		</div>
	{:else}
		<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
			No international medallists from {country.name} are in the archive yet.
		</p>
	{/if}
</section>
