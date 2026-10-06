export function createTtlCache<T>(ttlMs: number, now: () => number = Date.now) {
	let entry: { value: Promise<T>; expiresAt: number } | undefined;

	return function get(load: () => Promise<T>): Promise<T> {
		if (entry && entry.expiresAt > now()) return entry.value;

		const value = load();
		entry = { value, expiresAt: now() + ttlMs };
		value.catch(() => {
			if (entry?.value === value) entry = undefined;
		});

		return value;
	};
}
