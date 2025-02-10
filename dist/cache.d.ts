/// <reference types="@cloudflare/workers-types" />
import { R2HTTPMetadata, R2ListOptions } from '@cloudflare/workers-types/2023-07-01';
import { Context } from './context';
export declare const getDirectoryCache: () => Promise<Cache>;
export declare const DIRECTORY_CACHE_REQUEST: (hostname: string) => Request<unknown, CfProperties<unknown>>;
export declare const clearDirectoryCache: (ctx: Context) => Promise<boolean>;
export type CacheElement<T> = {
    value: T;
    expiration: Date;
};
interface ReadableCache {
    read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}
export declare const STALE_WHILE_REVALIDATE_IN_MS = 30000;
export declare function shouldRevalidate(expirationDate: Date): boolean;
export declare class InMemoryCryptoKeyCache {
    private ctx;
    private static store;
    constructor(ctx: Context);
    read(key: string, setValFn: (key: string) => Promise<CacheElement<CryptoKey>>): Promise<CryptoKey>;
}
export declare class InMemoryCache implements ReadableCache {
    private ctx;
    private static store;
    constructor(ctx: Context);
    read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}
export declare class APICache implements ReadableCache {
    private ctx;
    private cacheKey;
    constructor(ctx: Context, cacheKey: string);
    read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}
export declare class CascadingCache implements ReadableCache {
    private caches;
    constructor(...caches: ReadableCache[]);
    read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}
export declare const DEFAULT_R2_BUCKET_CACHE_TTL_IN_MS: number;
export declare class CachedR2Object {
    data?: Uint8Array | undefined;
    checksums: R2Checksums;
    customMetadata?: Record<string, string>;
    etag: string;
    httpEtag: string;
    httpMetadata?: R2HTTPMetadata;
    key: string;
    size: number;
    uploaded: Date;
    version: string;
    constructor(object: R2Object, data?: Uint8Array | undefined);
}
export declare class CachedR2Objects {
    delimitedPrefixes: string[];
    objects: CachedR2Object[];
    truncated: boolean;
    constructor(objects: R2Objects);
}
export interface CachedR2BucketOptions {
    shouldUseCache?: boolean;
}
export declare class CachedR2Bucket {
    private ctx;
    private cache;
    private ttl_in_ms;
    private bucket;
    constructor(ctx: Context, bucket: R2Bucket, cache: ReadableCache, ttl_in_ms?: number);
    private shouldUseCache;
    head(key: string, options?: CachedR2BucketOptions): Promise<CachedR2Object | null>;
    list(options?: R2ListOptions & CachedR2BucketOptions): Promise<CachedR2Objects>;
    get(key: string, options?: R2GetOptions & CachedR2BucketOptions): Promise<CachedR2Object | null>;
    put(...args: Parameters<typeof R2Bucket.prototype.put>): ReturnType<typeof R2Bucket.prototype.put>;
    delete(...args: Parameters<typeof R2Bucket.prototype.delete>): ReturnType<typeof R2Bucket.prototype.delete>;
}
export {};
