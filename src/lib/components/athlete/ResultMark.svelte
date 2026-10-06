<script lang="ts">
	import type { Result } from '#lib/domain/result.js';
	import { formatWind } from '#lib/format/mark.js';

	let { result }: { result: Result } = $props();

	const indoor = $derived(result.markNote === '(i)');
</script>

<span class="font-data font-bold whitespace-nowrap tabular">
	<span class={result.canceled ? 'text-ink-3 line-through decoration-dq decoration-2' : ''}>
		{result.mark ?? '—'}
	</span>
	{#if indoor}
		<span title="Indoor" class="ml-1 font-medium text-ink-3">i</span>
	{:else if result.markNote}
		<span class="ml-1 text-xs font-medium text-ink-3">{result.markNote}</span>
	{/if}
	{#if result.wind !== null}
		<span title="Wind (m/s)" class="ml-1 text-xs font-medium text-ink-3"
			>{formatWind(result.wind)}</span
		>
	{/if}
</span>
