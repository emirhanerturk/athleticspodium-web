<script lang="ts">
	let { html }: { html: string } = $props();

	let expanded = $state(false);
	let overflowing = $state(true);

	function measureOverflow(body: HTMLElement) {
		overflowing = body.scrollHeight > body.clientHeight + 1;
	}
</script>

<article>
	<h2 class="mb-3.5 font-display text-[30px] leading-[0.94] font-bold sm:text-4xl">Biography</h2>
	<div
		{@attach measureOverflow}
		class="biography relative flex max-w-[720px] flex-col gap-3.5 text-[16.5px] leading-[1.65] text-ink-2 {expanded
			? ''
			: 'max-h-[19rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]'}"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- biographies are written by editors in the CMS -->
		{@html html}
	</div>
	{#if overflowing || expanded}
		<button
			type="button"
			aria-expanded={expanded}
			onclick={() => (expanded = !expanded)}
			class="mt-4 h-11 rounded-full border-[1.5px] border-ink px-[18px] text-sm font-semibold hover:bg-surface-2"
		>
			{expanded ? 'Show less' : 'Read full biography'}
		</button>
	{/if}
</article>

<style>
	.biography :global(p) {
		margin: 0;
	}

	.biography :global(p:first-child) {
		font-size: 19px;
		line-height: 1.55;
		color: var(--color-ink);
	}

	.biography :global(a) {
		color: var(--color-brand-ink);
		text-decoration: underline;
	}
</style>
