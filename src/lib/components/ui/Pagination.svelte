<script lang="ts">
	let {
		page,
		lastPage,
		href
	}: { page: number; lastPage: number | null; href: (page: number) => string } = $props();

	const LINK =
		'inline-flex h-11 items-center rounded-full border-[1.5px] border-ink px-[18px] text-sm font-semibold hover:bg-surface-2';
	const hasNext = $derived(lastPage === null || page < lastPage);
</script>

<nav aria-label="Pagination" class="flex flex-wrap items-center justify-between gap-3">
	{#if page > 1}
		<a href={href(page - 1)} rel="prev" class={LINK}>← Previous</a>
	{:else}
		<span></span>
	{/if}
	<span class="font-data text-sm text-ink-3">
		Page {page}{lastPage ? ` of ${lastPage}` : ''}
	</span>
	{#if hasNext}
		<a href={href(page + 1)} rel="next" class={LINK}>Next →</a>
	{:else}
		<span></span>
	{/if}
</nav>
