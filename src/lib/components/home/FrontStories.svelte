<script lang="ts">
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { ArticleTeaser } from '#lib/domain/article.js';
	import { formatDate, formatDayMonth } from '#lib/format/date.js';
	import { articleUrl } from '#lib/routing/urls.js';

	let { lead, latest }: { lead: ArticleTeaser | null; latest: ArticleTeaser[] } = $props();
</script>

<section class="page-container pt-7 pb-12">
	<div class="grid grid-cols-1 gap-9 md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
		{#if lead}
			<a href={articleUrl(lead)} class="relative block hover:opacity-[.97]">
				{#if lead.image}
					<MediaImage
						image={lead.image}
						alt={lead.image.caption ?? lead.title}
						width={1200}
						height={800}
						eager
						class="block aspect-[3/2] w-full rounded-md object-cover"
					/>
				{/if}
				<div
					class="flex flex-col gap-3 rounded bg-bg px-5 pt-5 pb-4 shadow-[0_12px_40px_rgba(0,0,0,.18)] sm:px-7 sm:pt-[26px] sm:pb-6 {lead.image
						? 'relative mx-3 -mt-12 md:absolute md:right-[120px] md:bottom-6 md:left-6 md:m-0'
						: ''}"
				>
					{#if lead.context}
						<span class="font-data text-xs tracking-[0.1em] text-ink-3 uppercase">
							{lead.context.name}
						</span>
					{/if}
					<h2 class="font-display text-[40px] leading-[0.94] font-bold text-balance sm:text-[72px]">
						{lead.title}
					</h2>
					{#if lead.description}
						<p class="text-[17px] leading-normal text-ink-2">{lead.description}</p>
					{/if}
					<span class="text-[13px] text-ink-3">
						{formatDate(lead.publishedOn)}{#if lead.image?.credit}&nbsp;· Photo: {lead.image
								.credit}{/if}
					</span>
				</div>
			</a>
		{/if}
		{#if latest.length}
			<div class="flex flex-col">
				<h2 class="mb-1.5 font-data text-xs font-semibold tracking-[0.14em] text-ink-3 uppercase">
					Latest
				</h2>
				{#each latest as story (story.id)}
					<a
						href={articleUrl(story)}
						class="grid grid-cols-[minmax(0,1fr)_92px] items-start gap-4 border-t border-line-2 py-4 hover:text-brand-ink"
					>
						<span class="flex flex-col gap-1.5">
							<span class="font-data text-xs text-ink-3">
								{formatDayMonth(story.publishedOn)}{#if story.context}&nbsp;· {story.context
										.name}{/if}
							</span>
							<strong class="font-display text-[26px] leading-none font-bold">{story.title}</strong>
							{#if story.description}
								<span class="text-sm leading-[1.45] text-ink-2">{story.description}</span>
							{/if}
						</span>
						{#if story.image}
							<MediaImage
								image={story.image}
								alt=""
								width={184}
								height={184}
								class="block size-[92px] rounded object-cover"
							/>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
