export const ALLOW_CORS_HEADERS = {
	headers: {
		'content-type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
};
export const SUCCESS_RESPONSE = { status: 200, statusText: 'Bookmark added!' };
export const SUCCESSFUL_DELETE_RESPONSE = { status: 200, statusText: 'Bookmark removed!' };
export const GENERIC_ERROR_RESPONSE = { status: 400, statusText: 'Generic Error' };
export const MISSING_JSON_ERROR_RESPONSE = { status: 400, statusText: 'Missing data!' };
export const NOT_ALLOWED_RESPONSE = { status: 401, statusText: 'Not Allowed!' };
export const KNOWN_RESPONSE = { status: 403, statusText: 'Bookmark already exists!' };
export const UNKNOWN_RESPONSE = { status: 403, statusText: 'Bookmark does not exist!' };
export const MALFORMED_JSON_ERROR_RESPONSE = { status: 422, statusText: 'Malformed JSON!' };

// 400 Bad Request - server cannot or will not process the request
// 		due to something that is perceived to be a client error
// 		(for example, malformed request syntax, invalid request message framing,
// 		 or deceptive request routing)
// 401 Unauthorized - request lacks valid authentication credentials
// 402 Payment Required
// 403 Forbidden - server understands the request but refuses to fulfill it
// 418 I'm a teapot
// 422 Unprocessable Content -  server understands the content type of the request entity,
//		and the syntax of the request entity is correct, but
//		it was unable to process the contained instructions
