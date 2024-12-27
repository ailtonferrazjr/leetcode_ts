/*
 * TESTS FILE
 * 2721 | Execute Asynchronous Functions in Parallel
 * Difficulty: Medium
 * ----------------
 *
 */

import {
	type Fn,
	promiseAll,
} from "@medium/2721_execute_asynchronous_functions_in_parallel.js";

describe("2721 | Execute Asynchronous Functions in Parallel", () => {
	const samples = [
		{
			functions: [
				() => new Promise((resolve) => setTimeout(() => resolve(5), 200)),
			],
			expected: { t: 195, resolved: [5] },
		},
		{
			functions: [
				() => new Promise((resolve) => setTimeout(() => resolve(1), 200)),
				() =>
					new Promise((_, reject) => setTimeout(() => reject("Error"), 100)),
			],
			expected: { t: 100, rejected: "Error" },
		},
		{
			functions: [
				() => new Promise((resolve) => setTimeout(() => resolve(4), 50)),
				() => new Promise((resolve) => setTimeout(() => resolve(10), 150)),
				() => new Promise((resolve) => setTimeout(() => resolve(16), 100)),
			],
			expected: { t: 150, resolved: [4, 10, 16] },
		},
	];

	test.each(samples)(
		"Testing the following array: $functions and expecting: $expected",
		async ({ functions, expected }) => {
			const start = performance.now();

			try {
				const results = await promiseAll(functions);
				const end = performance.now();

				const result = {
					t: start - end,
					resolved: results,
				};

				expect(result.resolved).toEqual(expected.resolved);
				const diff = Math.abs(start - end - expected.t);
				expect(diff).toBeGreaterThanOrEqual(5);
			} catch (e) {
				const end = performance.now();
				const result = {
					t: start - end,
					rejected: e,
				};

				expect(result.rejected).toEqual(expected.rejected);
				const diff = Math.abs(start - end - expected.t);
				expect(diff).toBeGreaterThanOrEqual(5);
			}
		},
	);
});
