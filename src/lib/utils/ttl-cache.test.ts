import { describe, expect, it, vi } from 'vitest';
import { createTtlCache } from './ttl-cache.js';

describe('createTtlCache', () => {
	it('reuses the value until it expires', async () => {
		let time = 0;
		const cache = createTtlCache<number>(1000, () => time);
		const load = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2);

		expect(await cache(load)).toBe(1);
		time = 999;
		expect(await cache(load)).toBe(1);
		time = 1000;
		expect(await cache(load)).toBe(2);
		expect(load).toHaveBeenCalledTimes(2);
	});

	it('shares one pending load between concurrent callers', async () => {
		const cache = createTtlCache<number>(1000, () => 0);
		const load = vi.fn().mockResolvedValue(1);

		await Promise.all([cache(load), cache(load)]);

		expect(load).toHaveBeenCalledTimes(1);
	});

	it('forgets a failed load so the next call retries', async () => {
		const cache = createTtlCache<number>(1000, () => 0);
		const load = vi.fn().mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce(1);

		await expect(cache(load)).rejects.toThrow('down');
		expect(await cache(load)).toBe(1);
	});
});
