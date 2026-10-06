<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import logo from '#lib/assets/logo.svg';
	import Dateline from '#lib/components/home/Dateline.svelte';
	import FrontStories from '#lib/components/home/FrontStories.svelte';
	import OnThisDay from '#lib/components/home/OnThisDay.svelte';
	import Portraits from '#lib/components/home/Portraits.svelte';
	import ResultsDesk from '#lib/components/home/ResultsDesk.svelte';
	import UpcomingTimeline from '#lib/components/home/UpcomingTimeline.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { PAGES, SOCIAL_LINKS } from '#lib/routing/urls.js';
	import { organizationJsonLd, websiteJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead
	title="Athletics Podium"
	description="Every international athletics medal and medallist since 1873: championships, athletes, countries, results and stories."
	path="/"
/>
<JsonLd
	data={[
		websiteJsonLd(PUBLIC_SITE_URL, PAGES.search),
		organizationJsonLd(
			PUBLIC_SITE_URL,
			new URL(logo, PUBLIC_SITE_URL).href,
			Object.values(SOCIAL_LINKS)
		)
	]}
/>

<h1 class="sr-only">Athletics Podium: athletics medals, results and medallists since 1873</h1>

<Dateline today={data.today} year={data.year} stats={data.stats} />
<FrontStories lead={data.lead} latest={data.latest} />
{#if data.desk.length}<ResultsDesk entries={data.desk} />{/if}
{#if data.upcoming.length}
	<UpcomingTimeline
		meetings={data.upcoming}
		today={data.today}
		year={data.year}
		spanDays={data.timelineDays}
	/>
{/if}
{#if data.born.athletes.length || data.died.athletes.length}
	<OnThisDay born={data.born} died={data.died} today={data.today} />
{/if}
{#if data.portraits.length}<Portraits athletes={data.portraits} />{/if}
