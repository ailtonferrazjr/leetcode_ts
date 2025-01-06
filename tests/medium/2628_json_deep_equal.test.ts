/*
 * TESTS FILE
 * 2628 | JSON Deep Equal
 * Difficulty: Medium
 * ----------------
 *
 */

import {
	type JSONValue,
	areDeeplyEqual,
} from "@medium/2628_json_deep_equal.js";

describe("2628 | JSON Deep Equal", () => {
	const sample: { o1: JSONValue; o2: JSONValue; expected: boolean }[] = [
		{
			o1: { x: 1, y: 2 },
			o2: { x: 1, y: 2 },
			expected: true,
		},
		{
			o1: { y: 2, x: 1 },
			o2: { x: 1, y: 2 },
			expected: true,
		},
		{
			o1: { x: null, L: [1, 2, 3] },
			o2: { x: null, L: ["1", "2", "3"] },
			expected: false,
		},
		{
			o1: true,
			o2: false,
			expected: false,
		},
		{
			o1: { "0": 1 },
			o2: [1],
			expected: false,
		},
		{
			o1: { x: null, L: [1, 2, 3] },
			o2: { x: null, L: [1, 2, 3] },
			expected: true,
		},
		{
			o1: null,
			o2: {},
			expected: false,
		},
	];

	test.each(sample)(
		"Testing Deep Equality between o1 '$o1' and o2 '$o2', to be $expected",
		({ o1, o2, expected }) => {
			expect(areDeeplyEqual(o1, o2)).toBe(expected);
		},
	);
});
