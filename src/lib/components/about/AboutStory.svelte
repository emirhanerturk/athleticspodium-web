<script lang="ts">
	import OnThisPage from '#lib/components/ui/OnThisPage.svelte';

	const SECTIONS = [
		{ id: 'why', label: 'Why it exists' },
		{ id: 'included', label: 'What’s included' },
		{ id: 'aims', label: 'Six aims' },
		{ id: 'open-data', label: 'Open data' },
		{ id: 'team', label: 'Team & contributors' },
		{ id: 'help', label: 'Help us' }
	];

	const STORY = [
		{
			id: 'why',
			kicker: 'Why it exists',
			title: 'From a school notebook to an open archive',
			paragraphs: [
				'It started with results copied into a notebook during school years, next to pages copied from encyclopedias. A job in sports journalism made compiling easier, and the idea became simple: gather all medallists in athletics history in one place.',
				'Finding the correct medallists years after a championship is hard. Results change after doping cases and appeals, and old or false information stays online next to the right version — even on official sites. Athletics Podium was formed by one person to fix that, and belongs to every athletics enthusiast who helps.'
			]
		},
		{
			id: 'included',
			kicker: 'What’s included',
			title: 'Every level, every continent',
			paragraphs: [
				'All the top three medallists of the major championships, from Europe to Oceania — senior, U23, U20 and U18 — with results, technical data such as wind and course measurement, and notes where a medal has a story.',
				'Alongside the great names, the archive notices unsung heroes from every nation, and the stories hidden between the pages are told in the articles.'
			]
		}
	];

	const AIMS = [
		{ title: 'Verified information', text: 'The most important one of all.' },
		{
			title: 'Graphics that explain',
			text: 'Data that is easy to read, on the site and on social media.'
		},
		{ title: 'Free access', text: 'Easy and free access to data. For everybody.' },
		{
			title: 'History meets today',
			text: 'A strong connection between rich athletics history and the present.'
		},
		{
			title: 'Broad collaboration',
			text: 'Gathering information together with enthusiasts worldwide.'
		},
		{ title: 'Credit every contribution', text: 'Every name, result or photo sent is credited.' }
	];

	const KICKER = 'font-data text-[12.5px] font-bold tracking-[0.16em] text-brand-ink uppercase';
	const HEADING = 'font-display text-[30px] leading-[0.94] font-bold sm:text-[44px]';
</script>

<section id="story" class="page-container scroll-mt-6 pt-8 pb-9 sm:py-14">
	<div class="grid grid-cols-1 items-start gap-12 md:grid-cols-[280px_minmax(0,1fr)]">
		<OnThisPage sections={SECTIONS} class="hidden gap-0.5 md:sticky md:top-6 md:flex md:flex-col" />
		<div class="flex max-w-[760px] flex-col gap-10">
			{#each STORY as block (block.id)}
				<div id={block.id} class="flex scroll-mt-6 flex-col gap-3.5">
					<span class={KICKER}>{block.kicker}</span>
					<h2 class={HEADING}>{block.title}</h2>
					{#each block.paragraphs as paragraph (paragraph)}
						<p class="text-[17.5px] leading-[1.7] text-ink-2">{paragraph}</p>
					{/each}
				</div>
			{/each}

			<div id="aims" class="flex scroll-mt-6 flex-col gap-4">
				<h2 class={HEADING}>Six aims</h2>
				<ol class="grid grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] gap-3">
					{#each AIMS as aim, index (aim.title)}
						<li
							class="flex flex-col gap-2.5 rounded-2xl border p-[18px] {index === 0
								? 'border-brand bg-brand'
								: 'border-line bg-surface'}"
						>
							<span
								class="font-display text-[40px] leading-[0.9] font-bold {index === 0
									? 'text-ink'
									: 'text-brand-ink'}"
							>
								{String(index + 1).padStart(2, '0')}
							</span>
							<strong class="text-base leading-[1.35]">{aim.title}</strong>
							<span class="text-[13.5px] leading-[1.45] opacity-80">{aim.text}</span>
						</li>
					{/each}
				</ol>
			</div>

			<div
				id="open-data"
				class="grid scroll-mt-6 grid-cols-[56px_minmax(0,1fr)] items-center gap-3.5 rounded-[20px] bg-ink p-[18px] text-night-ink sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-[22px] sm:p-[26px]"
			>
				<span
					aria-hidden="true"
					class="grid size-14 -scale-x-100 place-items-center rounded-full border-4 border-brand font-display text-[34px] font-bold text-brand sm:size-24 sm:border-[6px] sm:text-[58px]"
				>
					C
				</span>
				<div class="flex flex-col gap-2">
					<h2 class="font-display text-[21px] leading-none font-bold sm:text-[36px]">
						All rights are not reserved.
					</h2>
					<p class="text-[15px] leading-[1.6] text-night-ink-3">
						Compiled results belong to everybody. Use the data freely — if you excerpt it, naming
						Athletics Podium as the source is all we ask.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
