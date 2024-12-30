/*
 * TESTS FILE
 * 2722 | Join Two Arrays by ID
 * Difficulty: Medium
 * ----------------
 *
 */

import { join, joinWithPointers } from "@medium/2722_join_two_arrays_by_id.js";

describe("2722 | Join Two Arrays by ID", () => {
	const sample = [
		{
			arr1: [
				{ id: 1, x: 1 },
				{ id: 2, x: 9 },
			],
			arr2: [{ id: 3, x: 5 }],
			expected: [
				{ id: 1, x: 1 },
				{ id: 2, x: 9 },
				{ id: 3, x: 5 },
			],
		},
		{
			arr1: [
				{ id: 1, x: 2, y: 3 },
				{ id: 2, x: 3, y: 6 },
			],
			arr2: [
				{ id: 2, x: 10, y: 20 },
				{ id: 3, x: 0, y: 0 },
			],
			expected: [
				{ id: 1, x: 2, y: 3 },
				{ id: 2, x: 10, y: 20 },
				{ id: 3, x: 0, y: 0 },
			],
		},
		{
			arr1: [{ id: 1, b: { b: 94 }, v: [4, 3], y: 48 }],
			arr2: [{ id: 1, b: { c: 84 }, v: [1, 3] }],
			expected: [{ id: 1, b: { c: 84 }, v: [1, 3], y: 48 }],
		},
	];

	test.each(sample)(
		"Testing join the arr1: $arr1 with arr2: $arr2, to result $expected",
		({ arr1, arr2, expected }) => {
			expect(join(arr1, arr2)).toEqual(expected);
			expect(joinWithPointers(arr1, arr2)).toEqual(expected);
		},
	);
});
