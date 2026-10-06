<script lang="ts">
	import { PUBLIC_MEDIA_URL, PUBLIC_SITE_URL } from '$app/env/public';
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import ChampionshipHero from '#lib/components/championship/ChampionshipHero.svelte';
	import ChampionshipLeaders from '#lib/components/championship/ChampionshipLeaders.svelte';
	import EditionStrip from '#lib/components/championship/EditionStrip.svelte';
	import GoDeeper from '#lib/components/championship/GoDeeper.svelte';
	import Programme from '#lib/components/championship/Programme.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import NationTable from '#lib/components/medal/NationTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import CollapsibleHtml from '#lib/components/ui/CollapsibleHtml.svelte';
	import { championshipFacts, programmeGrowth } from '#lib/domain/championship.js';
	import { champUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import { championshipDescription, championshipTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const champ = $derived(data.champ);
	const path = $derived(champUrl(champ.slug));
	const facts = $derived(championshipFacts(data.editions, data.today));
	const growth = $derived(programmeGrowth(data.editions, data.today));
	const hasProgramme = $derived(Object.values(data.programme).some((events) => events.length));

	const crumbs = $derived([
		{ name: 'Championships', path: PAGES.champs },
		{ name: champ.name, path }
	]);
</script>

<SeoHead
	title={championshipTitle(champ.name)}
	description={championshipDescription(champ.name, facts, data.nations.length)}
	{path}
	image={data.image ? `${PUBLIC_MEDIA_URL}/${data.image.path}` : undefined}
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
	class="page-container pt-5 pb-4"
/>

<ChampionshipHero {champ} image={data.image} {facts} nations={data.nations.length} />

<section
	class="page-container grid grid-cols-1 items-start gap-12 pb-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
>
	{#if data.history}
		<article aria-labelledby="history">
			<h2 id="history" class="sr-only">History</h2>
			<CollapsibleHtml html={data.history} moreLabel="Read the full history" />
		</article>
	{:else}
		<p class="text-[17px] leading-[1.65] text-ink-2">
			Every edition, medallist and record of the {champ.name} in one place.
		</p>
	{/if}
	<GoDeeper {champ} />
</section>

{#if data.editions.length}
	<EditionStrip
		champSlug={champ.slug}
		editions={data.editions}
		latest={facts.latest}
		today={data.today}
	/>
{/if}

{#if data.nations.length || data.leaders.length}
	<section
		class="page-container grid grid-cols-1 gap-12 py-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
	>
		{#if data.nations.length}
			<NationTable nations={data.nations} title="All-time medal table" />
		{/if}
		{#if data.leaders.length}
			<ChampionshipLeaders leaders={data.leaders} today={data.today} />
		{/if}
	</section>
{/if}

{#if hasProgramme}
	<Programme
		champId={champ.id}
		programme={data.programme}
		{growth}
		since={facts.first?.year ?? null}
	/>
{/if}

{#if data.stories.length}
	<section class="page-container pt-14 pb-[72px]">
		<h2 class="mb-[18px] font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
			Stories
		</h2>
		<StoryCards stories={data.stories} />
	</section>
{/if}
