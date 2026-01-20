// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Labels } from 'promjs-plus';
import { Context } from './context';
import { JSONResponse } from './utils/jsonResponse';

function shouldSendToSentry(error: Error): boolean {
	if (
		error instanceof PageNotFoundError ||
		error instanceof MethodNotAllowedError ||
		error instanceof HeaderNotDefinedError ||
		error instanceof BadTokenKeyRequestedError
	) {
		return false;
	}
	return true;
}

export async function handleError(ctx: Context, error: Error, labels?: Labels) {
	ctx.metrics.erroredRequestsTotal.inc({
		...labels,
	});

	const status = (error as HTTPError).status ?? 500;
	const message = error.message || 'Server Error';

	const logEntry: Record<string, unknown> = {
		message,
		status,
		prefix: ctx.prefix,
	};

	if (ctx.key_id) {
		logEntry.key_id = ctx.key_id;
	}
	if (labels?.path) {
		logEntry.path = labels.path;
	}

	// if (status === 500) {
		ctx.wshimLogger.error(logEntry);
	// }

	if (shouldSendToSentry(error)) {
		ctx.logger.captureException(error);
	}
	return new JSONResponse(
		{
			error: { reason: error.name, details: message },
		},
		{ status }
	);
}

export class HTTPError extends Error {
	status: number;

	constructor(message?: string, status = 500) {
		super(message);
		this.name = 'HTTPError';
		this.status = status;
	}
}

export class MethodNotAllowedError extends HTTPError {
	static CODE = 'ERROR_METHOD_NOT_ALLOWED';
	code: string;

	constructor(message = 'Method not allowed') {
		super(message, 405);
		this.name = 'MethodNotAllowed';
		this.code = MethodNotAllowedError.CODE;
	}
}

export class PageNotFoundError extends HTTPError {
	static CODE = 'ERROR_PAGE_NOT_FOUND';
	code: string;

	constructor(message = 'Page not found') {
		super(message, 404);
		this.name = 'PageNotFound';
		this.code = PageNotFoundError.CODE;
	}
}

export class HeaderNotDefinedError extends HTTPError {
	static CODE = 'ERROR_HEADER_NOT_DEFINED';
	code: string;

	constructor(message = 'Header not defined') {
		super(message, 406);
		this.name = 'HeaderNotDefined';
		this.code = HeaderNotDefinedError.CODE;
	}
}

export class InternalCacheError extends HTTPError {
	static CODE = 'ERROR_INTERNAL_CACHE_ERROR';
	code: string;

	constructor(message = 'Internal cache error') {
		super(message, 500);
		this.name = 'InternalCacheError';
		this.code = InternalCacheError.CODE;
	}
}

export class NotImplementedError extends HTTPError {
	static CODE = 'ERROR_NOT_IMPLEMENTED';
	code: string;

	constructor(message = 'Not Implemented') {
		super(message, 501);
		this.name = 'NotImplemented';
		this.code = NotImplementedError.CODE;
	}
}

export class UnreachableError extends HTTPError {
	static CODE = 'ERROR_UNREACHABLE';
	code: string;

	constructor(message = 'Unreachable') {
		super(message, 500);
		this.name = 'Unreachable';
		this.code = UnreachableError.CODE;
	}
}

export class InvalidTokenTypeError extends HTTPError {
	static CODE = 'ERROR_INVALID_TOKEN_TYPE';
	code: string;

	constructor(message = 'Invalid token type') {
		super(message, 400);
		this.name = 'InvalidTokenTypeError';
		this.code = InvalidTokenTypeError.CODE;
	}
}

export class InvalidBatchedTokenTypeError extends HTTPError {
	static CODE = 'ERROR_INVALID_TOKEN_TYPE';
	code: string;

	constructor(message = 'Invalid token type') {
		super(message, 422);
		this.name = 'InvalidTokenTypeError';
		this.code = InvalidTokenTypeError.CODE;
	}
}

export class BadTokenKeyRequestedError extends HTTPError {
	static CODE = 'ERROR_BAD_TOKEN_KEY_REQUESTED';
	code: string;

	constructor(message = 'Bad token key requested') {
		super(message, 400);
		this.name = 'BadTokenKeyRequestedError';
		this.code = BadTokenKeyRequestedError.CODE;
	}
}

export class InvalidContentTypeError extends HTTPError {
	static CODE = 'ERROR_INVALID_CONTENT_TYPE';
	code: string;

	constructor(message = 'Invalid content type') {
		super(message, 422);
		this.name = 'InvalidContentTypeError';
		this.code = InvalidContentTypeError.CODE;
	}
}

export class MismatchedTokenKeyIDError extends HTTPError {
	static CODE = 'ERROR_MISMATCHED_TOKEN_KEY_ID';
	code: string;

	constructor(message = 'Batched token request must have the same key ID') {
		super(message, 400);
		this.name = 'MismatchedTokenKeyIDError';
		this.code = MismatchedTokenKeyIDError.CODE;
	}
}
