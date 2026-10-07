export type RecordTier = 'world' | 'major' | 'other';

const WORLD_RECORDS = new Set(['WR', 'WIR', 'WB']);
const MAJOR_RECORDS = new Set(['OR', 'GR', 'CR', 'AR', 'ER', 'AsR', 'AfR', 'OcR', 'NACAR', 'SAR']);

export function recordTier(record: string): RecordTier {
	const base = record.replace(/[=*]+$/, '');
	if (WORLD_RECORDS.has(base)) return 'world';
	return MAJOR_RECORDS.has(base) ? 'major' : 'other';
}
