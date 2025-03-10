// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { PRIVATE_TOKEN_ISSUER_DIRECTORY } from '@cloudflare/privacypass-ts';
import { Bindings } from './bindings';
import { Context } from './context';
import { ConsoleLogger, FlexibleLogger, Logger } from './context/logging';
import { MetricsRegistry } from './context/metrics';
import { MethodNotAllowedError, PageNotFoundError, handleError, HTTPError } from './errors';
import { WshimLogger } from './context/logging';

export const HttpMethod = {
	DELETE: 'DELETE',
	GET: 'GET',
	HEAD: 'HEAD',
	POST: 'POST',
	PUT: 'PUT',
} as const;


// TODO: We could have a "Response" factory that allows us to return responses with a more sophisticated structure.
export type ExportedHandlerFetchHandler = (ctx: Context, request: Request) => Response | Promise<Response>;
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

// Simple router
// Register HTTP method handlers, and then handles them by exact path match
export class Router {
	private handlers: {
		[key: string]: { [key: string]: ExportedHandlerFetchHandler };
	} = {};

	private validPaths: Set<string>;

	constructor(validPaths: Set<string>) {
		this.validPaths = validPaths;
	}

	private normalisePath(path: string): string {
		const normalised = path.endsWith('/') ? path.slice(0, -1) : path;
		return this.validPaths.has(normalised) ? normalised : '/not-found';
	}

	// Register a handler for a specific path on the router
	private registerMethod(
		method: HttpMethod,
		path: string,
		handler: ExportedHandlerFetchHandler
	): Router {
		// if handlers for method is not defined, initialise it.
		this.handlers[method] ??= {};

		// path should not already be define for this method.
		// the configuration is wrong. this is a developer bug.
		if (path in this.handlers[method]) {
			throw new Error(`path '${path}' already exists`);
		}
		// normalise path, so that they never end with a trailing '/'
		path = this.normalisePath(path);
		this.handlers[method][path] = handler;
		if (method === HttpMethod.GET) {
			this.handlers[HttpMethod.HEAD] ??= {};
			this.handlers[HttpMethod.HEAD][path] = async (
				ctx: Context,
				request: Request
			): Promise<Response> => {
				const response = await handler(ctx, request);
				if (response.ok) {
					return new Response(null, response);
				}
				return response;
			};
		}
		return this;
	}

	delete(path: string, handler: ExportedHandlerFetchHandler): Router {
		return this.registerMethod(HttpMethod.DELETE, path, handler);
	}

	get(path: string, handler: ExportedHandlerFetchHandler): Router {
		return this.registerMethod(HttpMethod.GET, path, handler);
	}

	head(path: string, handler: ExportedHandlerFetchHandler): Router {
		return this.registerMethod(HttpMethod.HEAD, path, handler);
	}

	post(path: string, handler: ExportedHandlerFetchHandler): Router {
		return this.registerMethod(HttpMethod.POST, path, handler);
	}

	put(path: string, handler: ExportedHandlerFetchHandler): Router {
		return this.registerMethod(HttpMethod.PUT, path, handler);
	}

	private buildContext(request: Request, env: Bindings, ectx: ExecutionContext): Context {
		// Prometheus Registry should be unique per request
		const metrics = new MetricsRegistry(env);
		const wshimLogger = new WshimLogger(request, env);

		// Use a flexible reporter, so that it uses console.log when debugging, and Core Sentry when in production
		let logger: Logger;
		if (!env.SENTRY_SAMPLE_RATE || parseFloat(env.SENTRY_SAMPLE_RATE) === 0) {
			logger = new ConsoleLogger();
		} else {
			let sentrySampleRate = parseFloat(env.SENTRY_SAMPLE_RATE);
			if (!Number.isFinite(sentrySampleRate)) {
				sentrySampleRate = 1;
			}
			logger = new FlexibleLogger(env.ENVIRONMENT, {
				context: ectx,
				request: request,
				dsn: env.SENTRY_DSN,
				accessClientId: env.SENTRY_ACCESS_CLIENT_ID,
				accessClientSecret: env.SENTRY_ACCESS_CLIENT_SECRET,
				release: RELEASE,
				service: env.SERVICE,
				sampleRate: sentrySampleRate,
				coloName: request?.cf?.colo as string,
			});
		}
		return new Context(request, env, ectx.waitUntil.bind(ectx), logger, metrics, wshimLogger);
	}

	private async postProcessing(ctx: Context) {
		// wait for async tasks to complete before reporting metrics
		await ctx.waitForPromises();
		await ctx.metrics.publish();
		await ctx.wshimLogger.flushLogs();
	}

	// match exact path, and returns a response using the appropriate path handler
	async handle(
		request: Request<Bindings, IncomingRequestCfProperties<unknown>>,
		env: Bindings,
		ectx: ExecutionContext
	): Promise<Response> {
		const ctx = this.buildContext(request, env, ectx);
		const rawPath = new URL(request.url).pathname;
		const path = this.normalisePath(rawPath);
		ctx.metrics.requestsTotal.inc({ path });

		// check if there exist a handler for the specific method and path.
		// first filtering by method, then checking the path.
		// dev: if there needs to be argument-in-path down the line, this is where the context would be built and validated
		let response: Response;
		try {
			const handlers = this.handlers[request.method as HttpMethod];
			if (!handlers) {
				throw new MethodNotAllowedError();
			}
			if (!(path in handlers)) {
				throw new PageNotFoundError();
			}
			response = await handlers[path](ctx, request);
		} catch (e: unknown) {
			let status = 500;
			if (e instanceof HTTPError) {
				status = e.status;
			}
			response = await handleError(ctx, e as Error, { path, status });
		}
		ctx.metrics.requestsDurationMs.observe(ctx.performance.now() - ctx.startTime, { path });
		ectx.waitUntil(this.postProcessing(ctx));
		return response;
	}
}
