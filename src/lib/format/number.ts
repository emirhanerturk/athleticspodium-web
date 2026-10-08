const counter = new Intl.NumberFormat('en-GB');

export function formatCount(value: number): string {
	return counter.format(value);
}

export function formatOrdinal(value: number): string {
	const tens = value % 100;
	const suffix =
		tens >= 11 && tens <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th');
	return `${value}${suffix}`;
}
