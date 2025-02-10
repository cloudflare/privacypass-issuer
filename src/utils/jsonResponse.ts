// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0
import { Context } from '../context';

export class JSONResponse extends Response {
	constructor(body: unknown, init: ResponseInit = {}) {
		const headers = new Headers(init.headers);
		headers.append('Content-Type', 'application/json;charset=UTF-8');
		init.headers = headers;
		super(JSON.stringify(body), init);
	}
}

// TODO: Modify file name/make it into a class where JSONResponse makes sense
export type StandardResponse = {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string | null;
}

export type MyResponse = {
	status: number;
	message: string;
	headers: Record<string, string>; // without this all works
	body: string | null;
}

// cahce should be last argument default ot false
export class ResponseFactory {
	static async createResponse(
		res: StandardResponse,
		cache: boolean = false,
		ctx?: Context,
		isRCP: boolean = false
	): Promise<Response | StandardResponse> {

		// If no caching is required and isRCP is true, return the response immediately
		if (!cache && isRCP) {
			return res;
		}

		// Create a new Response object for caching or modification
		const response = new Response(res.body, {
			headers: res.headers,
			statusText: res.statusText,
			status: res.status,
		});

		// Handle caching if needed
		if (cache && ctx) {
			// Add caching logic here (e.g., storing response in a cache)
		}

		// If isRCP is true, return the original response, else return the new Response object
		return isRCP ? res : response;
	}
}
