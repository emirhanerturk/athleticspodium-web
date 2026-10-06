<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<div class="article-body flex max-w-[720px] flex-col gap-5 text-[18px] leading-[1.7] text-ink-2">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- stories are written by editors in the CMS -->
	{@html html}
</div>

<style>
	.article-body :global(:where(p, ul, ol, table, figure, blockquote)) {
		margin: 0;
	}

	.article-body :global(:where(h2, h3, h4)) {
		margin: 0.6em 0 0;
		font-family: var(--font-display);
		font-weight: 700;
		line-height: 1;
		color: var(--color-ink);
	}

	.article-body :global(h2) {
		font-size: 34px;
	}

	.article-body :global(:where(h3, h4)) {
		font-size: 26px;
	}

	.article-body :global(a) {
		color: var(--color-brand-ink);
		text-decoration: underline;
	}

	.article-body :global(:where(ul, ol)) {
		padding-left: 1.3em;
		list-style: revert;
	}

	.article-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
	}

	.article-body :global(table) {
		display: block;
		overflow-x: auto;
		border-collapse: collapse;
		font-size: 15px;
	}

	.article-body :global(:where(td, th)) {
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		text-align: left;
	}

	.article-body :global(blockquote) {
		padding-left: 18px;
		border-left: 3px solid var(--color-brand);
		color: var(--color-ink);
	}
</style>
