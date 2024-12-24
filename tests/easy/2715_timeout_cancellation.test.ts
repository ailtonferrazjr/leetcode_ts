/*
 * TESTS FILE
 * 2715 | Timeout Cancellation
 * Difficulty: Easy
 * ----------------
 *
 */

import { type Fn, cancellable } from "@easy/2715_timeout_cancellation.js";

describe("2715 | Timeout Cancellation", () => {
	const fnOne = (x: number): number => x * 5;
	const fnTwo = (x: number): number => x ** 2;
	const fnThree = (x1: number, x2: number): number => x1 * x2;

	const testSamples = [
		{
			fn: fnOne,
			args: [2],
			t: 20,
			cancelTimeMs: 50,
			expected: [{ time: 20, returned: 10 }],
		},
		{
			fn: fnTwo,
			args: [2],
			t: 100,
			cancelTimeMs: 50,
			expected: [],
		},
		{
			fn: fnThree,
			args: [2, 4],
			t: 30,
			cancelTimeMs: 100,
			expected: [{ time: 30, returned: 8 }],
		},
	];

	test.each(testSamples)(
		"Testing fn with args $args, delay=$t, cancel=$cancelTimeMs, expect $expected",
		async ({ fn, args, t, cancelTimeMs, expected }) => {
			const result: { time: number; returned: number }[] = [];
			const start = performance.now();

			function logNumber(...argsArr: number[]) {
				const diff = Math.floor(performance.now() - start);

				const typedFn = fn as unknown as (...nums: number[]) => number;

				result.push({
					time: diff,
					returned: typedFn(...argsArr),
				});
			}

			const log = logNumber as unknown as Fn;

			const cancel = cancellable(log, args, t);
			setTimeout(cancel, cancelTimeMs);

			await new Promise((resolve) =>
				setTimeout(resolve, Math.max(t, cancelTimeMs) + 30),
			);

			if (expected.length === 1) {
				expect(result).toHaveLength(1);
				expect(result[0].returned).toEqual(expected[0].returned);

				// Requires that the times differ by no more than +/- 5 ms
				const diff = Math.abs(result[0].time - expected[0].time);
				expect(diff).toBeLessThanOrEqual(5);
			} else {
				expect(result).toHaveLength(0);
			}
		},
	);
});
