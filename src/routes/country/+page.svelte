<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { page } from '$app/state';
	import CountryDirectory from '#lib/components/country/CountryDirectory.svelte';
	import OlympicTable from '#lib/components/country/OlympicTable.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { areaTabOf } from '#lib/domain/country.js';
	import { countryUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const active = $derived(areaTabOf(page.url.searchParams.get('area')));
	const olympicMedals = $derived(
		new Map(data.olympic.map((nation) => [nation.country.code, nation.total]))
	);
</script>

<SeoHead
	title="Countries – athletics medals by nation"
	description="{data.countries
		.length} nations and territories in athletics: medals by championship, the most decorated athletes and the all-time Olympic table."
	path={PAGES.countries}
	fallbackImage="countries"
/>
<JsonLd
	data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Countries', path: PAGES.countries }])]}
/>

<div class="pb-16">
	<CountryDirectory countries={data.countries} {olympicMedals} {active}>
		{#snippet aside()}
			{#if data.olympic.length}<OlympicTable nations={data.olympic} />{/if}
			{#if data.teams.length}
				<div class="rounded-[20px] bg-surface-2 px-5 py-[18px]">
					<h2 class="mb-2 text-sm font-bold">Teams & neutral entries</h2>
					<ul class="flex flex-wrap gap-1.5">
						{#each data.teams as team (team.code)}
							<li>
								<a
									href={countryUrl(team.code)}
									class="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-line bg-surface px-[9px] text-[12.5px] hover:border-ink"
								>
									<span class="font-data font-bold text-ink-3">{team.code}</span>{team.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/snippet}
	</CountryDirectory>
</div>
