<script lang="ts">
	import type { EditionRef, ProgrammeEvent } from '#lib/domain/championship.js';
	import { GENDER_LABELS, type Gender } from '#lib/domain/edition.js';
	import { medalSearchUrl } from '#lib/routing/urls.js';

	let {
		champId,
		programme,
		growth,
		since
	}: {
		champId: number;
		programme: Record<Gender, ProgrammeEvent[]>;
		growth: { from: EditionRef; to: EditionRef } | null;
		since: number | null;
	} = $props();

	const groups = $derived(
		(Object.keys(GENDER_LABELS) as Gender[])
			.map((gender) => ({ gender, events: programme[gender] }))
			.filter((group) => group.events.length)
	);
	const total = $derived(groups.reduce((sum, group) => sum + group.events.length, 0));
	const place = (edition: EditionRef) => edition.city ?? String(edition.year);
</script>

<section class="bg-ink text-night-ink">
	<div class="page-container py-14">
		<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div class="flex flex-col gap-2.5">
				<span class="font-data text-xs tracking-[0.16em] text-brand uppercase">
					Programme · all time
				</span>
				<h2 class="font-display text-[34px] leading-[0.94] font-bold sm:text-[44px]">
					{total}
					{total === 1 ? 'event' : 'events'} contested{since ? ` since ${since}` : ''}
				</h2>
			</div>
			{#if growth}
				<p class="max-w-[460px] text-[15px] leading-[1.55] text-night-ink-3">
					From {growth.from.eventsCount} events in {place(growth.from)} to {growth.to.eventsCount} in
					{place(growth.to)}.
				</p>
			{/if}
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each groups as group (group.gender)}
				<div
					class="flex flex-col gap-3.5 rounded-[18px] border border-night-line-2 bg-night-surface/45 p-[22px]"
				>
					<h3 class="flex items-baseline justify-between">
						<span class="font-display text-[30px] leading-none font-bold">
							{GENDER_LABELS[group.gender]}
						</span>
						<span class="font-data text-sm text-brand">{group.events.length}</span>
					</h3>
					<ul class="flex flex-wrap gap-1.5">
						{#each group.events as event (event.id)}
							<li>
								<a
									href={medalSearchUrl({ champ: champId, event: event.id, gender: group.gender })}
									class="block rounded-[7px] bg-night-surface px-[9px] py-[5px] font-data text-[13px] text-night-ink-2 hover:bg-brand hover:text-ink"
								>
									{event.longName}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
