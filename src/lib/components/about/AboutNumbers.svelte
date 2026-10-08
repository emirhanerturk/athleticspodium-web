<script lang="ts">
	let { figures }: { figures: { value: string; label: string }[] } = $props();
</script>

<section class="bg-ink text-night-ink">
	<dl
		class="page-container grid grid-cols-2 gap-x-3.5 gap-y-[18px] py-6 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-5 sm:py-[30px]"
	>
		{#each figures as figure (figure.label)}
			<div
				class="flex flex-col-reverse gap-1 border-l-[3px] border-brand pl-3.5 max-sm:last:odd:col-span-2"
			>
				<dt class="text-sm text-night-ink-3">{figure.label}</dt>
				<dd
					class="font-display text-[40px] leading-none font-bold text-brand tabular sm:text-[54px]"
				>
					{figure.value}
				</dd>
			</div>
		{/each}
	</dl>
</section>
