/*
 * TESTS FILE
 * 2619 | Array Prototype Last
 * Difficulty: Easy
 * ----------------
 *
 */

import "@easy/2619_array_prototype_last.js";

describe("2619 | Array Prototype Last", () => {
	const sample = [
		{
			nums: [null, {}, 3],
			expected: 3,
		},
		{
			nums: [],
			expected: -1,
		},
	];

	test.each(sample)(
		"Testing the array $nums, that should return the last as '$expected'",
		({ nums, expected }) => {
			expect(nums.last()).toBe(expected);
		},
	);

	test("should handle array with single element", () => {
		expect([1].last()).toBe(1);
	});
});
