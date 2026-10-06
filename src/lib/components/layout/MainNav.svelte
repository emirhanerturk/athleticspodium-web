<script lang="ts">
	import { page } from '$app/state';
	import { PAGES } from '#lib/routing/urls.js';
	import ToolsMenu from './ToolsMenu.svelte';

	const ITEM =
		'inline-flex shrink-0 items-center px-3 text-sm uppercase tracking-[0.06em] whitespace-nowrap';

	const sections = [
		{ label: 'Championships', href: PAGES.champs },
		{ label: 'Athletes', href: PAGES.athletes },
		{ label: 'Countries', href: PAGES.countries },
		{ label: 'Calendar', href: PAGES.calendar }
	];

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

{#snippet link(label: string, href: string)}
	<a
		{href}
		aria-current={isCurrent(href) ? 'page' : undefined}
		class="{ITEM} {isCurrent(href)
			? 'font-bold text-ink shadow-[inset_0_-3px_0_var(--color-brand)]'
			: 'font-medium text-ink-2 hover:text-ink'}"
	>
		{label}
	</a>
{/snippet}

<div class="border-y border-line bg-surface">
	<nav
		aria-label="Main"
		class="mx-auto flex h-[50px] max-w-page [scrollbar-width:none] items-stretch gap-0.5 overflow-x-auto px-5"
	>
		{#each sections as section (section.href)}
			{@render link(section.label, section.href)}
		{/each}
		<ToolsMenu itemClass={ITEM} />
		{@render link('Articles', PAGES.articles)}
	</nav>
</div>
