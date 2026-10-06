<script lang="ts">
	import AthleteName from '#lib/components/athlete/AthleteName.svelte';
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { CountryAthlete } from '#lib/domain/country.js';
	import type { IsoDate } from '#lib/domain/date.js';

	let { athletes, offset, today }: { athletes: CountryAthlete[]; offset: number; today: IsoDate } =
		$props();
</script>

<div class="overflow-x-auto rounded-[20px] border border-line bg-surface">
	<table class="w-full min-w-[560px] border-collapse text-[14.5px]">
		<thead>
			<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
				<th scope="col" class="w-14 py-3 pl-5 text-left font-semibold">#</th>
				<th scope="col" class="py-3 text-left font-semibold">Athlete</th>
				<th scope="col" class="hidden w-24 py-3 text-left font-semibold sm:table-cell">Born</th>
				<th scope="col" class="w-12 py-3"
					><span title="Gold" class="inline-block size-3 rounded-full bg-gold"></span></th
				>
				<th scope="col" class="w-12 py-3"
					><span title="Silver" class="inline-block size-3 rounded-full bg-silver"></span></th
				>
				<th scope="col" class="w-12 py-3"
					><span title="Bronze" class="inline-block size-3 rounded-full bg-bronze"></span></th
				>
				<th scope="col" class="w-16 py-3 pr-5 text-right font-semibold">Total</th>
			</tr>
		</thead>
		<tbody class="font-data tabular">
			{#each athletes as { athlete, tally }, index (athlete.id)}
				<tr class="border-t border-line">
					<td class="py-2.5 pl-5 text-[13.5px] text-ink-3">{offset + index + 1}</td>
					<td class="py-2.5 font-text">
						<span class="flex min-w-0 items-center gap-3">
							<AthletePortrait
								image={athlete.image}
								firstName={athlete.firstName}
								lastName={athlete.lastName}
								class="size-9 text-xs"
							/>
							<span class="flex min-w-0 flex-col">
								<AthleteName {athlete} {today} class="truncate font-semibold hover:text-brand-ink"
									>{fullName(athlete)}</AthleteName
								>
								<span class="truncate text-[12.5px] text-ink-3">
									{[athlete.men ? 'Men' : 'Women', ...athlete.events.slice(0, 2)].join(' · ')}
								</span>
							</span>
						</span>
					</td>
					<td class="hidden py-2.5 text-ink-2 sm:table-cell"
						>{athlete.birthDate?.slice(0, 4) ?? '–'}</td
					>
					<td class="py-2.5 text-center font-bold">{tally.gold}</td>
					<td class="py-2.5 text-center">{tally.silver}</td>
					<td class="py-2.5 text-center">{tally.bronze}</td>
					<td class="py-2.5 pr-5 text-right font-bold">{tally.total}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
