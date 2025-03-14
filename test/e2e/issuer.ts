// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import fetch from 'node-fetch'; // using node-fetch to allow usage of client side certificate with a fetch-like API. This is not a standard webcrypto behaviour, therefore using native node fetch does not work.
import fs from 'node:fs';
import https from 'node:https';

import {
	IssuerConfig,
	MediaType,
	PRIVATE_TOKEN_ISSUER_DIRECTORY,
	TOKEN_TYPES,
	TokenChallenge,
	publicVerif,
	arbitraryBatched,
	util,
} from '@cloudflare/privacypass-ts';

const { BlindRSAMode, Client, Origin } = publicVerif;
const { TokenRequest, Client: BatchedTokensClient, BatchedTokenResponse } = arbitraryBatched;
import { type Token } from '@cloudflare/privacypass-ts';
import { b64URLtoB64, b64Tou8 } from '../../src/utils/base64';

// ========== TYPES ==========

export type IssuerConfiguration = {
	publicKeyEnc: Uint8Array;
	publicKey: CryptoKey;
	url: string;
};

export interface MTLSConfiguration {
	certPath: string;
	keyPath: string;
}

// export function base64UrlToUint8Array(base64Url: string): Uint8Array {
// 	return Uint8Array.from(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')), c =>
// 		c.charCodeAt(0)
// 	);
// }

function getProtocol(host: string): string {
	return host.includes('localhost') ? 'http:' : 'https:';
}

async function importPublicKey(spki: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey('spki', spki, { name: 'RSA-PSS', hash: 'SHA-384' }, true, [
		'verify',
	]);
}

async function fetchWithMTLS(mTLS: MTLSConfiguration): Promise<typeof fetch> {
	const clientCert = fs.readFileSync(mTLS.certPath);
	const clientKey = fs.readFileSync(mTLS.keyPath);

	const agent = new https.Agent({
		cert: clientCert,
		key: clientKey,
		rejectUnauthorized: false,
	});

	return (request, init) => fetch(request, { ...init, agent });
}

async function getIssuerConfig(
	name: string,
	mTLS?: MTLSConfiguration
): Promise<IssuerConfiguration> {
	const protocol = getProtocol(name);
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const response = await proxyFetch(`${protocol}//${name}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
	const config = (await response.json()) as IssuerConfig;

	const token = config['token-keys'].find(t => t['token-type'] === TOKEN_TYPES.BLIND_RSA.value);
	if (!token) {
		throw new Error('Could not find BlindRSA token key on issuer');
	}

	const publicKeyEnc = b64Tou8(b64URLtoB64(token['token-key']));
	// const publicKeyEnc = base64UrlToUint8Array(token['token-key']);

	const publicKey = await importPublicKey(util.convertRSASSAPSSToEnc(publicKeyEnc));

	return {
		publicKey,
		publicKeyEnc,
		url: `${protocol}//${name}${config['issuer-request-uri']}`,
	};
}

// Requests key rotation on the issuer.
export async function rotateKey(issuerName: string, mTLS: MTLSConfiguration) {
	const protocol = getProtocol(issuerName);
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const rotateURL = `${protocol}//${issuerName}/admin/rotate`;

	const response = await proxyFetch(rotateURL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response.ok) {
		throw new Error(`Key rotation request failed: ${response.status} ${response.statusText}`);
	}
}

export async function testE2E(
	issuerName: string,
	nTokens: number,
	requestType: string,
	mTLS?: MTLSConfiguration
): Promise<boolean> {
	console.log(`request type is ${requestType}`);
	return requestType === 'batched'
		? testArbitraryBatchedRequest(issuerName, nTokens, mTLS)
		: testTokenRequest(issuerName, mTLS);
}

export async function testTokenRequest(
	issuerName: string,
	mTLS?: MTLSConfiguration
): Promise<boolean> {
	console.log(`[Test] Initiating token request to issuer: ${issuerName}`);
	const client = new Client(BlindRSAMode.PSS);
	const redemptionContext = new Uint8Array(32).fill(0xfe);
	const challenge = new TokenChallenge(TOKEN_TYPES.BLIND_RSA.value, issuerName, redemptionContext);

	const { publicKeyEnc, publicKey, url } = await getIssuerConfig(issuerName, mTLS);
	const tokenRequest = await client.createTokenRequest(challenge, publicKeyEnc);

	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const response = await proxyFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.PRIVATE_TOKEN_REQUEST,
			'Accept': MediaType.PRIVATE_TOKEN_RESPONSE,
		},
		body: tokenRequest.serialize().buffer as Buffer, // node-fetch fetch requires a node.js Buffer, but ArrayBuffer seems fine
	});

	if (!response.ok) {
		throw new Error(
			`Issuer request failed: ${response.status} ${response.statusText}\n${await response.text()}`
		);
	}

	const tokenResponse = publicVerif.TokenResponse.deserialize(
		new Uint8Array(await response.arrayBuffer())
	);
	const token = await client.finalize(tokenResponse);

	const origin = new Origin(BlindRSAMode.PSS);
	return (
		(await origin.verify(token, publicKey)) &&
		response.headers.get('Content-Type') === MediaType.PRIVATE_TOKEN_RESPONSE
	);
}

async function testArbitraryBatchedRequest(
	issuerName: string,
	nTokens: number,
	mTLS?: MTLSConfiguration
): Promise<boolean> {
	console.log(`[Test] Initiating batched request for ${nTokens} tokens to issuer: ${issuerName}`);

	if (nTokens === 0) {
		console.log('[Test] No tokens requested. Sending empty batched request.');

		const batchedTokensClient = new BatchedTokensClient();
		const batchedRequest = batchedTokensClient.createTokenRequest([]);

		const { url } = await getIssuerConfig(issuerName, mTLS);

		const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
		const response = await proxyFetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST,
				'Accept': MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
			},
			body: batchedRequest.serialize().buffer as Buffer,
		});

		if (!response.ok) {
			console.error(`[Error] Issuer request failed: ${response.status} ${response.statusText}`);
			throw new Error(`Issuer request failed: ${response.status} ${response.statusText}`);
		}

		const tokenResponse = BatchedTokenResponse.deserialize(
			new Uint8Array(await response.arrayBuffer())
		);

		const isValid = tokenResponse.tokenResponses.length === 0;
		console.log(`[Test] Empty batched response valid: ${isValid}`);

		return isValid;
	}

	const clients = Array.from({ length: nTokens }, () => new Client(BlindRSAMode.PSS));
	const origin = new Origin(BlindRSAMode.PSS);

	const { publicKeyEnc, publicKey, url } = await getIssuerConfig(issuerName, mTLS);
	const batchedTokensClient = new BatchedTokensClient();

	const tokenChallenges = clients.map(() =>
		origin.createTokenChallenge(issuerName, crypto.getRandomValues(new Uint8Array(32)))
	);

	const tokenRequests = await Promise.all(
		tokenChallenges.map((ch, i) => clients[i].createTokenRequest(ch, publicKeyEnc))
	);

	const batchedRequest = batchedTokensClient.createTokenRequest(
		tokenRequests.map(tr => new TokenRequest(tr))
	);

	console.log(`[Test] Sending batched token request to issuer: ${url}`);
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const response = await proxyFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST,
			'Accept': MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
		},
		body: batchedRequest.serialize().buffer as Buffer,
	});

	if (!response.ok) {
		console.error(`[Error] Issuer request failed: ${response.status} ${response.statusText}`);
		throw new Error(`Issuer request failed: ${response.status} ${response.statusText}`);
	}

	console.log(`[Test] Processing token responses...`);
	const tokenResponse = BatchedTokenResponse.deserialize(
		new Uint8Array(await response.arrayBuffer())
	);
	const responses = tokenResponse.tokenResponses;

	const tokens: Array<Token | undefined> = [];

	for (const [index, res] of responses.entries()) {
		if (!res.tokenResponse) {
			console.warn(`[Warning] Token response ${index} is missing (null). Skipping finalization.`);
			tokens.push(undefined);
			continue;
		}

		try {
			const deserializedResponse = publicVerif.TokenResponse.deserialize(res.tokenResponse);
			const token = await clients[index].finalize(deserializedResponse);
			tokens.push(token);
			console.log(`[Token ${index}] Finalization successful.`);
		} catch (err) {
			console.error(`[Token ${index}] Finalization failed:`, err);
			tokens.push(undefined);
		}
	}

	console.log(`[Test] Verifying ${tokens.length} tokens...`);
	let isValid = true;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		try {
			const valid = token !== undefined && (await origin.verify(token, publicKey));
			console.log(`[Verification] Token [${i}] Valid: ${valid}`);
			if (!valid) isValid = false;
		} catch (err) {
			console.error(`[Error] Token verification failed for token [${i}]:`, err);
			isValid = false;
		}
	}

	const contentTypeValid =
		response.headers.get('Content-Type') === MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE;
	console.log(`[Test] Response Content-Type Valid: ${contentTypeValid}`);

	const overallSuccess = isValid && contentTypeValid;
	console.log(
		`[Test] Overall Batched Token Validity: ${overallSuccess ? '✅ Valid' : '❌ Invalid'}`
	);

	return overallSuccess;
}
