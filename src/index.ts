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
import { ConsoleLogger, WshimLogger } from './context/logging';
import { KeyError, MetricsRegistry } from './context/metrics';
import { hexEncode } from './utils/hex';
import {
	DIRECTORY_CACHE_REQUEST,
	InMemoryCryptoKeyCache,
	clearDirectoryCache,
	getDirectoryCache,
} from './cache';
const { BlindRSAMode, Issuer, TokenRequest } = publicVerif;
const { BatchedTokenRequest, BatchedTokenResponse, Issuer: BatchedTokensIssuer } = arbitraryBatched;

import { shouldRotateKey, shouldClearKey } from './utils/keyRotation';

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

export const handleTokenRequest = async (ctx: Context, request: Request) => {
	ctx.metrics.issuanceRequestTotal.inc({ version: ctx.env.VERSION_METADATA.id ?? RELEASE });
	const contentType = request.headers.get('content-type');

	if (!contentType) {
		throw new HeaderNotDefinedError('"Content-Type" must be defined');
	}

	switch (contentType) {
		case MediaType.PRIVATE_TOKEN_REQUEST:
			return handleSingleTokenRequest(ctx, request);
		case MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST:
			return handleBatchedTokenRequest(ctx, request);
		default:
			throw new InvalidContentTypeError(`Invalid content type: ${contentType}`);
	}
};

export const handleSingleTokenRequest = async (ctx: Context, request: Request) => {
	ctx.metrics.issuanceRequestTotal.inc({ version: ctx.env.VERSION_METADATA.id ?? RELEASE });
	const buffer = await request.arrayBuffer();
	const tokenRequest = TokenRequest.deserialize(TOKEN_TYPES.BLIND_RSA, new Uint8Array(buffer));

	if (tokenRequest.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
		throw new InvalidTokenTypeError();
	}

	const keyID = tokenRequest.truncatedTokenKeyId;
	const { sk, pk } = await getBlindRSAKeyPair(ctx, keyID);
	const domain = new URL(request.url).host;
	const issuer = new Issuer(BlindRSAMode.PSS, domain, sk, pk, { supportsRSARAW: true });
	const signedToken = await issuer.issue(tokenRequest);
	ctx.metrics.signedTokenTotal.inc({ key_id: keyID });

	// too verbose with workers observability
	// once there is a way to filter logpush based on log level, we can consider re-enabling
	// console.debug(`Token issued successfully for key ${keyID}`);

	return new Response(signedToken.serialize(), {
		headers: { 'content-type': MediaType.PRIVATE_TOKEN_RESPONSE },
	});
};

const handleBatchedTokenRequest = async (ctx: Context, request: Request): Promise<Response> => {
	try {
		// Read request body
		const buffer = await request.arrayBuffer();

		// Deserialize the batched token request
		const batchedTokenRequest = BatchedTokenRequest.deserialize(new Uint8Array(buffer));

		if (batchedTokenRequest.tokenRequests.length === 0) {
			const responseBytes = new BatchedTokenResponse([]).serialize();
			return new Response(responseBytes, {
				headers: { 'Content-Type': MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE },
			});
		}

		// Extract key ID and validate token requests
		const keyID = batchedTokenRequest.tokenRequests[0].truncatedTokenKeyId;

		for (let i = 0; i < batchedTokenRequest.tokenRequests.length; i++) {
			const tokenRequest = batchedTokenRequest.tokenRequests[i];

			if (tokenRequest.tokenType !== TOKEN_TYPES.BLIND_RSA.value) {
				throw new InvalidBatchedTokenTypeError();
			}
			if (tokenRequest.truncatedTokenKeyId !== keyID) {
				throw new MismatchedTokenKeyIDError();
			}
		}

		// Retrieve key pair
		const { sk, pk } = await getBlindRSAKeyPair(ctx, keyID);

		const domain = new URL(request.url).host;
		const issuer = new Issuer(BlindRSAMode.PSS, domain, sk, pk, { supportsRSARAW: true });

		const batchedTokenIssuer = new BatchedTokensIssuer(issuer);
		const batchedTokenResponse = await batchedTokenIssuer.issue(batchedTokenRequest);
		const responseBytes = batchedTokenResponse.serialize();

		// Determine if any token response is empty (null) and set the appropriate status code
		const partial = batchedTokenResponse.tokenResponses.some(resp => resp.tokenResponse === null);
		const status = partial ? 206 : 200;

		return new Response(responseBytes, {
			status,
			headers: {
				'Content-Type': MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
				'Content-Length': responseBytes.length.toString(),
			},
		});
	} catch (error) {
		return new Response('Internal Server Error', { status: 500 });
	}
};

const getBlindRSAKeyPair = async (
	ctx: Context,
	keyID: number
): Promise<{ sk: CryptoKey; pk: CryptoKey }> => {
	const key = await ctx.bucket.ISSUANCE_KEYS.get(keyID.toString());

	if (key === null) {
		ctx.metrics.issuanceKeyErrorTotal.inc({ key_id: keyID, type: KeyError.NOT_FOUND });
		throw new BadTokenKeyRequestedError();
	}

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

	return { sk, pk };
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
		cachedResponse = await cache.match(DIRECTORY_CACHE_REQUEST(ctx.hostname));
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
	ctx.waitUntil(cache.put(DIRECTORY_CACHE_REQUEST(ctx.hostname), toCacheResponse));

	return response;
};

export const handleRotateKey = async (ctx: Context, _request?: Request) => {
	ctx.metrics.keyRotationTotal.inc();

	// Generate a new type 2 Issuer key
	let publicKeyEnc: string;
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
		const rsaSsaPssPublicKey = util.convertEncToRSASSAPSS(publicKey);
		publicKeyEnc = b64ToB64URL(u8ToB64(rsaSsaPssPublicKey));
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
		publicKey: publicKeyEnc,
		tokenKeyID: tokenKeyID.toString(),
	};

	await ctx.bucket.ISSUANCE_KEYS.put(tokenKeyID.toString(), privateKey, {
		customMetadata: metadata,
	});

	ctx.waitUntil(clearDirectoryCache(ctx));

	ctx.wshimLogger.log(`Key rotated successfully, new key ${tokenKeyID}`);

	return new Response(`New key ${publicKeyEnc}`, { status: 201 });
};

export const handleClearKey = async (ctx: Context, _request?: Request) => {
	ctx.metrics.keyClearTotal.inc();

	const keys = await ctx.bucket.ISSUANCE_KEYS.list({ shouldUseCache: false });

	if (keys.objects.length === 0) {
		return new Response('No keys to clear', { status: 201 });
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

	await ctx.bucket.ISSUANCE_KEYS.delete(toDeleteArray);
	ctx.waitUntil(clearDirectoryCache(ctx));

	return new Response(`Keys cleared: ${toDeleteArray.join('\n')}`, { status: 201 });
};

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
		// router defines all API endpoints
		// this ease testing, as test can be performed on specific handler methods, not necessardily e2e
		const router = new Router();

		router
			.get(PRIVATE_TOKEN_ISSUER_DIRECTORY, handleTokenDirectory)
			.post('/token-request', handleTokenRequest)
			.post('/admin/rotate', handleRotateKey)
			.post('/admin/clear', handleClearKey);

		return router.handle(
			request as Request<Bindings, IncomingRequestCfProperties<unknown>>,
			env,
			ctx
		);
	},

	async scheduled(event: ScheduledEvent, env: Bindings, ectx: ExecutionContext) {
		const sampleRequest = new Request(`https://schedule.example.com`);
		const ctx = new Context(
			sampleRequest,
			env,
			ectx.waitUntil.bind(ectx),
			new ConsoleLogger(),
			new MetricsRegistry(env),
			new WshimLogger(sampleRequest, env)
		);
		const date = new Date(event.scheduledTime);

		if (shouldRotateKey(date, env)) {
			await handleRotateKey(ctx);
		} else {
			await handleClearKey(ctx);
		}
	},
};
