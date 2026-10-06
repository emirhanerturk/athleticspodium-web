<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	let { measurementId }: { measurementId: string } = $props();

	function loadGtag() {
		if (window.gtag) return;

		window.dataLayer = window.dataLayer ?? [];
		window.gtag = function gtag() {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());
		window.gtag('config', measurementId, { send_page_view: false });

		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
		document.head.append(script);
	}

	afterNavigate(() => {
		loadGtag();
		window.gtag?.('event', 'page_view', {
			page_location: location.href,
			page_title: document.title
		});
	});
</script>
