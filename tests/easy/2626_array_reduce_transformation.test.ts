/*
 * TESTS FILE
 * 2626 | Array Reduce Transformation
 * Difficulty: Easy
 * ----------------
 *
*/

import { type Fn, reduce } from "@easy/2626_array_reduce_transformation.js";

interface Sample {
	nums: number[];
	fn: Fn;
	output: number;
	init: number;
}

describe("2626. Array Reduce Transformation", () => {
	const funOne = (accum: number, curr: number): number => accum + curr;
	const funTwo = (accum: number, curr: number): number => accum + curr * curr;
	const funThree = (_accum: number, _curr: number): number => 0;

	const testSamples: Sample[] = [
		{
			nums: [1, 2, 3, 4],
			fn: funOne,
			output: 10,
			init: 0,
		},
		{
			nums: [1, 2, 3, 4],
			fn: funTwo,
			output: 130,
			init: 100,
		},
		{
			nums: [],
			fn: funThree,
			output: 25,
			init: 25,
		},
	];

	test.each(testSamples)(
		"Testing array $nums with inital value of $init, with function $fn, to output $output",
		({
			nums,
			fn,
			init,
			output,
		}: {
			nums: number[];
			fn: Fn;
			init: number;
			output: number;
		}) => {
			expect(reduce(nums, fn, init)).toEqual(output);
		},
	);
});
