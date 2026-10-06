import { describe, expect, it, vi } from 'vitest';
import { BackendNotFoundError, BackendUnavailableError, createClient } from './client.js';

const BASE = 'https://api.example.test/1.0';

function respondWith(body: unknown, status = 200) {
	return vi
		.fn()
		.mockResolvedValue(
			new Response(typeof body === 'string' ? body : JSON.stringify(body), { status })
		);
}

describe('createClient', () => {
	it('returns the data of a successful envelope', async () => {
		const fetch = respondWith({ success: true, data: { medals: 3 } });

		expect(await createClient(fetch, BASE).get('/stats')).toEqual({ medals: 3 });
	});

	it('adds defined query values and skips undefined ones', async () => {
		const fetch = respondWith({ success: true, data: [] });

		await createClient(fetch, BASE).get('/athletes', { limit: 10, fields: undefined });

		expect(String(fetch.mock.calls[0][0])).toBe(`${BASE}/athletes?limit=10`);
	});

	it('reports a missing record for HTTP 404 and for error code 4040', async () => {
		const notFoundStatus = respondWith({ success: false, error: { code: 4040 } }, 404);
		const notFoundCode = respondWith({ success: false, error: { code: 4040 } });

		await expect(createClient(notFoundStatus, BASE).get('/x')).rejects.toBeInstanceOf(
			BackendNotFoundError
		);
		await expect(createClient(notFoundCode, BASE).get('/x')).rejects.toBeInstanceOf(
			BackendNotFoundError
		);
	});

	it('reports the backend as unavailable for other errors', async () => {
		const serverError = respondWith({ success: false, error: { code: 5001 } }, 500);
		const validation = respondWith({ success: false, error: [{ code: 4000 }] }, 400);
		const notJson = respondWith('<html>Bad gateway</html>', 502);
		const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));

		for (const fetch of [serverError, validation, notJson, offline]) {
			await expect(createClient(fetch, BASE).get('/x')).rejects.toBeInstanceOf(
				BackendUnavailableError
			);
		}
	});

	it('posts JSON with the given headers', async () => {
		const fetch = respondWith({ success: true, data: true });

		expect(
			await createClient(fetch, BASE).post(
				'/contacts',
				{ name: 'Ana' },
				{ 'x-forwarded-for': '1.2.3.4' }
			)
		).toBe(true);
		const [url, init] = fetch.mock.calls[0];
		expect(String(url)).toBe(`${BASE}/contacts`);
		expect(init).toMatchObject({
			method: 'POST',
			body: '{"name":"Ana"}',
			headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' }
		});
	});

	it('reports a failed post as unavailable', async () => {
		const fetch = respondWith({ success: false, error: { code: 5001 } }, 500);

		await expect(createClient(fetch, BASE).post('/contacts', {})).rejects.toBeInstanceOf(
			BackendUnavailableError
		);
	});
});
