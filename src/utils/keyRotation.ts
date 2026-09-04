export function shouldClearKey(keyNotBefore: Date, lifespanInMs: number): boolean {
	const keyExpirationTime = keyNotBefore.getTime() + lifespanInMs;
	return Date.now() > keyExpirationTime;
}

/**
 * Determines if a key should be served based on its notBefore time, lifespan, and grace period.
 *
 * Apple asked us to serve last week's key for a short time to paper over a bug in their clients.
 * Basically after rotation they want a grace period where we serve three keys instead of two.
 *
 * @param keyNotBefore - The notBefore timestamp of the key
 * @param currentTime - The current time
 * @param lifespanInMs - The key's lifespan in milliseconds
 * @param gracePeriodInMs - Additional grace period after lifespan in milliseconds
 * @returns true if the key should be served, false otherwise
*/
export function shouldServeKey(
	keyNotBefore: Date,
	currentTime: Date,
	lifespanInMs: number,
	gracePeriodInMs: number
): boolean {
	const keyNotBeforeMs = keyNotBefore.getTime();
	const currentTimeMs = currentTime.getTime();
	const isValid = keyNotBeforeMs <= currentTimeMs;
	const expirationTime = keyNotBeforeMs + lifespanInMs + gracePeriodInMs;
	const notExpired = currentTimeMs <= expirationTime;
	return isValid && notExpired;
}
