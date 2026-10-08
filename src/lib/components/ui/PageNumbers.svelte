<script lang="ts">
	import { pageNumbers } from '#lib/utils/page-numbers.js';

	let {
		page,
		pageCount,
		href
	}: { page: number; pageCount: number; href: (page: number) => string } = $props();

	const BOX =
		'inline-grid h-9 min-w-9 place-items-center rounded-[10px] border px-2.5 font-data text-[14.5px] font-bold tabular';
	const LINK = `${BOX} border-line-2 bg-surface hover:border-ink`;
</script>

{#if pageCount > 1}
	<nav aria-label="Pagination" class="flex flex-wrap gap-1.5">
		{#if page > 1}
			<a href={href(page - 1)} rel="prev" class={LINK}>← Previous</a>
		{/if}
		{#each pageNumbers(page, pageCount) as number, index (index)}
			{#if number === null}
				<span class="inline-grid h-9 place-items-center px-1 text-ink-3" aria-hidden="true">…</span>
			{:else if number === page}
				<span aria-current="page" class="{BOX} border-ink bg-ink text-bg">{number}</span>
			{:else}
				<a href={href(number)} aria-label="Page {number}" class={LINK}>{number}</a>
			{/if}
		{/each}
		{#if page < pageCount}
			<a href={href(page + 1)} rel="next" class={LINK}>Next →</a>
		{/if}
	</nav>
{/if}
