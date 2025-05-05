// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { env, ProvidedEnv, createExecutionContext } from 'cloudflare:test';
import { Context } from '../src/context';
import { handleTokenRequest, handleClearKey, default as workerObject } from '../src/index';
import { IssuerConfigurationResponse } from '../src/types';
import { b64ToB64URL, u8ToB64 } from '../src/utils/base64';
import { MockCache, mockDateNow, clearDateMocks, getContext } from './mocks';
import { RSABSSA } from '@cloudflare/blindrsa-ts';
import {
	IssuerConfig,
	MediaType,
	PRIVATE_TOKEN_ISSUER_DIRECTORY,
	publicVerif,
	arbitraryBatched,
	util,
	TokenChallenge,
	TOKEN_TYPES,
} from '@cloudflare/privacypass-ts';
import { getDirectoryCache } from '../src/cache';
import { shouldRotateKey, shouldClearKey } from '../src/utils/keyRotation';
const { TokenRequest, BLIND_RSA } = publicVerif;
const {
	TokenRequest: batchedTokenRequest,
	Client: BatchedTokensClient,
	BatchedTokenResponse,
	BatchedTokenRequest,
} = arbitraryBatched;

const sampleURL = 'http://localhost';

function setupTestContext() {
	return getContext({
		request: new Request(sampleURL),
		env: env,
		ectx: new createExecutionContext(),
	});
}

const keyToTokenKeyID = async (key: Uint8Array): Promise<number> => {
	const hash = await crypto.subtle.digest('SHA-256', key);
	const u8 = new Uint8Array(hash);
	return u8[u8.length - 1];
};

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('challenge handlers', () => {
	let ctx: Context;
	beforeEach(() => {
		ctx = setupTestContext();
	});

	const suite = RSABSSA.SHA384.PSS.Deterministic();

	const tokenRequestURL = `${sampleURL}/token-request`;
	const mockPrivateKey = async (ctx: Context): Promise<CryptoKeyPair> => {
		const keypair = await suite.generateKey({
			publicExponent: Uint8Array.from([1, 0, 1]),
			modulusLength: 2048,
		});

		const publicKeyRaw = await crypto.subtle.exportKey('spki', keypair.publicKey);
		const privateKeyRaw = await crypto.subtle.exportKey('pkcs8', keypair.privateKey);
		const publicKeyBase64 = Buffer.from(new Uint8Array(publicKeyRaw as ArrayBuffer)).toString(
			'base64'
		);
		const privateKeyBase64 = Buffer.from(new Uint8Array(privateKeyRaw as ArrayBuffer)).toString(
			'base64'
		);

		// Convert the raw public key, then derive the key from the converted bytes.
		const publicKeyRawBytes = Uint8Array.from(Buffer.from(publicKeyBase64, 'base64'));
		const convertedPublicKey = util.convertEncToRSASSAPSS(publicKeyRawBytes);
		const tokenKey = await keyToTokenKeyID(convertedPublicKey);

		await ctx.bucket.ISSUANCE_KEYS.put(tokenKey.toString(), privateKeyRaw as ArrayBuffer, {
			customMetadata: { publicKey: publicKeyBase64 },
		});

		return keypair;
	};

	it('should return a Privacy Pass token response when provided with a valid Privacy Pass token request', async () => {
		const msgString = 'Hello World!';
		const message = new TextEncoder().encode(msgString);
		const preparedMsg = suite.prepare(message);
		const { publicKey } = await mockPrivateKey(ctx);
		const { blindedMsg, inv } = await suite.blind(publicKey, preparedMsg);
		const publicKeyExport = new Uint8Array(
			(await crypto.subtle.exportKey('spki', publicKey)) as ArrayBuffer
		);
		const publicKeyConverted = util.convertEncToRSASSAPSS(publicKeyExport);
		const tokenKeyId = await keyToTokenKeyID(publicKeyConverted);

		// note that blindedMsg should be the payload and not the message directly
		const tokenRequest = new TokenRequest(tokenKeyId, blindedMsg, BLIND_RSA);

		const request = new Request(tokenRequestURL, {
			method: 'POST',
			headers: { 'content-type': MediaType.PRIVATE_TOKEN_REQUEST },
			body: tokenRequest.serialize(),
		});

		const response = await handleTokenRequest(ctx, request);

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe(MediaType.PRIVATE_TOKEN_RESPONSE);

		const blindSignature = new Uint8Array(await response.arrayBuffer());
		const signature = await suite.finalize(publicKey, preparedMsg, blindSignature, inv);
		const isValid = await suite.verify(publicKey, signature, preparedMsg);
		expect(isValid).toBe(true);
	});

	it('should return a Privacy Pass token response when provided with a valid batched Privacy Pass token request', async () => {
		const msgString = 'Hello World!';
		const message = new TextEncoder().encode(msgString);
		const preparedMsg = suite.prepare(message);
		const { publicKey } = await mockPrivateKey(ctx);
		const publicKeyExport = new Uint8Array(
			(await crypto.subtle.exportKey('spki', publicKey)) as ArrayBuffer
		);
		const publicKeyConverted = util.convertEncToRSASSAPSS(publicKeyExport);
		const tokenKeyId = await keyToTokenKeyID(publicKeyConverted);

		const nTokens = 2;
		const invs: Uint8Array[] = [];

		const tokReqs = new Array<publicVerif.TokenRequest>(nTokens);
		const batchedTokenReqs = new Array<arbitraryBatched.TokenRequest>(nTokens);

		for (let i = 0; i < nTokens; i++) {
			const { blindedMsg, inv } = await suite.blind(publicKey, preparedMsg);
			tokReqs[i] = new publicVerif.TokenRequest(tokenKeyId, blindedMsg, BLIND_RSA);
			batchedTokenReqs[i] = new arbitraryBatched.TokenRequest(tokReqs[i]);
			invs.push(inv);
		}

		const batchedTokenRequest = new arbitraryBatched.BatchedTokenRequest(batchedTokenReqs);
		const request = new Request(tokenRequestURL, {
			method: 'POST',
			headers: { 'content-type': MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST },
			body: batchedTokenRequest.serialize(),
		});

		const response = await handleTokenRequest(ctx, request);
		expect(response.status).toBe(200); // Could be 206 if some tokens failed
		expect(response.headers.get('content-type')).toBe(MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE);

		const responseBytes = new Uint8Array(await response.arrayBuffer());
		const batchedTokenResponse = arbitraryBatched.BatchedTokenResponse.deserialize(responseBytes);

		expect(batchedTokenResponse.tokenResponses.length).toBe(nTokens);

		// Verify each issued token
		for (let i = 0; i < nTokens; i++) {
			const tokenResponse = batchedTokenResponse.tokenResponses[i];
			expect(tokenResponse.tokenResponse).not.toBeNull();

			const blindSignature = tokenResponse.tokenResponse!;
			const signature = await suite.finalize(publicKey, preparedMsg, blindSignature, invs[i]);

			const isValid = await suite.verify(publicKey, signature, preparedMsg);
			expect(isValid).toBe(true);
		}
	});
});

describe('non existing handler', () => {
	const nonExistingURL = `${sampleURL}/non-existing`;

	let errorMock: vi.Mock;

	beforeEach(() => {
		errorMock = vi.fn();
		console.error = errorMock;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
	it('should return 404 when a non GET existing endpoint is requested', async () => {
		const request = new Request(nonExistingURL);
		const response = await workerObject.fetch(request, env, new createExecutionContext());

		expect(response.status).toBe(404);
	});

	it('should return 404 when a non POST existing endpoint is requested', async () => {
		const request = new Request(nonExistingURL, { method: 'POST' });
		const response = await workerObject.fetch(request, env, new createExecutionContext());

		expect(response.status).toBe(404);
	});
});

describe('rotate and clear key', () => {
	const rotateURL = `${sampleURL}/admin/rotate`;
	const clearURL = `${sampleURL}/admin/clear`;
	const directoryURL = `${sampleURL}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`;

	it('should generate multiple keys', async () => {
		const rotateRequest = new Request(rotateURL, { method: 'POST' });
		const directoryRequest = new Request(directoryURL);

		const NUMBER_OF_KEYS_GENERATED = 3;

		env.MINIMUM_FRESHEST_KEYS = NUMBER_OF_KEYS_GENERATED.toFixed();
		for (let i = 0; i < NUMBER_OF_KEYS_GENERATED; i += 1) {
			await workerObject.fetch(rotateRequest, env, new createExecutionContext());
		}

		const response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);

		const directory: IssuerConfigurationResponse = await response.json();
		expect(directory['token-keys']).toHaveLength(NUMBER_OF_KEYS_GENERATED);
	});

	it('should not clear any keys before TTL expires', async () => {
		const rotateRequest = new Request(rotateURL, { method: 'POST' });
		const clearRequest = new Request(clearURL, { method: 'POST' });
		const directoryRequest = new Request(directoryURL);

		const NUMBER_OF_KEYS_GENERATED = 3;

		env.MINIMUM_FRESHEST_KEYS = NUMBER_OF_KEYS_GENERATED.toFixed();

		for (let i = 0; i < NUMBER_OF_KEYS_GENERATED; i += 1) {
			await workerObject.fetch(rotateRequest, env, new createExecutionContext());
		}

		await workerObject.fetch(clearRequest, env, new createExecutionContext());

		let response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);

		let directory: IssuerConfigurationResponse = await response.json();

		// All keys should still be present since the TTL has not expired
		expect(directory['token-keys']).toHaveLength(NUMBER_OF_KEYS_GENERATED);

		await workerObject.fetch(clearRequest, env, new createExecutionContext());
		response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);

		directory = await response.json();

		// Verify all keys are still present
		expect(directory['token-keys']).toHaveLength(NUMBER_OF_KEYS_GENERATED);
	});
});

describe('directory', () => {
	const rotateURL = `${sampleURL}/admin/rotate`;
	const directoryURL = `${sampleURL}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`;

	const initializeKeys = async (numberOfKeys = 1): Promise<void> => {
		const rotateRequest = new Request(rotateURL, { method: 'POST' });

		env.MINIMUM_FRESHEST_KEYS = numberOfKeys.toFixed();

		for (let i = 0; i < numberOfKeys; i += 1) {
			await workerObject.fetch(rotateRequest, env, new createExecutionContext());
		}
	};

	beforeEach(async () => {
		await initializeKeys();
	});

	it('should be ordered by latest not-before first', async () => {
		const directoryRequest = new Request(directoryURL);

		const NUMBER_OF_KEYS_GENERATED = 32; // arbitrary number, but good enough to confirm the ordering is working

		env.MINIMUM_FRESHEST_KEYS = NUMBER_OF_KEYS_GENERATED.toFixed();
		await initializeKeys(NUMBER_OF_KEYS_GENERATED);

		const exct = new createExecutionContext();
		const response = await workerObject.fetch(directoryRequest, env, exct);
		expect(response.ok).toBe(true);

		const directory = (await response.json()) as IssuerConfig;

		let previousDate = Date.now() + Number.parseInt(env.KEY_NOT_BEFORE_DELAY_IN_MS);
		for (const tokenKey of directory['token-keys']) {
			if (!tokenKey['not-before']) {
				continue;
			}
			const notBeforeDate = tokenKey['not-before'] * 1000;
			expect(notBeforeDate).toBeLessThanOrEqual(previousDate);

			previousDate = notBeforeDate;
		}
	}, 10_000);

	it('response should be cached', async () => {
		const mockCaches: Map<string, MockCache> = new Map();
		const spy = vi.spyOn(caches, 'open').mockImplementation(async (name: string) => {
			if (!mockCaches.has(name)) {
				mockCaches.set(name, new MockCache());
			}
			return mockCaches.get(name) as unknown as Cache;
		});
		const directoryRequest = new Request(directoryURL);
		const mockCache = (await getDirectoryCache()) as unknown as MockCache;

		let response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);
		expect(Object.entries(mockCache.cache)).toHaveLength(1);

		const [cachedURL, _] = Object.entries(mockCache.cache)[0];
		const sampleEtag = '"sampleEtag"';
		const cachedResponse = new Response('cached response', { headers: { etag: sampleEtag } });
		mockCache.cache[cachedURL] = cachedResponse;

		response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);
		expect(response).toBe(cachedResponse);

		const cachedDirectoryRequest = new Request(directoryURL, {
			headers: { 'if-none-match': sampleEtag },
		});
		response = await workerObject.fetch(cachedDirectoryRequest, env, new createExecutionContext());
		expect(response.status).toBe(304);

		const headCachedDirectoryRequest = new Request(directoryURL, {
			method: 'HEAD',
			headers: { 'if-none-match': sampleEtag },
		});
		response = await workerObject.fetch(
			headCachedDirectoryRequest,
			env,
			new createExecutionContext()
		);
		expect(response.status).toBe(304);

		spy.mockClear();
	});

	it('not-before should be the unix time number of seconds as a 64-bit integer', async () => {
		const directoryRequest = new Request(directoryURL);

		const response = await workerObject.fetch(directoryRequest, env, new createExecutionContext());
		expect(response.ok).toBe(true);

		const directory = (await response.json()) as IssuerConfig;

		for (const tokenKey of directory['token-keys']) {
			if (!tokenKey['not-before']) {
				continue;
			}
			// check if it's an integer
			expect(tokenKey['not-before'] - Math.trunc(tokenKey['not-before'])).toBe(0);

			// checks the date matches
			const date = new Date(tokenKey['not-before'] * 1000);
			expect(date.getMilliseconds()).toBe(0);
			expect(date.getDay()).toBe(new Date().getDay()); // while this could fail if the test is run when day is passing, this is unlikely and a good enough proxy
		}
	});
});

describe('key rotation', () => {
	let ctx: Context; // Store context for reuse in tests

	beforeEach(async () => {
		ctx = getContext({
			request: new Request(sampleURL),
			env: env,
			ectx: new createExecutionContext(),
		});

		try {
			const storedKeys = await ctx.bucket.ISSUANCE_KEYS.list();
			for (const key of storedKeys.objects) {
				await ctx.bucket.ISSUANCE_KEYS.delete(key.key);
			}
		} catch (error) {
			console.error('[Test] Failed to clear storage:', error);
		}
	});

	it.each`
		name                                                        | rotationCron     | date                          | expected
		${'rotate key at every minute'}                             | ${'* * * * *'}   | ${'2023-08-01T00:01:00Z'}     | ${true}
		${'rotate key at midnight on the first day of every month'} | ${'0 0 1 * *'}   | ${'2023-09-01T00:00:00Z'}     | ${true}
		${'rotate key at 12:30 PM every day'}                       | ${'30 12 * * *'} | ${'2023-08-01T12:30:00Z'}     | ${true}
		${'not rotate key at noon on a non-rotation day'}           | ${'0 0 1 * *'}   | ${'2023-08-02T12:00:00Z'}     | ${false}
		${'rotate key at 11:59 PM on the last day of the month'}    | ${'59 23 * * *'} | ${'2023-08-31T23:59:00Z'}     | ${true}
		${'handle rotation with millisecond precision'}             | ${'* * * * *'}   | ${'2023-08-01T00:01:00.010Z'} | ${true}
	`(
		'should $name',
		async ({
			rotationCron,
			date,
			expected,
		}: {
			rotationCron: string;
			date: string;
			expected: boolean;
		}) => {
			// Use the context created in beforeEach
			ctx.env.ROTATION_CRON_STRING = rotationCron;

			expect(shouldRotateKey(new Date(date), ctx.env)).toBe(expected);
		}
	);
});

describe('shouldClearKey Function', () => {
	it.each`
		name                                                                     | keyUpload                 | now                           | lifespanInMs           | expected
		${'not clear key when within the lifespan'}                              | ${'2023-10-01T12:00:00Z'} | ${'2023-10-02T11:59:59Z'}     | ${48 * 60 * 60 * 1000} | ${false}
		${'clear key when it exceeds the lifespan'}                              | ${'2023-10-01T12:00:00Z'} | ${'2023-10-03T12:00:00.001Z'} | ${48 * 60 * 60 * 1000} | ${true}
		${'clear key when it exceeds the lifespan even if close to the edge'}    | ${'2023-10-01T12:00:00Z'} | ${'2023-10-03T12:00:00.001Z'} | ${48 * 60 * 60 * 1000} | ${true}
		${'not clear key within custom shorter lifespan if within that period'}  | ${'2023-10-01T12:00:00Z'} | ${'2023-10-01T13:00:00Z'}     | ${1 * 60 * 60 * 1000}  | ${false}
		${'clear key based on custom shorter lifespan if the period has passed'} | ${'2023-10-01T12:00:00Z'} | ${'2023-10-01T13:00:01Z'}     | ${1 * 60 * 60 * 1000}  | ${true}
	`(
		'should $name',
		({
			keyUpload,
			now,
			lifespanInMs,
			expected,
		}: {
			keyUpload: string;
			now: string;
			lifespanInMs: number;
			expected: boolean;
		}) => {
			const keyUploadTime = new Date(keyUpload);

			mockDateNow(now);
			const result = shouldClearKey(keyUploadTime, lifespanInMs);
			expect(result).toBe(expected);

			clearDateMocks();
		}
	);
});

describe('Integration Test for Key Clearing with Mocked Date', () => {
	let ctx: Context;

	beforeEach(async () => {
		ctx = getContext({
			request: new Request(sampleURL),
			env: env,
			ectx: new createExecutionContext(),
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it.each`
		name                                                                  | keyUpload1                | keyUpload2                | keyUpload3                | clearTime                 | keyLifespanInMs            | minimumNumberOfKeys | expectedDeletedKeys
		${'should clear expired key and preserve freshest keys'}              | ${'2024-10-01T14:59:59Z'} | ${'2024-09-30T11:00:00Z'} | ${'2024-10-03T13:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${2 * 24 * 60 * 60 * 1000} | ${1}                | ${['_global/key2']}
		${'should preserve all keys when within lifespan'}                    | ${'2024-10-01T14:00:00Z'} | ${'2024-10-02T10:00:00Z'} | ${'2024-10-03T12:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${2 * 24 * 60 * 60 * 1000} | ${1}                | ${[]}
		${'should clear only the oldest key that exceeded lifespan'}          | ${'2024-09-28T11:00:00Z'} | ${'2024-10-01T15:00:00Z'} | ${'2024-10-03T13:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${2 * 24 * 60 * 60 * 1000} | ${1}                | ${['_global/key1']}
		${'should leave only the freshest key remaining'}                     | ${'2024-09-28T10:00:00Z'} | ${'2024-09-29T10:00:00Z'} | ${'2024-10-02T14:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${2 * 24 * 60 * 60 * 1000} | ${1}                | ${['_global/key1', '_global/key2']}
		${'should keep all keys when minimum freshest is three'}              | ${'2024-09-28T10:00:00Z'} | ${'2024-09-29T10:00:00Z'} | ${'2024-10-02T14:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${2 * 24 * 60 * 60 * 1000} | ${3}                | ${[]}
		${'should leave only the freshest key remaining with 1 day rotation'} | ${'2024-10-01T14:00:00Z'} | ${'2024-10-02T10:00:00Z'} | ${'2024-10-03T12:00:00Z'} | ${'2024-10-03T14:00:00Z'} | ${1 * 24 * 60 * 60 * 1000} | ${1}                | ${['_global/key1', '_global/key2']}
	`(
		'$name',
		async ({
			keyUpload1,
			keyUpload2,
			keyUpload3,
			clearTime,
			keyLifespanInMs,
			minimumNumberOfKeys,
			expectedDeletedKeys,
		}: {
			name: string;
			keyUpload1: string;
			keyUpload2: string;
			keyUpload3: string;
			clearTime: string;
			keyLifespanInMs: number;
			minimumNumberOfKeys: number;
			expectedDeletedKeys: string[];
		}) => {
			env.KEY_LIFESPAN_IN_MS = keyLifespanInMs.toFixed();
			env.MINIMUM_FRESHEST_KEYS = minimumNumberOfKeys.toFixed();

			// Create fake keys with desired uploaded timestamps
			const fakeKeys = {
				objects: [
					{
						key: '_global/key1',
						uploaded: new Date(keyUpload1),
						customMetadata: {},
						etag: 'etag1',
						version: 'v1',
						size: 22,
						checksums: {},
						httpEtag: '',
					},
					{
						key: '_global/key2',
						uploaded: new Date(keyUpload2),
						customMetadata: {},
						etag: 'etag2',
						version: 'v2',
						size: 22,
						checksums: {},
						httpEtag: '',
					},
					{
						key: '_global/key3',
						uploaded: new Date(keyUpload3),
						customMetadata: {},
						etag: 'etag3',
						version: 'v3',
						size: 22,
						checksums: {},
						httpEtag: '',
					},
				],
				delimitedPrefixes: [],
				truncated: false,
			};

			const listSpy = vi.spyOn(ctx.env.ISSUANCE_KEYS, 'list').mockResolvedValue(fakeKeys);
			const deleteSpy = vi.spyOn(ctx.env.ISSUANCE_KEYS, 'delete').mockResolvedValue(undefined);

			vi.setSystemTime(new Date(clearTime));
			await handleClearKey(ctx, new Request('http://host'));

			// Assert: if no expectedDeletedKeys, delete should not be called
			if (expectedDeletedKeys.length === 0) {
				expect(deleteSpy).not.toHaveBeenCalled();
			} else {
				expect(deleteSpy).toHaveBeenCalledWith(expect.arrayContaining(expectedDeletedKeys));
			}
		}
	);
});
