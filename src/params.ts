import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	integer: (param) => (/^[1-9]\d*$/.test(param) ? Number(param) : undefined)
});
