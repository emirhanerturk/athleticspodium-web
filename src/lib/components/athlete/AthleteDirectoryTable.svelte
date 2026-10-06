<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { type AthleteListing } from '#lib/domain/athlete.js';
	import type { IsoDate } from '#lib/domain/date.js';
	import AthleteName from './AthleteName.svelte';
	import AthletePortrait from './AthletePortrait.svelte';

	let { athletes, today }: { athletes: AthleteListing[]; today: IsoDate } = $props();

	function lifeYears(athlete: AthleteListing): string {
		const born = athlete.birthDate?.slice(0, 4);
		if (athlete.deathDate) return `${born ?? '?'}–${athlete.deathDate.slice(0, 4)}`;
		return born ?? '–';
	}
</script>

<div class="overflow-x-auto rounded-[20px] border border-line bg-surface">
	<table class="w-full min-w-[520px] border-collapse text-[14.5px]">
		<thead>
			<tr class="font-data text-[11px] tracking-[0.1em] text-ink-3 uppercase">
				<th scope="col" class="py-3 pl-5 text-left font-semibold">Athlete</th>
				<th scope="col" class="w-28 py-3 text-left font-semibold">Country</th>
				<th scope="col" class="w-28 py-3 pr-5 text-right font-semibold">Born</th>
			</tr>
		</thead>
		<tbody>
			{#each athletes as athlete (athlete.id)}
				<tr class="border-t border-line">
					<td class="py-2.5 pl-5">
						<span class="flex min-w-0 items-center gap-3">
							<AthletePortrait
								image={athlete.image}
								firstName={athlete.firstName}
								lastName={athlete.lastName}
								class="size-9 text-xs"
							/>
							<span class="flex min-w-0 flex-col">
								<span class="flex min-w-0 items-center gap-2">
									<AthleteName
										{athlete}
										{today}
										class="truncate font-semibold hover:text-brand-ink"
									>
										<span class="font-bold">{athlete.lastName}</span>{athlete.firstName
											? `, ${athlete.firstName}`
											: ''}
									</AthleteName>
									{#if athlete.olympicChampion}
										<span
											title="Olympic champion"
											class="rounded bg-brand px-[5px] py-0.5 font-data text-[10.5px] font-bold text-ink"
											>OG</span
										>
									{/if}
								</span>
								{#if athlete.events.length}
									<span class="truncate text-[12.5px] text-ink-3">
										{athlete.events.slice(0, 3).join(' · ')}
									</span>
								{/if}
							</span>
						</span>
					</td>
					<td class="py-2.5">
						{#if athlete.countryCode}
							<span class="inline-flex items-center gap-2 font-data text-[13.5px] font-semibold">
								<Flag code={athlete.countryCode} />{athlete.countryCode}
							</span>
						{/if}
					</td>
					<td class="py-2.5 pr-5 text-right font-data text-ink-2 tabular">{lifeYears(athlete)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
