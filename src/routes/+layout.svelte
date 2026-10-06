<script lang="ts">
	import '../styles/app.css';
	import favicon from '#lib/assets/favicon.svg';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import SearchOverlay from '#lib/components/layout/SearchOverlay.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let searchOverlay: SearchOverlay;

	function openSearchFromKeyboard(event: KeyboardEvent) {
		const typing =
			event.target instanceof HTMLElement &&
			event.target.closest('input, textarea, select, [contenteditable]');
		const slash = event.key === '/' && !typing;
		const commandK = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);

		if (slash || commandK) {
			event.preventDefault();
			searchOverlay.open();
		}
	}
</script>

<svelte:window onkeydown={openSearchFromKeyboard} />

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header
		today={data.today}
		nextMeeting={data.nextMeeting}
		birthdays={data.birthdays}
		onSearch={() => searchOverlay.open()}
	/>
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer stats={data.stats} year={data.year} />
</div>

<SearchOverlay bind:this={searchOverlay} year={data.year} nextMeeting={data.nextMeeting} />
