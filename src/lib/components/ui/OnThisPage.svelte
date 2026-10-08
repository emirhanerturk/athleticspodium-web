<script lang="ts">
	let {
		sections,
		numbered = false,
		class: className = ''
	}: { sections: { id: string; label: string }[]; numbered?: boolean; class?: string } = $props();

	let active = $state<string | null>(null);
	const current = $derived(active ?? sections[0]?.id);

	$effect(() => {
		const inView: Record<string, boolean> = {};
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) inView[entry.target.id] = entry.isIntersecting;
				active = sections.find((section) => inView[section.id])?.id ?? active;
			},
			{ rootMargin: '-40px 0px -70% 0px' }
		);
		for (const { id } of sections) {
			const section = document.getElementById(id);
			if (section) observer.observe(section);
		}
		return () => observer.disconnect();
	});
</script>

<nav aria-label="On this page" class={className}>
	{#each sections as section, index (section.id)}
		<a
			href="#{section.id}"
			aria-current={current === section.id ? 'location' : undefined}
			onclick={() => (active = section.id)}
			class="flex gap-2.5 border-l-[3px] px-3 py-2 text-[14.5px] hover:text-ink {current ===
			section.id
				? 'border-brand font-bold text-ink'
				: 'border-line font-medium text-ink-3'}"
		>
			{#if numbered}
				<span class="font-data font-medium text-ink-3">{String(index + 1).padStart(2, '0')}</span>
			{/if}
			{section.label}
		</a>
	{/each}
</nav>
