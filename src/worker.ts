import { decrypt, encrypt } from './lib/aes-gcm';
import { checkAuth } from './lib/basic-auth';
import { hash } from './lib/hashUtils';
import { Validator } from '@cfworker/json-schema';
import {
	Bookmark,
	BookmarkSchema,
	BookmarkToDelete,
	BookmarkToDeleteSchema,
	Bookmarks,
	EMPTY_BOOKMARKS,
	EncryptedPacket,
	Env,
	Packet,
	PacketSchema,
	TimestampedBookmark,
} from './types';
import {
	ALLOW_CORS_HEADERS,
	GENERIC_ERROR_RESPONSE,
	KNOWN_RESPONSE,
	MALFORMED_JSON_ERROR_RESPONSE,
	MISSING_JSON_ERROR_RESPONSE,
	SUCCESSFUL_DELETE_RESPONSE,
	SUCCESS_RESPONSE,
	UNKNOWN_RESPONSE,
} from './lib/returns';

const OPEN_FIDS = [6546];

export default {
	async fetch(request: Request, env: Env) {
		const authResponse = await checkAuth(request.headers, env);
		const newUrl = new URL(request.url);
		const params = newUrl.searchParams;

		const fidAsString = params.get('fid');
		if ((request.method !== 'GET' && request.method !== 'POST' && request.method !== 'DELETE') || !fidAsString)
			return new Response('Error', { ...GENERIC_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
		const fid = parseInt(fidAsString);

		const plainKey = `${fidAsString}:${env.KEY}`;
		const hashedKey = await hash(plainKey, env.SECRET);

		const validator = new Validator(PacketSchema);
		const jsonPacket = await env.FRAMECHAINKV.get(hashedKey);
		if (jsonPacket) {
			const res = validator.validate(JSON.parse(jsonPacket));
			if (!res.valid) return new Response('Error', { ...MALFORMED_JSON_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
		}

		const canDecrypt = !authResponse || OPEN_FIDS.includes(fid);

		const encryptedPacket: Packet = jsonPacket ? JSON.parse(jsonPacket) : {};
		const decryptedJson =
			encryptedPacket.e && encryptedPacket.i ? await decrypt(encryptedPacket as EncryptedPacket, env.SECRET) : undefined;
		const bookmarks: Bookmarks = decryptedJson ? JSON.parse(decryptedJson) : EMPTY_BOOKMARKS;

		if (request.method === 'GET') {
			return new Response(canDecrypt ? JSON.stringify(bookmarks) : JSON.stringify(EMPTY_BOOKMARKS), ALLOW_CORS_HEADERS);
		} else if (request.method === 'POST') {
			if (authResponse) return authResponse;

			const reqBody = await request.text();
			if (reqBody) {
				const bookmarkValidator = new Validator(BookmarkSchema);
				const res = bookmarkValidator.validate(JSON.parse(reqBody));
				if (!res.valid) {
					return new Response('Error', { ...MALFORMED_JSON_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
				}

				const validatedBookmark: Bookmark = JSON.parse(reqBody);
				if (bookmarks.bookmarks.find((u) => u.hash === validatedBookmark.hash)) {
					return new Response('Error', { ...KNOWN_RESPONSE, ...ALLOW_CORS_HEADERS });
				} else {
					const timestampedBookmark: TimestampedBookmark = { timestamp: Date.now(), ...validatedBookmark };
					bookmarks.bookmarks.push(timestampedBookmark);

					const textToEncrypt = JSON.stringify(bookmarks);
					const encryptedData = await encrypt(textToEncrypt, env.SECRET);

					await env.FRAMECHAINKV.put(hashedKey, encryptedData);

					return new Response('OK', { ...SUCCESS_RESPONSE, ...ALLOW_CORS_HEADERS });
				}
			} else {
				return new Response('Error', { ...MISSING_JSON_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
			}
		} else if (request.method === 'DELETE') {
			if (authResponse) return authResponse;

			const reqBody = await request.text();
			if (reqBody) {
				const deleteValidator = new Validator(BookmarkToDeleteSchema);
				const res = deleteValidator.validate(JSON.parse(reqBody));
				if (!res.valid) {
					return new Response('Error', { ...MALFORMED_JSON_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
				}

				const validatedBookmarkToDelete: BookmarkToDelete = JSON.parse(reqBody);
				console.log('validatedBookmarkHash:', validatedBookmarkToDelete);
				console.log('bookmarks:', JSON.stringify(bookmarks));
				if (bookmarks.bookmarks.find((u) => u.hash === validatedBookmarkToDelete.hash)) {
					bookmarks.bookmarks = bookmarks.bookmarks.filter((bm) => bm.hash !== validatedBookmarkToDelete.hash);

					const textToEncrypt = JSON.stringify(bookmarks);
					const encryptedData = await encrypt(textToEncrypt, env.SECRET);

					await env.FRAMECHAINKV.put(hashedKey, encryptedData);

					return new Response('OK', { ...SUCCESSFUL_DELETE_RESPONSE, ...ALLOW_CORS_HEADERS });
				} else {
					return new Response('Error', { ...UNKNOWN_RESPONSE, ...ALLOW_CORS_HEADERS });
				}
			} else {
				return new Response('Error', { ...MISSING_JSON_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
			}
		} else {
			return new Response('Error', { ...GENERIC_ERROR_RESPONSE, ...ALLOW_CORS_HEADERS });
		}
	},
};
