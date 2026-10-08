<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { localIsoDateOf } from '#lib/domain/date.js';
	import { dayOfDate } from '#lib/domain/day.js';
	import { onThisDayUrl, PAGES } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => {
		goto(onThisDayUrl(dayOfDate(localIsoDateOf(new Date()))), { replace: true });
	});
</script>

<SeoHead
	title="On this day"
	description="The athletes born and died on today’s date."
	path={PAGES.onThisDay}
	noindex
/>

<section class="page-container flex flex-col items-start gap-4 py-24">
	<h1 class="font-display text-6xl leading-none font-bold">On this day</h1>
	<p class="text-lg text-ink-2">Opening today’s page…</p>
	<a href={onThisDayUrl(data.serverDay)} class="font-semibold text-brand-ink hover:underline">
		Today’s athletes →
	</a>
</section>
