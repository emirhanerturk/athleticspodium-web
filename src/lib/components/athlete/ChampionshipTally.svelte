<script lang="ts">
	import type { ChampionshipTally } from '#lib/domain/career.js';
	import type { MedalTally } from '#lib/domain/result.js';
	import { champUrl } from '#lib/routing/urls.js';

	let {
		title,
		totalLabel,
		rows,
		total
	}: { title: string; totalLabel: string; rows: ChampionshipTally[]; total: MedalTally } = $props();

	const MEDALS = [
		{ key: 'gold', label: 'Gold', dot: 'bg-gold' },
		{ key: 'silver', label: 'Silver', dot: 'bg-silver' },
		{ key: 'bronze', label: 'Bronze', dot: 'bg-bronze' }
	] as const;
</script>

<div>
	<h2 class="mb-3.5 font-display text-[30px] leading-[0.94] font-bold sm:text-4xl">{title}</h2>
	<table class="w-full border-collapse text-[14.5px]">
		<thead>
			<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
				<th scope="col" class="py-2 text-left font-semibold">Championship</th>
				{#each MEDALS as medal (medal.key)}
					<th scope="col" class="w-10 py-2">
						<span
							title={medal.label}
							role="img"
							class="inline-block size-3 rounded-full {medal.dot}"
							aria-label={medal.label}
						></span>
					</th>
				{/each}
				<th scope="col" class="w-12 py-2 text-right font-semibold">Total</th>
			</tr>
		</thead>
		<tbody class="font-data tabular">
			{#each rows as row (row.champ.id)}
				<tr class="border-t border-line">
					<td class="py-[9px] font-text">
						<a href={champUrl(row.champ.slug)} class="font-semibold hover:text-brand-ink">
							{row.champ.name}
						</a>
					</td>
					{#each MEDALS as medal (medal.key)}
						<td class="py-[9px] text-center {row[medal.key] ? 'text-ink' : 'text-line-2'}">
							{row[medal.key]}
						</td>
					{/each}
					<td class="py-[9px] text-right font-bold">{row.total}</td>
				</tr>
			{/each}
			<tr class="border-t-2 border-ink font-bold">
				<td class="py-[11px] font-text">{totalLabel}</td>
				{#each MEDALS as medal (medal.key)}
					<td class="py-[11px] text-center">{total[medal.key]}</td>
				{/each}
				<td class="py-[11px] text-right">{total.total}</td>
			</tr>
		</tbody>
	</table>
</div>
