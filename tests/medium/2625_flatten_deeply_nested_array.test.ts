/*
 * TESTS FILE
 * 2625 | Flatten Deeply Nested Array
 * Difficulty: Medium
 * ----------------
 *
 */

import { flat, flatTwo } from "@medium/2625_flatten_deeply_nested_array.js";

describe("2626 | Flatten Deeply Nested Array", () => {
	const sample = [
		{
			arr: [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]],
			n: 0,
			output: [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]],
		},
		{
			arr: [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]],
			n: 1,
			output: [1, 2, 3, 4, 5, 6, 7, 8, [9, 10, 11], 12, 13, 14, 15],
		},
		{
			arr: [1, 2, 3, [4, 5, 6], [7, 8, [9, 10, 11], 12], [13, 14, 15]],
			n: 2,
			output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		},
	];

	test.each(sample)(
		"Testing flatting arr $arr, with deepness of $n, to output $output",
		({ arr, n, output }) => {
			expect(flat(arr, n)).toEqual(output);
			expect(flatTwo(arr, n)).toEqual(output);
		},
	);
});
