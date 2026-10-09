<script lang="ts">
	import { PUBLIC_MEDIA_URL } from '$app/env/public';
	import { flagPath } from '#lib/routing/urls.js';

	let { code, class: className = 'h-[15px] w-5' }: { code: string; class?: string } = $props();
</script>

<img
	src="{PUBLIC_MEDIA_URL}/{flagPath(code)}"
	alt=""
	width="20"
	height="15"
	loading="lazy"
	class="{className} shrink-0 rounded-[2px] object-cover"
/>
