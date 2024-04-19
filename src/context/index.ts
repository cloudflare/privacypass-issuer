import { Bindings } from '../bindings';
import { APICache, CachedR2Bucket, InMemoryCache, CascadingCache } from '../cache';
import { Logger } from './logging';
import { MetricsRegistry } from './metrics';

export type WaitUntilFunc = (p: Promise<unknown>) => void;

export class Context {
	private promises: Promise<unknown>[] = [];
	public cache: { ISSUANCE_KEYS: CachedR2Bucket };

	constructor(
		public env: Bindings,
		private _waitUntil: WaitUntilFunc,
		public logger: Logger,
		public metrics: MetricsRegistry
	) {
		const cache = new CascadingCache(new InMemoryCache(), new APICache('r2/issuance_keys'));
		this.cache = {
			ISSUANCE_KEYS: new CachedR2Bucket(this, env.ISSUANCE_KEYS, cache),
		};
	}

	isTest(): boolean {
		return RELEASE === 'test';
	}

	/**
	 * Registers async tasks with the runtime, tracks them internally and adds error reporting for uncaught exceptions
	 * @param p - Promise for the async task to track
	 */
	waitUntil(p: Promise<unknown>): void {
		// inform runtime of async task
		this._waitUntil(p);
		this.promises.push(
			p.catch((e: Error) => {
				console.log(e.message);
			})
		);
	}

	/**
	 * Waits for promises to complete in the order that they were registered.
	 *
	 * @remark
	 * It is important to wait for the promises in the array to complete sequentially since new promises created by async tasks may be added to the end of the array while this function runs.
	 */
	async waitForPromises(): Promise<void> {
		for (let i = 0; i < this.promises.length; i++) {
			try {
				await this.promises[i];
			} catch (e) {
				console.log(e);
			}
		}
	}
}
