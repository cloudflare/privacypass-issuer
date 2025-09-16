export function shouldClearKey(keyNotBefore: Date, lifespanInMs: number): boolean {
	const keyExpirationTime = keyNotBefore.getTime() + lifespanInMs;
	return Date.now() > keyExpirationTime;
}
