// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Context } from 'toucan-js/dist/types';
import { RewriteFrames, Toucan } from 'toucan-js';
import { Breadcrumb } from '@sentry/types';
import { Bindings } from '../bindings';

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
	constructor(environment: string, options: SentryOptions) {
		if (environment === 'dev') {
			this.logger = new ConsoleLogger();
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
	setTag(key: string, value: string): void { }
	setSampleRate(sampleRate: number): void { }
	addBreadcrumb(breadcrumb: Breadcrumb): void { }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	info(category: string, message: string, data?: { [key: string]: any }): void { }
}

export class VoidLogger implements Logger {
	setTag(key: string, value: string): void { }
	setSampleRate(sampleRate: number): void { }
	addBreadcrumb(breadcrumb: Breadcrumb): void { }
	captureException(e: Error): void { }
	info(category: string, message: string, data?: { [key: string]: any }): void { }
}
/* eslint-enable */

interface LogEntry {
	message: string;
	log_level: string;
	error?: string;
}

export class WshimLogger {
	private request: Request;
	private env: Bindings;

	private logs: LogEntry[] = [];
	private serviceToken: string;
	private sampleRate: number;
	private fetcher: typeof fetch;
	private loggingEndpoint: string;

	constructor(request: Request, env: Bindings, sampleRate: number = 1) {
		this.request = request;
		this.env = env;
		if (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1) {
			throw new Error('Sample rate must be a number between 0 and 1');
		}

		this.serviceToken = env.LOGGING_SHIM_TOKEN;
		this.sampleRate = sampleRate;
		// this.fetcher = env.WSHIM_SOCKET?.fetch?.bind(env.WSHIM_SOCKET) ?? fetch;
		const socket = env.WSHIM_SOCKET;
		this.fetcher = (input: RequestInfo, init?: RequestInit) => {
			if (socket && typeof socket.fetch === 'function') {
				return socket.fetch.bind(socket)(input, init);
			}
			return fetch(input, init);
		};

		this.loggingEndpoint = `${env.WSHIM_ENDPOINT}/log`;
	}

	private shouldLog(): boolean {
		return Math.random() < this.sampleRate;
	}

	private defaultFields() {
		return {
			'environment': this.env.ENVIRONMENT,
			'http.host': this.request.url,
			'http.user_agent': this.request.headers.get('User-Agent'),
			'source_service': this.env.SERVICE,
		};
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
		if (this.logs.length === 0) return;

		const defaultFields = this.defaultFields();

		const body = JSON.stringify({
			logs: this.logs.map(log => ({ message: { ...defaultFields, ...log } })),
		});

		try {
			const response = await this.fetcher(this.loggingEndpoint, {
				method: 'POST',
				headers: { Authorization: `Bearer ${this.serviceToken}` },
				body,
			});
			if (!response.ok) {
				console.error(`Failed to flush logs: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error('Failed to flush logs:', error);
		}

		this.logs = [];
	}
}
