import { Bindings } from '../src/bindings';
import { Context, WaitUntilFunc } from '../src/context';
import { ConsoleLogger, Logger } from '../src/context/logging';
import { MetricsRegistry } from '../src/context/metrics';

export class ExecutionContextMock implements ExecutionContext {
	waitUntils: Promise<any>[] = [];
	passThrough = false;

	waitUntil(promise: Promise<any>): void {
		this.waitUntils.push(promise);
	}
	passThroughOnException(): void {
		this.passThrough = true;
	}
}

export const getEnv = (): Bindings => getMiniflareBindings();

export interface MockContextOptions {
	env: Bindings;
	ectx: ExecutionContext;
	logger?: Logger;
	metrics?: MetricsRegistry;
	waitUntilFunc?: WaitUntilFunc;
}

export const getContext = (options: MockContextOptions): Context => {
	const logger = options.logger ?? new ConsoleLogger();
	const metrics = options.metrics ?? new MetricsRegistry({});
	const waitUntilFunc = options.waitUntilFunc || options.ectx.waitUntil.bind(options.ectx);
	return new Context(options.env, waitUntilFunc, logger, metrics);
};
