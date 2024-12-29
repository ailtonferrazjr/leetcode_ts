/*
 * 2724 | Sort By
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an array "arr" and a function "fn", return a sorted array "sortedArr".
 * You can assume "fn" only returns numbers and those numbers determine the sort
 * order of "sortedArr". "sortedArr" must be sorted in ascending order by "fn"
 * output.
 *
 * You may assume that "fn" will never duplicate numbers for a given array.
 *
 * URL: https://leetcode.com/problems/sort-by/
 */

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
export type Fn = (value: JSONValue) => number;

export function sortBy(arr: JSONValue[], fn: Fn): JSONValue[] {
	return arr.sort((a: JSONValue, b: JSONValue) => fn(a) - fn(b));
}
