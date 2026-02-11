// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

import fetch from 'node-fetch'; // using node-fetch to allow usage of client side certificate with a fetch-like API. This is not a standard webcrypto behaviour, therefore using native node fetch does not work.
import fs from 'node:fs';

import https from 'node:https';

import {
	UniversalFetch,
	UniversalRequestInit,
	requestBatchedTokens,
	requestSingleToken,
} from './e2eUtils.js';

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

function getProtocol(host: string): string {
	return host.includes('localhost') ? 'http:' : 'https:';
}

export async function fetchWithMTLS(mTLS: MTLSConfiguration): Promise<UniversalFetch> {
	const clientCert = fs.readFileSync(mTLS.certPath);
	const clientKey = fs.readFileSync(mTLS.keyPath);

	const agent = new https.Agent({
		cert: clientCert,
		key: clientKey,
		rejectUnauthorized: true,
	});

	// Return a function that accepts a UniversalRequestInit.
	// We force the result to match the global Response type.
	return async (url: string, init?: UniversalRequestInit): Promise<Response> => {
		return (await fetch(url, { ...init, agent })) as unknown as Response;
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
	return requestType === 'batched'
		? testArbitraryBatchedRequest(issuerName, nTokens, mTLS)
		: testTokenRequest(issuerName, mTLS);
}

export async function testTokenRequest(
	issuerName: string,
	mTLS?: MTLSConfiguration
): Promise<boolean> {
	let customFetch: UniversalFetch;
	if (mTLS) {
		customFetch = await fetchWithMTLS(mTLS);
	} else {
		customFetch = fetch as unknown as UniversalFetch;
	}

	return await requestSingleToken(
		`${getProtocol(issuerName)}//${issuerName}`,
		issuerName,
		customFetch
	);
}

export async function testArbitraryBatchedRequest(
	issuerName: string,
	nTokens: number,
	mTLS?: MTLSConfiguration
): Promise<boolean> {
	let customFetch: UniversalFetch;
	if (mTLS) {
		customFetch = await fetchWithMTLS(mTLS);
	} else {
		customFetch = fetch as unknown as UniversalFetch;
	}

	return await requestBatchedTokens(
		`${getProtocol(issuerName)}//${issuerName}`,
		issuerName,
		nTokens,
		customFetch
	);
}
