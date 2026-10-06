// Replaces the legacy Angular service worker so returning visitors stop getting the cached old app.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			await self.registration.unregister();
			await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
			const windows = await self.clients.matchAll({ type: 'window' });
			await Promise.all(windows.map((client) => client.navigate(client.url)));
		})()
	);
});
