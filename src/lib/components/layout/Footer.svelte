<script lang="ts">
	import logoReversed from '#lib/assets/logo-reversed.svg';
	import mark from '#lib/assets/mark.svg';
	import type { SiteStats } from '#lib/domain/stats.js';
	import { formatDate } from '#lib/format/date.js';
	import { formatCount } from '#lib/format/number.js';
	import { meetingUrl, PAGES, SOCIAL_LINKS } from '#lib/routing/urls.js';
	import SocialLinks from './SocialLinks.svelte';

	let { stats, year }: { stats: SiteStats | null; year: number } = $props();

	const columns = [
		{
			title: 'Explore',
			links: [
				{ label: 'Championships', href: PAGES.champs },
				{ label: 'Athletes', href: PAGES.athletes },
				{ label: 'Countries', href: PAGES.countries },
				{ label: 'Calendar', href: PAGES.calendar },
				{ label: 'Articles', href: PAGES.articles }
			]
		},
		{
			title: 'Tools',
			links: [
				{ label: 'Medal Tracker', href: PAGES.medalSearch },
				{ label: 'Medals by country', href: PAGES.countryChamps },
				{ label: 'Compare championships', href: PAGES.compare }
			]
		},
		{
			title: 'The database',
			links: [
				{ label: 'How to read the database', href: PAGES.databaseNotes },
				{ label: 'Missing information', href: PAGES.missingInformation },
				{ label: 'About & contact', href: PAGES.about }
			]
		},
		{
			title: 'Follow',
			links: [
				{ label: 'Bluesky', href: SOCIAL_LINKS.bluesky },
				{ label: 'Facebook', href: SOCIAL_LINKS.facebook },
				{ label: 'Instagram', href: SOCIAL_LINKS.instagram }
			]
		}
	];

	const totals = $derived(
		stats
			? [
					{ value: stats.medals, label: 'medals' },
					{ value: stats.placings, label: 'places 4–8' },
					{ value: stats.athletes, label: 'athletes' },
					{ value: stats.championships, label: 'championships' }
				]
			: []
	);
</script>

<footer class="relative overflow-hidden bg-night text-night-ink-3">
	<img
		src={mark}
		alt=""
		aria-hidden="true"
		class="pointer-events-none absolute -right-[60px] -bottom-[90px] w-[560px] opacity-[0.06]"
	/>

	<div class="relative page-container flex flex-col gap-14 pt-[72px] pb-7">
		<div class="flex flex-wrap gap-x-16 gap-y-12">
			<div class="flex max-w-[420px] flex-[1_1_320px] flex-col gap-5">
				<img src={logoReversed} alt="Athletics Podium" width="176" height="62" />
				<p class="text-[15px] leading-relaxed">
					An international medallist database for track and field. All open track, indoor and
					cross-country medals, in every age group, since 1873.
				</p>
				{#if totals.length}
					<dl class="flex flex-wrap gap-[22px] font-data text-xs text-night-ink-4">
						{#each totals as total (total.label)}
							<div class="flex flex-col-reverse">
								<dt>{total.label}</dt>
								<dd class="text-lg font-semibold text-night-ink tabular">
									{formatCount(total.value)}
								</dd>
							</div>
						{/each}
					</dl>
				{/if}
			</div>

			<div class="grid flex-[2_1_560px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8">
				{#each columns as column (column.title)}
					<nav aria-label={column.title} class="flex flex-col gap-3">
						<span class="font-data text-[11px] tracking-[0.14em] text-brand uppercase">
							{column.title}
						</span>
						{#each column.links as link (link.href)}
							<a href={link.href} class="py-0.5 text-[15px] text-night-ink-2 hover:text-brand">
								{link.label}
							</a>
						{/each}
					</nav>
				{/each}
			</div>
		</div>

		<div
			class="flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-6 text-[13px] text-night-ink-4"
		>
			<span>
				All rights are NOT reserved.
				<span class="inline-block -scale-x-100">©</span>
				2020–{year}
			</span>
			{#if stats?.lastAddition}
				<a
					href={meetingUrl(stats.lastAddition.champSlug, stats.lastAddition.slug)}
					class="font-data text-xs hover:text-night-ink"
				>
					Last addition · {stats.lastAddition.name} · {formatDate(stats.lastAddition.addedOn)}
				</a>
			{/if}
			<div class="flex gap-1.5">
				<SocialLinks
					linkClass="grid size-10 place-items-center rounded-full border border-night-line-2 text-night-ink hover:border-brand hover:bg-brand hover:text-ink"
				/>
			</div>
		</div>
	</div>
</footer>
