export function parsePageParam(value: string | null): number | null {
	if (value === null) return 1;
	if (!/^[1-9]\d{0,5}$/.test(value)) return null;
	return Number(value);
}
