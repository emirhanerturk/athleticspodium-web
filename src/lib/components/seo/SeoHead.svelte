<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { ogImage, type SocialImageName } from '#lib/seo/social-images.js';
	import { pageTitle } from '#lib/seo/titles.js';

	let {
		title,
		description,
		path,
		image,
		fallbackImage = 'default',
		noindex = false
	}: {
		title: string;
		description: string;
		path: string;
		image?: string;
		fallbackImage?: SocialImageName;
		noindex?: boolean;
	} = $props();

	const canonical = $derived(PUBLIC_SITE_URL + path);
	const fullTitle = $derived(pageTitle(title));
	const og = $derived(ogImage(PUBLIC_SITE_URL, image, fallbackImage));
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
	<meta property="og:image" content={og.url} />
	{#if og.width && og.height}
		<meta property="og:image:width" content={String(og.width)} />
		<meta property="og:image:height" content={String(og.height)} />
	{/if}
	{#if og.alt}<meta property="og:image:alt" content={og.alt} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
