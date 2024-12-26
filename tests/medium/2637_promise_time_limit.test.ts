/*
 * TESTS FILE
 * 2637 | Promise Time Limit
 * Difficulty: Medium
 * ----------------
 *
 */

import { time } from "console";
import { type Fn, timeLimit } from "@medium/2637_promise_time_limit.js";

describe("2637 | Promise Time Limit", () => {
	const fnOne = async (n: number) => {
		await new Promise((res) => setTimeout(res, 100));
		return n * n;
	};

	const fnTwo = async (n: number) => {
		await new Promise((res) => setTimeout(res, 100));
		return n * n;
	};

	const fnThree = async (a: number, b: number) => {
		await new Promise((res) => setTimeout(res, 120));
		return a + b;
	};

	const fnFour = () => {
		throw "Error";
	};

	const samples = [
		{
			fn: fnOne,
			inputs: [5],
			t: 50,
			expected: { rejected: "Time Limit Exceeded", time: 50 },
		},
		{
			fn: fnTwo,
			inputs: [5],
			t: 150,
			expected: { resolved: 25, time: 100 },
		},
		{
			fn: fnThree,
			inputs: [5, 10],
			t: 150,
			expected: { resolved: 15, time: 120 },
		},
		{
			fn: fnFour,
			inputs: [],
			t: 1000,
			expected: { rejected: "Error", time: 0 },
		},
	];

	test.each(samples)(
		"Testing the fn $fn, with timeout limit of $t and inputs $inputs, expecting $expected",
		async ({ fn, inputs, t, expected }) => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const result: { [key: string]: any } = {};
			const start = performance.now();
			const limited = timeLimit(fn, t);

			try {
				const value = await limited(...inputs);
				result.resolved = value;
			} catch (e) {
				result.rejected = e;
			} finally {
				result.time = performance.now() - start;
			}

			if (Object.keys(result).includes("rejected")) {
				expect(result.rejected).toEqual(expected.rejected);
			}

			if (Object.keys(result).includes("resolved")) {
				expect(result.resolved).toEqual(expected.resolved);
			}
			const diff = Math.abs((result.time as number) - expected.time);
			expect(diff).toBeLessThanOrEqual(5);
		},
	);
});
