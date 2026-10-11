const TEXT_CONTENT = /^(text\/|application\/(json|xml)\b)/i;

export function shouldGzip(request: Request, response: Response): boolean {
	return (
		response.body !== null &&
		!response.headers.has('content-encoding') &&
		TEXT_CONTENT.test(response.headers.get('content-type') ?? '') &&
		acceptsGzip(request.headers.get('accept-encoding') ?? '')
	);
}

function acceptsGzip(acceptEncoding: string): boolean {
	const qualities = new Map(
		acceptEncoding.split(',').map((entry) => {
			const [coding, ...params] = entry.split(';').map((part) => part.trim().toLowerCase());
			const quality = params.find((param) => param.startsWith('q='));
			return [coding, quality ? Number(quality.slice(2)) : 1] as const;
		})
	);
	return (qualities.get('gzip') ?? qualities.get('*') ?? 0) > 0;
}
