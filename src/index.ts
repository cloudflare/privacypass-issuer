// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./lib/global.d.ts" />

import { Bindings, UncheckedBindings, checkMandatoryBindings } from './lib/bindings';
import { Context } from './lib/context';
import { Router } from './lib/router';
import { handleError, HTTPError } from './lib/errors';
import { PRIVATE_TOKEN_ISSUER_DIRECTORY } from '@cloudflare/privacypass-ts';
import { WorkerEntrypoint } from 'cloudflare:workers';

import { BaseRpcOptions, IssueOptions } from './lib/types';
import {
	IssueResponse,
	clearKey,
	handleClearKey,
	handleRotateKey,
	handleTokenDirectory,
	handleTokenRequest,
	issue,
	rotateKey,
} from './lib';
export { KeyBackupWorkflow } from './lib/key-backup';

export class IssuerHandler extends WorkerEntrypoint<Bindings> {
	private context(url: string, prefix?: string): Context {
		const env = this.env;
		const ectx = this.ctx;

		const sample = new Request(url);
		return Router.buildContext(sample, env, ectx, prefix);
	}

	async fetch(request: Request): Promise<Response> {
		const router = new Router();

		router
			.get(PRIVATE_TOKEN_ISSUER_DIRECTORY, handleTokenDirectory)
			.post('/token-request', handleTokenRequest)
			.post('/admin/rotate', handleRotateKey)
			.post('/admin/clear', handleClearKey);

		return router.handle(
			request as Request<Bindings, IncomingRequestCfProperties<unknown>>,
			this.env,
			this.ctx
		);
	}

	async tokenDirectory(opts: BaseRpcOptions): Promise<Response> {
		return this.withMetrics({ op: 'tokenDirectory', ...opts }, ctx =>
			handleTokenDirectory(ctx, new Request(opts.serviceInfo.url))
		);
	}

	async issue(opts: IssueOptions): Promise<IssueResponse> {
		return this.withMetrics({ op: 'issue', ...opts }, ctx =>
			issue(ctx, opts.tokenRequest, new URL(opts.serviceInfo.url).host, opts.contentType)
		);
	}

	async rotateKey(opts: BaseRpcOptions): Promise<Uint8Array> {
		return this.withMetrics({ op: 'rotateKey', ...opts }, ctx => rotateKey(ctx));
	}

	async clearKey(opts: BaseRpcOptions): Promise<string[]> {
		return this.withMetrics({ op: 'clearKey', ...opts }, ctx => clearKey(ctx));
	}

	private async withMetrics<T>(
		opts: BaseRpcOptions & { op: 'tokenDirectory' | 'issue' | 'rotateKey' | 'clearKey' },
		fn: (ctx: Context) => Promise<T>
	): Promise<T> {
		const { prefix, serviceInfo, op } = opts;
		const hostname = new URL(serviceInfo.url).hostname;
		const ctx = this.context(serviceInfo.url, prefix);
		const route = serviceInfo?.route ?? `/${op}`;
		ctx.serviceInfo = serviceInfo;

		const start = ctx.performance.now();
		try {
			return await fn(ctx);
		} catch (e: unknown) {
			const err = e as Error;
			const status = e instanceof HTTPError ? e.status : 500;
			await handleError(ctx, err, { path: route, hostname, status });
			throw e;
		} finally {
			const labels = { path: route, hostname };
			const duration = ctx.performance.now() - start;

			ctx.metrics.requestsTotal.inc(labels);
			ctx.metrics.requestsDurationMs.observe(duration, labels);
			ctx.waitUntil(ctx.postProcessing());
		}
	}
}

export default {
	async fetch(request: Request, env: UncheckedBindings, ctx: ExecutionContext) {
		const issuerHandler = new IssuerHandler(ctx, checkMandatoryBindings(env));
		return issuerHandler.fetch(request);
	},

	async scheduled(event: ScheduledEvent, env: UncheckedBindings, ctx: ExecutionContext) {
		const sampleRequest = new Request(`https://schedule.example.com`);

		const checkedEnv = checkMandatoryBindings(env);
		const context = Router.buildContext(sampleRequest, checkedEnv, ctx);

		try {
			if (event.cron === checkedEnv.ROTATION_CRON_STRING) {
				await handleRotateKey(context, sampleRequest);
			} else if (event.cron === checkedEnv.BACKUPS_CRON_STRING) {
				await checkedEnv.KEY_BACKUP_WF?.create();
			} else {
				await handleClearKey(context, sampleRequest);
			}
		} catch (err) {
			await handleError(context, err as Error, {
				path: '/cron',
				status: err instanceof HTTPError ? err.status : 500,
			});
			throw err;
		} finally {
			ctx.waitUntil(context.postProcessing());
		}
	},
};
