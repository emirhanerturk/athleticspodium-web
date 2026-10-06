import { fail, type RequestEvent } from '@sveltejs/kit';
import { parseContactForm } from '#lib/domain/contact.js';

export function contactAction(fixedSubject?: number) {
	return async ({ request, locals: { backend } }: RequestEvent) => {
		const { values, errors, spam } = parseContactForm(await request.formData(), fixedSubject);
		if (Object.keys(errors).length) return fail(400, { values, errors, failed: false });
		if (spam) return { sent: true };

		try {
			await backend.contacts.send(values, {
				ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null,
				userAgent: request.headers.get('user-agent')
			});
		} catch (error) {
			console.error('Contact message not sent', error);
			return fail(503, { values, errors: {}, failed: true });
		}
		return { sent: true };
	};
}
