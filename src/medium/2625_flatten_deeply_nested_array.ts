/*
 * 2625 | Flatten Deeply Nested Array
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given a multi-dimensional array "arr" and a depth "n",
 * return a flattened version of that array.
 *
 * A multi-dimensional array is a recursive data structure that contains
 * integers or other multi-dimensional arrays.
 *
 * A flattened array is a version of that array with some or all of the
 * sub-arrays removed and replaced with the actual elements in that sub-array.
 * This flattening operation should only be done if the current depth of
 * nesting is less than "n". The depth of the elements in the first array are
 * considered to be "0".
 *
 * Please solve it without the built-in "Array.flat" method.
 *
 * URL: https://leetcode.com/problems/flatten-deeply-nested-array/
 */

export type MultiDimensionalArray = (number | MultiDimensionalArray)[];

export const flat = function (
	arr: MultiDimensionalArray,
	n: number,
): MultiDimensionalArray {
	const result: (number | number[])[] = [];

	// In case the n is equal to 0;
	if (n === 0) return arr;

	// Now call recursiverly
	return iterateOverArray(arr, 0, n, result);
};

function isNumber(n: number | MultiDimensionalArray): boolean {
	return typeof n == "number";
}

function pushToResult(
	result: MultiDimensionalArray,
	n: number | MultiDimensionalArray,
): MultiDimensionalArray {
	result.push(n);
	return result;
}

function iterateOverArray(
	array: MultiDimensionalArray,
	deepness: number,
	n: number,
	acc: MultiDimensionalArray,
): MultiDimensionalArray {
	for (let i = 0; i < array.length; i++) {
		if (isNumber(array[i]) || deepness >= n) {
			acc = pushToResult(acc, array[i]);
			continue;
		}

		iterateOverArray(array[i] as MultiDimensionalArray, deepness + 1, n, acc);
	}

	return acc;
}

export const flatTwo = function (
	arr: MultiDimensionalArray,
	n: number,
): MultiDimensionalArray {
	const result: (number | MultiDimensionalArray)[] = [];

	const flattening = (nums: MultiDimensionalArray, l: number): void => {
		for (const num of nums) {
			if (Array.isArray(num) && l > 0 && l <= n) {
				flattening(num, l - 1);
			} else {
				result.push(num);
			}
		}
	};

	flattening(arr, n);
	return result;
};
