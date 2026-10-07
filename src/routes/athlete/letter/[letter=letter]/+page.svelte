<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import AthleteDirectoryTable from '#lib/components/athlete/AthleteDirectoryTable.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import { LETTERS } from '#lib/domain/athlete.js';
	import { formatCount } from '#lib/format/number.js';
	import { athleteLetterUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const upper = $derived(data.letter.toUpperCase());
	const path = $derived(athleteLetterUrl(data.letter, data.page));
	const pageSuffix = $derived(data.page > 1 ? `, page ${data.page}` : '');
	const crumbs = $derived([
		{ name: 'Athletes', path: PAGES.athletes },
		{ name: `A–Z: ${upper}`, path }
	]);
</script>

<SeoHead
	title="Athletes A–Z: {upper}{pageSuffix}"
	description="Athletes whose surname starts with {upper}: {formatCount(
		data.count
	)} medallists and finalists in the archive, with country and year of birth."
	{path}
	fallbackImage="athletes"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)]} />

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

<section class="page-container pt-7 pb-16">
	<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div class="flex flex-col gap-2">
			<h1 class="font-display text-[48px] leading-[0.94] font-bold sm:text-[72px]">
				Athletes: {upper}
			</h1>
			<span class="text-[15px] text-ink-2">
				{formatCount(data.count)} surnames starting with {upper}
			</span>
		</div>
	</div>
	<nav aria-label="Letters" class="mb-6 flex flex-wrap gap-1.5">
		{#each LETTERS as letter (letter)}
			<a
				href={athleteLetterUrl(letter)}
				aria-current={letter === data.letter ? 'page' : undefined}
				class="grid size-10 place-items-center rounded-[10px] font-display text-xl font-bold {letter ===
				data.letter
					? 'bg-ink text-brand'
					: 'border border-line bg-surface text-ink-2 hover:border-ink hover:text-ink'}"
			>
				{letter.toUpperCase()}
			</a>
		{/each}
	</nav>
	{#if data.athletes.length}
		<AthleteDirectoryTable athletes={data.athletes} today={data.today} />
		<div class="mt-6">
			<Pagination
				page={data.page}
				lastPage={data.lastPage}
				href={(page) => athleteLetterUrl(data.letter, page)}
			/>
		</div>
	{:else}
		<p class="rounded-2xl border border-line bg-surface px-6 py-8 text-ink-2">
			No athlete in the archive has a surname starting with {upper}.
		</p>
	{/if}
</section>
