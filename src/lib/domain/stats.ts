import type { IsoDate } from './date.js';

export interface SiteStats {
	medals: number;
	placings: number;
	athletes: number;
	championships: number;
	countries: number;
	seasonMeetings: number;
	lastAddition: {
		name: string;
		slug: string;
		champSlug: string;
		addedOn: IsoDate;
	} | null;
}
