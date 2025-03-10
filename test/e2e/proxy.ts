import fs from "node:fs";
import https from "node:https";
import fetch, { RequestInfo, RequestInit } from "node-fetch";
import { program } from "commander";

export interface MTLSConfiguration {
	certPath: string;
	keyPath: string;
}

interface TestResult {
	name: string;
	status: "passed" | "failed";
	message: string;
}

function fetchWithMTLS(mTLS: MTLSConfiguration): typeof fetch {
	const clientCert = fs.readFileSync(mTLS.certPath);
	const clientKey = fs.readFileSync(mTLS.keyPath);

	const agent = new https.Agent({
		cert: clientCert,
		key: clientKey,
		rejectUnauthorized: false, // Set to true if your certificates are valid
	});

	return (request: RequestInfo, init?: RequestInit) =>
		fetch(request, { ...init, agent });
}

// Default base URL
let baseUrl = "https://privacypass-proxy-dev.cloudflare-mallard.workers.dev";

// Test cases
const testCases = [
	{
		name: "handleV1TokenConfigs",
		endpoint: "/api/v1/token-configs",
	},
	{
		name: "handleTokenConfigs",
		endpoint: "/api/v2/token-configs",
	},
	{
		name: "handleApiKeys",
		endpoint: "/api/keys",
	},
	{
		name: "handleV2Keys",
		endpoint: "/api/v2/keys",
	},
	{
		name: "handleKeyId",
		endpoint: "/api/v1/key-id?region=US-PST",
	},
	{
		name: "handleKeyIdV2",
		endpoint: "/api/v2/key-id?region=US-PST",
	},
];

function findNotAfterField(obj: object): string | undefined {
	if (!obj || typeof obj !== "object") return undefined;

	if (obj.hasOwnProperty("not_after")) {
		return (obj as Record<string, string>).not_after;
	}

	for (const key of Object.keys(obj)) {
		const result = findNotAfterField(obj[key]);
		if (result !== undefined) {
			return result;
		}
	}

	return undefined;
}

export async function testE2E(
	baseUrl: string,
	mTLS?: MTLSConfiguration,
	verbose: boolean = false,
): Promise<TestResult[]> {
	console.log(`Starting E2E tests with baseUrl: ${baseUrl}`);
	if (mTLS) console.log(`mTLS configuration detected: ${JSON.stringify(mTLS)}`);
	const proxyFetch = mTLS ? fetchWithMTLS(mTLS) : fetch;

	const results: TestResult[] = [];

	for (const { name, endpoint } of testCases) {
		const url = `${baseUrl}${endpoint}`;

		if (verbose) {
			console.log(`Testing "${name}" with URL: ${url}`);
		}

		try {
			const response = await proxyFetch(url);

			if (response.status !== 200) {
				results.push({
					name,
					status: "failed",
					message: `Expected status 200 but received ${response.status}`,
				});
				continue;
			}

			const jsonResponse: any = await response.json();

			const notAfter = findNotAfterField(jsonResponse);
			if (!notAfter) {
				results.push({
					name,
					status: "failed",
					message: `"not_after" property is missing or not found in the response.`,
				});
				continue;
			}

			// Validate `not_after` date
			const notAfterDate = new Date(notAfter);
			if (isNaN(notAfterDate.getTime())) {
				results.push({
					name,
					status: "failed",
					message: `"not_after" contains an invalid date: ${notAfter}`,
				});
			} else {
				if (verbose) {
					console.log(
						`"not_after" for "${name}": ${notAfterDate.toISOString()}`,
					);
				}
				results.push({
					name,
					status: "passed",
					message: `Test passed. "not_after" is valid and set to ${notAfterDate.toISOString()}.`,
				});
			}
		} catch (error) {
			results.push({
				name,
				status: "failed",
				message: `Test failed with error: ${error}`,
			});
		}
	}

	return results;
}

async function main() {
	console.log("Parsing command-line arguments...");
	program
		.option("--cert <path>", "Path to client certificate. e.g. ./client.crt")
		.option("--key <path>", "Path to client key. e.g. ./client.key")
		.option("--url <url>", "Base URL of the gateway")
		.option("--verbose", "Enable verbose output")
		.action(async (options) => {
			try {
				console.log("Command-line options received:", options);

				// Set baseUrl if provided
				if (options.url) {
					baseUrl = options.url;
				}

				let mTLS: MTLSConfiguration | undefined;

				if (options.cert && options.key) {
					mTLS = { certPath: options.cert, keyPath: options.key };
				} else if (options.cert || options.key) {
					console.error("You must specify both --cert and --key for mTLS.");
					process.exit(1);
				}

				const results = await testE2E(baseUrl, mTLS, options.verbose);

				// Result report
				console.log(
					"Note: not_after day includes a 48 hour buffer after last rotation",
				);
				console.log("\nTest Results:");
				results.forEach((result) => {
					console.log(
						`- ${result.name}: ${result.status.toUpperCase()} - ${result.message}`,
					);
				});

				const failedTests = results.filter(
					(result) => result.status === "failed",
				);
				if (failedTests.length > 0) {
					console.error(`\n${failedTests.length} test(s) failed.`);
					process.exit(1);
				} else {
					console.log("\nAll tests passed successfully!");
				}
			} catch (e) {
				console.error("An error occurred during execution:", e);
				process.exit(1);
			}
		});

	await program.parseAsync(process.argv);
}

console.log("Starting the application...");
main();
