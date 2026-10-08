<script lang="ts">
	import { page } from '$app/state';
	import AboutHelp from '#lib/components/about/AboutHelp.svelte';
	import AboutHero from '#lib/components/about/AboutHero.svelte';
	import AboutNumbers from '#lib/components/about/AboutNumbers.svelte';
	import AboutStory from '#lib/components/about/AboutStory.svelte';
	import AboutTeam from '#lib/components/about/AboutTeam.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import { CONTRIBUTORS, ONLINE_SINCE, TEAM } from '#lib/domain/about.js';
	import { topicByKey } from '#lib/domain/contact.js';
	import { formatDate } from '#lib/format/date.js';
	import { formatCount } from '#lib/format/number.js';
	import { PAGES } from '#lib/routing/urls.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const topic = $derived(topicByKey(page.url.searchParams.get('topic')));
	const figures = $derived(
		[
			data.stats && { value: formatCount(data.stats.medals), label: 'medals in the database' },
			data.stories !== null && { value: formatCount(data.stories), label: 'stories published' },
			data.stats && { value: formatCount(data.stats.countries), label: 'nations and territories' },
			{ value: formatCount(TEAM.length + CONTRIBUTORS.length), label: 'people credited' },
			{ value: formatDate(ONLINE_SINCE), label: 'online since' }
		].filter((figure) => !!figure)
	);
</script>

<SeoHead
	title="About Athletics Podium"
	description="From South American juniors to Oceanian multi-eventers — an open database of all major athletics championships at every level, built by one journalist and kept honest by athletics lovers worldwide."
	path={PAGES.about}
/>

<AboutHero />
<AboutNumbers {figures} />
<AboutStory />
<AboutTeam />
<AboutHelp {form} {topic} />
