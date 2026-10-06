const counter = new Intl.NumberFormat('en-GB');

export function formatCount(value: number): string {
	return counter.format(value);
}
