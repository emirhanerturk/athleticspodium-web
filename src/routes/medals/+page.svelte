<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import EditionMedalsCard from '#lib/components/medal/EditionMedalsCard.svelte';
	import MedalQuestion from '#lib/components/medal/MedalQuestion.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import ToolsHero from '#lib/components/tools/ToolsHero.svelte';
	import Pagination from '#lib/components/ui/Pagination.svelte';
	import type { Gender } from '#lib/domain/edition.js';
	import {
		groupByEdition,
		MEDAL_PAGE_SIZE,
		MEDAL_QUESTIONS,
		type MedalQuery
	} from '#lib/domain/medal-search.js';
	import { formatCount } from '#lib/format/number.js';
	import { medalCountdownUrl, medalSearchUrl, PAGES } from '#lib/routing/urls.js';
	import { breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = $derived(data.query);
	const champ = $derived(data.champs.find((item) => item.id === query.champ));
	const country = $derived(data.countries.find((item) => item.code === query.country));
	const subject = $derived([champ?.name, country?.name, query.year].filter(Boolean).join(' · '));
	const lastPage = $derived(
		data.results ? Math.max(1, Math.ceil(data.results.count / MEDAL_PAGE_SIZE)) : 1
	);
	const editions = $derived(data.results ? groupByEdition(data.results.rows) : []);
	const path = $derived(medalSearchUrl(query));

	const MEDAL_TABS: { medal: MedalQuery['medal']; label: string; dot?: string }[] = [
		{ medal: null, label: 'All medals' },
		{ medal: 1, label: 'Gold', dot: 'bg-gold' },
		{ medal: 2, label: 'Silver', dot: 'bg-silver' },
		{ medal: 3, label: 'Bronze', dot: 'bg-bronze' }
	];
	const TALLY = [
		{ key: 'gold', dot: 'bg-gold' },
		{ key: 'silver', dot: 'bg-silver' },
		{ key: 'bronze', dot: 'bg-bronze' }
	] as const;
	const GENDER_TABS: { gender: Gender | null; label: string }[] = [
		{ gender: null, label: 'All' },
		{ gender: 'men', label: 'Men' },
		{ gender: 'women', label: 'Women' },
		{ gender: 'mixed', label: 'Mixed' }
	];

	const tabCount = (medal: MedalQuery['medal']) => {
		const tally = data.medalTally;
		if (!tally) return null;
		if (medal === 1) return tally.gold;
		if (medal === 2) return tally.silver;
		if (medal === 3) return tally.bronze;
		return tally.gold + tally.silver + tally.bronze + tally.withdrawn;
	};

	const looser = $derived(
		[
			query.year && { label: 'Show all years', change: { year: null } },
			query.event && { label: 'Any event', change: { event: null } },
			query.gender && { label: 'Men & women', change: { gender: null } },
			query.medal && { label: 'All medals', change: { medal: null } }
		].filter((item) => !!item)
	);

	const tallySize = (tally: { gold: number; silver: number; bronze: number }) => {
		const largest = Math.max(tally.gold, tally.silver, tally.bronze);
		return largest >= 10_000 ? 'text-[26px]' : largest >= 1_000 ? 'text-[32px]' : 'text-[44px]';
	};

	let copied = $state(false);

	async function copyLink() {
		await navigator.clipboard.writeText(location.href);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<SeoHead
	title={subject ? `${subject} – medal search` : 'Medal search – every athletics podium'}
	description={subject
		? `Every medal for ${subject}: year, event, athlete, country and mark.`
		: 'Search every athletics medal in the archive by championship, country, event, year, gender and medal.'}
	{path}
	fallbackImage="tools"
/>
<JsonLd
	data={[breadcrumbJsonLd(PUBLIC_SITE_URL, [{ name: 'Medal search', path: PAGES.medalSearch }])]}
/>

<ToolsHero active="search" medals={data.stats?.medals ?? null} />

<section class="border-b border-line bg-surface">
	<div class="page-container py-[26px]">
		<MedalQuestion
			{query}
			champs={data.champs}
			countries={data.countries}
			events={data.events}
			currentYear={data.year}
		/>
	</div>
</section>

<section class="page-container pt-8 pb-16">
	<div class="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1fr)_320px]">
		<div class="flex min-w-0 flex-col gap-[22px]">
			{#if data.results}
				<div class="flex flex-wrap items-center justify-between gap-3">
					<nav aria-label="Medal" class="flex flex-wrap gap-1.5">
						{#each MEDAL_TABS as tab (tab.label)}
							{@const current = tab.medal === query.medal}
							<a
								href={medalSearchUrl({ ...query, medal: tab.medal, page: 1 })}
								aria-current={current ? 'page' : undefined}
								data-sveltekit-noscroll
								class="inline-flex h-[34px] items-center gap-[7px] rounded-full border px-3 text-[13.5px] font-semibold {current
									? 'border-ink bg-ink text-bg'
									: 'border-line-2 bg-surface hover:border-ink'}"
							>
								{#if tab.dot}<span aria-hidden="true" class="size-2.5 rounded-full {tab.dot}"
									></span>{/if}
								{tab.label}
								{#if tabCount(tab.medal) !== null}
									<span class="font-data opacity-70">{formatCount(tabCount(tab.medal)!)}</span>
								{/if}
							</a>
						{/each}
					</nav>
					<nav aria-label="Gender" class="inline-flex rounded-full bg-surface-2 p-[3px]">
						{#each GENDER_TABS as tab (tab.label)}
							{@const current = tab.gender === query.gender}
							<a
								href={medalSearchUrl({ ...query, gender: tab.gender, page: 1 })}
								aria-current={current ? 'page' : undefined}
								data-sveltekit-noscroll
								class="inline-flex h-[30px] items-center rounded-full px-3.5 text-[13px] font-bold {current
									? 'bg-surface text-ink shadow-[0_1px_3px_rgba(18,19,22,.12)]'
									: 'text-ink-3 hover:text-ink'}"
							>
								{tab.label}
							</a>
						{/each}
					</nav>
				</div>

				{#each editions as edition (edition.meeting.id)}
					<EditionMedalsCard
						{edition}
						showChamp={!query.champ}
						showCountry={!query.country}
						today={data.today}
					/>
				{:else}
					<div
						class="flex flex-col gap-3.5 rounded-[18px] border-2 border-dashed border-line-2 p-[26px]"
					>
						<span aria-hidden="true" class="flex gap-1.5">
							<span class="size-[30px] rounded-full border-2 border-dashed border-gold"></span>
							<span class="size-[30px] rounded-full border-2 border-dashed border-silver"></span>
							<span class="size-[30px] rounded-full border-2 border-dashed border-bronze"></span>
						</span>
						<strong class="font-display text-[30px] leading-none font-bold">No podium here</strong>
						<span class="text-[14.5px] leading-normal text-ink-2">
							No medal matches these filters.
						</span>
						{#if looser.length}
							<div class="flex flex-wrap gap-2">
								{#each looser as item (item.label)}
									<a
										href={medalSearchUrl({ ...query, ...item.change, page: 1 })}
										class="inline-flex h-9 items-center rounded-full border border-line-2 px-3.5 text-[13.5px] font-semibold hover:border-ink"
									>
										{item.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				{#if lastPage > 1}
					<Pagination
						page={query.page}
						{lastPage}
						href={(page) => medalSearchUrl({ ...query, page })}
					/>
				{/if}
			{:else}
				<p
					class="rounded-[18px] border-2 border-dashed border-line-2 px-6 py-8 text-center text-ink-2"
				>
					Pick a nation or a championship in the sentence above to see its medals.
				</p>
			{/if}
		</div>

		<aside class="flex flex-col gap-4 md:sticky md:top-6">
			{#if data.results}
				{@const { tally } = data.results}
				<div class="flex flex-col gap-3.5 rounded-[18px] border border-line bg-surface p-5">
					<h2 class="font-data text-xs tracking-[0.14em] text-ink-3 uppercase">This search</h2>
					<dl class="grid grid-cols-3 gap-2">
						{#each TALLY as medal (medal.key)}
							<div class="flex flex-col-reverse items-start gap-1.5">
								<dt class="text-[12.5px] text-ink-3">{medal.key}</dt>
								<dd class="font-display {tallySize(tally)} leading-[0.9] font-bold">
									{formatCount(tally[medal.key])}
								</dd>
								<span aria-hidden="true" class="size-[22px] rounded-full {medal.dot}"></span>
							</div>
						{/each}
					</dl>
					<p class="border-t border-line pt-3 text-[13px] leading-normal text-ink-2">
						{#if tally.withdrawn}
							<strong>
								{formatCount(tally.withdrawn)}
								{tally.withdrawn === 1 ? 'medal' : 'medals'} withdrawn
							</strong>
							after doping cases {tally.withdrawn === 1 ? 'is' : 'are'} shown struck through in red and
							not counted.
						{/if}
						Relays count once.
					</p>
					{#if query.champ && query.country}
						<a
							href={medalCountdownUrl(query.country, query.champ)}
							class="text-[13.5px] font-semibold text-brand-ink hover:underline"
						>
							Medal countdown, edition by edition →
						</a>
					{/if}
					<button
						type="button"
						onclick={copyLink}
						class="h-[38px] rounded-[10px] border border-line-2 text-[13.5px] font-semibold hover:border-ink"
					>
						{copied ? 'Link copied' : 'Copy link'}
					</button>
				</div>
			{/if}
			<div class="flex flex-col gap-2.5 rounded-[18px] bg-surface-2 px-5 py-[18px]">
				<h2 class="text-sm font-bold">Try another question</h2>
				<ul>
					{#each MEDAL_QUESTIONS as question (question.label)}
						<li class="border-t border-line">
							<a
								href={medalSearchUrl(question.query)}
								class="block py-2 text-sm leading-snug text-ink-2 hover:text-brand-ink"
							>
								{question.label} →
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</aside>
	</div>
</section>
