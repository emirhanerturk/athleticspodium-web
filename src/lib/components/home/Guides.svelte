<script lang="ts">
	import ArrowRightIcon from '#lib/components/ui/icons/ArrowRightIcon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { Guide } from '#lib/domain/guides.js';
	import { articleUrl } from '#lib/routing/urls.js';

	let { guides }: { guides: Guide[] } = $props();
</script>

<section aria-labelledby="guides-heading" class="page-container pt-9 pb-2">
	<div class="mb-[18px] flex flex-wrap items-baseline justify-between gap-3">
		<h2
			id="guides-heading"
			class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]"
		>
			Guides
		</h2>
		<span class="text-sm text-ink-3">Everything about one event, kept up to date</span>
	</div>
	<ul class="grid grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))] gap-5">
		{#each guides as guide (guide.article.id)}
			<li>
				<a
					href={articleUrl(guide.article)}
					class="relative flex h-full min-h-[300px] flex-col justify-end gap-3.5 overflow-hidden rounded-[22px] bg-night p-[26px] text-night-ink hover:shadow-[0_0_0_3px_var(--color-brand)]"
				>
					<MediaImage
						image={guide.image}
						alt=""
						width={1000}
						height={550}
						class="absolute inset-0 size-full object-cover opacity-50"
					/>
					<span
						aria-hidden="true"
						class="absolute inset-0 bg-linear-to-r from-night/95 via-night/75 to-night/20"
					></span>
					<span
						class="relative inline-flex h-[26px] items-center self-start rounded-full bg-brand px-2.5 font-data text-xs font-bold tracking-[0.1em] text-ink uppercase"
					>
						Guide · {guide.topic}
					</span>
					<h3
						class="relative max-w-[460px] font-display text-[44px] leading-[0.92] font-bold sm:text-[56px]"
					>
						{guide.title}
					</h3>
					<p class="relative max-w-[440px] text-[15px] leading-normal text-night-ink-2">
						{guide.summary}
					</p>
					<dl class="relative flex flex-wrap gap-[22px] border-t border-night-ink/20 pt-3.5">
						{#each guide.facts as fact (fact.label)}
							<div class="flex flex-col-reverse gap-0.5">
								<dt class="text-[12.5px] text-night-ink-3">{fact.label}</dt>
								<dd class="font-display text-[30px] leading-none font-bold text-brand">
									{fact.value}
								</dd>
							</div>
						{/each}
					</dl>
					<span
						aria-hidden="true"
						class="absolute top-[26px] right-[26px] grid size-11 place-items-center rounded-full bg-brand text-ink"
					>
						<ArrowRightIcon class="size-5" />
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
