<script lang="ts">
	let { html, moreLabel }: { html: string; moreLabel: string } = $props();

	let expanded = $state(false);
	let overflowing = $state(true);

	function measureOverflow(body: HTMLElement) {
		overflowing = body.scrollHeight > body.clientHeight + 1;
	}
</script>

<div
	{@attach measureOverflow}
	class="prose-body relative flex max-w-[720px] flex-col gap-3.5 text-[16.5px] leading-[1.65] text-ink-2 {expanded
		? ''
		: 'max-h-[19rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]'}"
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- written by editors in the CMS -->
	{@html html}
</div>
{#if overflowing || expanded}
	<button
		type="button"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
		class="mt-4 h-11 rounded-full border-[1.5px] border-ink px-[18px] text-sm font-semibold hover:bg-surface-2"
	>
		{expanded ? 'Show less' : moreLabel}
	</button>
{/if}

<style>
	.prose-body :global(p) {
		margin: 0;
	}

	.prose-body :global(p:first-child) {
		font-size: 19px;
		line-height: 1.55;
		color: var(--color-ink);
	}

	.prose-body :global(h3) {
		margin: 0.4em 0 0;
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 700;
		line-height: 1.05;
		color: var(--color-ink);
	}

	.prose-body :global(a) {
		color: var(--color-brand-ink);
		text-decoration: underline;
	}
</style>
