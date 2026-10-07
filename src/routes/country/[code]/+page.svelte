<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import CountryHero from '#lib/components/country/CountryHero.svelte';
	import HostedMeetings from '#lib/components/country/HostedMeetings.svelte';
	import MedalOverview from '#lib/components/country/MedalOverview.svelte';
	import MostDecorated from '#lib/components/country/MostDecorated.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { CATEGORY_GROUPS } from '#lib/domain/championship.js';
	import { internationalMedals, nationalTitles } from '#lib/domain/country.js';
	import { countriesUrl, countryAthletesUrl, countryUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import { countryDescription, countryTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const country = $derived(data.country);
	const path = $derived(countryUrl(country.code));
	const international = $derived(internationalMedals(data.medals));
	const titles = $derived(nationalTitles(data.medals));
	const area = $derived(CATEGORY_GROUPS.find((group) => group.category === country.areas[0]));

	const crumbs = $derived([
		{ name: 'Countries', path: PAGES.countries },
		...(area ? [{ name: area.label, path: countriesUrl(area.slug) }] : []),
		{ name: country.name, path }
	]);
</script>

<SeoHead
	title={countryTitle(country)}
	description={countryDescription(country, international, titles)}
	{path}
	fallbackImage="countries"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<CountryHero
	{country}
	{international}
	nationalTitles={titles}
	crumbs={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

{#if data.medals.length}
	<MedalOverview
		countryCode={country.code}
		medals={data.medals}
		{international}
		nationalTitles={titles}
	/>
{/if}

{#if data.decorated.all.length}
	<MostDecorated
		lists={data.decorated}
		allHref={countryAthletesUrl(country.code)}
		countryName={country.name}
		today={data.today}
	/>
{/if}

{#if data.hosted.length || data.stories.length}
	<section
		class="page-container grid grid-cols-1 items-start gap-10 pt-12 pb-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
	>
		{#if data.hosted.length}
			<HostedMeetings meetings={data.hosted} countryName={country.name} today={data.today} />
		{/if}
		{#if data.stories.length}
			<div class="flex flex-col gap-4 {data.hosted.length ? '' : 'md:col-span-2'}">
				<h2 class="border-b-2 border-ink pb-2.5 font-display text-[30px] leading-none font-bold">
					Stories
				</h2>
				<StoryCards stories={data.stories} />
			</div>
		{/if}
	</section>
{/if}
