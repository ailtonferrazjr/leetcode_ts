/*
 * 2634 | Filter Elements from Array
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an integer array "arr" and a filtering function "fn", return a filtered
 * array "filteredArr".
 * 
 * The "fn" function takes one or two arguments:
 * 
 * "arr[i]" - number from the "arr"
	"i" - index of "arr[i]"
 * 
 * "filteredArr" should only contain the elements from the "arr" for which the
 * expression "fn(arr[i], i)" evaluates to a truthy value. A truthy value is a
 * value where "Boolean(value)" returns "true".
 * 
 * Please solve it without the built-in "Array.filter" method.
 *
 * URL: https://https://leetcode.com/problems/filter-elements-from-array/
*/

export type Fn = (n: number, i: number) => boolean;

export function filterElementsFromArray(arr: number[], fn: Fn): number[] {
	const newArray: number[] = [];
	for (let i = 0; i < arr.length; i++) {
		if (fn(arr[i], i)) {
			newArray.push(arr[i]);
		}
	}
	return newArray;
}
