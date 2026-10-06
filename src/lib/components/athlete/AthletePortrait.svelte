<script lang="ts">
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { Image } from '#lib/domain/image.js';

	let {
		image,
		firstName,
		lastName,
		class: className = 'size-11 text-sm'
	}: { image: Image | null; firstName: string; lastName: string; class?: string } = $props();
</script>

{#if image}
	<MediaImage
		{image}
		alt=""
		width={88}
		height={88}
		class="{className} shrink-0 rounded-full object-cover object-top"
	/>
{:else}
	<span
		class="{className} grid shrink-0 place-items-center rounded-full bg-surface-2 font-bold text-ink-2"
		aria-hidden="true"
	>
		{firstName.charAt(0)}{lastName.charAt(0)}
	</span>
{/if}
