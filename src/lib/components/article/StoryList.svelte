<script lang="ts">
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { ArticleSummary } from '#lib/domain/article.js';
	import { formatDate } from '#lib/format/date.js';
	import { articleUrl } from '#lib/routing/urls.js';

	let { stories }: { stories: ArticleSummary[] } = $props();
</script>

<div>
	<h3 class="mb-3 text-[13px] font-bold tracking-[0.08em] text-ink-3 uppercase">In the stories</h3>
	<div class="flex flex-col gap-2.5">
		{#each stories as story (story.id)}
			<a
				href={articleUrl(story)}
				class="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3.5 hover:text-brand-ink"
			>
				{#if story.image}
					<MediaImage
						image={story.image}
						alt=""
						width={96}
						height={64}
						class="h-16 w-24 rounded-[10px] bg-surface-2 object-cover"
					/>
				{:else}
					<span class="h-16 w-24 rounded-[10px] bg-surface-2"></span>
				{/if}
				<span class="flex flex-col gap-[3px]">
					<strong class="text-[15px] leading-[1.3] font-semibold">{story.title}</strong>
					<span class="font-data text-xs text-ink-3">{formatDate(story.publishedOn)}</span>
				</span>
			</a>
		{/each}
	</div>
</div>
