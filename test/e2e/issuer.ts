// Copyright (c) 2023 Cloudflare, Inc.
// SPDX-License-Identifier: Apache-2.0

// Importing necessary modules
import fetch from 'node-fetch'; // Using node-fetch to support client-side certificates with a fetch-like API.
import fs from 'node:fs'; // File system module to read certificate files
import https from 'node:https'; // HTTPS module for creating secure connections

// Importing various utilities and types from the Privacy Pass library
import {
	IssuerConfig,
	MediaType,
	PRIVATE_TOKEN_ISSUER_DIRECTORY,
	TOKEN_TYPES,
	TokenChallenge,
	publicVerif,
	util,
} from '@cloudflare/privacypass-ts';

const { BlindRSAMode, Client, verifyToken } = publicVerif; // Destructuring specific exports for easier access

export interface MTLSConfiguration {
	certPath: string; // Path to the certificate file
	keyPath: string; // Path to the key file
}

// Function to convert a base64Url encoded string to a Uint8Array
export function base64UrlToUint8Array(base64Url: string): Uint8Array {
	// Log the base64Url input
	console.log(`Converting base64Url to Uint8Array: ${base64Url}`);
	// Convert URL-safe base64 characters to regular base64 characters
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	// Convert the base64 string to a Uint8Array
	const uint8Array = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
	console.log(`Converted Uint8Array: ${uint8Array}`);
	return uint8Array;
}

// Asynchronously fetches with MTLS configuration
async function fetchWithMTLS(mTLS: MTLSConfiguration): Promise<typeof fetch> {
	console.log(`Setting up MTLS with cert: ${mTLS.certPath}, key: ${mTLS.keyPath}`);
	// Read the client certificate and key from the provided paths
	const clientCert = fs.readFileSync(mTLS.certPath);
	const clientKey = fs.readFileSync(mTLS.keyPath);
	console.log(`Loaded client certificate and key.`);

	// Create an HTTPS agent with the provided client certificate and key
	const agent = new https.Agent({
		cert: clientCert,
		key: clientKey,
		rejectUnauthorized: false, // Allow unauthorized certificates (not recommended for production)
	});

	// Log the agent creation
	console.log(`Created HTTPS agent with client certificate and key.`);

	// Return a function that uses the custom HTTPS agent
	return (request, init) => {
		console.log(`Making request with MTLS: ${request}`);
		return fetch(request, { ...init, agent });
	};
}

// Determine the protocol (http or https) based on the host
function getProtocol(host: string): string {
	console.log(`Determining protocol for host: ${host}`);
	// If the host includes 'localhost', use 'http:', otherwise use 'https:'
	const protocol = host.includes('localhost') ? 'http:' : 'https:';
	console.log(`Protocol determined: ${protocol}`);
	return protocol;
}

// Fetch the issuer configuration from the issuer's server
async function getIssuerConfig(name: string, mTLS?: MTLSConfiguration) {
	console.log(`Fetching issuer config for: ${name}`);
	const protocol = getProtocol(name); // Determine the protocol
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch; // Use MTLS if provided, otherwise default fetch
	const response = await proxyFetch(`${protocol}//${name}${PRIVATE_TOKEN_ISSUER_DIRECTORY}`);
	console.log(`Received response for issuer config request: ${response.status}`);
	const config: IssuerConfig = (await response.json()) as IssuerConfig; // Parse the response JSON into IssuerConfig
	console.log(`Parsed issuer config: ${JSON.stringify(config)}`);

	// Find the public key for the BlindRSA token type
	const token = config['token-keys'].find(
		token => token['token-type'] == TOKEN_TYPES.BLIND_RSA.value
	);
	console.log(`Found BlindRSA token key: ${JSON.stringify(token)}`);

	// If no token key is found, throw an error
	if (!token) {
		console.error('Could not find BlindRSA token key on issuer');
		throw new Error('Could not find BlindRSA token key on issuer');
	}

	// Convert the base64Url encoded public key to a Uint8Array
	const publicKeyEnc = base64UrlToUint8Array(token['token-key']);
	// Import the public key into a usable format
	const publicKey = await importPublicKey(util.convertRSASSAPSSToEnc(publicKeyEnc));
	console.log(`Imported public key: ${publicKey}`);

	// Return the public key, encoded key, and the issuer request URL
	return {
		publicKey,
		publicKeyEnc,
		url: `${protocol}//${name}${config['issuer-request-uri']}`,
	};
}

// Rotate the issuer's key by making a POST request to the issuer's admin endpoint
export async function rotateKey(issuerName: string, mTLS: MTLSConfiguration) {
	console.log(`Rotating key for issuer: ${issuerName}`);
	const protocol = getProtocol(issuerName); // Determine the protocol
	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch; // Use MTLS if provided, otherwise default fetch
	const rotateURL = `${protocol}//${issuerName}/admin/rotate`; // Construct the rotate URL
	console.log(`Rotate URL: ${rotateURL}`);

	// Make the POST request to rotate the key
	const response = await proxyFetch(rotateURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json', // Specify the content type as JSON
		},
	});
	console.log(`Received response for rotate key request: ${response.status} ${response.statusText}`);

	// If the response is not OK, throw an error with the status
	if (!response.ok) {
		console.error(`Key rotation request failed: ${response.status} ${response.statusText}`);
		throw new Error(`Key rotation request failed: ${response.status} ${response.statusText}`);
	}
}

// Import a public key from an SPKI (Subject Public Key Info) format Uint8Array
async function importPublicKey(spki: Uint8Array) {
	// Log the SPKI data
	console.log(`Importing public key from SPKI data: ${spki}`);
	// Use the Web Crypto API to import the key with the RSA-PSS algorithm and SHA-384 hash
	const publicKey = await crypto.subtle.importKey('spki', spki, { name: 'RSA-PSS', hash: 'SHA-384' }, true, ['verify']);
	console.log(`Successfully imported public key.`);
	return publicKey;
}

// Test the end-to-end process of issuing and redeeming a token
export async function testE2E(issuerName: string, mTLS?: MTLSConfiguration): Promise<boolean> {
	console.log(`Starting end-to-end test for issuer: ${issuerName}`);
	const client = new Client(BlindRSAMode.PSS); // Create a new Client with Blind RSA mode
	console.log(`Created new client for Blind RSA mode.`);

	// Create a redemption context filled with 0xfe
	const redemptionContext = new Uint8Array(32);
	redemptionContext.fill(0xfe);
	console.log(`Created redemption context: ${redemptionContext}`);

	// Create a new TokenChallenge with the Blind RSA token type
	const challenge = new TokenChallenge(TOKEN_TYPES.BLIND_RSA.value, issuerName, redemptionContext);
	console.log(`Created token challenge: ${JSON.stringify(challenge)}`);

	// Get the issuer's configuration including public key and request URL
	const {
		publicKeyEnc: issuerPublicKeyEnc,
		publicKey: issuerPublicKey,
		url: issuerRequestURL,
	} = await getIssuerConfig(issuerName);
	console.log(`Fetched issuer config with public key and request URL: ${issuerRequestURL}`);

	// Create a token request using the challenge and issuer's public key
	const tokenRequest = await client.createTokenRequest(challenge, issuerPublicKeyEnc);
	console.log(`Created token request: ${JSON.stringify(tokenRequest)}`);

	const proxyFetch = mTLS ? await fetchWithMTLS(mTLS) : fetch; // Use MTLS if provided, otherwise default fetch
	// Send the token request to the issuer's request URL
	const response = await proxyFetch(issuerRequestURL, {
		method: 'POST',
		headers: {
			'Content-Type': MediaType.PRIVATE_TOKEN_REQUEST, // Set content type for token request
			'Accept': MediaType.PRIVATE_TOKEN_RESPONSE, // Accept token response
		},
		body: tokenRequest.serialize().buffer as Buffer, // Send the serialized token request
	});
	console.log(`Received response from issuer request: ${response.status} ${response.statusText}`);

	// If the response is not OK, throw an error with the status
	if (!response.ok) {
		console.error(`Issuer request failed: ${response.status} ${response.statusText}`);
		throw new Error(`Issuer request failed: ${response.status} ${response.statusText}`);
	}

	// Deserialize the token response
	const tokenResponse = publicVerif.TokenResponse.deserialize(
		new Uint8Array(await response.arrayBuffer())
	);
	console.log(`Deserialized token response: ${JSON.stringify(tokenResponse)}`);

	// Finalize the token with the client
	const token = await client.finalize(tokenResponse);
	console.log(`Finalized token: ${JSON.stringify(token)}`);

	// Verify the token and check if the content type is correct
	const isTokenValid = await verifyToken(BlindRSAMode.PSS, token, issuerPublicKey);
	const isContentTypeValid = response.headers.get('Content-Type') === MediaType.PRIVATE_TOKEN_RESPONSE;

	console.log(`Token verification result: ${isTokenValid}`);
	console.log(`Content-Type validation result: ${isContentTypeValid}`);

	return isTokenValid && isContentTypeValid;
}
