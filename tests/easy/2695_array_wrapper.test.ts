/*
 * TESTS FILE
 * 2695 | Array Wrapper
 * Difficulty: Easy
 * ----------------
 *
 */

import { ArrayWrapper } from "@easy/2695_array_wrapper.js";

describe("2695 | Array Wrapper", () => {
	const sample = [
		{
			nums: [
				[1, 2],
				[3, 4],
			],
			operation: "Add",
			expected: 10,
		},
		{
			nums: [[23, 98, 42, 70]],
			operation: "String",
			expected: "[23,98,42,70]",
		},
		{
			nums: [[], []],
			operation: "Add",
			expected: 0,
		},
	];

	test.each(sample)(
		"Testing the arr '$nums', with operation '$operation' to return '$expected'",
		({ nums, operation, expected }) => {
			if (operation == "Sum") {
				const arr1 = new ArrayWrapper(nums[0]);
				const arr2 = new ArrayWrapper(nums[1]);
				expect(arr1.valueOf() + arr2.valueOf()).toEqual(expected);
			}

			if (operation == "String") {
				const result = String(new ArrayWrapper(nums[0]));
				expect(result).toEqual(expected);
			}
		},
	);
});
