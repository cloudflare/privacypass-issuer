import { shouldRevalidate, STALE_WHILE_REVALIDATE_IN_MS } from '../src/cache';

describe('cache revalidation', () => {
	it('should not revalidate before expiration', () => {
		const expiration = new Date(Date.now());
		expect(shouldRevalidate(expiration)).toBe(false);
	});

	it('should revalidate when after expiration and staleness', () => {
		const expiration = new Date(Date.now() - STALE_WHILE_REVALIDATE_IN_MS);
		expect(shouldRevalidate(expiration)).toBe(true);
	});

	it('should not always revalidate when after expiration but still within staleness interval', () => {
		const expiration = new Date(Date.now() - STALE_WHILE_REVALIDATE_IN_MS / 2);
		let hasSeenFalse = false;
		let hasSeenTrue = false;
		for (let i = 0; i < 1_000_000; i += 1) {
			if (shouldRevalidate(expiration)) {
				hasSeenTrue = true;
			} else {
				hasSeenFalse = true;
			}
		}
		expect(hasSeenFalse).toBe(true);
		expect(hasSeenTrue).toBe(true);
	});
});
