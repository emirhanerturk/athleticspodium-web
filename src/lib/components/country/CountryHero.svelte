<script lang="ts">
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import CollapsibleHtml from '#lib/components/ui/CollapsibleHtml.svelte';
	import { areaName } from '#lib/domain/championship.js';
	import type { CountryProfile } from '#lib/domain/country.js';
	import type { MedalTally } from '#lib/domain/result.js';
	import { formatCount } from '#lib/format/number.js';
	import { flagUrl } from '#lib/routing/urls.js';

	let {
		country,
		international,
		nationalTitles,
		crumbs
	}: {
		country: CountryProfile;
		international: MedalTally;
		nationalTitles: number;
		crumbs: { label: string; href?: string }[];
	} = $props();

	const area = $derived(country.areas.length ? areaName(country.areas[0]) : null);
	const figures = $derived([
		{ value: international.total, label: 'international medals', accent: false },
		{ value: international.gold, label: 'of them gold', accent: true },
		{ value: nationalTitles, label: 'national titles', accent: false }
	]);
</script>

<section class="border-b border-line bg-surface">
	<div class="page-container pt-[22px] pb-10">
		<Breadcrumb items={crumbs} class="mb-7" />
		<div class="grid grid-cols-1 items-end gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
			<div class="flex flex-wrap items-center gap-7">
				<img
					src={flagUrl(country.code)}
					alt="Flag of {country.name}"
					width="168"
					height="112"
					class="h-[84px] w-[126px] rounded-xl object-cover shadow-[0_0_0_1px_var(--color-line),0_8px_24px_rgba(18,19,22,.06)] sm:h-28 sm:w-[168px]"
				/>
				<div class="flex min-w-0 flex-col gap-2.5">
					<span
						class="flex items-center gap-2.5 font-data text-[13.5px] tracking-[0.14em] text-ink-3 uppercase"
					>
						<span class="rounded-md bg-ink px-2 py-0.5 font-bold tracking-[0.08em] text-bg">
							{country.code}
						</span>
						{area ?? ''}
					</span>
					<h1
						class="font-display text-[56px] leading-[0.86] font-bold text-balance sm:text-[112px]"
					>
						{country.name}
					</h1>
				</div>
			</div>
			<dl class="grid grid-cols-3 border-t-2 border-ink">
				{#each figures as figure (figure.label)}
					<div class="flex flex-col-reverse gap-1 pt-3.5 pr-3">
						<dt class="text-[13px] text-ink-2">{figure.label}</dt>
						<dd
							class="font-display text-[40px] leading-none font-bold tabular sm:text-[52px] {figure.accent
								? 'text-brand-ink'
								: ''}"
						>
							{formatCount(figure.value)}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
		{#if country.about}
			<div class="mt-9 max-w-[760px]">
				<h2 class="sr-only">About</h2>
				<CollapsibleHtml html={country.about} moreLabel="Read more" />
			</div>
		{/if}
	</div>
</section>
