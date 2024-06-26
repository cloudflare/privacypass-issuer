import { CounterType, HistogramType, Labels, RegistryType } from 'promjs';
import { Registry } from 'promjs/registry';
import { Bindings } from '../bindings';
export const METRICS_ENDPOINT = 'https://workers-logging.cfdata.org/prometheus';

export interface RegistryOptions {
	bearerToken?: string;
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

	directoryCacheMissTotal: CounterType;
	erroredRequestsTotal: CounterType;
	issuanceRequestTotal: CounterType;
	keyRotationTotal: CounterType;
	keyClearTotal: CounterType;
	requestsDurationMs: HistogramType;
	requestsTotal: CounterType;
	signedTokenTotal: CounterType;
	r2RequestsTotal: CounterType;

	constructor(env: Bindings, options: RegistryOptions) {
		this.env = env;
		this.options = options;
		this.registry = new Registry();

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
			'request_time_total',
			'Request time',
			HISTOGRAM_MS_BUCKETS
		);
		this.requestsTotal = this.create('counter', 'requests_total', 'total requests');
		this.signedTokenTotal = this.create(
			'counter',
			'signed_token_total',
			'Number of issued signed private tokens.'
		);
		this.r2RequestsTotal = this.create('counter', 'r2_requests_total', 'Number of accesses to R2');
	}

	private createCounter(name: string, help?: string): CounterType {
		const counter = this.registry.create('counter', name, help);
		const defaultLabels: DefaultLabels = { env: this.env.ENVIRONMENT, service: this.env.SERVICE };
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
		const defaultLabels: DefaultLabels = { env: this.env.ENVIRONMENT, service: this.env.SERVICE };
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
		await fetch(METRICS_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.options.bearerToken}`,
			},
			body: this.registry.metrics(),
		});
	}
}
