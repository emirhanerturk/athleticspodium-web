<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { pageTitle } from '#lib/seo/titles.js';

	let { title, description, path }: { title: string; description: string; path: string } = $props();

	const canonical = $derived(PUBLIC_SITE_URL + path);
	const fullTitle = $derived(pageTitle(title));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:site_name" content="Athletics Podium" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
</svelte:head>
