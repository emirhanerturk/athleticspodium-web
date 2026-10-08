<script lang="ts">
	let {
		place,
		canceled = false,
		class: className = 'size-[26px] text-xs'
	}: { place: number | null; canceled?: boolean; class?: string } = $props();

	const FILLS: Record<number, string> = { 1: 'bg-gold', 2: 'bg-silver', 3: 'bg-bronze' };
	const NAMES: Record<number, string> = { 1: 'Gold', 2: 'Silver', 3: 'Bronze' };

	const fill = $derived(
		canceled
			? 'bg-dq text-surface'
			: place && FILLS[place]
				? `${FILLS[place]} text-ink`
				: 'bg-surface-2 text-ink-2'
	);
	const title = $derived(
		canceled ? 'Disqualified' : place ? (NAMES[place] ?? `Place ${place}`) : 'Medal'
	);
</script>

<span
	{title}
	class="{className} {fill} inline-grid shrink-0 place-items-center rounded-full font-data font-bold"
>
	{canceled ? 'DQ' : (place ?? '–')}
</span>
