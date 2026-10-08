<script lang="ts">
	import Flag from '#lib/components/ui/Flag.svelte';
	import { CONTRIBUTORS, countryCount, initialsOf, TEAM } from '#lib/domain/about.js';

	const CAREER = [
		{ when: '1999 →', what: 'Magazines, journals and TV stations' },
		{ when: '2002–14', what: 'Full-time commentator, Eurosport Turkey' },
		{ when: '2016–22', what: 'Press Chief, Turkish Athletics Federation' },
		{ when: '2023', what: 'Media Director, European Indoors Istanbul' },
		{ when: '2024', what: 'Covered the Paris Olympics in full' },
		{ when: '10 May 2020', what: 'Opened athleticspodium.com, during the pandemic quarantine' }
	];

	const LIST_HEAD = 'mb-2 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2.5';
	const LIST = 'grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-x-6';
</script>

<section id="team" class="scroll-mt-6 border-y border-line bg-surface">
	<div
		class="page-container grid grid-cols-1 items-start gap-12 pt-8 pb-9 sm:py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
	>
		<div class="flex flex-col gap-[18px]">
			<span class="font-data text-[12.5px] font-bold tracking-[0.16em] text-brand-ink uppercase">
				Editor
			</span>
			<img
				src="/about/sfe-profile-1.jpg"
				alt="Şevket Furkan Erbay"
				width="800"
				height="533"
				loading="lazy"
				class="aspect-[4/3] w-full rounded-[20px] object-cover object-[75%_30%]"
			/>
			<h2 class="font-display text-[32px] leading-[0.95] font-bold sm:text-[48px]">
				Şevket Furkan Erbay
			</h2>
			<p class="text-[15px] text-ink-2">
				Sports journalist, media researcher, athletics aficionado. Born 1981. Founder and
				editor-in-chief.
			</p>
			<dl>
				{#each CAREER as step (step.what)}
					<div
						class="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-line py-2.5 text-sm leading-[1.45]"
					>
						<dt class="font-data font-bold text-ink-3">{step.when}</dt>
						<dd>{step.what}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="flex flex-col gap-7">
			<div>
				<div class={LIST_HEAD}>
					<h2 class="font-display text-[32px] leading-none font-bold">The team</h2>
					<span class="font-data text-[13.5px] text-ink-3">{TEAM.length} people</span>
				</div>
				<ul class={LIST}>
					{#each TEAM as member, index (member.name)}
						<li class="flex items-center gap-3 border-b border-line py-2.5">
							<span
								aria-hidden="true"
								class="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold {index ===
								0
									? 'bg-brand text-ink'
									: 'bg-surface-2 text-ink-2'}"
							>
								{initialsOf(member.name)}
							</span>
							<span class="flex min-w-0 flex-col gap-px">
								<strong class="text-[15px] font-semibold">{member.name}</strong>
								<span class="text-[13px] text-ink-3">{member.role}</span>
							</span>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class={LIST_HEAD}>
					<h2 class="font-display text-[32px] leading-none font-bold">Contributors</h2>
					<span class="font-data text-[13.5px] text-ink-3">
						{CONTRIBUTORS.length} people · {countryCount(CONTRIBUTORS)} countries
					</span>
				</div>
				<p class="mt-1.5 mb-2.5 text-sm text-ink-2">Every correction is credited. Thank you.</p>
				<ul class={LIST}>
					{#each CONTRIBUTORS as contributor (contributor.name)}
						<li
							class="grid grid-cols-[22px_minmax(0,1fr)] items-start gap-2.5 border-b border-line py-[9px]"
						>
							<Flag code={contributor.countryCode} class="mt-0.5 h-[16.5px] w-[22px]" />
							<span class="flex flex-col gap-px">
								<strong class="text-sm font-semibold">
									{contributor.name}<span class="sr-only">, {contributor.countryCode}</span>
								</strong>
								<span class="text-[12.5px] leading-[1.35] text-ink-3">{contributor.role}</span>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>
