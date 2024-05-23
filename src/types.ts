import { Schema } from '@cfworker/json-schema';

export interface Env {
	KEY: string;
	SECRET: string;
	FRAMECHAINKV: KVNamespace;
}

export interface Bookmark {
	fid: string;
	hash: `0x${string}`;
	username: string;
	tags?: string[];
}
export interface TimestampedBookmark extends Bookmark {
	timestamp: number;
}
export interface Bookmarks {
	bookmarks: TimestampedBookmark[];
}
export interface BookmarkToDelete {
	hash: `0x${string}`;
}
export const EMPTY_BOOKMARKS: Bookmarks = { bookmarks: [] };

export const PacketSchema: Schema = {
	type: 'object',
	optional: ['e', 'i', 'p', 'z'],
	properties: {
		e: { type: 'string' },
		i: { type: 'string' },
		p: { type: 'string' },
		z: { type: 'string' },
	},
};
export const BookmarkSchema: Schema = {
	type: 'object',
	required: ['hash', 'fid', 'username'],
	properties: {
		hash: { type: 'string' },
		fid: { type: 'number' },
		username: { type: 'string' },
	},
};
export const TimestampedBookmarkSchema: Schema = {
	type: 'object',
	required: ['timestamp', 'hash', 'fid', 'username'],
	properties: {
		timestamp: { type: 'number' },
		hash: { type: 'string' },
		fid: { type: 'number' },
		username: { type: 'string' },
	},
};
export const BookmarkToDeleteSchema: Schema = {
	type: 'object',
	required: ['hash'],
	properties: {
		hash: { type: 'string' },
	},
};
export const AllowlistSchema: Schema = {
	type: 'array',
	items: {
		type: 'string',
	},
};

export interface Packet {
	e?: string; // encryptedText
	i?: string; // iv
	p?: string; // plainText
	z?: string; // zkp
}

export interface EncryptedPacket {
	e: string; // encryptedText
	i: string; // iv
	p?: string; // plainText
	z?: string; // zkp
}
