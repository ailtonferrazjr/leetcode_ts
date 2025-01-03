/*
 * TESTS FILE
 * 2636 | Promise Pool
 * Difficulty: Medium
 * ----------------
 *
 */

import { type F, promisePool } from "@medium/2636_promise_pool.js";

describe("2636 | Promise Pool", () => {
	const sample = [
		{
			functions: [
				() => new Promise((res) => setTimeout(() => res(Date.now()), 300)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 400)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 200)),
			],
			n: 2,
			expected: [[301, 400, 501], 501],
		},
		{
			functions: [
				() => new Promise((res) => setTimeout(() => res(Date.now()), 300)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 400)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 200)),
			],
			n: 5,
			expected: [[300, 401, 200], 401],
		},
		{
			functions: [
				() => new Promise((res) => setTimeout(() => res(Date.now()), 300)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 400)),
				() => new Promise((res) => setTimeout(() => res(Date.now()), 200)),
			],
			n: 1,
			expected: [[300, 700, 901], 901],
		},
	];

	test.each(sample)(
		"Run functions with pool max $n",
		async ({ functions, n, expected }) => {
			const start = Date.now();

			const elapsedTimes: number[] = [];
			const wrappedFunctions = functions.map((fn) => async () => {
				const result = await fn();
				elapsedTimes.push(Date.now() - start); // Record time elapsed
				return result;
			});

			// Run the promise pool
			await promisePool(wrappedFunctions, n);

			// Validate the sequence of resolution times with a margin of ±50ms
			const expectedTimes = expected[0] as number[]; // Explicitly cast to number[]
			const expectedTotal = expected[1] as number; // Explicitly cast to number
			const margin = 50; // Allowable error margin in ms

			// Sort actual elapsed times if concurrency affects order
			const sortedElapsed = [...elapsedTimes].sort((a, b) => a - b);
			const sortedExpected = [...expectedTimes].sort((a, b) => a - b);

			// Validate sorted completion times within margin
			expect(sortedElapsed.length).toBe(sortedExpected.length);
			sortedElapsed.forEach((time, index) => {
				expect(time).toBeGreaterThanOrEqual(sortedExpected[index] - margin);
				expect(time).toBeLessThanOrEqual(sortedExpected[index] + margin);
			});

			// Validate total time within margin
			const totalTime = Math.max(...elapsedTimes);
			expect(totalTime).toBeGreaterThanOrEqual(expectedTotal - margin);
			expect(totalTime).toBeLessThanOrEqual(expectedTotal + margin);
		},
	);
});
