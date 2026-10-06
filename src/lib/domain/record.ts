export type RecordTier = 'world' | 'major' | 'other';

const MAJOR_RECORDS = new Set(['OR', 'GR', 'CR', 'AR', 'ER', 'AsR', 'AfR', 'OcR', 'NACAR', 'SAR']);

export function recordTier(record: string): RecordTier {
	const base = record.replace(/[=*]+$/, '');
	if (base === 'WR') return 'world';
	return MAJOR_RECORDS.has(base) ? 'major' : 'other';
}
