<script lang="ts">
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import { fullName } from '#lib/domain/athlete.js';
	import type { SearchAthlete } from '#lib/domain/search.js';
	import { athleteUrl } from '#lib/routing/urls.js';
	import Highlighted from './Highlighted.svelte';

	let { athletes, query }: { athletes: SearchAthlete[]; query: string } = $props();

	const lifeYears = (athlete: SearchAthlete) =>
		athlete.deathDate
			? `${athlete.birthDate?.slice(0, 4) ?? '?'}–${athlete.deathDate.slice(0, 4)}`
			: athlete.birthDate
				? `b. ${athlete.birthDate.slice(0, 4)}`
				: '';
</script>

<ul>
	{#each athletes as athlete (athlete.id)}
		<li>
			<a
				href={athleteUrl(athlete)}
				class="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-3 hover:bg-surface sm:grid-cols-[48px_minmax(0,1fr)_110px_140px]"
			>
				<AthletePortrait
					image={athlete.image}
					firstName={athlete.firstName}
					lastName={athlete.lastName}
					class="size-12 text-[15px] {athlete.olympicChampion
						? 'shadow-[0_0_0_2px_var(--color-brand)]'
						: 'shadow-[0_0_0_2px_var(--color-line)]'}"
				/>
				<span class="flex min-w-0 flex-col gap-1">
					<strong class="truncate text-base font-semibold"
						><Highlighted text={fullName(athlete)} {query} /></strong
					>
					<span class="flex items-center gap-2 text-[13px] text-ink-3">
						{#if athlete.countryCode}
							<Flag code={athlete.countryCode} class="h-[13.5px] w-[18px]" />
							<span class="font-data font-semibold">{athlete.countryCode}</span><span>·</span>
						{/if}
						<span>{athlete.men ? 'Men' : 'Women'}</span>
						{#if athlete.olympian}
							<span
								class="inline-flex h-[18px] items-center rounded-full border border-brand px-1.5 font-data text-[10.5px] font-bold tracking-[0.06em] text-brand-ink"
								>OLYMPIAN</span
							>
						{/if}
					</span>
				</span>
				<span class="hidden font-data text-[14px] text-ink-2 sm:block">{lifeYears(athlete)}</span>
				<span class="flex items-center justify-end gap-2 font-data text-[14.5px]">
					{#if athlete.medals.total}
						<span class="inline-flex items-center gap-1"
							><span class="size-2.5 rounded-full bg-gold"></span><strong
								>{athlete.medals.gold}</strong
							></span
						>
						<span class="inline-flex items-center gap-1 text-ink-2"
							><span class="size-2.5 rounded-full bg-silver"></span>{athlete.medals.silver}</span
						>
						<span class="inline-flex items-center gap-1 text-ink-2"
							><span class="size-2.5 rounded-full bg-bronze"></span>{athlete.medals.bronze}</span
						>
					{:else}
						<span class="text-ink-3">medals —</span>
					{/if}
				</span>
			</a>
		</li>
	{/each}
</ul>
