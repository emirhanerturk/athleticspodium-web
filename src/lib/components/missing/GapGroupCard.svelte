<script lang="ts">
	import type { Gap, GapGroup, MissingMedal } from '#lib/domain/missing.js';

	let {
		group,
		relays,
		knowHref
	}: {
		group: GapGroup;
		relays: boolean;
		knowHref: (gap: Gap, group: string | null) => string;
	} = $props();

	const MEDALS: Record<MissingMedal, { name: string; border: string }> = {
		G: { name: 'Gold', border: 'border-gold' },
		S: { name: 'Silver', border: 'border-silver' },
		B: { name: 'Bronze', border: 'border-bronze' }
	};

	const medalNote = (medal: MissingMedal) =>
		relays ? `${MEDALS[medal].name} team, legs unknown` : `${MEDALS[medal].name} missing`;
</script>

<section class="overflow-hidden rounded-[18px] border border-line bg-surface">
	<div class="flex items-baseline justify-between gap-3 bg-surface-2 px-5 py-3.5">
		<h2 class="font-display text-[26px] leading-none font-bold">
			{group.name ?? 'Across championships'}
		</h2>
		<span class="font-data text-[13px] whitespace-nowrap text-ink-3">
			{group.gaps.length}
			{group.gaps.length === 1 ? 'gap' : 'gaps'}
		</span>
	</div>
	<ul>
		{#each group.gaps as gap, index (index)}
			<li
				class="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2 border-t border-line px-5 py-[11px] sm:grid-cols-[62px_minmax(0,1fr)_auto_auto]"
			>
				<strong class="font-data text-[15px]">{gap.year}</strong>
				<span class="text-[14.5px] leading-snug">{gap.text}</span>
				{#if gap.medals.length}
					<span class="flex gap-1 max-sm:col-start-2 max-sm:row-start-2">
						{#each gap.medals as medal, position (position)}
							<span
								title={medalNote(medal)}
								class="grid size-6 place-items-center rounded-full border-2 border-dashed {MEDALS[
									medal
								].border} font-data text-[11px] font-bold text-ink-2"
							>
								<span aria-hidden="true">{medal}</span>
								<span class="sr-only">{medalNote(medal)}</span>
							</span>
						{/each}
					</span>
				{/if}
				<a
					href={knowHref(gap, group.name)}
					aria-label="I know this: {gap.year} {gap.text}"
					class="inline-flex h-[30px] items-center rounded-lg border border-line-2 px-[11px] text-[13px] font-semibold whitespace-nowrap hover:border-ink hover:bg-brand-soft max-sm:col-start-3 max-sm:row-start-1 sm:col-start-4"
				>
					I know this
				</a>
			</li>
		{/each}
	</ul>
</section>
