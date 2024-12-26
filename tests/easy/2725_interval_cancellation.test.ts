/*
 * TESTS FILE
 * 2725 | Interval Cancellation
 * Difficulty: Easy
 * ----------------
 *
 */

import {
	type Fn,
	type JSONValue,
	cancellable,
} from "@easy/2725_interval_cancellation.js";

describe("2725 | Interval Cancellation", () => {
	const fnOne = (x: number) => x * 2;
	const fnTwo = (x1: number, x2: number) => x1 * x2;
	const fnThree = (x1: number, x2: number, x3: number) => x1 + x2 + x3;

	const testSamples = [
		{
			fn: fnOne,
			args: [4],
			t: 35,
			cancelTimeMs: 190,
			expected: [
				{ time: 0, returned: 8 },
				{ time: 35, returned: 8 },
				{ time: 69, returned: 8 },
				{ time: 104, returned: 8 },
				{ time: 139, returned: 8 },
				{ time: 175, returned: 8 },
			],
		},
		{
			fn: fnTwo,
			args: [2, 5],
			t: 30,
			cancelTimeMs: 165,
			expected: [
				{ time: 0, returned: 10 },
				{ time: 30, returned: 10 },
				{ time: 60, returned: 10 },
				{ time: 90, returned: 10 },
				{ time: 121, returned: 10 },
				{ time: 151, returned: 10 },
			],
		},
		{
			fn: fnThree,
			args: [5, 1, 3],
			t: 50,
			cancelTimeMs: 180,
			expected: [
				{ time: 0, returned: 9 },
				{ time: 50, returned: 9 },
				{ time: 100, returned: 9 },
				{ time: 150, returned: 9 },
			],
		},
	];

	test.each(testSamples)(
		"Testing function $fn for args $args, with timer $t, with cancelTime $cancelTimeMs, that should output: $expected",
		async ({ fn, args, t, cancelTimeMs, expected }) => {
			const result: { time: number; returned: number }[] = [];
			const start = performance.now();

			function logResult() {
				const timeDiff = Math.floor(performance.now() - start);
				const typedFn = fn as unknown as (...nums: number[]) => number;
				result.push({ time: timeDiff, returned: typedFn(...args) });
			}

			const log = logResult as unknown as Fn;
			const cancelFn = cancellable(log, args, t);
			setTimeout(cancelFn, cancelTimeMs);

			await new Promise((resolve) => {
				setTimeout(resolve, Math.max(t, cancelTimeMs) + 30);
			});

			if (expected.length > 0) {
				expect(result).toHaveLength(expected.length);
				for (let i = 0; i < expected.length; i++) {
					expect(result[i].returned).toEqual(expected[i].returned);
					const diff = Math.abs(result[i].time - expected[i].time);
					expect(diff).toBeLessThanOrEqual(10);
				}
			}
			if (expected.length == 0) {
				expect(result).toHaveLength(0);
			}
		},
	);
});
