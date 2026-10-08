<script lang="ts">
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import type { CountryProfile } from '#lib/domain/country.js';
	import { formatCount } from '#lib/format/number.js';
	import { possessive } from '#lib/format/text.js';
	import { flagUrl } from '#lib/routing/urls.js';

	let {
		country,
		counts,
		crumbs
	}: {
		country: CountryProfile;
		counts: { medallists: number; men: number; women: number };
		crumbs: { label: string; href?: string }[];
	} = $props();

	const figures = $derived([
		{ value: counts.medallists, label: 'medallists' },
		{ value: counts.men, label: 'men' },
		{ value: counts.women, label: 'women' }
	]);
</script>

<section class="border-b border-line bg-surface">
	<div class="page-container pt-[22px] pb-[30px]">
		<Breadcrumb items={crumbs} class="mb-[22px]" />
		<div class="grid grid-cols-1 items-end gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
			<div class="flex items-center gap-3.5 sm:gap-[22px]">
				<img
					src={flagUrl(country.code)}
					alt="Flag of {country.name}"
					width="96"
					height="64"
					class="h-[43px] w-16 shrink-0 rounded-lg object-cover shadow-[0_0_0_1px_var(--color-line)] sm:h-16 sm:w-24"
				/>
				<div class="flex min-w-0 flex-col gap-2">
					<span class="font-data text-[12.5px] tracking-[0.14em] text-ink-3 uppercase">
						{country.code} · every international medallist
					</span>
					<h1 class="font-display text-[40px] leading-[0.88] font-bold text-balance sm:text-[80px]">
						{possessive(country.name)} athletes
					</h1>
				</div>
			</div>
			<dl class="grid grid-cols-3 border-t-2 border-ink">
				{#each figures as figure (figure.label)}
					<div class="flex flex-col-reverse gap-[3px] pt-3 pr-2.5">
						<dt class="text-[13px] text-ink-2">{figure.label}</dt>
						<dd class="font-display text-[46px] leading-none font-bold tabular">
							{formatCount(figure.value)}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
