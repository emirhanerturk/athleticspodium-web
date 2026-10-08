export interface Credit {
	name: string;
	role: string;
}

export interface Contributor extends Credit {
	countryCode: string;
}

export const TEAM: Credit[] = [
	{ name: 'Şevket F. Erbay', role: 'Founder and editor-in-chief' },
	{ name: 'Emirhan Ertürk', role: 'Developer & Technical manager' },
	{ name: 'Yavuz Yavuz', role: 'Contributing editor' },
	{ name: 'Alp Ulagay', role: 'Contributing editor & UK Correspondent' },
	{ name: 'Evren Özüyener', role: 'Contributing editor' },
	{ name: 'Engin Eryiğit', role: 'Contributing editor' },
	{ name: 'Hilal Doğan', role: 'Data verification' },
	{ name: 'Michel Naze', role: 'Data verification' },
	{ name: 'Can Korkmazoğlu', role: 'Advisor' }
];

export const CONTRIBUTORS: Contributor[] = [
	{ name: 'Andreas Janssen', countryCode: 'GER', role: 'Corrections' },
	{ name: 'Anjana Kalaurachchi', countryCode: 'SRI', role: 'Sri Lankan relay teams & information' },
	{ name: 'Alexander Vangelov', countryCode: 'BUL', role: 'Bulgarian relay teams & information' },
	{ name: 'Bob Ramsak', countryCode: 'SLO', role: 'Photographs' },
	{ name: 'Christel Saneh', countryCode: 'LBN', role: 'Team information, Arabic transcription' },
	{ name: 'Diano Masarani', countryCode: 'BRA', role: 'Medal information' },
	{
		name: 'Rodrigo Dario Diniz',
		countryCode: 'BRA',
		role: 'Brazilian & South American information'
	},
	{ name: 'David Ruiz Fernandez', countryCode: 'ESP', role: 'Athlete information' },
	{ name: 'Earle Laing', countryCode: 'JAM', role: 'Name and medal correction' },
	{ name: 'Emmanuel Glangetas', countryCode: 'FRA', role: 'Athletes information, Missing medals' },
	{ name: 'Gerry Borman', countryCode: 'USA', role: 'Biographical information' },
	{ name: 'Gökhan Taner', countryCode: 'TUR', role: 'Photographs' },
	{ name: 'Harry Prevor', countryCode: 'USA', role: 'Missing Pacific results' },
	{ name: 'Ibrahim Nkofue', countryCode: 'CMR', role: 'Cameroonian relay teams' },
	{ name: 'Janusz Rozum', countryCode: 'POL', role: 'Polish athletes information' },
	{ name: 'Jiri Ondracek', countryCode: 'CZE', role: 'Czech names' },
	{ name: 'Karolos Sargologos', countryCode: 'GRE', role: 'Greek relay teams' },
	{ name: 'Luc Beucher', countryCode: 'FRA', role: 'Francophonie Games relay teams' },
	{ name: 'Luis Vinker', countryCode: 'ARG', role: 'Argentinian relay teams' },
	{ name: 'Manuel Arons Carvalho', countryCode: 'POR', role: 'Relay teams' },
	{ name: 'Mustafa Yalçın', countryCode: 'TUR', role: 'Photographs' },
	{ name: 'Ram Murali Krishnan', countryCode: 'IND', role: 'Indian relay teams, names' },
	{ name: 'Riel Haumann', countryCode: 'RSA', role: 'Relay teams' },
	{ name: 'Sergio Molina', countryCode: 'CRC', role: 'Correction on Central American Games' },
	{ name: 'Tilda Acar', countryCode: 'TUR', role: 'Athletes information' },
	{ name: 'Yoshimasa Noguchi', countryCode: 'JPN', role: 'Japanese relay teams' },
	{ name: 'Winfried Kramer', countryCode: 'GER', role: 'German relay teams' },
	{ name: 'Zekican Şamlı', countryCode: 'TUR', role: 'Athletes information' }
];

export const ONLINE_SINCE = '2020-05-10';

export function initialsOf(name: string): string {
	const words = name.split(' ');
	return `${words[0].charAt(0)}${words.at(-1)!.charAt(0)}`;
}

export function countryCount(contributors: Contributor[]): number {
	return new Set(contributors.map((contributor) => contributor.countryCode)).size;
}
