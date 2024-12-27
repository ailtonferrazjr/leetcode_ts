/*
 * 2631 | Group By
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Write code that enhances all arrays such that you can call
 * the "array.groupBy(fn)" method on any array and it will return a
 * grouped version of the array.
 *
 * A grouped array is an object where each key is the output of "fn(arr[i])" and
 * each value is an array containing all items in the original array which
 * generate that key.
 *
 * The provided callback "fn" will accept an item in the array and return a
 * string key.
 *
 * The order of each value list should be the order the items appear in the
 * array. Any order of keys is acceptable.
 *
 * Please solve it without lodash's "_.groupBy" function.
 *
 * URL: https://leetcode.com/problems/group-by/
 *
 */

declare global {
	interface Array<T> {
		groupBy(fn: (item: T) => string): Record<string, T[]>;
	}
}

Array.prototype.groupBy = function <T>(fn: (item: T) => string) {
	const returnObject: Record<string, T[]> = {};

	// Use for...of instead of for...in to iterate over array values
	for (const item of this) {
		const result = fn(item);
		if (result in returnObject) {
			returnObject[result].push(item);
		} else {
			returnObject[result] = [item];
		}
	}

	return returnObject;
};
export {};

/**
 * [1,2,3].groupBy(String) // {"1":[1],"2":[2],"3":[3]}
 */
