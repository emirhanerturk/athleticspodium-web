<script lang="ts">
	import BlueskyIcon from '#lib/components/ui/icons/BlueskyIcon.svelte';
	import FacebookIcon from '#lib/components/ui/icons/FacebookIcon.svelte';
	import InstagramIcon from '#lib/components/ui/icons/InstagramIcon.svelte';
	import { SOCIAL_LINKS } from '#lib/routing/urls.js';

	let { linkClass }: { linkClass: string } = $props();

	const links = [
		{ label: 'Bluesky', href: SOCIAL_LINKS.bluesky, Icon: BlueskyIcon },
		{ label: 'Facebook', href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
		{ label: 'Instagram', href: SOCIAL_LINKS.instagram, Icon: InstagramIcon }
	];
</script>

{#each links as { label, href, Icon } (label)}
	<a {href} aria-label={label} rel="noopener" class={linkClass}>
		<Icon class="size-[15px]" />
	</a>
{/each}
