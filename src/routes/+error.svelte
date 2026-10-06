<script lang="ts">
	import { page } from '$app/state';
	import { PAGES } from '#lib/routing/urls.js';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} | Athletics Podium</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="page-container flex flex-col items-start gap-5 py-24">
	<span class="font-data text-sm tracking-[0.16em] text-brand-ink uppercase"
		>Error {page.status}</span
	>
	<h1 class="font-display text-6xl leading-none font-bold">
		{notFound ? 'Page not found' : 'Something went wrong'}
	</h1>
	<p class="max-w-xl text-lg text-ink-2">
		{notFound
			? 'This page is not in the archive. It may have moved, or the address may be mistyped.'
			: page.error?.message}
	</p>
	<a
		href={PAGES.home}
		class="inline-flex h-11 items-center rounded-[10px] bg-brand px-[18px] text-sm font-bold text-ink hover:bg-brand-hover"
	>
		Back to the front page
	</a>
</section>
