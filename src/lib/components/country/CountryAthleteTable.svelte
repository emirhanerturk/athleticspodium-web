<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { CountryAthlete } from '#lib/domain/country.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import { formatDate, formatYearSpan } from '#lib/format/date.js';
	import { formatEventList } from '#lib/format/event.js';

	let {
		athletes,
		offset,
		mostMedals,
		today
	}: { athletes: CountryAthlete[]; offset: number; mostMedals: number; today: IsoDate } = $props();

	const TALLY = [
		{ key: 'gold', label: 'gold', fill: 'bg-gold' },
		{ key: 'silver', label: 'silver', fill: 'bg-silver' },
		{ key: 'bronze', label: 'bronze', fill: 'bg-bronze' }
	] as const;
	const HEAD = 'py-3 font-normal';

	const barWidth = (total: number) =>
		`${Math.max(2, Math.round(Math.sqrt(total / Math.max(1, mostMedals)) * 100))}%`;
</script>

<table class="w-full table-fixed border-collapse">
	<thead>
		<tr class="border-b border-line font-data text-[11.5px] tracking-[0.12em] text-ink-3 uppercase">
			<th scope="col" class="{HEAD} w-[38px] pl-3 text-left sm:w-[68px] sm:pl-5">#</th>
			<th scope="col" class="{HEAD} pl-2 text-left sm:pl-3.5">Athlete</th>
			<th scope="col" class="{HEAD} hidden w-[134px] pl-3.5 text-left md:table-cell">Born</th>
			<th scope="col" class="{HEAD} hidden w-[234px] pl-3.5 text-left lg:table-cell">Events</th>
			<th scope="col" class="{HEAD} w-[92px] pl-2 text-left sm:w-[164px] sm:pl-3.5">
				<abbr title="Gold, silver, bronze" class="no-underline">G · S · B</abbr>
			</th>
			<th scope="col" class="{HEAD} w-[46px] pr-3.5 text-right sm:w-16 sm:pr-5 md:w-[200px]">
				Total
			</th>
		</tr>
	</thead>
	<tbody>
		{#each athletes as { athlete, tally, events, firstYear, lastYear }, index (athlete.id)}
			<tr class="border-b border-line">
				<td
					class="py-2.5 pl-3 font-display text-[17px] font-bold text-ink-3 tabular sm:pl-5 sm:text-[22px]"
				>
					{offset + index + 1}
				</td>
				<td class="py-2.5 pl-2 sm:pl-3.5">
					<span class="flex min-w-0 items-center gap-2.5 sm:gap-3">
						<AthletePortrait
							image={athlete.image}
							firstName={athlete.firstName}
							lastName={athlete.lastName}
							class="size-[34px] text-[12px] sm:size-[38px] sm:text-[13px]"
						/>
						<span class="flex min-w-0 flex-col gap-0.5">
							<AthleteName
								{athlete}
								{today}
								class="text-[15px] font-semibold underline decoration-line-2 decoration-dotted underline-offset-4 hover:text-brand-ink sm:truncate"
							>
								{fullName(athlete)}
							</AthleteName>
							<span class="text-[12px] whitespace-nowrap text-ink-3">
								{athlete.men ? 'Men' : 'Women'}{#if firstYear && lastYear}&nbsp;·&nbsp;<span
										class="font-data">{formatYearSpan(firstYear, lastYear)}</span
									>{/if}
							</span>
						</span>
					</span>
				</td>
				<td class="hidden py-2.5 pl-3.5 font-data text-[13.5px] text-ink-2 md:table-cell">
					{athlete.birthDate ? formatDate(athlete.birthDate) : '–'}
				</td>
				<td class="hidden truncate py-2.5 pl-3.5 text-[13px] text-ink-2 lg:table-cell">
					{formatEventList(events) || '–'}
				</td>
				<td class="py-2.5 pl-2 sm:pl-3.5">
					<span
						class="flex items-center gap-[5px] font-data text-[13.5px] tabular sm:gap-2.5 sm:text-[14.5px]"
					>
						{#each TALLY as medal (medal.key)}
							<span
								class="inline-flex items-center gap-[3px] sm:gap-1 {medal.key === 'gold'
									? 'font-bold'
									: 'text-ink-2'}"
							>
								<span class="size-[9px] shrink-0 rounded-full {medal.fill}" aria-hidden="true"
								></span>
								{tally[medal.key]}<span class="sr-only">&nbsp;{medal.label}</span>
							</span>
						{/each}
					</span>
				</td>
				<td class="py-2.5 pr-3.5 sm:pr-5">
					<span class="flex items-center justify-end gap-2.5">
						<span
							class="hidden h-1.5 max-w-[110px] flex-1 overflow-hidden rounded-[3px] bg-surface-2 md:block"
							aria-hidden="true"
						>
							<span class="block h-full bg-ink" style:width={barWidth(tally.total)}></span>
						</span>
						<strong class="min-w-7 text-right font-data text-[17px] tabular">{tally.total}</strong>
					</span>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
