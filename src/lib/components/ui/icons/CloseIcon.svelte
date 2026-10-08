<script lang="ts">
	let { class: className = 'size-4' }: { class?: string } = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2.4"
	stroke-linecap="round"
	aria-hidden="true"
>
	<path d="M6 6l12 12M18 6L6 18"></path>
</svg>
