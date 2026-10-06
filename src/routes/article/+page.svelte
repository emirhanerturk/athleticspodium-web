<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { formatCount } from '#lib/format/number.js';
	import { articlesUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const path = $derived(articlesUrl(data.page));
</script>

<SeoHead
	title="Articles{data.page > 1
		? `, page ${data.page}`
		: ''} – athletics history and championship reports"
	description="Stories from the Athletics Podium archive: championship reports, records, numbers and the history of athletics."
	{path}
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Articles', path: PAGES.articles }])]} />

<section class="page-container pt-12 pb-16">
	<div class="mb-8 flex flex-col gap-3">
		<span class="font-data text-xs tracking-[0.16em] text-ink-3 uppercase">
			{formatCount(data.count)} articles
		</span>
		<h1 class="font-display text-[56px] leading-[0.86] font-bold sm:text-[104px]">Articles</h1>
		<p class="max-w-[600px] text-base leading-[1.55] text-ink-2">
			Championship reports, records and numbers, and the history behind the medals.
		</p>
	</div>
	<StoryCards stories={data.articles} />
	<div class="mt-8">
		<Pagination page={data.page} lastPage={data.lastPage} href={articlesUrl} />
	</div>
</section>
