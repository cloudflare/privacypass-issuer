// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Labels } from 'promjs';
import { Context } from './context';
import { JSONResponse } from './utils/jsonResponse';

function shouldSendToSentry(error: Error): boolean {
	if (error instanceof PageNotFoundError || error instanceof MethodNotAllowedError) {
		return false;
	}
	return true;
}

function isHTTPError(error: unknown): error is HTTPError {
	return error instanceof HTTPError;
}

export function getStatusFromError(e: unknown): number {
	if (isHTTPError(e)) {
		return e.status;
	}
	if (typeof e === 'object' && e !== null && 'status' in e) {
		const status = (e as { status: unknown }).status;
		if (typeof status === 'number') {
			return status;
		}
	}
	return 500;
}

export async function handleError(ctx: Context, error: Error, labels?: Labels) {
	console.error(error.stack);

	ctx.metrics.erroredRequestsTotal.inc(labels);

	const status = (error as HTTPError).status ?? 500;
	const message = error.message || 'Server Error';
	console.log(message);
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
