<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { ResultsDeskEntry } from '#lib/domain/meeting.js';
	import { formatDateRange } from '#lib/format/date.js';
	import { meetingUrl, PAGES } from '#lib/routing/urls.js';

	let { entries }: { entries: ResultsDeskEntry[] } = $props();

	const DOTS = ['bg-gold', 'bg-silver', 'bg-bronze'];
</script>

<section class="bg-ink text-night-ink">
	<div class="page-container pt-[52px] pb-14">
		<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div class="flex flex-col gap-2">
				<span class="font-data text-xs tracking-[0.16em] text-brand uppercase">Results desk</span>
				<h2 class="font-display text-[36px] leading-[0.94] font-bold sm:text-5xl">
					Fresh in the archive
				</h2>
			</div>
			<a href={PAGES.champs} class="text-sm font-semibold text-brand hover:underline">
				All championships →
			</a>
		</div>
		<ul class="grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] gap-3.5">
			{#each entries as { meeting, summary } (meeting.slug)}
				<li>
					<a
						href={meetingUrl(meeting.champ.slug, meeting.slug)}
						class="flex h-full flex-col gap-3.5 rounded-[14px] border border-night-line-2 bg-night-surface/45 p-5 hover:border-brand"
					>
						<span class="flex items-center justify-between gap-2.5">
							{#if meeting.countryCode}<Flag
									code={meeting.countryCode}
									class="h-[19.5px] w-[26px]"
								/>{/if}
							{#if meeting.startDate}
								<span class="font-data text-xs text-night-ink-3">
									{formatDateRange(meeting.startDate, meeting.endDate)}
								</span>
							{/if}
						</span>
						<strong class="font-display text-[28px] leading-none font-bold">{meeting.name}</strong>
						{#if meeting.city}<span class="-mt-1.5 text-[13px] text-night-ink-3"
								>{meeting.city}</span
							>{/if}
						<span class="flex flex-col border-t border-night-line-2">
							{#if summary.kind === 'nations'}
								{#each summary.nations as nation, index (nation.country.code)}
									<span
										class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-b border-night-surface py-[9px] text-sm"
									>
										<span class="flex min-w-0 items-center gap-[9px]">
											<span class="size-2 flex-none rounded-full {DOTS[index]}"></span>
											<span class="truncate">
												<strong class="font-semibold">{nation.country.name}</strong>
												<span class="text-night-ink-4">
													{nation.gold} · {nation.silver} · {nation.bronze}
												</span>
											</span>
										</span>
										<span class="font-data font-semibold tabular">{nation.total}</span>
									</span>
								{/each}
							{:else}
								{#each summary.winners.slice(0, 3) as winner, index (index)}
									<span
										class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-b border-night-surface py-[9px] text-sm"
									>
										<span class="flex min-w-0 items-center gap-[9px]">
											<span class="size-2 flex-none rounded-full bg-gold"></span>
											<span class="truncate">
												<strong class="font-semibold">{winner.name}</strong>
												<span class="text-night-ink-4">
													{[winner.countryCode, winner.event].filter(Boolean).join(' · ')}
												</span>
											</span>
										</span>
										<span class="font-data font-semibold tabular">{winner.mark ?? ''}</span>
									</span>
								{/each}
							{/if}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
