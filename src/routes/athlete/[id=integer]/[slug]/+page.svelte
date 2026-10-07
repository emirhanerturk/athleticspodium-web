<script lang="ts">
	import { PUBLIC_MEDIA_URL, PUBLIC_SITE_URL } from '$app/env/public';
	import StoryList from '#lib/components/article/StoryList.svelte';
	import AthleteHero from '#lib/components/athlete/AthleteHero.svelte';
	import ChampionshipTally from '#lib/components/athlete/ChampionshipTally.svelte';
	import NationalResults from '#lib/components/athlete/NationalResults.svelte';
	import OlympicCards from '#lib/components/athlete/OlympicCards.svelte';
	import Relatives from '#lib/components/athlete/Relatives.svelte';
	import ResultsTable from '#lib/components/athlete/ResultsTable.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import CollapsibleHtml from '#lib/components/ui/CollapsibleHtml.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import {
		careerSummary,
		internationalResults,
		medalsByChampionship,
		nationalResults,
		olympicAppearances
	} from '#lib/domain/career.js';
	import { tallyOf } from '#lib/domain/result.js';
	import { athleteUrl, countryUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd, personJsonLd } from '#lib/seo/json-ld.js';
	import { athleteDescription, athleteTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const athlete = $derived(data.athlete);
	const path = $derived(athleteUrl(athlete));
	const career = $derived(careerSummary(data.results));
	const international = $derived(internationalResults(data.results));
	const national = $derived(nationalResults(data.results));
	const internationalTallies = $derived(medalsByChampionship(international));
	const nationalTallies = $derived(medalsByChampionship(national));
	const olympics = $derived(olympicAppearances(data.olympics, data.results));

	const crumbs = $derived([
		{ name: 'Athletes', path: PAGES.athletes },
		...(athlete.country
			? [{ name: athlete.country.name, path: countryUrl(athlete.country.code) }]
			: []),
		{ name: fullName(athlete), path }
	]);

	const hasAside = $derived(
		olympics.length > 0 || data.stories.length > 0 || data.relatives.length > 0
	);
</script>

<SeoHead
	title={athleteTitle(athlete)}
	description={athleteDescription(athlete, career)}
	{path}
	image={athlete.image ? `${PUBLIC_MEDIA_URL}/${athlete.image.path}` : undefined}
/>
<JsonLd
	data={[
		personJsonLd({ siteUrl: PUBLIC_SITE_URL, mediaUrl: PUBLIC_MEDIA_URL }, athlete, path),
		breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)
	]}
/>

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

<AthleteHero {athlete} {career} {olympics} resultCount={data.results.length} today={data.today} />

{#if athlete.biography || hasAside}
	<section class="page-container pb-12">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
			<div>
				{#if athlete.biography}
					<article>
						<h2 class="mb-3.5 font-display text-[30px] leading-[0.94] font-bold sm:text-4xl">
							Biography
						</h2>
						<CollapsibleHtml html={athlete.biography} moreLabel="Read full biography" />
					</article>
				{/if}
			</div>
			{#if hasAside}
				<aside class="flex flex-col gap-7">
					{#if olympics.length}<OlympicCards appearances={olympics} />{/if}
					{#if data.stories.length}<StoryList stories={data.stories} />{/if}
					{#if data.relatives.length}<Relatives relatives={data.relatives} />{/if}
				</aside>
			{/if}
		</div>
	</section>
{/if}

{#if internationalTallies.length || nationalTallies.length}
	<section class="border-y border-line bg-surface">
		<div class="page-container grid grid-cols-1 gap-12 py-[52px] md:grid-cols-2">
			{#if internationalTallies.length}
				<ChampionshipTally
					title="By championship"
					totalLabel="International total"
					rows={internationalTallies}
					total={career.international}
				/>
			{/if}
			{#if nationalTallies.length}
				<ChampionshipTally
					title="National championships"
					totalLabel="National total"
					rows={nationalTallies}
					total={tallyOf(national)}
				/>
			{/if}
		</div>
	</section>
{/if}

{#if international.length}<ResultsTable results={international} />{/if}
{#if national.length}<NationalResults results={national} />{/if}

<div class="h-12"></div>
