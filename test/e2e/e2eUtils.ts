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

const { TokenRequest, Client: BatchedTokensClient, BatchedTokenResponse } = arbitraryBatched;
import { type Token } from '@cloudflare/privacypass-ts';
const { BlindRSAMode, Client, Origin } = publicVerif;

import { RequestInit } from 'node-fetch';

import { RequestInit as NodeFetchRequestInit, Response as NodeFetchResponse } from 'node-fetch';
// Union type for RequestInit from DOM and node‑fetch
export type UniversalRequestInit = RequestInit | NodeFetchRequestInit;

// The UniversalFetch type returns a DOM-style Response.
// (At runtime they work the same; we simply force the types to be compatible.)
export type UniversalFetch = (url: string, init?: UniversalRequestInit) => Promise<Response>;

export async function importPublicKey(spki: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey('spki', spki, { name: 'RSA-PSS', hash: 'SHA-384' }, true, [
		'verify',
	]);
}

const b64Tou8 = (b: string): Uint8Array => Uint8Array.from(atob(b), c => c.charCodeAt(0));
const b64URLtoB64 = (s: string): string => s.replace(/-/g, '+').replace(/_/g, '/');

export async function getIssuerConfig(
	baseUrl: string,
	customFetch: UniversalFetch
): Promise<{ url: string; publicKey: CryptoKey; publicKeyEnc: Uint8Array }> {
	const issuerConfigResponse = (await customFetch(`${baseUrl}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; CustomMTLSClient/1.0)',
		},
	})) as Response;

	const bodyText = await issuerConfigResponse.text();
	if (!issuerConfigResponse.ok) {
		throw new Error(
			`Issuer request failed: ${issuerConfigResponse.status} ${issuerConfigResponse.statusText}\n${bodyText}`
		);
	}

	const config = JSON.parse(bodyText) as IssuerConfig;
	const token = config['token-keys'].find(t => t['token-type'] === TOKEN_TYPES.BLIND_RSA.value);
	if (!token) {
		throw new Error('Could not find BlindRSA token key on issuer');
	}

	const publicKeyEnc = b64Tou8(b64URLtoB64(token['token-key']));
	const publicKey = await importPublicKey(util.convertRSASSAPSSToEnc(publicKeyEnc));
	return {
		publicKey,
		publicKeyEnc,
		url: `${baseUrl}${config['issuer-request-uri']}`,
	};
}

// Generic function to request and finalize a token
export async function requestAndFinalizeToken(
	baseUrl: string,
	challenge: TokenChallenge,
	client: any,
	customFetch: UniversalFetch
	// customFetch: (url: string, init?: RequestInit) => Promise<Response>
): Promise<{ finalizedToken: any; publicKey: CryptoKey; response: Response }> {
	// Get issuer configuration
	const { url, publicKey, publicKeyEnc } = await getIssuerConfig(baseUrl, customFetch);

	// Create and issue the token request
	const tokenRequest = await client.createTokenRequest(challenge, publicKeyEnc);
	const body =
		typeof Buffer !== 'undefined'
			? Buffer.from(tokenRequest.serialize())
			: tokenRequest.serialize().buffer;
	const response = await customFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.PRIVATE_TOKEN_REQUEST,
			'Accept': MediaType.PRIVATE_TOKEN_RESPONSE,
		},
		body,
	});
	if (!response.ok) {
		throw new Error(
			`Issuer request failed: ${response.status} ${response.statusText}\n${await response.text()}`
		);
	}
	const tokenResponse = publicVerif.TokenResponse.deserialize(
		new Uint8Array(await response.arrayBuffer())
	);
	const finalizedToken = await client.finalize(tokenResponse);

	return { finalizedToken, publicKey, response };
}

export async function requestSingleToken(
	baseUrl: string,
	issuerName: string,
	customFetch: UniversalFetch
): Promise<boolean> {
	console.log(`[Test] Requesting a single token from issuer: ${issuerName}`);

	const client = new Client(BlindRSAMode.PSS);
	const redemptionContext = new Uint8Array(32).fill(0xfe);
	const challenge = new TokenChallenge(TOKEN_TYPES.BLIND_RSA.value, issuerName, redemptionContext);

	const { finalizedToken, publicKey, response } = await requestAndFinalizeToken(
		baseUrl,
		challenge,
		client,
		customFetch
	);

	const origin = new Origin(BlindRSAMode.PSS);
	const isValid =
		(await origin.verify(finalizedToken, publicKey)) &&
		response.headers.get('Content-Type') === MediaType.PRIVATE_TOKEN_RESPONSE;

	console.log(`[Test] Single token validity: ${isValid}`);
	return isValid;
}

export async function requestBatchedTokens(
	baseUrl: string,
	issuerName: string,
	nTokens: number,
	customFetch: UniversalFetch
): Promise<boolean> {
	console.log(`[Test] Requesting ${nTokens} tokens from issuer: ${issuerName}`);

	if (nTokens === 0) {
		return false;
	}
	const clients = Array.from({ length: nTokens }, () => new Client(BlindRSAMode.PSS));
	const origin = new Origin(BlindRSAMode.PSS);
	const { publicKeyEnc, publicKey, url } = await getIssuerConfig(baseUrl, customFetch);
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
	const response = await customFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.ARBITRARY_BATCHED_TOKEN_REQUEST,
			'Accept': MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE,
		},
		body: batchedRequest.serialize().buffer as Buffer,
	});
	if (!response.ok) {
		throw new Error(`Issuer request failed: ${response.status} ${response.statusText}`);
	}
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
		} catch (err) {
			console.error(`[Token ${index}] Finalization failed:`, err);
			tokens.push(undefined);
		}
	}

	let isValid = true;
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		try {
			const valid = token !== undefined && (await origin.verify(token, publicKey));
			if (!valid) isValid = false;
		} catch (err) {
			console.error(`[Error] Token verification failed for token [${i}]:`, err);
			isValid = false;
		}
	}
	const contentTypeValid =
		response.headers.get('Content-Type') === MediaType.ARBITRARY_BATCHED_TOKEN_RESPONSE;

	const overallSuccess = isValid && contentTypeValid;
	console.log(`[Test] Batched token validity: ${overallSuccess}`);
	return overallSuccess;
}
