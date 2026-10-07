import { foldText } from '#lib/utils/fold-text.js';

export const MISSING_SECTIONS = ['medallists', 'marks', 'names', 'relays'] as const;
export type MissingSection = (typeof MISSING_SECTIONS)[number];

export type MissingMedal = 'G' | 'S' | 'B';

export interface Gap {
	year: number;
	text: string;
	medals: MissingMedal[];
}

export interface GapGroup {
	name: string | null;
	gaps: Gap[];
}

export function parseMissingSection(value: string | null): MissingSection {
	return MISSING_SECTIONS.find((section) => section === value) ?? MISSING_SECTIONS[0];
}

export function gapCount(groups: GapGroup[]): number {
	return groups.reduce((sum, group) => sum + group.gaps.length, 0);
}

export function filterGaps(groups: GapGroup[], query: string): GapGroup[] {
	const needle = foldText(query.trim());
	if (!needle) return groups;

	return groups
		.map((group) => ({
			...group,
			gaps: group.gaps.filter((gap) =>
				foldText(`${gap.year} ${gap.text} ${group.name ?? ''}`).includes(needle)
			)
		}))
		.filter((group) => group.gaps.length);
}

export function describeGap(gap: Gap, group: string | null): string {
	const medals = gap.medals.length ? ` - ${gap.medals.join(' / ')}` : '';
	return `${group ? `${group} · ` : ''}${gap.year} ${gap.text}${medals}`;
}
