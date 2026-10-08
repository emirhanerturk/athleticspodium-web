const BASE_LETTERS: Record<string, string> = { ı: 'i', ø: 'o', ł: 'l', đ: 'd' };
const WORD = /[\p{L}\p{N}]+/gu;

export function foldText(text: string): string {
	return text
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[ıøłđ]/g, (letter) => BASE_LETTERS[letter]);
}

export function searchWords(text: string): string[] {
	return foldText(text).match(WORD) ?? [];
}

export function startsWords(tokens: string[], words: string[]): boolean {
	return tokens.every((token) => words.some((word) => word.startsWith(token)));
}
