// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CounterType, HistogramType, Labels, RegistryType } from 'promjs';
import { Registry } from 'promjs/registry';
import { Bindings } from '../bindings';

export const KeyError = {
	NOT_FOUND: 'not-found',
	INVALID_PRIVATE_KEY: 'invalid-private-key',
	MISSING_PRIVATE_KEY: 'missing-private-key',
	MISSING_PUBLIC_KEY: 'missing-public-key',
};

interface RegistryOptions {
	endpoint: string;
	bearerToken: string;
	fetcher: typeof fetch;
}

export interface DefaultLabels {
	env: string;
	service: string;
}

const HISTOGRAM_MS_BUCKETS = [50, 100, 200, 400, 1000, 2 * 1000, 4 * 1000];

/**
 * A wrapper around the promjs registry to manage registering and publishing metrics
 */
export class MetricsRegistry {
	env: Bindings;

	options: RegistryOptions;
	registry: RegistryType;

	asyncRetriesTotal: CounterType;
	directoryCacheMissTotal: CounterType;
	erroredRequestsTotal: CounterType;
	issuanceKeyErrorTotal: CounterType;
	issuanceRequestTotal: CounterType;
	keyRotationTotal: CounterType;
	keyClearTotal: CounterType;
	requestsDurationMs: HistogramType;
	requestsTotal: CounterType;
	r2RequestsDurationMs: HistogramType;
	signedTokenTotal: CounterType;

	constructor(env: Bindings) {
		this.env = env;
		this.options = {
			bearerToken: env.WSHIM_TOKEN,
			endpoint: `${env.WSHIM_ENDPOINT}/prometheus`,
			fetcher: env.WSHIM_SOCKET?.fetch ?? fetch,
		};
		this.registry = new Registry();

		this.asyncRetriesTotal = this.create(
			'counter',
			'async_retries_total',
			'Number of async retries performed.'
		);
		this.directoryCacheMissTotal = this.create(
			'counter',
			'directory_cache_miss_total',
			'Number of requests for private token issuer directory which are not served by the cache.'
		);
		this.erroredRequestsTotal = this.create(
			'counter',
			'errored_requests_total',
			'Errored requests served to eyeball'
		);
		this.issuanceKeyErrorTotal = this.create(
			'counter',
			'issuance_key_error_total',
			'Number of key errors encountered when issuing a private token.'
		);
		this.issuanceRequestTotal = this.create(
			'counter',
			'issuance_request_total',
			'Number of requests for private token issuance.'
		);
		this.keyRotationTotal = this.create(
			'counter',
			'key_rotation_total',
			'Number of key rotation performed.'
		);
		this.keyClearTotal = this.create(
			'counter',
			'key_clear_total',
			'Number of key clear performed.'
		);
		this.requestsDurationMs = this.create(
			'histogram',
			'request_duration_ms',
			'Request duration',
			HISTOGRAM_MS_BUCKETS
		);
		this.requestsTotal = this.create('counter', 'requests_total', 'total requests');
		this.r2RequestsDurationMs = this.create(
			'histogram',
			'r2_requests_duration_ms',
			'R2 requests duration',
			HISTOGRAM_MS_BUCKETS
		);
		this.signedTokenTotal = this.create(
			'counter',
			'signed_token_total',
			'Number of issued signed private tokens.'
		);
	}

	private defaultLabels(): DefaultLabels {
		return {
			env: this.env.ENVIRONMENT,
			service: this.env.SERVICE,
		};
	}

	private createCounter(name: string, help?: string): CounterType {
		const counter = this.registry.create('counter', name, help);
		const defaultLabels = this.defaultLabels();
		return new Proxy(counter, {
			get(target, prop, receiver) {
				if (['collect', 'get', 'inc', 'reset'].includes(prop.toString())) {
					return function (labels?: Labels) {
						const mergedLabels = { ...defaultLabels, ...labels };
						return Reflect.get(target, prop, receiver)?.call(target, mergedLabels);
					};
				}
				if (['add', 'set'].includes(prop.toString())) {
					return function (value: number, labels?: Labels) {
						const mergedLabels = { ...defaultLabels, ...labels };
						return Reflect.get(target, prop, receiver)?.call(target, value, mergedLabels);
					};
				}
				return Reflect.get(target, prop, receiver);
			},
		});
	}

	private createHistogram(name: string, help?: string, histogramBuckets?: number[]): HistogramType {
		const histogram = this.registry.create('histogram', name, help, histogramBuckets);
		const defaultLabels = this.defaultLabels();
		return new Proxy(histogram, {
			get(target, prop, receiver) {
				if (['collect', 'get', 'reset'].includes(prop.toString())) {
					return function (labels?: Labels) {
						const mergedLabels = { ...defaultLabels, ...labels };
						return Reflect.get(target, prop, receiver)?.call(target, mergedLabels);
					};
				}
				if (['add', 'observe', 'set'].includes(prop.toString())) {
					return function (value: number, labels?: Labels) {
						const mergedLabels = { ...defaultLabels, ...labels };
						return Reflect.get(target, prop, receiver)?.call(target, value, mergedLabels);
					};
				}
				return Reflect.get(target, prop, receiver);
			},
		});
	}

	private create(type: 'counter', name: string, help?: string): CounterType;
	private create(
		type: 'histogram',
		name: string,
		help?: string,
		histogramBuckets?: number[]
	): HistogramType;
	private create(
		type: 'counter' | 'histogram',
		name: string,
		help?: string,
		histogramBuckets?: number[]
	): CounterType | HistogramType {
		switch (type) {
			case 'counter':
				return this.createCounter(name, help);
			case 'histogram':
				return this.createHistogram(name, help, histogramBuckets);
			default:
				throw new Error(`Unknown metric type: ${type}`);
		}
	}

	/**
	 * Publishes metrics to the workers metrics API
	 * This function is a no-op in test and wrangler environements
	 */
	async publish(): Promise<void> {
		await this.options.fetcher(this.options.endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.options.bearerToken}`,
			},
			body: this.registry.metrics(),
		});
	}
}
