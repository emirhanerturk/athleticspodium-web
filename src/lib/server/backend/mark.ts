export type MarkDto = string | number | null;

export function parseMark(dto: MarkDto): string | null {
	return dto === null ? null : String(dto);
}
