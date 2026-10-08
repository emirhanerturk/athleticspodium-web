export function createKeyedTtlCache<T>(
	ttlMs: number,
	maxEntries: number,
	now: () => number = Date.now
) {
	const entries = new Map<string, { value: Promise<T>; expiresAt: number }>();

	return function get(key: string, load: () => Promise<T>): Promise<T> {
		const entry = entries.get(key);
		if (entry && entry.expiresAt > now()) return entry.value;

		entries.delete(key);
		if (entries.size >= maxEntries) entries.delete(entries.keys().next().value!);

		const value = load();
		entries.set(key, { value, expiresAt: now() + ttlMs });
		value.catch(() => {
			if (entries.get(key)?.value === value) entries.delete(key);
		});

		return value;
	};
}

export function createTtlCache<T>(ttlMs: number, now: () => number = Date.now) {
	const cache = createKeyedTtlCache<T>(ttlMs, 1, now);
	return (load: () => Promise<T>): Promise<T> => cache('', load);
}
