<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { page } from '$app/state';
	import ChampionshipDirectory from '#lib/components/championship/ChampionshipDirectory.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { archiveExtent, categoryGroupOf } from '#lib/domain/championship.js';
	import { PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import { championshipsDescription, championshipsTitle } from '#lib/seo/titles.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const active = $derived(categoryGroupOf(page.url.searchParams.get('category')));
</script>

<SeoHead
	title={championshipsTitle()}
	description={championshipsDescription(data.champs.length, archiveExtent(data.champs))}
	path={PAGES.champs}
	fallbackImage="championships"
/>
<JsonLd
	data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Championships', path: PAGES.champs }])]}
/>

<ChampionshipDirectory champs={data.champs} {active} currentYear={data.year} />

<section class="page-container pt-8 pb-[72px]">
	<div
		class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-2 px-6 py-[22px]"
	>
		<span class="flex flex-col gap-1">
			<strong class="text-[17px]">A championship or an edition missing?</strong>
			<span class="text-sm text-ink-2">
				The archive grows from readers’ corrections. Send what you know and the source.
			</span>
		</span>
		<a
			href={PAGES.missingInformation}
			class="inline-flex h-[46px] items-center rounded-full bg-ink px-5 text-[14.5px] font-bold text-bg hover:opacity-90"
		>
			Send missing information
		</a>
	</div>
</section>
