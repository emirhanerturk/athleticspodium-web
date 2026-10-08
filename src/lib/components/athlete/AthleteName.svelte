<script lang="ts" module>
	import { SvelteMap } from 'svelte/reactivity';
	import type { AthleteSummary } from '#lib/domain/athlete.js';

	const summaries = new SvelteMap<number, Promise<AthleteSummary | null>>();

	function loadSummary(id: number): Promise<AthleteSummary | null> {
		if (!summaries.has(id)) {
			summaries.set(
				id,
				fetch(`/internal/athlete-card/${id}`)
					.then((response) => (response.ok ? response.json() : null))
					.catch(() => null)
			);
		}
		return summaries.get(id)!;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AthleteRef } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { athleteUrl } from '#lib/routing/urls.js';
	import { popoverAlign, type PopoverAlign } from '#lib/utils/popover-align.js';
	import AthleteCard from './AthleteCard.svelte';

	let {
		athlete,
		today,
		result,
		class: className = '',
		children
	}: {
		athlete: AthleteRef;
		today: IsoDate;
		result?: string;
		class?: string;
		children: Snippet;
	} = $props();

	const OPEN_DELAY_MS = 100;

	let summary = $state<AthleteSummary | null>(null);
	let loading = $state(false);
	let open = $state(false);
	let anchor = $state<HTMLElement>();
	let align = $state<PopoverAlign>('start');
	let timer: ReturnType<typeof setTimeout> | undefined;

	function show(event: Event) {
		const canHover = matchMedia('(hover: hover)').matches;
		if (event.type !== 'focus' && !canHover) return;

		void fetchSummary();
		clearTimeout(timer);
		timer = setTimeout(() => (open = true), OPEN_DELAY_MS);
	}

	async function fetchSummary() {
		if (summary || loading) return;
		loading = true;
		summary = await loadSummary(athlete.id);
		loading = false;
	}

	function hide() {
		clearTimeout(timer);
		open = false;
	}

	function hideOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
	}

	function placeCard(card: HTMLElement) {
		if (!anchor) return;
		const viewportWidth = document.documentElement.clientWidth;
		align = popoverAlign(anchor.getBoundingClientRect(), card.offsetWidth, viewportWidth);
	}
</script>

<svelte:window onkeydown={open ? hideOnEscape : undefined} />

<span
	bind:this={anchor}
	class="relative inline-flex min-w-0"
	role="presentation"
	onpointerleave={hide}
>
	<a
		href={athleteUrl(athlete)}
		onpointerenter={show}
		onfocus={show}
		onblur={hide}
		class={className}
	>
		{@render children()}
	</a>
	{#if open}
		<div
			{@attach placeCard}
			class="absolute top-full z-50 pt-2 {align === 'end' ? 'right-0' : 'left-0'}"
		>
			<AthleteCard {athlete} {summary} {loading} {today} {result} {align} />
		</div>
	{/if}
</span>
