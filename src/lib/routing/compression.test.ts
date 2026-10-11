import { describe, expect, it } from 'vitest';
import { shouldGzip } from './compression.js';

const requestAccepting = (acceptEncoding?: string) =>
	new Request('https://athleticspodium.com/athlete/8973/kirani-james', {
		headers: acceptEncoding === undefined ? {} : { 'accept-encoding': acceptEncoding }
	});

const html = () => new Response('<!doctype html>', { headers: { 'content-type': 'text/html' } });

describe('shouldGzip', () => {
	it('gzips pages for clients that accept gzip', () => {
		expect(shouldGzip(requestAccepting('gzip, deflate, br, zstd'), html())).toBe(true);
		expect(shouldGzip(requestAccepting('GZIP'), html())).toBe(true);
		expect(shouldGzip(requestAccepting('br;q=1.0, *;q=0.5'), html())).toBe(true);
	});

	it('sends pages as they are to clients that do not accept gzip', () => {
		expect(shouldGzip(requestAccepting(), html())).toBe(false);
		expect(shouldGzip(requestAccepting('identity'), html())).toBe(false);
		expect(shouldGzip(requestAccepting('br'), html())).toBe(false);
		expect(shouldGzip(requestAccepting('gzip;q=0, br'), html())).toBe(false);
		expect(shouldGzip(requestAccepting('*;q=0'), html())).toBe(false);
	});

	it('gzips data, sitemaps and robots.txt', () => {
		const typed = (type: string) => new Response('{}', { headers: { 'content-type': type } });

		expect(shouldGzip(requestAccepting('gzip'), typed('application/json'))).toBe(true);
		expect(shouldGzip(requestAccepting('gzip'), typed('application/xml'))).toBe(true);
		expect(shouldGzip(requestAccepting('gzip'), typed('text/plain; charset=utf-8'))).toBe(true);
	});

	it('leaves bodiless, already encoded and binary responses alone', () => {
		const redirect = new Response(null, { status: 301, headers: { location: '/' } });
		const encoded = new Response('x', {
			headers: { 'content-type': 'text/html', 'content-encoding': 'br' }
		});
		const image = new Response('x', { headers: { 'content-type': 'image/png' } });

		expect(shouldGzip(requestAccepting('gzip'), redirect)).toBe(false);
		expect(shouldGzip(requestAccepting('gzip'), encoded)).toBe(false);
		expect(shouldGzip(requestAccepting('gzip'), image)).toBe(false);
	});
});
