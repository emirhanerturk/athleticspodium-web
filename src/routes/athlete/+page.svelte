<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import AthleteSearchHero from '#lib/components/athlete/AthleteSearchHero.svelte';
	import FeaturedAthleteCards from '#lib/components/athlete/FeaturedAthleteCards.svelte';
	import GreatestByNation from '#lib/components/athlete/GreatestByNation.svelte';
	import OnThisDayCards from '#lib/components/athlete/OnThisDayCards.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { dayOfDate } from '#lib/domain/day.js';
	import { formatDayMonth } from '#lib/format/date.js';
	import { athleteLetterUrl, onThisDayUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const H2 = 'font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]';
</script>

<SeoHead
	title="Athletes – find any medallist"
	description="Search every athletics medallist and finalist in the archive, browse athletes A–Z, today's birthdays and the greatest athletes by nation."
	path={PAGES.athletes}
	fallbackImage="athletes"
/>
<JsonLd data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Athletes', path: PAGES.athletes }])]} />

<AthleteSearchHero athleteCount={data.stats?.athletes ?? null} />

{#if data.featured.length}
	<section class="page-container pt-14 pb-6">
		<div class="mb-[18px] flex items-baseline justify-between gap-3">
			<h2 class={H2}>Featured</h2>
			<a href={athleteLetterUrl('a')} class="text-sm font-semibold text-brand-ink hover:underline">
				Browse A–Z →
			</a>
		</div>
		<FeaturedAthleteCards athletes={data.featured} />
	</section>
{/if}

{#if data.born.athletes.length}
	<section class="page-container py-8">
		<div class="rounded-[20px] border border-line bg-surface p-[26px]">
			<div class="mb-[18px] flex flex-wrap items-baseline justify-between gap-2.5">
				<h2 class={H2}>Birthdays today</h2>
				<a
					href={onThisDayUrl(dayOfDate(data.today))}
					class="text-sm font-semibold text-brand-ink hover:underline"
				>
					All {data.born.count} born on {formatDayMonth(data.today)} →
				</a>
			</div>
			<OnThisDayCards athletes={data.born.athletes} today={data.today} />
		</div>
	</section>
{/if}

<section class="page-container pt-8 pb-[72px]">
	<GreatestByNation nations={data.nations} />
	<a
		href={athleteLetterUrl('a')}
		class="mt-8 inline-flex h-11 items-center rounded-full border-[1.5px] border-ink px-[18px] text-sm font-semibold hover:bg-surface-2"
	>
		Browse all athletes A–Z
	</a>
</section>
