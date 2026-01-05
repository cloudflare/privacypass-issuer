// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
	CounterType,
	HistogramType,
	Labels,
	RegistryType,
	Registry,
	GaugeType,
	CollectorType,
} from 'promjs-plus';
import { Bindings } from '../bindings';
import { WshimOptions } from '.';
import { Logger } from './logging';

export const KeyError = {
	NOT_FOUND: 'not-found',
	INVALID_PRIVATE_KEY: 'invalid-private-key',
	INVALID_PUBLIC_KEY: 'invalid-public-key',
	MISSING_PRIVATE_KEY: 'missing-private-key',
	MISSING_PUBLIC_KEY: 'missing-public-key',
};

export interface DefaultLabels {
	env: string;
	service: string;
}

const HISTOGRAM_MS_BUCKETS = [50, 100, 200, 400, 1000, 2 * 1000, 4 * 1000];

/**
 * A wrapper around the promjs registry to manage registering and publishing metrics
 */
export class MetricsRegistry {
	registry: RegistryType;

	asyncRetriesTotal: CounterType;
	directoryCacheMissTotal: CounterType;
	erroredRequestsTotal: CounterType;
	issuanceKeyErrorTotal: CounterType;
	issuanceRequestTotal: CounterType;
	lastRotationTimestamp: CounterType;
	keyClearTotal: CounterType;
	requestsDurationMs: HistogramType;
	requestsTotal: CounterType;
	r2RequestsDurationMs: HistogramType;
	signedTokenTotal: CounterType;
	cacheRefreshed: CounterType;
	defaultLabels: {
		env: string;
		service: string;
		version: string;
	};
	wshimOptions?: WshimOptions;

	constructor(env: Bindings, logger: Logger) {
		this.defaultLabels = {
			env: env.ENVIRONMENT,
			service: env.SERVICE,
			version: env.VERSION_METADATA.id ?? RELEASE,
		};
		this.wshimOptions = WshimOptions.init(env, 'prometheus', logger);

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
		this.lastRotationTimestamp = this.create(
			'gauge',
			'last_rotation_timestamp',
			'last time a rotation happened'
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
		this.cacheRefreshed = this.create(
			'counter',
			'cache_refreshed',
			'Number of times the cache has been deemed stale and was refreshed'
		);
	}

	private createCounter(name: string, help?: string): CounterType {
		const counter = this.registry.create('counter', name, help);
		return makeCollectorProxy(counter, this.defaultLabels, COUNTER_FNS);
	}

	private createGauge(name: string, help: string): GaugeType {
		const gauge = this.registry.create('gauge', name, help);
		return makeCollectorProxy(gauge, this.defaultLabels, GAUGE_FNS);
	}

	private createHistogram(name: string, help?: string, histogramBuckets?: number[]): HistogramType {
		const histogram = this.registry.create('histogram', name, help, histogramBuckets);
		return makeCollectorProxy(histogram, this.defaultLabels, HISTOGRAM_FNS);
	}

	private create(type: 'counter', name: string, help: string): CounterType;
	private create(type: 'gauge', name: string, help: string): CounterType;
	private create(
		type: 'histogram',
		name: string,
		help: string,
		histogramBuckets?: number[]
	): HistogramType;
	private create(
		type: CollectorType,
		name: string,
		help: string,
		histogramBuckets?: number[]
	): CounterType | HistogramType {
		switch (type) {
			case 'counter':
				return this.createCounter(name, help);
			case 'gauge':
				return this.createGauge(name, help);
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
		if (this.wshimOptions === undefined) {
			if (this.defaultLabels.service !== 'unit-tests') {
				console.log('metrics flushing is disabled');
			}
			return;
		}

		await this.wshimOptions.flush(this.registry.metrics());
	}
}

const COUNTER_FNS: CollectorFns<CounterType> = makeCollectorFns<CounterType>()(
	'reset',
	'get',
	'inc',
	'collect'
)('set', 'add');

const GAUGE_FNS: CollectorFns<GaugeType> = makeCollectorFns<GaugeType>()(
	...COUNTER_FNS.unary,
	'dec'
)(...COUNTER_FNS.binary, 'sub');

const HISTOGRAM_FNS: CollectorFns<HistogramType> = makeCollectorFns<HistogramType>()(
	'collect',
	'get',
	'reset'
)('set', 'observe');

// Creates a collector proxy which always includes the defaultLabels along with the passed in labels
function makeCollectorProxy<T extends object>(
	collector: T,
	defaultLabels: Record<string, string>,
	fns: CollectorFns<T>
): T {
	return new Proxy(collector, {
		get(target, prop, receiver) {
			if ((fns.unary as string[]).includes(prop.toString())) {
				return function (labels?: Labels) {
					const mergedLabels = { ...defaultLabels, ...labels };
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return (Reflect.get(target, prop, receiver) as any)?.call(target, mergedLabels);
				};
			}
			if ((fns.binary as string[]).includes(prop.toString())) {
				return function (value: number, labels?: Labels) {
					const mergedLabels = { ...defaultLabels, ...labels };
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return (Reflect.get(target, prop, receiver) as any)?.call(target, value, mergedLabels);
				};
			}
			return Reflect.get(target, prop, receiver);
		},
	});
}

// Type magic used to guarantee we create type safe and exaustive object
// proxies for the metric collectors types.
//
// Collector types are: Counter, Gauge and Histogram

// The functions of a collector we want to proxy.
type CollectorFns<T> = {
	// functions that take only labels.
	unary: FunctionsOfArity<T, 1>[];
	// functions that a value along with labels.
	binary: FunctionsOfArity<T, 2>[];
};

// Extract the last element of a tuple
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

// Checks Arity (N) AND Last Argument (Labels)
type FunctionsOfArity<T, N extends number> = {
	[K in keyof T]-?: T[K] extends (...args: never[]) => unknown
		? Required<Parameters<T[K]>>['length'] extends N // Check 1: Exact Arity
			? Last<Parameters<T[K]>> extends Labels // Check 2: Last Arg is Labels
				? K
				: never
			: never
		: never;
}[keyof T];

/**
 * Instantiates `CollectorFns` object guaranteeing that it contains every function
 * exposed by the original T
 */
function makeCollectorFns<T extends object>() {
	type A1 = FunctionsOfArity<T, 1>;
	type A2 = FunctionsOfArity<T, 2>;

	// resolves to never when Params does not contain every value in Set
	type IsExaustive<Set, Params extends unknown[]> =
		Exclude<Set, Params[number]> extends never
			? unknown
			: ['Error: Missing keys', Exclude<Set, Params[number]>];

	// builder like sequence of functions that require it's parameters to be
	// exactly the unary and binary functions of the collector
	return <Unary extends A1[]>(...unary: Unary & IsExaustive<A1, Unary>) => {
		return <Binary extends A2[]>(...binary: Binary & IsExaustive<A2, Binary>) => {
			return { unary, binary };
		};
	};
}
