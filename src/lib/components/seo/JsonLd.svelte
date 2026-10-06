<script lang="ts">
	import { jsonLdScriptTag } from '#lib/seo/json-ld.js';

	let { data }: { data: unknown } = $props();
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- jsonLdScriptTag escapes "<" in the data -->
	{@html jsonLdScriptTag(data)}
</svelte:head>
