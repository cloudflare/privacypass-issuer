/// <reference types="@cloudflare/workers-types" />
import { Bindings } from '../bindings';
import { CachedR2Bucket } from '../cache';
import { Logger, WshimLogger } from './logging';
import { MetricsRegistry } from './metrics';
export type WaitUntilFunc = (p: Promise<unknown>) => void;
export declare class Context {
    env: Bindings;
    private _waitUntil;
    logger: Logger;
    metrics: MetricsRegistry;
    wshimLogger: WshimLogger;
    hostname: string;
    startTime: number;
    private promises;
    bucket: {
        ISSUANCE_KEYS: CachedR2Bucket;
    };
    performance: Performance;
    constructor(request: Request, env: Bindings, _waitUntil: WaitUntilFunc, logger: Logger, metrics: MetricsRegistry, wshimLogger: WshimLogger);
    isTest(): boolean;
    /**
     * Registers async tasks with the runtime, tracks them internally and adds error reporting for uncaught exceptions
     * @param p - Promise for the async task to track
     */
    waitUntil(p: Promise<unknown>): void;
    /**
     * Waits for promises to complete in the order that they were registered.
     *
     * @remark
     * It is important to wait for the promises in the array to complete sequentially since new promises created by async tasks may be added to the end of the array while this function runs.
     */
    waitForPromises(): Promise<void>;
}
