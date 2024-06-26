import { CounterType, Labels, RegistryType } from 'promjs';
import { Registry } from 'promjs/registry';
import { Bindings } from '../bindings';
export const METRICS_ENDPOINT = 'https://workers-logging.cfdata.org/prometheus';

export const KeyError = {
	NOT_FOUND: 'not-found',
	INVALID_PRIVATE_KEY: 'invalid-private-key',
	MISSING_PRIVATE_KEY: 'missing-private-key',
	MISSING_PUBLIC_KEY: 'missing-public-key',
};

export interface RegistryOptions {
	bearerToken?: string;
}

export interface DefaultLabels {
	env: string;
	service: string;
}

/**
 * A wrapper around the promjs registry to manage registering and publishing metrics
 */
export class MetricsRegistry {
	env: Bindings;

	options: RegistryOptions;
	registry: RegistryType;

	directoryCacheMissTotal: CounterType;
	erroredRequestsTotal: CounterType;
	issuanceKeyErrorTotal: CounterType;
	issuanceRequestTotal: CounterType;
	keyRotationTotal: CounterType;
	keyClearTotal: CounterType;
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
		this.requestsTotal = this.create('counter', 'requests_total', 'total requests');
		this.signedTokenTotal = this.create(
			'counter',
			'signed_token_total',
			'Number of issued signed private tokens.'
		);
		this.r2RequestsTotal = this.create('counter', 'r2_requests_total', 'Number of accesses to R2');
	}

	private create(type: 'counter', name: string, help?: string): CounterType {
		const counter = this.registry.create(type, name, help);
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
