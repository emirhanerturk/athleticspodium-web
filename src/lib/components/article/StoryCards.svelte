<script lang="ts">
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { ArticleSummary } from '#lib/domain/article.js';
	import { formatDate } from '#lib/format/date.js';
	import { articleUrl } from '#lib/routing/urls.js';

	let { stories }: { stories: ArticleSummary[] } = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
	{#each stories as story (story.id)}
		<a
			href={articleUrl(story)}
			class="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface hover:shadow-[0_1px_2px_rgba(18,19,22,.05),0_8px_24px_rgba(18,19,22,.06)]"
		>
			{#if story.image}
				<MediaImage
					image={story.image}
					alt=""
					width={480}
					height={300}
					class="aspect-[16/10] w-full bg-surface-2 object-cover"
				/>
			{/if}
			<span class="flex flex-col gap-2 px-[18px] pt-4 pb-[18px]">
				<span class="font-data text-xs text-ink-3">{formatDate(story.publishedOn)}</span>
				<strong class="text-lg leading-tight font-bold">{story.title}</strong>
				{#if story.description}
					<span class="text-sm leading-normal text-ink-2">{story.description}</span>
				{/if}
			</span>
		</a>
	{/each}
</div>
