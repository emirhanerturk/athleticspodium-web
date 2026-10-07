<script lang="ts">
	import { formatCount } from '#lib/format/number.js';
	import { PAGES } from '#lib/routing/urls.js';

	let { active, medals }: { active: 'search' | 'countdown' | 'compare'; medals: number | null } =
		$props();

	const TOOLS = [
		{
			key: 'search',
			icon: 'MS',
			title: 'Medal search',
			text: 'Every podium, filtered by nation, championship, event, year.',
			href: PAGES.medalSearch
		},
		{
			key: 'countdown',
			icon: 'MC',
			title: 'Medal countdown',
			text: 'One nation at one championship, edition by edition.',
			href: PAGES.medalCountdown
		},
		{
			key: 'compare',
			icon: 'VS',
			title: 'Compare championships',
			text: 'Two championships, one event, year by year.',
			href: PAGES.compare
		}
	];
</script>

<section class="bg-night text-night-ink">
	<div class="page-container pt-11">
		<div class="grid grid-cols-1 items-end gap-8 pb-7 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
			<div class="flex flex-col gap-3">
				<span class="font-data text-xs tracking-[0.16em] text-brand uppercase">Tools</span>
				<h1 class="font-display text-[56px] leading-[0.88] font-bold sm:text-[96px]">
					Ask the archive
				</h1>
			</div>
			<p class="leading-relaxed text-night-ink-3">
				{#if medals}
					<strong class="font-data text-xl text-night-ink">{formatCount(medals)}</strong>
					medals, every one searchable.
				{/if}
				Filter by nation, championship, event and year, count a country’s haul edition by edition, or
				set two championships side by side.
			</p>
		</div>
		<nav aria-label="Archive tools" class="grid grid-cols-3 gap-1.5 sm:gap-3">
			{#each TOOLS as tool (tool.key)}
				{@const current = tool.key === active}
				<a
					href={tool.href}
					aria-current={current ? 'page' : undefined}
					class="flex items-start gap-3.5 rounded-t-2xl border border-b-0 px-3 pt-3.5 pb-4 sm:px-[18px] sm:pt-[18px] sm:pb-5 {current
						? 'border-surface bg-surface text-ink'
						: 'border-night-line-2 bg-night-surface text-night-ink hover:border-night-ink-4'}"
				>
					<span
						class="grid size-10 shrink-0 place-items-center rounded-xl font-data text-[15px] font-bold max-sm:hidden {current
							? 'bg-brand text-ink'
							: 'bg-night-line-2 text-brand'}">{tool.icon}</span
					>
					<span class="flex flex-col gap-1">
						<strong class="font-display text-[17px] leading-none font-bold sm:text-[26px]">
							{tool.title}
						</strong>
						<span class="text-[13.5px] leading-snug opacity-80 max-sm:hidden">{tool.text}</span>
					</span>
				</a>
			{/each}
		</nav>
	</div>
</section>
