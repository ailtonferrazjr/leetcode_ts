/*
 * TEST FILE
 * 2676 | Throttle
 * Difficulty: Medium
 * ------------------
 */

import { throttle } from "@medium/2676_throttle.js";
import { describe, expect, it } from "vitest";

describe("2676 | Throttle", () => {
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms)); // Helper to simulate delays
	const margin = 10; // Acceptable margin in milliseconds

	const cases = [
		{
			t: 100,
			fnCalls: [{ t: 20, inputs: [1] }],
			expected: [{ t: 20, inputs: [1] }],
		},
		{
			t: 50,
			fnCalls: [
				{ t: 50, inputs: [1] },
				{ t: 75, inputs: [2] },
			],
			expected: [
				{ t: 50, inputs: [1] },
				{ t: 100, inputs: [2] },
			],
		},
		{
			t: 70,
			fnCalls: [
				{ t: 50, inputs: [1] },
				{ t: 75, inputs: [2] },
				{ t: 90, inputs: [8] },
				{ t: 140, inputs: [5, 7] },
				{ t: 300, inputs: [9, 4] },
			],
			expected: [
				{ t: 50, inputs: [1] },
				{ t: 120, inputs: [8] },
				{ t: 190, inputs: [5, 7] },
				{ t: 300, inputs: [9, 4] },
			],
		},
	];

	it.each(cases)(
		"Throttle test with t=$t ms and calls=$fnCalls",
		async ({ t, fnCalls, expected }) => {
			const actualCalls: { t: number; inputs: any[] }[] = [];
			const startTime = Date.now();

			// Mock function to capture execution time
			const mockFn = (...args: any[]) => {
				actualCalls.push({ t: Date.now() - startTime, inputs: args });
			};

			const throttled = throttle(mockFn, t);

			// Simulate calls with real delays
			for (const { t: callTime, inputs } of fnCalls) {
				const now = Date.now() - startTime;
				if (callTime > now) await sleep(callTime - now); // Wait until the correct time
				throttled(...inputs);
			}

			// Wait for all pending timers to finish
			await sleep(t * fnCalls.length);

			// Compare actual calls with expected results, allowing for a margin of error
			expected.forEach((expectedCall, index) => {
				const actualCall = actualCalls[index];
				expect(actualCall).toBeDefined();
				expect(actualCall.inputs).toEqual(expectedCall.inputs);
				expect(Math.abs(actualCall.t - expectedCall.t)).toBeLessThanOrEqual(
					margin,
				);
			});
		},
	);
});
