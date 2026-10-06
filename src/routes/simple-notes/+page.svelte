<script lang="ts">
	import ArticleBody from '#lib/components/article/ArticleBody.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { PAGES } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead
	title="Simple notes on the database"
	description="The rules and notes behind the Athletics Podium database: what counts as a medal, how names, marks and relays are recorded."
	path={PAGES.simpleNotes}
/>

<section class="page-container pt-12 pb-16">
	<h1 class="mb-8 font-display text-[48px] leading-[0.9] font-bold sm:text-[80px]">
		Simple notes on the database
	</h1>
	{#if data.page.content}<ArticleBody html={data.page.content} />{/if}
</section>
