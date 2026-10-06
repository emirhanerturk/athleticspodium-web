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

	const OPEN_DELAY_MS = 150;

	let summary = $state<AthleteSummary | null>(null);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function show(event: Event) {
		const canHover = matchMedia('(hover: hover)').matches;
		if (event.type !== 'focus' && !canHover) return;

		clearTimeout(timer);
		timer = setTimeout(async () => {
			summary = await loadSummary(athlete.id);
			open = summary !== null;
		}, OPEN_DELAY_MS);
	}

	function hide() {
		clearTimeout(timer);
		open = false;
	}

	function hideOnEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') hide();
	}
</script>

<svelte:window onkeydown={open ? hideOnEscape : undefined} />

<span class="relative inline-flex min-w-0" role="presentation" onpointerleave={hide}>
	<a
		href={athleteUrl(athlete)}
		onpointerenter={show}
		onfocus={show}
		onblur={hide}
		class={className}
	>
		{@render children()}
	</a>
	{#if open && summary}
		<div class="absolute top-full left-0 z-50 pt-2">
			<AthleteCard athlete={summary} {today} {result} />
		</div>
	{/if}
</span>
