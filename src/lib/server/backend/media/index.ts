import type { Image } from '#lib/domain/image.js';

const TIMEOUT_MS = 2000;

export function createMedia(fetch: typeof globalThis.fetch, mediaUrl: string) {
	return {
		async exists(image: Image): Promise<boolean> {
			try {
				const response = await fetch(`${mediaUrl}/${image.path}`, {
					method: 'HEAD',
					signal: AbortSignal.timeout(TIMEOUT_MS)
				});
				return response.ok;
			} catch {
				return false;
			}
		}
	};
}
