/*
 * TESTS FILE
 * 2724 | Sort By
 * Difficulty: Easy
 * ----------------
 *
 */

import { sortBy } from "@easy/2724_sort_by.js";
import { type Fn, type JSONValue } from "@easy/2724_sort_by.js";

describe("2725 | Sort By", () => {
	const fnOne = (x: number) => x as unknown as number;
	const fnTwo = (x: { x: number }) => x.x as unknown as number;
	const fnThree = (x: number[]) => x[1];

	const sample = [
		{
			fn: fnOne,
			arr: [5, 4, 1, 2, 3],
			expected: [1, 2, 3, 4, 5],
		},
		{
			fn: fnTwo,
			arr: [{ x: 1 }, { x: 0 }, { x: -1 }],
			expected: [{ x: -1 }, { x: 0 }, { x: 1 }],
		},
		{
			fn: fnThree,
			arr: [
				[3, 4],
				[5, 2],
				[10, 1],
			],
			expected: [
				[10, 1],
				[5, 2],
				[3, 4],
			],
		},
	];

	test.each(sample)(
		"Testing array $arr with the fn $fn, to result $expected",
		({ fn, arr, expected }) => {
			const sorted = sortBy(arr, fn as Fn);
			expect(sorted).toEqual(expected);
		},
	);
});
