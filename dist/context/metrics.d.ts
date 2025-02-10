/// <reference types="@cloudflare/workers-types" />
import { CounterType, HistogramType, RegistryType } from 'promjs';
import { Bindings } from '../bindings';
export declare const KeyError: {
    NOT_FOUND: string;
    INVALID_PRIVATE_KEY: string;
    MISSING_PRIVATE_KEY: string;
    MISSING_PUBLIC_KEY: string;
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
/**
 * A wrapper around the promjs registry to manage registering and publishing metrics
 */
export declare class MetricsRegistry {
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
    constructor(env: Bindings);
    private defaultLabels;
    private createCounter;
    private createHistogram;
    private create;
    /**
     * Publishes metrics to the workers metrics API
     * This function is a no-op in test and wrangler environements
     */
    publish(): Promise<void>;
}
export {};
