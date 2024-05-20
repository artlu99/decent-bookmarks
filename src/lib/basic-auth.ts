import { AllowlistSchema, Env } from '../types';
import { Validator } from '@cfworker/json-schema';
import { ALLOW_CORS_HEADERS, NOT_ALLOWED_RESPONSE } from './returns';

const realm = 'decent-bookmarks';

export const checkAuth = async (headers: Headers, env: Env) => {
	const validator = new Validator(AllowlistSchema);
	const allowlist_str = await env.FRAMECHAINKV.get('ALLOWLIST');
	if (allowlist_str) {
		const res = validator.validate(JSON.parse(allowlist_str));
		if (!res.valid) return new Response('Error', { ...NOT_ALLOWED_RESPONSE, ...ALLOW_CORS_HEADERS });
	}

	const allowlist_tokens: string[] = allowlist_str ? JSON.parse(allowlist_str) : [];

	// The "Authorization" header is sent when authenticated.
	const authorization = headers.get('Authorization');
	if (!authorization) {
		return new Response('You need to login.', {
			...{ status: 401, headers: { 'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"` } },
			...ALLOW_CORS_HEADERS,
		});
	}

	// The Authorization header must start with Basic, followed by a space.
	const [scheme, plaintext] = authorization.split(' ');
	if (!plaintext || scheme !== 'Basic') new Response('Malformed authorization header.', { ...{ status: 400 }, ...ALLOW_CORS_HEADERS });

	if (!allowlist_tokens.find((t) => t === plaintext)) {
		return new Response(`Incorrect password. ${plaintext}`, {
			...{
				status: 401,
				headers: { 'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"` },
			},
			...ALLOW_CORS_HEADERS,
		});
	}
};
