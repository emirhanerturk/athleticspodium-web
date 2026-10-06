<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import MedalSearchForm from '#lib/components/medal/MedalSearchForm.svelte';
	import MedalSearchTable from '#lib/components/medal/MedalSearchTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { MEDAL_PAGE_SIZE } from '#lib/domain/medal-search.js';
	import { formatCount } from '#lib/format/number.js';
	import { countryChampsUrl, medalSearchUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const champ = $derived(data.champs.find((item) => item.id === query.champ));
	const country = $derived(data.countries.find((item) => item.code === query.country));
	const subject = $derived([champ?.name, country?.name, query.year].filter(Boolean).join(' · '));
	const lastPage = $derived(
		data.results ? Math.max(1, Math.ceil(data.results.count / MEDAL_PAGE_SIZE)) : 1
	);
	const path = $derived(medalSearchUrl({ ...query, order: 'year' }));
</script>

<SeoHead
	title={subject ? `${subject} – medal search` : 'Medal search – every athletics podium'}
	description={subject
		? `Every medal for ${subject}: year, event, athlete, country and mark.`
		: 'Search every athletics medal in the archive by championship, country, event, year, gender and medal.'}
	{path}
/>
<JsonLd
	data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Medal search', path: PAGES.medalSearch }])]}
/>

<section class="page-container pt-12 pb-6">
	<div class="mb-6 flex flex-col gap-3">
		<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">Medal tracker</span>
		<h1 class="font-display text-[52px] leading-[0.9] font-bold sm:text-[96px]">
			{subject || 'Medal search'}
		</h1>
		<p class="max-w-[640px] text-base leading-[1.55] text-ink-2">
			Every podium in the archive, filtered by championship, country, event, year, gender and medal.
		</p>
	</div>
	<MedalSearchForm
		{query}
		champs={data.champs}
		countries={data.countries}
		events={data.events}
		currentYear={data.year}
	/>
</section>

<section class="page-container pb-16">
	{#if data.results}
		{@const { count, tally, rows } = data.results}
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-[15px] text-ink-2">
			<span>
				{#if count}
					<strong class="text-ink">{formatCount(count)}</strong>
					{count === 1 ? 'result' : 'results'} ·
					<strong class="text-ink">{formatCount(tally.gold)}</strong> gold,
					<strong class="text-ink">{formatCount(tally.silver)}</strong> silver and
					<strong class="text-ink">{formatCount(tally.bronze)}</strong> bronze
				{:else}
					No medal matches these filters.
				{/if}
			</span>
			{#if query.champ && query.country}
				<a
					href={countryChampsUrl(query.country, query.champ)}
					class="text-sm font-semibold text-brand-ink hover:underline"
				>
					Medals by edition →
				</a>
			{/if}
		</div>
		{#if rows.length}
			<MedalSearchTable {rows} {query} today={data.today} />
			<div class="mt-6">
				<Pagination
					page={query.page}
					{lastPage}
					href={(page) => medalSearchUrl({ ...query, page })}
				/>
			</div>
		{/if}
	{:else}
		<p class="rounded-2xl border border-dashed border-line-2 px-6 py-8 text-center text-ink-2">
			Pick a championship or a country to see its medals.
		</p>
	{/if}
</section>
