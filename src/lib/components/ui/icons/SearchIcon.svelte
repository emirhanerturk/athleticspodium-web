<script lang="ts">
	let { class: className = 'size-5' }: { class?: string } = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	aria-hidden="true"
>
	<circle cx="11" cy="11" r="7"></circle>
	<path d="M20 20l-3.5-3.5"></path>
</svg>
