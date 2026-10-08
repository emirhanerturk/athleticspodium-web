export function pageNumbers(page: number, pageCount: number): (number | null)[] {
	const shown = [...new Set([1, page - 1, page, page + 1, pageCount])]
		.filter((number) => number >= 1 && number <= pageCount)
		.sort((a, b) => a - b);

	return shown.flatMap((number, index) => {
		const step = number - (shown[index - 1] ?? number - 1);
		if (step === 2) return [number - 1, number];
		return step > 2 ? [null, number] : [number];
	});
}
