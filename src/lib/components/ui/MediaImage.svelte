<script lang="ts">
	import { PUBLIC_MEDIA_URL } from '$app/env/public';
	import type { Image } from '#lib/domain/image.js';

	let {
		image,
		alt,
		width,
		height,
		eager = false,
		class: className = ''
	}: {
		image: Image;
		alt: string;
		width: number;
		height: number;
		eager?: boolean;
		class?: string;
	} = $props();
</script>

<img
	src="{PUBLIC_MEDIA_URL}/{image.path}"
	{alt}
	{width}
	{height}
	loading={eager ? 'eager' : 'lazy'}
	fetchpriority={eager ? 'high' : 'auto'}
	class={className}
/>
