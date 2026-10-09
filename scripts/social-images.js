import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MEDIA_URL = process.env.PUBLIC_MEDIA_URL ?? 'https://api.athleticspodium.com/media';
const OUT_DIR = resolve(ROOT, 'static/og');
const SIZE = { width: 1200, height: 630 };

const FONTS = [
	{ family: 'Saira Condensed', pkg: 'saira-condensed', weights: [700, 800] },
	{ family: 'Barlow Semi Condensed', pkg: 'barlow-semi-condensed', weights: [600, 700] },
	{ family: 'IBM Plex Sans', pkg: 'ibm-plex-sans', weights: [400] }
];

const MOSAIC_FLAGS = [
	...['jam', 'ken', 'usa', 'eth', 'swe', 'jpn', 'gbr', 'bra', 'nor', 'ita', 'ukr', 'cub'],
	...['pol', 'ned', 'esp', 'chn', 'aus', 'rsa', 'can', 'mar', 'ger', 'bah', 'nzl', 'fra'],
	...['grn', 'qat', 'uga', 'tur', 'kor', 'mex', 'por', 'bel']
];
const TALLY_FLAGS = ['usa', 'ken', 'jam', 'eth', 'gbr', 'ger'];

const MEDAL_FILLS = { 1: 'gold', 2: 'silver', 3: 'bronze' };

const IMAGES = [
	{
		name: 'default',
		kicker: 'International athletics since 1873',
		title: 'Every medal,<br>every podium',
		text: 'Championships, athletes, countries and results from more than 150 years of international athletics.',
		motif: brandMark
	},
	{
		name: 'championships',
		kicker: 'Olympics · Worlds · Area champs',
		title: 'Championships',
		text: 'Every edition with its medallists, results and medal tables.',
		motif: podium
	},
	{
		name: 'athletes',
		kicker: 'Medallists from A to Z',
		title: 'Athletes',
		text: 'Profiles of international medallists with their medals, results and national titles.',
		motif: resultRows
	},
	{
		name: 'countries',
		kicker: 'Medal records by nation',
		title: 'Countries',
		text: 'The medal record of every nation, from Olympic champions to national titles.',
		motif: flagMosaic
	},
	{
		name: 'calendar',
		kicker: 'Season calendar',
		title: 'Calendar',
		text: 'The championships of every season with their dates, venues and results.',
		motif: calendarCard
	},
	{
		name: 'tools',
		kicker: 'Search · Count · Compare',
		title: 'Medal tools',
		text: 'Search every medal, count them by country and championship, and compare championships.',
		motif: medalTallies
	},
	{
		name: 'articles',
		kicker: 'Stories, numbers and guides',
		title: 'Articles',
		text: 'Stories and numbers from championships and the athletes who made them.',
		motif: storyCards
	}
];

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
	position: relative;
	width: ${SIZE.width}px;
	height: ${SIZE.height}px;
	overflow: hidden;
	background: var(--color-night);
	color: var(--color-night-ink);
	font-family: 'IBM Plex Sans', sans-serif;
	-webkit-font-smoothing: antialiased;
}
.copy {
	position: absolute;
	top: 60px;
	bottom: 76px;
	left: 72px;
	width: 640px;
	display: flex;
	flex-direction: column;
}
.logo { height: 60px; align-self: flex-start; }
.kicker {
	margin-top: auto;
	font: 700 20px/1 'Barlow Semi Condensed';
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--color-brand);
}
h1 {
	margin-top: 16px;
	font: 800 116px/0.86 'Saira Condensed';
}
p {
	margin-top: 22px;
	max-width: 560px;
	font-size: 25px;
	line-height: 1.4;
	color: var(--color-night-ink-2);
}
.stripe {
	position: absolute;
	inset: auto 0 0 0;
	height: 14px;
	background: var(--color-brand);
}
.motif { position: absolute; inset: 0; }
.disc {
	display: grid;
	place-items: center;
	border-radius: 50%;
	font: 700 22px/1 'Barlow Semi Condensed';
	color: var(--color-ink);
}
.gold { background: var(--color-gold); }
.silver { background: var(--color-silver); }
.bronze { background: var(--color-bronze); }
.flag { object-fit: cover; }
`;

async function loadAssets() {
	const css = await readFile(resolve(ROOT, 'src/styles/app.css'), 'utf8');
	const fontFaces = await Promise.all(
		FONTS.flatMap(({ family, pkg, weights }) =>
			weights.map(async (weight) => {
				const file = `node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`;
				return `@font-face { font-family: '${family}'; font-weight: ${weight}; src: url(${await dataUri(file, 'font/woff2')}); }`;
			})
		)
	);
	const flagCodes = [...new Set([...MOSAIC_FLAGS, ...TALLY_FLAGS])];
	const flags = await Promise.all(
		flagCodes.map(async (code) => [
			code,
			await downloadedDataUri(`${MEDIA_URL}/flags/${code}.svg`, 'image/svg+xml')
		])
	);
	return {
		colors: css.match(/--color-[\w-]+:\s*#[0-9a-f]+;/gi).join('\n'),
		fontFaces: fontFaces.join('\n'),
		logo: await dataUri('src/lib/assets/logo-reversed.svg', 'image/svg+xml'),
		mark: await dataUri('src/lib/assets/mark.svg', 'image/svg+xml'),
		flags: Object.fromEntries(flags)
	};
}

async function dataUri(path, type) {
	const file = await readFile(resolve(ROOT, path));
	return `data:${type};base64,${file.toString('base64')}`;
}

async function downloadedDataUri(url, type) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url} answered ${response.status}`);
	return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString('base64')}`;
}

function documentFor({ kicker, title, text, motif }, assets) {
	return `<!doctype html>
<html>
<head>
<style>
${assets.fontFaces}
:root { ${assets.colors} }
${STYLES}
</style>
</head>
<body>
<div class="motif">${motif(assets)}</div>
<main class="copy">
	<img class="logo" src="${assets.logo}" alt="">
	<span class="kicker">${kicker}</span>
	<h1>${title}</h1>
	<p>${text}</p>
</main>
<div class="stripe"></div>
</body>
</html>`;
}

function flag(assets, code, width, height, radius) {
	return `<img class="flag" src="${assets.flags[code]}" alt="" style="width: ${width}px; height: ${height}px; border-radius: ${radius}px;">`;
}

function brandMark(assets) {
	return `<img src="${assets.mark}" alt="" style="position: absolute; right: -150px; bottom: -40px; height: 500px;">`;
}

function podium() {
	const steps = [
		{ place: 2, height: 230 },
		{ place: 1, height: 320 },
		{ place: 3, height: 170 }
	];
	const blocks = steps.map(
		({ place, height }) =>
			`<div class="${MEDAL_FILLS[place]}" style="width: 112px; height: ${height}px; border-radius: 16px 16px 0 0; padding-top: 16px; text-align: center; font: 800 84px/1 'Saira Condensed'; color: var(--color-ink);">${place}</div>`
	);
	return `<div style="position: absolute; right: 72px; bottom: 14px; display: flex; align-items: flex-end; gap: 10px;">${blocks.join('')}</div>`;
}

function resultRows() {
	const rows = [
		{ place: 1, name: 220, mark: 76 },
		{ place: 2, name: 180, mark: 88 },
		{ place: 3, name: 240, mark: 70 }
	];
	const lines = rows.map(
		({
			place,
			name,
			mark
		}) => `<div style="display: flex; align-items: center; gap: 26px; height: 120px; border-bottom: 1px solid var(--color-night-line-2);">
			<span class="disc ${MEDAL_FILLS[place]}" style="width: 72px; height: 72px; font-size: 34px;">${place}</span>
			<span style="width: ${name}px; height: 22px; border-radius: 11px; background: var(--color-night-ink-4);"></span>
			<span style="margin-left: auto; width: ${mark}px; height: 22px; border-radius: 11px; background: var(--color-night-line-2);"></span>
		</div>`
	);
	return `<div style="position: absolute; top: 130px; right: 72px; width: 440px;">${lines.join('')}</div>`;
}

function flagMosaic(assets) {
	const flags = MOSAIC_FLAGS.map((code) => flag(assets, code, 150, 100, 12));
	return `<div style="position: absolute; top: 0; bottom: 0; left: 600px; right: 0; mask-image: linear-gradient(to right, transparent 0, #000 220px);">
		<div style="position: absolute; top: -170px; left: 20px; display: grid; grid-template-columns: repeat(4, 150px); gap: 16px; transform: rotate(-10deg);">${flags.join('')}</div>
	</div>`;
}

function calendarCard() {
	const firstWeekday = 5;
	const championshipDays = new Set([10, 11, 12, 13, 14, 15, 16]);
	const meetingDays = new Set([1, 2, 22, 29, 30]);
	const blanks = Array.from({ length: firstWeekday }, () => '<span></span>');
	const days = Array.from({ length: 31 }, (_, index) => {
		const day = index + 1;
		const fill = championshipDays.has(day)
			? 'background: var(--color-brand); color: var(--color-ink);'
			: meetingDays.has(day)
				? 'box-shadow: inset 0 0 0 2px var(--color-brand); color: var(--color-night-ink);'
				: 'background: var(--color-night-line); color: var(--color-night-ink-4);';
		return `<span style="display: grid; place-items: center; height: 42px; border-radius: 10px; font: 600 17px/1 'Barlow Semi Condensed'; ${fill}">${day}</span>`;
	});
	return `<div style="position: absolute; top: 62px; right: 80px; width: 400px; padding: 26px; border-radius: 24px; background: var(--color-night-surface); transform: rotate(4deg);">
		<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 18px;">
			<strong style="font: 800 58px/0.9 'Saira Condensed';">August</strong>
			<span style="font: 700 16px/1 'Barlow Semi Condensed'; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-night-ink-3);">Season</span>
		</div>
		<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 7px;">${[...blanks, ...days].join('')}</div>
	</div>`;
}

function medalTallies(assets) {
	const tallies = [
		[150, 104, 86],
		[96, 80, 58],
		[78, 70, 52],
		[64, 52, 60],
		[44, 56, 62],
		[40, 46, 50]
	];
	const rows = tallies.map(
		([gold, silver, bronze], index) => `<div style="display: flex; align-items: center; gap: 18px;">
			${flag(assets, TALLY_FLAGS[index], 60, 40, 7)}
			<div style="display: flex; gap: 4px;">
				<span class="gold" style="width: ${gold}px; height: 30px; border-radius: 6px 0 0 6px;"></span>
				<span class="silver" style="width: ${silver}px; height: 30px;"></span>
				<span class="bronze" style="width: ${bronze}px; height: 30px; border-radius: 0 6px 6px 0;"></span>
			</div>
		</div>`
	);
	return `<div style="position: absolute; top: 74px; right: 72px; display: flex; flex-direction: column; gap: 22px; mask-image: linear-gradient(to bottom, #000 72%, transparent);">${rows.join('')}</div>`;
}

function storyCards() {
	const bar = (width, height, color) =>
		`<span style="display: block; width: ${width}px; height: ${height}px; border-radius: ${height / 2}px; background: var(--color-${color});"></span>`;
	return `<div style="position: absolute; top: 96px; right: 40px; width: 380px; height: 470px; border-radius: 24px; background: var(--color-night-line); transform: rotate(7deg);"></div>
	<div style="position: absolute; top: 70px; right: 96px; width: 380px; padding: 26px; border-radius: 24px; background: var(--color-night-surface); transform: rotate(-3deg); display: flex; flex-direction: column; gap: 14px;">
		<div style="height: 170px; margin-bottom: 8px; border-radius: 14px; background: linear-gradient(135deg, var(--color-brand), var(--color-bronze));"></div>
		<span style="align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: var(--color-brand); color: var(--color-ink); font: 700 14px/1 'Barlow Semi Condensed'; letter-spacing: 0.1em; text-transform: uppercase;">Story</span>
		${bar(310, 26, 'night-ink')}
		${bar(230, 26, 'night-ink')}
		<div style="height: 6px;"></div>
		${bar(320, 12, 'night-ink-4')}
		${bar(290, 12, 'night-ink-4')}
		${bar(250, 12, 'night-ink-4')}
	</div>`;
}

const assets = await loadAssets();
await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: SIZE });
for (const image of IMAGES) {
	await page.setContent(documentFor(image, assets), { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: resolve(OUT_DIR, `${image.name}.png`) });
	console.log(`static/og/${image.name}.png`);
}
await browser.close();
