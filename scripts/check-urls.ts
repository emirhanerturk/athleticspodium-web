// node scripts/check-urls.ts --base <origin> [--per-source N] [--concurrency N] <source>...
// A source is a sitemap (index or URL set) URL, or a text file with one URL or path per line.
// --per-source samples each sitemap file; text files are always checked in full.
import { readFile } from 'node:fs/promises';

interface Hop {
	status: number;
	location: string | null;
}

interface Check {
	url: string;
	hops: Hop[];
	ms: number;
	error?: string;
}

const MAX_HOPS = 5;

function option(name: string, fallback: string | null = null): string | null {
	const index = process.argv.indexOf(`--${name}`);
	return index === -1 ? fallback : process.argv[index + 1];
}

function sourcesOf(argv: string[]): string[] {
	const values = new Set(
		['--base', '--per-source', '--concurrency'].map((flag) => argv[argv.indexOf(flag) + 1])
	);
	return argv.slice(2).filter((arg) => !arg.startsWith('--') && !values.has(arg));
}

function sample<T>(items: T[], size: number | null): T[] {
	if (size === null || items.length <= size) return items;
	const pool = [...items];
	for (let index = pool.length - 1; index > 0; index--) {
		const other = Math.floor(Math.random() * (index + 1));
		[pool[index], pool[other]] = [pool[other], pool[index]];
	}
	return pool.slice(0, size);
}

const locsOf = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

async function urlSets(source: string): Promise<{ urls: string[]; sitemap: boolean }[]> {
	if (!/^https?:/.test(source)) {
		const lines = (await readFile(source, 'utf8')).split('\n').map((line) => line.trim());
		return [{ urls: lines.filter((line) => line && !line.startsWith('#')), sitemap: false }];
	}
	const xml = await (await fetch(source)).text();
	if (!xml.includes('<sitemapindex')) return [{ urls: locsOf(xml), sitemap: true }];
	return (await Promise.all(locsOf(xml).map(urlSets))).flat();
}

function rebase(url: string, base: string): string {
	const parsed = new URL(url, base);
	return new URL(parsed.pathname + parsed.search, base).href;
}

async function check(url: string): Promise<Check> {
	const started = performance.now();
	const hops: Hop[] = [];
	let current = url;
	try {
		while (hops.length < MAX_HOPS) {
			const response = await fetch(current, { redirect: 'manual' });
			await response.arrayBuffer();
			const location = response.headers.get('location');
			hops.push({ status: response.status, location });
			if (response.status < 300 || response.status >= 400 || !location) break;
			current = new URL(location, current).href;
		}
	} catch (error) {
		return { url, hops, ms: performance.now() - started, error: String(error) };
	}
	return { url, hops, ms: performance.now() - started };
}

async function pool<T, R>(items: T[], size: number, work: (item: T) => Promise<R>): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let next = 0;
	const worker = async () => {
		while (next < items.length) {
			const index = next++;
			results[index] = await work(items[index]);
		}
	};
	await Promise.all(Array.from({ length: size }, worker));
	return results;
}

const passed = ({ hops, error }: Check) => !error && hops.at(-1)?.status === 200;

function describe({ url, hops, ms, error }: Check): string {
	const path = new URL(url).pathname + new URL(url).search;
	const chain = hops.map((hop) => hop.status).join('→') || 'ERR';
	const target = hops.length > 1 ? ` → ${hops.at(-2)?.location}` : '';
	return `${chain.padEnd(11)} ${String(Math.round(ms)).padStart(5)}ms  ${path}${target}${error ? `  ${error}` : ''}`;
}

const base = option('base');
if (!base) throw new Error('Pass --base, for example --base https://next.athleticspodium.com');
const perSource = option('per-source');
const concurrency = Number(option('concurrency', '4'));

const sets = (await Promise.all(sourcesOf(process.argv).map(urlSets))).flat();
const urls = [
	...new Set(
		sets
			.flatMap((set) =>
				set.sitemap ? sample(set.urls, perSource ? Number(perSource) : null) : set.urls
			)
			.map((url) => rebase(url, base))
	)
];
const checks = await pool(urls, concurrency, check);

for (const result of checks) console.log(describe(result));
const failed = checks.filter((result) => !passed(result));
const redirected = checks.filter((result) => passed(result) && result.hops.length > 1);
const slowest = checks.toSorted((a, b) => b.ms - a.ms).slice(0, 5);

console.log(
	`\n${checks.length} checked · ${checks.length - failed.length} ok (${redirected.length} after a redirect) · ${failed.length} failed`
);
console.log(
	`median ${Math.round(checks.map((result) => result.ms).toSorted((a, b) => a - b)[Math.floor(checks.length / 2)] ?? 0)}ms`
);
console.log('\nslowest:');
for (const result of slowest) console.log(describe(result));
if (failed.length) {
	console.log('\nfailed:');
	for (const result of failed) console.log(describe(result));
	process.exitCode = 1;
}
