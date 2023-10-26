import { CounterType, RegistryType } from 'promjs';
import { Registry } from 'promjs/registry';
export const METRICS_ENDPOINT = 'https://workers-logging.cfdata.org/prometheus';

export interface RegistryOptions {
	bearerToken?: string;
}

/**
 * A wrapper around the promjs registry to manage registering and publishing metrics
 */
export class MetricsRegistry {
	registry: RegistryType;
	options: RegistryOptions;

	requestsTotal: CounterType;
	erroredRequestsTotal: CounterType;

	constructor(options: RegistryOptions) {
		this.options = options;
		this.registry = new Registry();

		this.requestsTotal = this.registry.create('counter', 'requests_total', 'total requests');
		this.erroredRequestsTotal = this.registry.create(
			'counter',
			'errored_requests_total',
			'Errored requests served to eyeball'
		);
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
