<script lang="ts">
	import { recordTier } from '#lib/domain/record.js';

	let { record }: { record: string } = $props();

	const STYLES = {
		world: 'bg-ink text-brand',
		major: 'bg-brand-soft text-brand-ink',
		other: 'border border-line-2 text-ink-2'
	};
</script>

<span
	class="{STYLES[
		recordTier(record)
	]} rounded-[5px] px-1.5 py-0.5 font-data text-[11px] font-bold tracking-[0.04em]"
>
	{record}
</span>
