export function formatWind(wind: number): string {
	const sign = wind > 0 ? '+' : '';
	return `${sign}${wind.toFixed(1)}`;
}
