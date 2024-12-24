/*
 * TESTS FILE
 * 2621 | Sleep
 * Difficulty: Easy
 * ----------------
 *
 */

import { sleep } from "@easy/2621_sleep.js";

describe("2621 | Sleep", () => {
	const testSamples = [
		{
			millis: 100,
			expected: 101,
		},
		{ millis: 200, expected: 201 },
	];

	test.each(testSamples)(
		"Testing the delay $millis, which expect the result to be close to $expected",
		async ({ millis, expected }: { millis: number; expected: number }) => {
			const start = Date.now();
			await sleep(millis);
			const end = Date.now();
			const elapsed = end - start;
			expect(elapsed).toBeGreaterThanOrEqual(millis);
			expect(elapsed).toBeLessThan(expected + 2);
		},
	);
});
