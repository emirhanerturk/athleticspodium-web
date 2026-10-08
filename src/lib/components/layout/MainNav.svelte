<script lang="ts">
	import { page } from '$app/state';
	import { PAGES } from '#lib/routing/urls.js';
	import ToolsMenu from './ToolsMenu.svelte';

	const ITEM =
		'relative inline-flex shrink-0 items-center px-3 text-sm uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-0 after:rounded-full after:transition-[scale,height,background-color] after:duration-200 after:ease-out';
	const CURRENT = 'font-bold text-ink after:h-[3px] after:scale-x-100 after:bg-brand';
	const IDLE =
		'font-medium text-ink-2 after:h-0.5 after:scale-x-0 after:bg-line-2 hover:text-ink hover:after:scale-x-100';

	const sections = [
		{ label: 'Championships', href: PAGES.champs },
		{ label: 'Athletes', href: PAGES.athletes },
		{ label: 'Countries', href: PAGES.countries },
		{ label: 'Calendar', href: PAGES.calendar }
	];

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	const itemClass = (current: boolean) => `${ITEM} ${current ? CURRENT : IDLE}`;
</script>

{#snippet steadyLabel(text: string)}
	<span class="grid justify-items-center">
		<span class="col-start-1 row-start-1">{text}</span>
		<span aria-hidden="true" class="invisible col-start-1 row-start-1 font-bold">{text}</span>
	</span>
{/snippet}

{#snippet link(label: string, href: string)}
	<a {href} aria-current={isCurrent(href) ? 'page' : undefined} class={itemClass(isCurrent(href))}>
		{@render steadyLabel(label)}
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
		<ToolsMenu itemClass={itemClass(isCurrent(PAGES.medalSearch))} label={steadyLabel} />
		{@render link('Articles', PAGES.articles)}
	</nav>
</div>
