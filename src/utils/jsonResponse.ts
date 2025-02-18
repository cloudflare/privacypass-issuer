// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

export class JSONResponse extends Response {
	constructor(body: unknown, init: ResponseInit = {}) {
		const headers = new Headers(init.headers);
		headers.append('Content-Type', 'application/json;charset=UTF-8');
		init.headers = headers;
		super(JSON.stringify(body), init);
	}
}
