import { describeEvent } from '#lib/domain/event.js';

export function formatEventList(names: string[], visible = 3): string {
	const isRelay = (name: string) => describeEvent(name).discipline === 'relays';
	const individual = names
		.filter((name) => !isRelay(name))
		.map((name) => describeEvent(name).longName);
	const items = names.some(isRelay) ? [...individual, 'relays'] : individual;
	const hidden = items.length - visible;

	return hidden > 0 ? `${items.slice(0, visible).join(', ')} +${hidden}` : items.join(', ');
}
