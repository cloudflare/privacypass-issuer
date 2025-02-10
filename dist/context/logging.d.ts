/// <reference types="@cloudflare/workers-types" />
import type { Context } from 'toucan-js/dist/types';
import { Toucan } from 'toucan-js';
import { Breadcrumb } from '@sentry/types';
import { Bindings } from '../bindings';
export interface Logger {
    captureException(err: Error): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    setTag(key: string, value: string): void;
    setSampleRate(sampleRate: number): void;
    info(category: string, message: string, data?: {
        [key: string]: any;
    }): void;
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
export declare class FlexibleLogger implements Logger {
    logger: Logger;
    constructor(environment: string, options: SentryOptions);
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    captureException(e: Error): void;
    setTag(key: string, value: string): void;
    setSampleRate(sampleRate: number): void;
    info(category: string, message: string, data?: {
        [key: string]: any;
    }): void;
}
export declare class SentryLogger implements Logger {
    sentry: Toucan;
    context: Context;
    request: Request;
    environment: string;
    service: string;
    sampleRate: number;
    constructor(environment: string, options: SentryOptions);
    setTag(key: string, value: string): void;
    setSampleRate(sampleRate: number): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    captureException(err: Error): void;
    info(category: string, message: string, data?: {
        [key: string]: any;
    }): void;
}
export declare class ConsoleLogger implements Logger {
    captureException(err: Error): void;
    setTag(key: string, value: string): void;
    setSampleRate(sampleRate: number): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    info(category: string, message: string, data?: {
        [key: string]: any;
    }): void;
}
export declare class VoidLogger implements Logger {
    setTag(key: string, value: string): void;
    setSampleRate(sampleRate: number): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    captureException(e: Error): void;
    info(category: string, message: string, data?: {
        [key: string]: any;
    }): void;
}
export declare class WshimLogger {
    private request;
    private env;
    private logs;
    private serviceToken;
    private sampleRate;
    private fetcher;
    private loggingEndpoint;
    constructor(request: Request, env: Bindings, sampleRate?: number);
    private shouldLog;
    private defaultFields;
    log(...msg: unknown[]): void;
    error(...msg: unknown[]): void;
    flushLogs(): Promise<void>;
}
export {};
