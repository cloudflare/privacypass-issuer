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
	util,
} from '@cloudflare/privacypass-ts';

const { BlindRSAMode, Client, verifyToken } = publicVerif;

export interface MTLSConfiguration {
	certPath: string;
	keyPath: string;
}

export function base64UrlToUint8Array(base64Url: string): Uint8Array {
	// Convert URL escaped characters to regular base64 string
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

	return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
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

function getProtocol(host: string): string {
	return host.includes('localhost') ? 'http:' : 'https:';
}

async function getIssuerConfig(name: string, mTLS?: MTLSConfiguration) {
	const protocol = getProtocol(name);
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const response = await proxyFetch(`${protocol}//${name}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
	const config: IssuerConfig = (await response.json()) as IssuerConfig;

	const token = config['token-keys'].find(
		token => token['token-type'] == TOKEN_TYPES.BLIND_RSA.value
	);

	if (!token) {
		throw new Error('Could not find BlindRSA token key on issuer');
	}

	const publicKeyEnc = base64UrlToUint8Array(token['token-key']);
	const publicKey = await importPublicKey(util.convertRSASSAPSSToEnc(publicKeyEnc));

	return {
		publicKey,
		publicKeyEnc,
		url: `${protocol}//${name}${config['issuer-request-uri']}`,
	};
}

async function importPublicKey(spki: Uint8Array) {
	return crypto.subtle.importKey('spki', spki, { name: 'RSA-PSS', hash: 'SHA-384' }, true, [
		'verify',
	]);
}

export async function testE2E(issuerName: string, mTLS?: MTLSConfiguration): Promise<boolean> {
	const client = new Client(BlindRSAMode.PSS);

	const redemptionContext = new Uint8Array(32);
	redemptionContext.fill(0xfe);
	const challenge = new TokenChallenge(TOKEN_TYPES.BLIND_RSA.value, issuerName, redemptionContext);

	const {
		publicKeyEnc: issuerPublicKeyEnc,
		publicKey: issuerPublicKey,
		url: issuerRequestURL,
	} = await getIssuerConfig(issuerName);

	const tokenRequest = await client.createTokenRequest(challenge, issuerPublicKeyEnc);

	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch;
	const response = await proxyFetch(issuerRequestURL, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.PRIVATE_TOKEN_REQUEST,
			'Accept': MediaType.PRIVATE_TOKEN_RESPONSE,
		},
		body: tokenRequest.serialize().buffer as Buffer, // node-fetch fetch requires a node.js Buffer, but ArrayBuffer seems fine
	});

	if (!response.ok) {
		throw new Error(`Issuer request failed: ${response.status} ${response.statusText}`);
	}

	const tokenResponse = publicVerif.TokenResponse.deserialize(
		new Uint8Array(await response.arrayBuffer())
	);
	const token = await client.finalize(tokenResponse);

	return (
		(await verifyToken(BlindRSAMode.PSS, token, issuerPublicKey)) &&
		response.headers.get('Content-Type') === MediaType.PRIVATE_TOKEN_RESPONSE
	);
}
