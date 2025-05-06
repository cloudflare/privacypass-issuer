// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />

import { Bindings } from './bindings';
import { Context } from './context';
import { Router } from './router';
import {
	BadTokenKeyRequestedError,
	HeaderNotDefinedError,
	InternalCacheError,
	InvalidTokenTypeError,
	InvalidBatchedTokenTypeError,
	InvalidContentTypeError,
	MismatchedTokenKeyIDError,
	handleError,
	HTTPError,
} from './errors';
import { IssuerConfigurationResponse, TokenType } from './types';
import { b64ToB64URL, b64Tou8, b64URLtoB64, u8ToB64 } from './utils/base64';
import {
	MediaType,
	PRIVATE_TOKEN_ISSUER_DIRECTORY,
	TOKEN_TYPES,
	publicVerif,
	arbitraryBatched,
	util,
} from '@cloudflare/privacypass-ts';
import { KeyError } from './context/metrics';
import { hexEncode } from './utils/hex';
import {
	DIRECTORY_CACHE_REQUEST,
	InMemoryCryptoKeyCache,
	clearDirectoryCache,
	getDirectoryCache,
} from './cache';
const { BlindRSAMode, Issuer, TokenRequest } = publicVerif;
const { BatchedTokenRequest, BatchedTokenResponse, Issuer: BatchedTokensIssuer } = arbitraryBatched;
import { shouldRotateKey } from './utils/keyRotation';

import { shouldClearKey } from './utils/keyRotation';
import { WorkerEntrypoint } from 'cloudflare:workers';

import { BaseRpcOptions, IssueOptions } from './types';

const keyToTokenKeyID = async (key: Uint8Array): Promise<number> => {
	const hash = await crypto.subtle.digest('SHA-256', key);
	const u8 = new Uint8Array(hash);
	return u8[u8.length - 1];
};

interface StorageMetadata extends Record<string, string> {
	notBefore: string;
	publicKey: string;
	tokenKeyID: string;
}

interface BlindRSAKeyPairWithMetadata {
	sk: CryptoKey;
	pk: CryptoKey;
	notBefore: number;
}

/**
 * The response returned by the `issue()` function.
 *
 * The `notBefore` field is temporarily included to allow the
 * calculation of the expiration date.
 */
export interface IssueResponse {
	serialized: Uint8Array;
	status: number;
	responseContentType: string;
	notBefore?: number;
}

export const issue = async (
	ctx: Context,
	buffer: ArrayBuffer,
	domain: string,
	contentType: string
): Promise<IssueResponse> => {
	switch (contentType) {
		case MediaType.PRIVATE_TOKEN_REQUEST: {
			return await handleSingleTokenRequest(ctx, buffer, domain);
		}
		case MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST: {
			return await handleBatchedTokenRequest(ctx, buffer, domain);
		}
		default:
			throw new InvalidContentTypeError(`Invalid content type: ${contentType}`);
	}
};

export const handleTokenRequest = async (ctx: Context, request: Request): Promise<Response> => {
	const contentType = request.headers.get('content-type');
	if (!contentType) {
		throw new HeaderNotDefinedError('"Content-Type" must be defined');
	}

	const domain = new URL(request.url).host;
	const buffer = await request.arrayBuffer();

	const result = await issue(ctx, buffer, domain, contentType);

	return new Response(result.serialized, {
		status: result.status ?? 200,
		headers: {
			'Content-Type': result.responseContentType,
			'Content-Length': result.serialized.length.toString(),
		},
	});
};

export const handleSingleTokenRequest = async (
	ctx: Context,
	buffer: ArrayBuffer,
	domain: string
): Promise<IssueResponse> => {
	// Deserialize and process the token request.
	const tokenRequest = TokenRequest.deserialize(TOKEN_TYPES.BLIND_RSA, new Uint8Array(buffer));
	if (tokenRequest.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
		throw new InvalidTokenTypeError();
	}
	const keyID = tokenRequest.truncatedTokenKeyId;
	const { sk, pk } = await getBlindRSAKeyPair(ctx, keyID);
	const issuer = new Issuer(BlindRSAMode.PSS, domain, sk, pk, { supportsRSARAW: true });
	const signedToken = await issuer.issue(tokenRequest);

	ctx.metrics.issuanceRequestTotal.inc({ version: ctx.env.VERSION_METADATA.id ?? RELEASE });
	ctx.metrics.signedTokenTotal.inc({ key_id: keyID });

	return {
		serialized: signedToken.serialize(),
		status: 200,
		responseContentType: MediaType.PRIVATE_TOKEN_RESPONSE,
	};
};

export const handleBatchedTokenRequest = async (
	ctx: Context,
	buffer: ArrayBuffer,
	domain: string
): Promise<IssueResponse> => {
	// Deserialize the batched token request.
	const batchedTokenRequest = BatchedTokenRequest.deserialize(new Uint8Array(buffer));
	if (batchedTokenRequest.tokenRequests.length === 0) {
		const responseBytes = new BatchedTokenResponse([]).serialize();
		return {
			serialized: responseBytes,
			status: 200,
			responseContentType: MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
			// notBefore may not be relevant if there are no tokens but could be set to a default value if needed.
		};
	}

	const keyID = batchedTokenRequest.tokenRequests[0].truncatedTokenKeyId;

	// Validate each token request in the batch.
	for (const tokenReq of batchedTokenRequest.tokenRequests) {
		if (tokenReq.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
			throw new InvalidBatchedTokenTypeError();
		}
		if (tokenReq.truncatedTokenKeyId !== keyID) {
			throw new MismatchedTokenKeyIDError();
		}
	}

	const { sk, pk, notBefore } = await getBlindRSAKeyPair(ctx, keyID);
	const issuer = new Issuer(BlindRSAMode.PSS, domain, sk, pk, { supportsRSARAW: true });
	const batchedTokenIssuer = new BatchedTokensIssuer(issuer);
	const batchedTokenResponse = await batchedTokenIssuer.issue(batchedTokenRequest);
	const responseBytes = batchedTokenResponse.serialize();

	// Set status code based on whether any token response is null.
	const partial = batchedTokenResponse.tokenResponses.some(resp => resp.tokenResponse === null);
	const status = partial ? 206 : 200;

	return {
		serialized: responseBytes,
		status,
		responseContentType: MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
		notBefore,
	};
};

const getBlindRSAKeyPair = async (
	ctx: Context,
	keyID: number
): Promise<BlindRSAKeyPairWithMetadata> => {
	const key = await ctx.bucket.ISSUANCE_KEYS.get(keyID.toString());

	if (key === null) {
		ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.NOT_FOUND });
		throw new BadTokenKeyRequestedError();
	}

	// Temporarily return notBefore, this allows to calculate the expiration date
	const metadata = (key.customMetadata as StorageMetadata) || undefined;
	const notBefore = parseInt(metadata?.notBefore ?? Math.floor(Date.now() / 1000).toString(), 10);

	const CRYPTO_KEY_EXPIRATION_IN_MS = 300_000; // 5min
	const cryptoKeyCache = new InMemoryCryptoKeyCache(ctx);

	const sk = await cryptoKeyCache.read(`sk-${keyID}`, async keyID => {
		const privateKey = key.data;
		if (privateKey === undefined) {
			ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.MISSING_PRIVATE_KEY });
			throw new BadTokenKeyRequestedError('No private key found for the requested key id');
		}
		let sk: CryptoKey;
		try {
			sk = await crypto.subtle.importKey(
				'pkcs8',
				privateKey,
				{
					name: ctx.isTest() ? 'RSA-PSS' : 'RSA-RAW',
					hash: 'SHA-384',
					length: 2048,
				},
				true,
				['sign']
			);
			return {
				value: sk,
				expiration: new Date(Date.now() + CRYPTO_KEY_EXPIRATION_IN_MS),
			};
		} catch (e) {
			ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.INVALID_PRIVATE_KEY });
			throw new BadTokenKeyRequestedError('Invalid private key format');
		}
	});
	const pk = await cryptoKeyCache.read(`pk-${keyID}`, async keyID => {
		const pkEnc = key?.customMetadata?.publicKey;
		if (!pkEnc) {
			ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.MISSING_PUBLIC_KEY });
			throw new BadTokenKeyRequestedError('No public key found for the requested key id');
		}
		try {
			const pk = await crypto.subtle.importKey(
				'spki',
				util.convertRSASSAPSSToEnc(b64Tou8(b64URLtoB64(pkEnc))),
				{ name: 'RSA-PSS', hash: 'SHA-384' },
				true,
				['verify']
			);
			return {
				value: pk,
				expiration: new Date(Date.now() + CRYPTO_KEY_EXPIRATION_IN_MS),
			};
		} catch (e) {
			ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.INVALID_PUBLIC_KEY });
			throw new BadTokenKeyRequestedError('Invalid public key format');
		}
	});

	return { sk, pk, notBefore };
};

export const handleHeadTokenDirectory = async (ctx: Context, request: Request) => {
	const getResponse = await handleTokenDirectory(ctx, request);

	return new Response(undefined, {
		status: getResponse.status,
		headers: getResponse.headers,
	});
};

export const handleTokenDirectory = async (ctx: Context, request: Request) => {
	const cache = await getDirectoryCache();
	let cachedResponse: Response | undefined;
	try {
		cachedResponse = await cache.match(DIRECTORY_CACHE_REQUEST(ctx.hostname, ctx.prefix));
	} catch (e: unknown) {
		const err = e as Error;
		throw new InternalCacheError(err.message);
	}
	if (cachedResponse) {
		if (request.headers.get('if-none-match') === cachedResponse.headers.get('etag')) {
			return new Response(undefined, {
				status: 304,
				headers: cachedResponse.headers,
			});
		}
		return cachedResponse;
	}
	ctx.metrics.directoryCacheMissTotal.inc();

	const keyList = await ctx.bucket.ISSUANCE_KEYS.list({ include: ['customMetadata'] });

	if (keyList.objects.length === 0) {
		throw new Error('Issuer not initialised');
	}

	// there is no reason for an auditor to continue serving keys beyond the minimum requirement
	const freshestKeyCount = Number.parseInt(ctx.env.MINIMUM_FRESHEST_KEYS);
	const keys = keyList.objects
		.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime())
		.slice(0, freshestKeyCount);

	const directory: IssuerConfigurationResponse = {
		'issuer-request-uri': '/token-request',
		'token-keys': keys.map(key => ({
			'token-type': TokenType.BlindRSA,
			'token-key': (key.customMetadata as StorageMetadata).publicKey,
			'not-before': Number.parseInt(
				(key.customMetadata as StorageMetadata).notBefore ??
					(new Date(key.uploaded).getTime() / 1000).toFixed(0)
			),
		})),
	};

	const body = JSON.stringify(directory);
	const digest = new Uint8Array(
		await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))
	);
	const etag = `"${hexEncode(digest)}"`;

	const response = new Response(body, {
		headers: {
			'content-type': MediaType.PRIVATE_TOKEN_ISSUER_DIRECTORY,
			'cache-control': `public, max-age=${ctx.env.DIRECTORY_CACHE_MAX_AGE_SECONDS}`,
			'content-length': body.length.toString(),
			'date': new Date().toUTCString(),
			etag,
		},
	});
	const toCacheResponse = response.clone();
	// directory cache time within worker should be between 70% and 100% of browser cache time
	const cacheTime = Math.floor(
		Number.parseInt(ctx.env.DIRECTORY_CACHE_MAX_AGE_SECONDS) * (0.7 + 0.3 * Math.random())
	).toFixed(0);
	toCacheResponse.headers.set('cache-control', `public, max-age=${cacheTime}`);
	ctx.waitUntil(cache.put(DIRECTORY_CACHE_REQUEST(ctx.hostname, ctx.prefix), toCacheResponse));

	return response;
};

const rotateKey = async (ctx: Context): Promise<Uint8Array> => {
	ctx.metrics.keyRotationTotal.inc();

	// Generate a new type 2 Issuer key
	let rsaSsaPssPublicKey: Uint8Array;
	let tokenKeyID: number;
	let privateKey: ArrayBuffer;
	do {
		const keypair = (await crypto.subtle.generateKey(
			{
				name: 'RSA-PSS',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: { name: 'SHA-384' },
			},
			true,
			['sign', 'verify']
		)) as CryptoKeyPair;
		const publicKey = new Uint8Array(
			(await crypto.subtle.exportKey('spki', keypair.publicKey)) as ArrayBuffer
		);
		rsaSsaPssPublicKey = util.convertEncToRSASSAPSS(publicKey);
		tokenKeyID = await keyToTokenKeyID(rsaSsaPssPublicKey);
		privateKey = (await crypto.subtle.exportKey('pkcs8', keypair.privateKey)) as ArrayBuffer;
		// The bellow condition ensure there is no collision between truncated_token_key_id provided by the issuer
		// This is a 1/256 with 2 keys, and 256/256 chances with 256 keys. This means an issuer cannot have more than 256 keys at the same time.
		// Otherwise, this loop is going to be infinite. With 255 keys, this iteration might take a while.
	} while ((await ctx.bucket.ISSUANCE_KEYS.head(tokenKeyID.toString())) !== null);

	const metadata: StorageMetadata = {
		notBefore: ((Date.now() + Number.parseInt(ctx.env.KEY_NOT_BEFORE_DELAY_IN_MS)) / 1000).toFixed(
			0
		), // the spec mandates to use seconds
		publicKey: b64ToB64URL(u8ToB64(rsaSsaPssPublicKey)),
		tokenKeyID: tokenKeyID.toString(),
	};

	await ctx.bucket.ISSUANCE_KEYS.put(tokenKeyID.toString(), privateKey, {
		customMetadata: metadata,
	});

	ctx.waitUntil(clearDirectoryCache(ctx));

	ctx.wshimLogger.log(`Key rotated successfully, new key ${tokenKeyID}`);

	return rsaSsaPssPublicKey;
};

export const handleRotateKey = async (ctx: Context, _request: Request) => {
	return new Response(`New key ${b64ToB64URL(u8ToB64(await rotateKey(ctx)))}`, { status: 201 });
};

const clearKey = async (ctx: Context): Promise<string[]> => {
	ctx.metrics.keyClearTotal.inc();

	const keys = await ctx.bucket.ISSUANCE_KEYS.list({ shouldUseCache: false });

	if (keys.objects.length === 0) {
		return [];
	}

	const lifespanInMs = Number.parseInt(ctx.env.KEY_LIFESPAN_IN_MS);
	const freshestKeyCount = Number.parseInt(ctx.env.MINIMUM_FRESHEST_KEYS);

	keys.objects.sort((a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime());

	const toDelete: Set<string> = new Set();

	for (let i = 0; i < keys.objects.length; i++) {
		const key = keys.objects[i];
		const notBefore = key.customMetadata?.notBefore;
		let keyNotBefore: Date;
		if (notBefore) {
			keyNotBefore = new Date(Number.parseInt(notBefore) * 1000);
		} else {
			keyNotBefore = new Date(key.uploaded);
		}

		const isFreshest = i < freshestKeyCount;

		if (isFreshest) {
			continue;
		}

		const shouldDelete = shouldClearKey(keyNotBefore, lifespanInMs);

		if (shouldDelete) {
			toDelete.add(key.key);
		}
	}

	const toDeleteArray = [...toDelete];

	if (toDeleteArray.length > 0) {
		ctx.wshimLogger.log(`\nKeys cleared: ${toDeleteArray.join('\n')}`);
	} else {
		ctx.wshimLogger.log('\nNo keys were cleared.');
	}

	while (toDeleteArray.length > 0) {
		await ctx.bucket.ISSUANCE_KEYS.delete(toDeleteArray.splice(0, 1000));
	}
	ctx.waitUntil(clearDirectoryCache(ctx));

	return toDeleteArray;
};

export const handleClearKey = async (ctx: Context, _request: Request) => {
	const deletedKeys = await clearKey(ctx);
	if (deletedKeys.length === 0) {
		return new Response('No keys to clear', { status: 201 });
	} else {
		return new Response(`Keys cleared: ${deletedKeys.join('\n')}`, { status: 201 });
	}
};

export class IssuerHandler extends WorkerEntrypoint<Bindings> {
	private context(url: string, prefix?: string): Context {
		const env = this.env;
		const ectx = this.ctx;

		const sample = new Request(url);
		return Router.buildContext(sample, env, ectx, prefix);
	}

	async fetch(request: Request): Promise<Response> {
		const router = new Router();

		router
			.get(PRIVATE_TOKEN_ISSUER_DIRECTORY, handleTokenDirectory)
			.post('/token-request', handleTokenRequest)
			.post('/admin/rotate', handleRotateKey)
			.post('/admin/clear', handleClearKey);

		return router.handle(
			request as Request<Bindings, IncomingRequestCfProperties<unknown>>,
			this.env,
			this.ctx
		);
	}

	async tokenDirectory(opts: BaseRpcOptions): Promise<Response> {
		return this.withMetrics(opts, ctx =>
			handleTokenDirectory(ctx, new Request(opts.serviceInfo.url))
		);
	}

	async issue(opts: IssueOptions): Promise<IssueResponse> {
		return this.withMetrics(opts, ctx =>
			issue(ctx, opts.tokenRequest, new URL(opts.serviceInfo.url).host, opts.contentType)
		);
	}

	async rotateKey(opts: BaseRpcOptions): Promise<Uint8Array> {
		return this.withMetrics(opts, ctx => rotateKey(ctx));
	}

	async clearKey(opts: BaseRpcOptions): Promise<string[]> {
		return this.withMetrics(opts, ctx => clearKey(ctx));
	}

	private async withMetrics<T>(opts: BaseRpcOptions, fn: (ctx: Context) => Promise<T>): Promise<T> {
		const { prefix, serviceInfo, op } = opts;
		const hostname = new URL(serviceInfo.url).hostname;
		const ctx = this.context(serviceInfo.url, prefix);
		const route = serviceInfo?.route ?? `/${op}`;
		ctx.serviceInfo = serviceInfo;

		const start = ctx.performance.now();
		try {
			return await fn(ctx);
		} catch (e: unknown) {
			const err = e as Error;
			const status = e instanceof HTTPError ? e.status : 500;
			await handleError(ctx, err, { path: route, hostname, status });
			throw e;
		} finally {
			const labels = { path: route, hostname };
			const duration = ctx.performance.now() - start;

			ctx.metrics.requestsTotal.inc(labels);
			ctx.metrics.requestsDurationMs.observe(duration, labels);
			ctx.waitUntil(ctx.postProcessing());
		}
	}
}

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
		const issuerHandler = new IssuerHandler(ctx, env);
		return issuerHandler.fetch(request);
	},

	async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
		const sampleRequest = new Request(`https://schedule.example.com`);

		const context = Router.buildContext(sampleRequest, env, ctx);
		const date = new Date(event.scheduledTime);

		if (shouldRotateKey(date, env)) {
			await handleRotateKey(context, sampleRequest);
		} else {
			await handleClearKey(context, sampleRequest);
		}
	},
};
