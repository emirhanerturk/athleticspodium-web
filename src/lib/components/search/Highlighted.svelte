<script lang="ts">
	import { highlight } from '#lib/domain/search.js';

	let { text, query }: { text: string; query: string } = $props();

	const parts = $derived(highlight(text, query));
</script>

{parts[0]}{#if parts[1]}<mark class="border-b-2 border-brand bg-brand-soft px-px text-inherit"
		>{parts[1]}</mark
	>{/if}{parts[2]}
