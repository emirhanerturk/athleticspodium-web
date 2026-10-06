<script lang="ts">
	import ArrowRightIcon from '#lib/components/ui/icons/ArrowRightIcon.svelte';
	import { medalSearchUrl, PAGES } from '#lib/routing/urls.js';

	let { champ }: { champ: { id: number; name: string } } = $props();

	const links = $derived([
		{
			href: PAGES.compare,
			title: 'Compare with another championship',
			note: 'Medal tables and winners side by side'
		},
		{
			href: medalSearchUrl({ champ: champ.id }),
			title: 'Every medal in the tracker',
			note: `Filtered to ${champ.name}`
		}
	]);
</script>

<nav
	aria-labelledby="go-deeper"
	class="flex flex-col gap-3 rounded-[18px] border border-line bg-surface p-[22px]"
>
	<h2 id="go-deeper" class="font-display text-[28px] leading-none font-bold">Go deeper</h2>
	{#each links as link (link.href)}
		<a
			href={link.href}
			class="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-3.5 hover:bg-surface-3"
		>
			<span class="flex flex-col gap-0.5">
				<strong class="font-semibold">{link.title}</strong>
				<span class="text-[13px] text-ink-3">{link.note}</span>
			</span>
			<ArrowRightIcon />
		</a>
	{/each}
</nav>
