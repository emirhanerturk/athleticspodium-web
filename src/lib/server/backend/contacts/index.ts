import type { ContactMessage } from '#lib/domain/contact.js';
import type { BackendClient } from '../client.js';

export function createContacts(client: BackendClient) {
	return {
		async send(message: ContactMessage, sender: { ip: string | null; userAgent: string | null }) {
			const headers: Record<string, string> = {};
			if (sender.ip) headers['x-forwarded-for'] = sender.ip;
			if (sender.userAgent) headers['user-agent'] = sender.userAgent;
			await client.post('/contacts', { ...message, file: null }, headers);
		}
	};
}
