<script lang="ts">
	let { items }: { items: { label: string; href?: string }[] } = $props();
</script>

<nav aria-label="Breadcrumb" class="page-container pt-5 text-[13.5px] text-ink-3">
	<ol class="flex flex-wrap items-center gap-2">
		{#each items as item, index (index)}
			<li class="flex items-center gap-2">
				{#if index > 0}<span aria-hidden="true">/</span>{/if}
				{#if item.href}
					<a href={item.href} class="text-ink-2 hover:text-ink hover:underline">{item.label}</a>
				{:else}
					<span aria-current="page" class="font-semibold text-ink">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
