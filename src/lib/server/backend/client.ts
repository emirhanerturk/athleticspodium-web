const TIMEOUT_MS = 8000;
const NOT_FOUND_CODE = 4040;

export class BackendNotFoundError extends Error {}
export class BackendUnavailableError extends Error {}

type Query = Record<string, string | number | undefined>;

interface Envelope<T> {
	success: boolean;
	data?: T;
	error?: ErrorDetail | ErrorDetail[];
}

interface ErrorDetail {
	code?: number;
	message?: string;
}

export interface BackendClient {
	get<T>(path: string, query?: Query): Promise<T>;
	post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T>;
}

export function createClient(fetch: typeof globalThis.fetch, baseUrl: string): BackendClient {
	return {
		async get<T>(path: string, query: Query = {}) {
			const url = buildUrl(baseUrl, path, query);
			const response = await send(fetch, url);
			const envelope = await readEnvelope<T>(response, url);

			if (response.status === 404 || errorCodeOf(envelope) === NOT_FOUND_CODE) {
				throw new BackendNotFoundError(url.pathname);
			}
			if (!response.ok || !envelope.success) {
				throw new BackendUnavailableError(`${url.pathname}: HTTP ${response.status}`);
			}

			return envelope.data as T;
		},

		async post<T>(path: string, body: unknown, headers: Record<string, string> = {}) {
			const url = buildUrl(baseUrl, path, {});
			const response = await send(fetch, url, {
				method: 'POST',
				headers: { 'content-type': 'application/json', ...headers },
				body: JSON.stringify(body)
			});
			const envelope = await readEnvelope<T>(response, url);
			if (!response.ok || !envelope.success) {
				throw new BackendUnavailableError(`${url.pathname}: HTTP ${response.status}`);
			}
			return envelope.data as T;
		}
	};
}

function buildUrl(baseUrl: string, path: string, query: Query): URL {
	const url = new URL(baseUrl + path);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	return url;
}

async function send(
	fetch: typeof globalThis.fetch,
	url: URL,
	init: RequestInit = {}
): Promise<Response> {
	try {
		return await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
	} catch (error) {
		throw new BackendUnavailableError(`${url.pathname}: ${(error as Error).message}`);
	}
}

async function readEnvelope<T>(response: Response, url: URL): Promise<Envelope<T>> {
	try {
		return await response.json();
	} catch {
		throw new BackendUnavailableError(`${url.pathname}: HTTP ${response.status}, body is not JSON`);
	}
}

function errorCodeOf(envelope: Envelope<unknown>): number | undefined {
	const error = Array.isArray(envelope.error) ? envelope.error[0] : envelope.error;
	return error?.code;
}
