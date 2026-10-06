<script lang="ts">
	import { fullName, type Relative } from '#lib/domain/athlete.js';
	import { athleteUrl } from '#lib/routing/urls.js';

	let { relatives }: { relatives: Relative[] } = $props();
</script>

<div>
	<h3 class="mb-3 text-[13px] font-bold tracking-[0.08em] text-ink-3 uppercase">Family</h3>
	<ul class="flex flex-col divide-y divide-line rounded-[14px] border border-line bg-surface">
		{#each relatives as relative (relative.id)}
			<li>
				<a
					href={athleteUrl(relative)}
					class="flex items-center justify-between gap-3 px-4 py-3 hover:text-brand-ink"
				>
					<strong class="font-semibold">{fullName(relative)}</strong>
					<span class="text-[13px] text-ink-3">{relative.relation}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
