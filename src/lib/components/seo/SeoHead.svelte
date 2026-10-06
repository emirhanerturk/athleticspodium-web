<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { pageTitle } from '#lib/seo/titles.js';

	let {
		title,
		description,
		path,
		image,
		noindex = false
	}: {
		title: string;
		description: string;
		path: string;
		image?: string;
		noindex?: boolean;
	} = $props();

	const canonical = $derived(PUBLIC_SITE_URL + path);
	const fullTitle = $derived(pageTitle(title));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}<meta name="robots" content="noindex, follow" />{/if}
	<meta property="og:site_name" content="Athletics Podium" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:card" content="summary_large_image" />
	{:else}
		<meta name="twitter:card" content="summary" />
	{/if}
</svelte:head>
