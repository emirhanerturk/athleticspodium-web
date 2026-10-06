import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const FIXTURES = new URL('./fixtures/backend', import.meta.url);
const PORT = Number(process.env.STUB_BACKEND_PORT ?? 4499);

createServer(async (request, response) => {
	const { pathname } = new URL(request.url ?? '/', 'http://localhost');

	try {
		const body = await readFile(new URL(`.${pathname}.json`, `${FIXTURES}/`));
		response.writeHead(200, { 'content-type': 'application/json' }).end(body);
	} catch {
		response
			.writeHead(404, { 'content-type': 'application/json' })
			.end(JSON.stringify({ success: false, error: { code: 4040, message: 'No fixture' } }));
	}
}).listen(PORT);
