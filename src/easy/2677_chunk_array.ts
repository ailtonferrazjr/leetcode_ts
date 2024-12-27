/*
 * 2677 | Chunk Array
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an array "arr" and a chunk size "size", return a chunked array.
 *
 * A chunked array contains the original elements in "arr", but consists of
 * subarrays each of length "size". The length of the last subarray may be less
 * than "size" if "arr.length" is not evenly divisible by "size".
 *
 * You may assume the array is the output of "JSON.parse". In other words, it is
 * valid JSON.
 *
 * Please solve it without using lodash's "_.chunk" function.
 *
 * URL: https://leetcode.com/problems/chunk-array/
 */

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
export type Obj = Record<string, JSONValue> | Array<JSONValue>;

export function chunk(arr: Obj[], size: number): Obj[][] {
	const chunk: Obj[][] = [];
	let index = 0;

	while (index < arr.length) {
		chunk.push(arr.slice(index, index + size));
		index += size;
	}

	return chunk;
}