// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { R2HTTPMetadata, R2ListOptions } from '@cloudflare/workers-types/2023-07-01';
import { Context } from './context';
import { b64Tou8, u8ToB64 } from './utils/base64';
import { PRIVATE_TOKEN_ISSUER_DIRECTORY } from '@cloudflare/privacypass-ts';

export const getDirectoryCache = async (): Promise<Cache> => {
	return caches.open('response/issuer-directory');
};

export const DIRECTORY_CACHE_REQUEST = (hostname: string) =>
	new Request(`https://${hostname}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);

export const clearDirectoryCache = async (ctx: Context): Promise<boolean> => {
	const cache = await getDirectoryCache();
	return cache.delete(DIRECTORY_CACHE_REQUEST(ctx.hostname));
};

export type CacheElement<T> = { value: T; expiration: Date };

interface ReadableCache {
	read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T>;
}

// This serialization is primitive, and can be optimized further if need be.
const serialize = <T>(value: T): string => {
	return JSON.stringify(value, (_key, value) => {
		if (value instanceof Uint8Array) {
			return `u8-${u8ToB64(value)}`;
		}
		if (value instanceof Date) {
			return `date-${value.toJSON()}`;
		}
		if (typeof value === 'string') {
			if (value.startsWith('u8-') || value.startsWith('date-')) {
				throw new Error('serialization error');
			}
		}
		return value;
	});
};

const deserialize = <T>(value: string): T => {
	return JSON.parse(value, (_key, value) => {
		if (!value) {
			return value;
		}
		if (value.startsWith && value.startsWith('u8-')) {
			return b64Tou8(value.slice('u8-'.length));
		}
		if (value.startsWith && value.startsWith('date-')) {
			return new Date(value.slice('date-'.length));
		}
		return value;
	});
};

export const STALE_WHILE_REVALIDATE_IN_MS = 30_000;

// Helper function to smooth cache revalidation
// It limits the thundering herd problem when cache expires
// The maximum cache staleness is defined as 30s via STALE_WHILE_REVALIDATE_IN_MS
// During the revalidation window, the closest a request time is to cache expiration, the higher revalidation probability
// dev: An alternative to probalistic stale-while-revalidate is to use a lock, or possibly a rate limit rules
// dev: None of these features are stable in Cloudflare Workers
// dev2: Somehow there is a paper describing the optimal way to do early expiration, which is similar to stale while revalidate
// dev2: The paper uses exp(x) intead of 2^x, which is the same with a different beta
// dev2: https://cseweb.ucsd.edu//~avattani/papers/cache_stampede.pdf
export function shouldRevalidate(expirationDate: Date): boolean {
	const now = Date.now();
	const expiration = expirationDate.getTime();

	const timeSinceExpiration = now - expiration;
	// Content has not expired
	if (timeSinceExpiration <= 0) {
		return false;
	}
	// Content should not be served even if stale
	if (timeSinceExpiration >= STALE_WHILE_REVALIDATE_IN_MS) {
		return true;
	}

	// Floor reduces the number of possible values for timeSinceExpirationWholeSeconds to 30
	// dev: performance is gained by pre-computing probabilityThreshold possible values
	// Regenerate PRECOMPUTED_PROBABILITY_THESHOLD:
	// const REVALIDATION_STEEPNESS = 1
	// const STALE_WHILE_REVALIDATE_IN_MS = 30_000
	// [...Array(STALE_WHILE_REVALIDATE_IN_MS/1000).keys()].map((t) => Math.pow(2, -REVALIDATION_STEEPNESS*(STALE_WHILE_REVALIDATE_IN_MS/1000-t)))
	const PRECOMPUTED_PROBABILITY_THESHOLD = [
		9.313225746154785e-10, 1.862645149230957e-9, 3.725290298461914e-9, 7.450580596923828e-9,
		1.490116119384765e-8, 2.980232238769531e-8, 5.960464477539063e-8, 1.192092895507812e-7,
		2.384185791015625e-7, 4.76837158203125e-7, 9.5367431640625e-7, 0.0000019073486328125,
		0.000003814697265625, 0.00000762939453125, 0.0000152587890625, 0.000030517578125,
		0.00006103515625, 0.0001220703125, 0.000244140625, 0.00048828125, 0.0009765625, 0.001953125,
		0.00390625, 0.0078125, 0.015625, 0.03125, 0.0625, 0.125, 0.25, 0.5,
	];
	const timeSinceExpirationWholeSeconds = Math.floor(timeSinceExpiration / 1000);
	const probabilityThreshold = PRECOMPUTED_PROBABILITY_THESHOLD[timeSinceExpirationWholeSeconds];

	return Math.random() < probabilityThreshold;
}

// InMemoryCryptoKeyCache uses workers memory to cache CryptoKey without serialisation
// Note it's up only until the worker is reloaded
// There is no lifetime guarantee
// dev: the use of ctx is to enable stale-while-revalidate like behaviour
export class InMemoryCryptoKeyCache {
	private static store: Map<string, CacheElement<CryptoKey>> = new Map();

	constructor(private ctx: Context) {}

	async read(
		key: string,
		setValFn: (key: string) => Promise<CacheElement<CryptoKey>>
	): Promise<CryptoKey> {
		const refreshCache = async () => {
			const val = await setValFn(key);
			InMemoryCryptoKeyCache.store.set(key, val);
			return val.value;
		};

		const cachedValue = InMemoryCryptoKeyCache.store.get(key);
		if (cachedValue) {
			this.ctx.waitUntil(
				(() => {
					const expiration = new Date(cachedValue.expiration.getTime());
					if (shouldRevalidate(expiration)) {
						this.ctx.wshimLogger.log('InMemoryCache is stale. Revalidating with waitUntil.');
						return refreshCache();
					}
					return Promise.resolve();
				})()
			);
			return cachedValue.value;
		}
		return refreshCache();
	}
}

// InMemoryCache uses workers memory to cache item
// Note it's up only until the worker is reloaded
// There is no lifetime guarantee
// dev: the use of ctx is to enable stale-while-revalidate like behaviour
export class InMemoryCache implements ReadableCache {
	private static store: Map<string, CacheElement<string>> = new Map();

	constructor(private ctx: Context) {}

	async read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T> {
		const refreshCache = async () => {
			const val = await setValFn(key);
			const newCacheValue = { value: serialize(val.value), expiration: val.expiration };
			InMemoryCache.store.set(key, newCacheValue);
			return val.value;
		};

		const cachedValue = InMemoryCache.store.get(key);
		if (cachedValue) {
			this.ctx.waitUntil(
				(() => {
					const expiration = new Date(cachedValue.expiration.getTime());
					if (shouldRevalidate(expiration)) {
						this.ctx.wshimLogger.log('InMemoryCache is stale. Revalidating with waitUntil.');
						return refreshCache();
					}
					return Promise.resolve();
				})()
			);
			return deserialize(cachedValue.value);
		}
		return refreshCache();
	}
}

// APICache uses workers API cache
// This is local to a colo, and does not involve tiered cache or zone configuration, as the worker is the origin
// Lifetime is artifitially extended by 30s to allow for stale-while-revalidate like behaviour
// dev: the use of ctx is to enable stale-while-revalidate like behaviour
export class APICache implements ReadableCache {
	constructor(
		private ctx: Context,
		private cacheKey: string
	) {}

	async read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T> {
		const cache = await caches.open(this.cacheKey);
		const request = new Request(`https://${this.ctx.hostname}/${key}`);
		const refreshCache = async () => {
			const val = await setValFn(key);
			// add an extension to cache time which allow for stale-while-revalidate behaviour
			val.expiration.setTime(val.expiration.getTime() + STALE_WHILE_REVALIDATE_IN_MS);
			await cache.put(
				request,
				new Response(serialize(val.value), {
					headers: {
						'expires': val.expiration.toUTCString(),
						'x-expires': val.expiration.toUTCString(), // somehow `expires` header is modified by cache. Using a distinct header allows the header to be preserved for internal processing
					},
				})
			);
			return val.value;
		};

		const cachedValue = await cache.match(request);
		if (cachedValue) {
			this.ctx.waitUntil(
				(() => {
					const now = Date.now();
					const expirationWithRevalidate = new Date(cachedValue.headers.get('x-expires') ?? now);
					const expiration = new Date(
						expirationWithRevalidate.getTime() - STALE_WHILE_REVALIDATE_IN_MS
					);
					if (shouldRevalidate(expiration)) {
						this.ctx.wshimLogger.log('APICache is stale. Revalidating with waitUntil.');
						return refreshCache();
					}
					return Promise.resolve();
				})()
			);
			const val = await cachedValue.text();
			return deserialize(val);
		}
		return refreshCache();
	}
}

// CascadingCache reads from the first cache, failing back to the second cache
// on cache miss, and so on. A ReadableCache implementation is supposed to cache
// results from later caches to avoid future cache misses.
export class CascadingCache implements ReadableCache {
	private caches: ReadableCache[];
	constructor(...caches: ReadableCache[]) {
		this.caches = caches;
	}

	async read<T>(key: string, setValFn: (key: string) => Promise<CacheElement<T>>): Promise<T> {
		const caches = this.caches;
		const setValFnBuilder = (i: number): ((key: string) => Promise<CacheElement<T>>) => {
			if (i >= caches.length) {
				return setValFn;
			}
			return async (key: string) => ({
				value: await caches[i].read(key, setValFnBuilder(i + 1)),
				expiration: new Date(), // TODO: find a way to use setVal expiration instead
			});
		};
		const cachedValue = await setValFnBuilder(0)(key);
		return cachedValue.value;
	}
}

export const DEFAULT_R2_BUCKET_CACHE_TTL_IN_MS = 5 * 60 * 1000;

export class CachedR2Object {
	public checksums: R2Checksums;
	public customMetadata?: Record<string, string>;
	public etag: string;
	public httpEtag: string;
	public httpMetadata?: R2HTTPMetadata;
	public key: string;
	public size: number;
	public uploaded: Date;
	public version: string;

	constructor(
		object: R2Object,
		public data?: Uint8Array
	) {
		this.checksums = object.checksums;
		this.customMetadata = object.customMetadata;
		this.etag = object.etag;
		this.httpEtag = object.httpEtag;
		this.httpMetadata = object.httpMetadata;
		this.key = object.key;
		this.size = object.size;
		this.uploaded = object.uploaded;
		this.version = object.version;
	}
}

export class CachedR2Objects {
	public delimitedPrefixes: string[];
	public objects: CachedR2Object[];
	public truncated: boolean;

	constructor(objects: R2Objects) {
		this.delimitedPrefixes = objects.delimitedPrefixes;
		this.objects = objects.objects.map(o => new CachedR2Object(o));
		this.truncated = objects.truncated;
	}
}

const R2Method = {
	DELETE: 'delete',
	GET: 'get',
	HEAD: 'head',
	LIST: 'list',
	PUT: 'put',
};
const R2MethodSet = new Set(Object.values(R2Method));

export interface CachedR2BucketOptions {
	shouldUseCache?: boolean;
}

export class CachedR2Bucket {
	private bucket: R2Bucket;
	constructor(
		private ctx: Context,
		bucket: R2Bucket,
		private cache: ReadableCache,
		private ttl_in_ms = DEFAULT_R2_BUCKET_CACHE_TTL_IN_MS
	) {
		this.bucket = new Proxy(bucket, {
			get: (target, prop, receiver) => {
				const method = Reflect.get(target, prop, receiver);
				if (R2MethodSet.has(prop.toString())) {
					const startTime = ctx.performance.now();
					return async function (...args: unknown[]) {
						try {
							return await Reflect.apply(method, target, args);
						} finally {
							const duration = ctx.performance.now() - startTime;
							ctx.metrics.r2RequestsDurationMs.observe(duration, { method: prop.toString() });
						}
					};
				}
				return method;
			},
		});
	}

	private shouldUseCache(options?: CachedR2BucketOptions): boolean {
		return options?.shouldUseCache ?? true;
	}

	// WARNING: key should be lowered than 1024 bytes
	// See https://developers.cloudflare.com/r2/reference/limits/
	head(key: string, options?: CachedR2BucketOptions): Promise<CachedR2Object | null> {
		if (!this.shouldUseCache(options)) {
			return this.bucket.head(key);
		}

		const cacheKey = `head/${key}`;
		return this.cache.read(cacheKey, async () => {
			const object = await this.bucket.head(key);
			if (object === null) {
				return { value: null, expiration: new Date() };
			}
			const value = new CachedR2Object(object);
			return {
				value,
				expiration: new Date(Date.now() + this.ttl_in_ms),
			};
		});
	}

	list(options?: R2ListOptions & CachedR2BucketOptions): Promise<CachedR2Objects> {
		if (!this.shouldUseCache(options)) {
			return this.bucket.list(options);
		}

		const cacheKey = `list/${JSON.stringify(options)}`;
		return this.cache.read(cacheKey, async () => {
			const objects = await this.bucket.list(options);
			const value = new CachedR2Objects(objects);
			return {
				value,
				expiration: new Date(Date.now() + this.ttl_in_ms),
			};
		});
	}

	// WARNING: key should be lowered than 1024 bytes
	// See https://developers.cloudflare.com/r2/reference/limits/
	async get(
		key: string,
		options?: R2GetOptions & CachedR2BucketOptions
	): Promise<CachedR2Object | null> {
		if (!this.shouldUseCache(options)) {
			return this.bucket.get(key, options);
		}

		const cacheKey = `get/${key}`;
		return this.cache.read(cacheKey, async () => {
			const object = await this.bucket.get(key, options);
			if (object === null) {
				return { value: null, expiration: new Date() };
			}
			const value = new CachedR2Object(object, new Uint8Array(await object.arrayBuffer()));
			return {
				value,
				expiration: new Date(Date.now() + this.ttl_in_ms),
			};
		});
	}

	put(
		...args: Parameters<typeof R2Bucket.prototype.put>
	): ReturnType<typeof R2Bucket.prototype.put> {
		return this.bucket.put(...args);
	}

	delete(
		...args: Parameters<typeof R2Bucket.prototype.delete>
	): ReturnType<typeof R2Bucket.prototype.delete> {
		return this.bucket.delete(...args);
	}
}
