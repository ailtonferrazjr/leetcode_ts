/*
 * TESTS FILE
 * 2632 | Curry
 * Difficulty: Medium
 * ----------------
 *
 */

import { curry } from "@medium/2632_curry.js";

describe("2632 | Curry", () => {
	const sample = [
		{
			fn: (a: number, b: number, c: number) => a + b + c,
			inputs: [[1], [2], [3]],
			expected: 6,
		},
		{
			fn: (a: number, b: number, c: number) => a + b + c,
			inputs: [[1, 2], [3]],
			expected: 6,
		},
		{
			fn: (a: number, b: number, c: number) => a + b + c,
			inputs: [[], [], [1, 2, 3]],
			expected: 6,
		},
		{
			fn: () => 42,
			inputs: [[]],
			expected: 42,
		},
	];

	test.each(sample)("Testing Curry functions", ({ fn, inputs, expected }) => {
		const curried = curry(fn);
		const result = inputs.reduce((acc, it) => acc(...it), curried);
		expect(result).toEqual(expected);
	});
});
