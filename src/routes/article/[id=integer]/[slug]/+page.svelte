<script lang="ts">
	import { PUBLIC_MEDIA_URL, PUBLIC_SITE_URL } from '$app/env/public';
	import ArticleBody from '#lib/components/article/ArticleBody.svelte';
	import RelatedTopics from '#lib/components/article/RelatedTopics.svelte';
	import StoryCards from '#lib/components/article/StoryCards.svelte';
	import Breadcrumb from '#lib/components/layout/Breadcrumb.svelte';
	import JsonLd from '#lib/components/seo/JsonLd.svelte';
	import SeoHead from '#lib/components/seo/SeoHead.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { formatDate } from '#lib/format/date.js';
	import { articleUrl, PAGES } from '#lib/routing/urls.js';
	import { articleJsonLd, breadcrumbJsonLd } from '#lib/seo/json-ld.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const article = $derived(data.article);
	const path = $derived(articleUrl(article));
	const kicker = $derived(article.related.meetings[0]?.name ?? article.related.champs[0]?.name);
	const crumbs = $derived([
		{ name: 'Articles', path: PAGES.articles },
		{ name: article.title, path }
	]);
</script>

<SeoHead
	title={article.title}
	description={article.description ?? article.standfirst ?? article.title}
	{path}
	image={article.image ? `${PUBLIC_MEDIA_URL}/${article.image.path}` : undefined}
	fallbackImage="articles"
/>
<JsonLd
	data={[
		articleJsonLd({ siteUrl: PUBLIC_SITE_URL, mediaUrl: PUBLIC_MEDIA_URL }, article, path),
		breadcrumbJsonLd(PUBLIC_SITE_URL, crumbs)
	]}
/>

<Breadcrumb
	items={crumbs.map((crumb, index) => ({
		label: crumb.name,
		href: index < crumbs.length - 1 ? crumb.path : undefined
	}))}
/>

<article class="page-container pt-8 pb-14">
	<header class="flex max-w-[880px] flex-col gap-4">
		{#if kicker}
			<span class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">{kicker}</span>
		{/if}
		<h1 class="font-display text-[44px] leading-[0.94] font-bold text-balance sm:text-[72px]">
			{article.title}
		</h1>
		{#if article.standfirst ?? article.description}
			<p class="text-xl leading-normal text-ink">{article.standfirst ?? article.description}</p>
		{/if}
		<span class="font-data text-[13.5px] text-ink-3">
			<time datetime={article.publishedOn}>{formatDate(article.publishedOn)}</time
			>{#if article.updatedOn && article.updatedOn !== article.publishedOn}&nbsp;· updated
				<time datetime={article.updatedOn}>{formatDate(article.updatedOn)}</time>{/if}
		</span>
	</header>

	{#if article.image}
		<figure class="mt-8 flex flex-col gap-2.5">
			<MediaImage
				image={article.image}
				alt={article.image.caption ?? ''}
				width={1344}
				height={756}
				eager
				class="block max-h-[620px] w-full rounded-lg object-cover"
			/>
			{#if article.image.caption || article.image.credit}
				<figcaption class="text-[13.5px] text-ink-3">
					{[article.image.caption, article.image.credit && `Photo: ${article.image.credit}`]
						.filter(Boolean)
						.join(' · ')}
				</figcaption>
			{/if}
		</figure>
	{/if}

	<div class="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
		{#if article.content}<ArticleBody html={article.content} />{:else}<div></div>{/if}
		<aside class="flex flex-col gap-4 lg:sticky lg:top-6">
			<RelatedTopics related={article.related} />
		</aside>
	</div>
</article>

{#if data.more.length}
	<section class="border-t border-line bg-surface">
		<div class="page-container pt-12 pb-16">
			<h2 class="mb-[18px] font-display text-[34px] leading-[0.94] font-bold sm:text-[40px]">
				More stories
			</h2>
			<StoryCards stories={data.more} />
		</div>
	</section>
{/if}
