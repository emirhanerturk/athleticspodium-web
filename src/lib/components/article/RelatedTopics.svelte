<script lang="ts">
	import AthletePortrait from '#lib/components/athlete/AthletePortrait.svelte';
	import Flag from '#lib/components/ui/Flag.svelte';
	import ArrowRightIcon from '#lib/components/ui/icons/ArrowRightIcon.svelte';
	import MedalDisc from '#lib/components/ui/MedalDisc.svelte';
	import type { ArticleDetail } from '#lib/domain/article.js';
	import { fullName } from '#lib/domain/athlete.js';
	import { athleteUrl, champUrl, countryUrl, meetingUrl } from '#lib/routing/urls.js';

	let { related }: { related: ArticleDetail['related'] } = $props();

	const championships = $derived([
		...related.meetings.map((meeting) => ({
			key: `${meeting.champSlug}/${meeting.slug}`,
			name: meeting.name,
			city: meeting.city,
			href: meetingUrl(meeting.champSlug, meeting.slug)
		})),
		...related.champs
			.filter((champ) => !related.meetings.some((meeting) => meeting.champSlug === champ.slug))
			.map((champ) => ({
				key: champ.slug,
				name: champ.name,
				city: null,
				href: champUrl(champ.slug)
			}))
	]);
	const hasTopics = $derived(
		championships.length + related.athletes.length + related.countries.length > 0
	);
</script>

{#snippet heading(title: string)}
	<h3 class="font-data text-xs font-normal tracking-[0.12em] text-ink-3 uppercase">{title}</h3>
{/snippet}

{#if hasTopics}
	<nav
		aria-labelledby="related"
		class="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5"
	>
		<h2 id="related" class="text-[15px] font-bold">In this story</h2>

		{#if championships.length}
			<div class="flex flex-col gap-1">
				{@render heading('Championships')}
				<ul class="flex flex-col divide-y divide-line">
					{#each championships as championship (championship.key)}
						<li>
							<a
								href={championship.href}
								class="group flex items-center justify-between gap-3 py-2.5 hover:text-brand-ink"
							>
								<span class="flex min-w-0 flex-col">
									<strong class="font-semibold">{championship.name}</strong>
									{#if championship.city}
										<span class="text-[13px] text-ink-3">{championship.city}</span>
									{/if}
								</span>
								<ArrowRightIcon class="size-4 shrink-0 text-ink-3 group-hover:text-brand-ink" />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if related.athletes.length}
			<div class="flex flex-col gap-1">
				{@render heading('Athletes')}
				<ul class="flex flex-col divide-y divide-line">
					{#each related.athletes as athlete (athlete.id)}
						<li>
							<a
								href={athleteUrl(athlete)}
								class="flex items-center gap-3 py-2.5 hover:text-brand-ink"
							>
								<AthletePortrait
									image={athlete.image}
									firstName={athlete.firstName}
									lastName={athlete.lastName}
									class="size-10 text-[13px]"
								/>
								<span class="flex min-w-0 flex-col gap-1">
									<span class="flex items-center gap-2">
										{#if athlete.countryCode}<Flag
												code={athlete.countryCode}
												class="h-3 w-4"
											/>{/if}
										<strong class="font-semibold">{fullName(athlete)}</strong>
									</span>
									{#if athlete.medals.length}
										<span class="flex flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-ink-2">
											{#each athlete.medals as medal, index (index)}
												<span class="inline-flex items-center gap-1">
													<MedalDisc place={medal.place} class="size-[18px] text-[10px]" />
													{medal.event}
												</span>
											{/each}
										</span>
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if related.countries.length}
			<div class="flex flex-col gap-2">
				{@render heading('Countries')}
				<ul class="flex flex-wrap gap-1.5">
					{#each related.countries as country (country.code)}
						<li>
							<a
								href={countryUrl(country.code)}
								class="inline-flex h-8 items-center gap-2 rounded-full border border-line-2 bg-surface px-3 text-[13.5px] font-semibold hover:border-ink"
							>
								<Flag code={country.code} class="h-3 w-4" />{country.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</nav>
{/if}
