// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Context } from 'toucan-js/dist/types';
import { RewriteFrames, Toucan } from 'toucan-js';
import { Breadcrumb } from '@sentry/types';
import { Bindings } from '../bindings';
import { WshimOptions } from '.';

// End toucan-js types

export interface Logger {
	captureException(err: Error): void;
	addBreadcrumb(breadcrumb: Breadcrumb): void;
	setTag(key: string, value: string): void;
	setSampleRate(sampleRate: number): void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(category: string, message: string, data?: { [key: string]: any }): void;
}

interface SentryOptions {
	context: Context;
	request: Request;
	service: string;
	dsn: string;
	accessClientId: string;
	accessClientSecret: string;
	release: string;

	sampleRate?: number;
	coloName?: string;
}

export class FlexibleLogger implements Logger {
	logger: Logger;
	constructor(environment: string, options?: SentryOptions) {
		if (options === undefined) {
			if (environment === 'dev') {
				console.log('sentry is disabled');
				this.logger = new ConsoleLogger();
			}
			throw new Error('Not all sentry options were defined');
		} else {
			this.logger = new SentryLogger(environment, options);
		}
	}
	addBreadcrumb(breadcrumb: Breadcrumb): void {
		this.logger.addBreadcrumb(breadcrumb);
	}
	captureException(e: Error): void {
		this.logger.captureException(e);
	}
	setTag(key: string, value: string): void {
		this.logger.setTag(key, value);
	}
	setSampleRate(sampleRate: number): void {
		this.logger.setSampleRate(sampleRate);
	}
	// any inherited from @sentry/types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(category: string, message: string, data?: { [key: string]: any }): void {
		this.logger.info(category, message, data);
	}
}

export class SentryLogger implements Logger {
	sentry: Toucan;
	context: Context;
	request: Request;
	environment: string;
	service: string;
	sampleRate: number;

	constructor(environment: string, options: SentryOptions) {
		this.environment = environment;
		this.context = options.context;
		this.request = options.request;
		this.service = options.service;

		this.sentry = new Toucan({
			dsn: options.dsn,
			context: this.context,
			request: this.request,
			integrations: [new RewriteFrames({ root: '/' })],
			environment: this.environment,
			release: options.release,
			transportOptions: {
				headers: {
					'CF-Access-Client-ID': options.accessClientId,
					'CF-Access-Client-Secret': options.accessClientSecret,
				},
			},
		});
		this.sentry.setTag('coloName', options.coloName);
		this.sentry.setTag('service', this.service);

		// default sample rate
		this.sampleRate = 1;
		if (options.sampleRate !== undefined) {
			// set if option is valid
			this.setSampleRate(options.sampleRate);
		}
	}

	setTag(key: string, value: string): void {
		this.sentry.setTag(key, value);
	}

	setSampleRate(sampleRate: number): void {
		if (typeof sampleRate !== 'number' || !Number.isFinite(sampleRate)) {
			return;
		}

		if (sampleRate < 0 || sampleRate > 1) {
			return;
		}

		this.sampleRate = sampleRate;
	}
	addBreadcrumb(breadcrumb: Breadcrumb): void {
		if (!breadcrumb.level) {
			breadcrumb.level = 'info';
		}
		this.sentry.addBreadcrumb(breadcrumb);
	}
	captureException(err: Error): void {
		if (Math.random() > this.sampleRate) {
			return;
		}
		this.sentry.captureException(err);
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(category: string, message: string, data?: { [key: string]: any }): void {
		const breadcrumb: Breadcrumb = {
			level: 'info',
			timestamp: Math.floor(Date.now() / 1000),
			category,
			message,
		};

		if (data !== undefined) {
			breadcrumb.data = data;
		}

		this.addBreadcrumb(breadcrumb);
	}
}

/* eslint-disable */
// Lots of empty functions and unused args in this section, ignoring lint errors

export class ConsoleLogger implements Logger {
	captureException(err: Error): void {
		// eslint-disable-next-line no-console
		console.error(err.stack);
	}
	setTag(key: string, value: string): void {}
	setSampleRate(sampleRate: number): void {}
	addBreadcrumb(breadcrumb: Breadcrumb): void {}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(category: string, message: string, data?: { [key: string]: any }): void {}
}

export class VoidLogger implements Logger {
	setTag(key: string, value: string): void {}
	setSampleRate(sampleRate: number): void {}
	addBreadcrumb(breadcrumb: Breadcrumb): void {}
	captureException(e: Error): void {}
	info(category: string, message: string, data?: { [key: string]: any }): void {}
}
/* eslint-enable */

interface LogEntry {
	message: string;
	log_level: string;
	error?: string;
}

export class WshimLogger {
	private logs: LogEntry[] = [];
	private sampleRate: number;
	private wshimOptions?: WshimOptions;
	private readonly defaultFields: {
		'env': string;
		'http.host': string;
		'http.user_agent': string | null;
		'source_service': string;
	};

	constructor(request: Request, env: Bindings, logger: Logger, sampleRate: number = 1) {
		this.wshimOptions = WshimOptions.init(env, logger);
		if (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1) {
			throw new Error('Sample rate must be a number between 0 and 1');
		}
		this.sampleRate = sampleRate;
		this.defaultFields = {
			'env': env.ENVIRONMENT,
			'http.host': request.url,
			'http.user_agent': request.headers.get('User-Agent'),
			'source_service': env.SERVICE,
		};
	}

	private shouldLog(): boolean {
		return Math.random() < this.sampleRate;
	}

	log(...msg: unknown[]): void {
		if (!this.shouldLog()) return;

		const message = msg.map(o => (typeof o === 'object' ? JSON.stringify(o) : String(o))).join(' ');
		const logEntry: LogEntry = { message, log_level: 'info' };
		this.logs.push(logEntry);
	}

	error(...msg: unknown[]): void {
		if (!this.shouldLog()) return;

		let logEntry: LogEntry;

		if (msg.length === 1 && msg[0] instanceof Error) {
			const error = msg[0] as Error;
			logEntry = {
				message: error.message,
				log_level: 'error',
				error: error.stack,
			};
		} else {
			const message = msg
				.map(o => (typeof o === 'object' ? JSON.stringify(o) : String(o)))
				.join(' ');
			logEntry = { message, log_level: 'error' };
		}

		this.logs.push(logEntry);
	}

	public async flushLogs(): Promise<void> {
		if (this.wshimOptions === undefined) {
			if (this.defaultFields.source_service !== 'unit-tests') {
				console.log('logs flushing is disabled');
			}
			for (const entry of this.logs) {
				switch (entry.log_level) {
					case 'error':
						console.error(entry.error ?? 'unknown error', entry.message);
						break;
					default:
						console.log(entry.message);
				}
			}
			return;
		}
		if (this.logs.length === 0) return;

		const body = JSON.stringify({
			logs: this.logs.map(log => ({ message: { ...this.defaultFields, ...log } })),
		});

		await this.wshimOptions.flush(body);

		this.logs = [];
	}
}
