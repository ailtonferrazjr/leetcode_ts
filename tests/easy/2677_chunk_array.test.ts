/*
 * TESTS FILE
 * 2677 | Chunk Array
 * Difficulty: Easy
 * ----------------
 *
 */

import { chunk } from "@easy/2677_chunk_array.js";
import { type JSONValue, type Obj } from "@easy/2677_chunk_array.js";

describe("2677 | Chunk Array", () => {
	const sample = [
		{
			arr: [1, 2, 3, 4, 5] as unknown as Obj[],
			size: 1,
			expected: [[1], [2], [3], [4], [5]],
		},
		{
			arr: [1, 9, 6, 3, 2] as unknown as Obj[],
			size: 3,
			expected: [
				[1, 9, 6],
				[3, 2],
			],
		},
		{
			arr: [8, 5, 3, 2, 6] as unknown as Obj[],
			size: 6,
			expected: [[8, 5, 3, 2, 6]],
		},
		{
			arr: [],
			size: 1,
			expected: [],
		},
	];

	test.each(sample)(
		"Chunking the arr $arr, with size $size, expecting $expected",
		({ arr, size, expected }) => {
			const result = chunk(arr, size);
			expect(result).toEqual(expected);
		},
	);
});
