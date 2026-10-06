<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import type { ArticleDetail } from '#lib/domain/article.js';
	import { fullName } from '#lib/domain/athlete.js';
	import { athleteUrl, champUrl, countryUrl, meetingUrl } from '#lib/routing/urls.js';

	let { related }: { related: ArticleDetail['related'] } = $props();

	const groups = $derived(
		[
			{
				title: 'Championships',
				links: [
					...related.meetings.map((meeting) => ({
						key: meeting.slug,
						label: meeting.name,
						href: meetingUrl(meeting.champSlug, meeting.slug),
						flag: null
					})),
					...related.champs.map((champ) => ({
						key: champ.slug,
						label: champ.name,
						href: champUrl(champ.slug),
						flag: null
					}))
				]
			},
			{
				title: 'Athletes',
				links: related.athletes.map((athlete) => ({
					key: String(athlete.id),
					label: fullName(athlete),
					href: athleteUrl(athlete),
					flag: athlete.countryCode
				}))
			},
			{
				title: 'Countries',
				links: related.countries.map((country) => ({
					key: country.code,
					label: country.name,
					href: countryUrl(country.code),
					flag: country.code
				}))
			}
		].filter((group) => group.links.length)
	);
</script>

{#if groups.length}
	<nav
		aria-labelledby="related"
		class="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5"
	>
		<h2 id="related" class="text-[15px] font-bold">In this story</h2>
		{#each groups as group (group.title)}
			<div class="flex flex-col gap-2">
				<span class="font-data text-xs tracking-[0.12em] text-ink-3 uppercase">{group.title}</span>
				<ul class="flex flex-wrap gap-1.5">
					{#each group.links as link (link.key)}
						<li>
							<a
								href={link.href}
								class="inline-flex h-8 items-center gap-2 rounded-full border border-line-2 bg-surface px-3 text-[13.5px] font-semibold hover:border-ink"
							>
								{#if link.flag}<Flag code={link.flag} class="h-3 w-4" />{/if}{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
{/if}
