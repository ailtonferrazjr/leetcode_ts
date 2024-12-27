/*
 * 2619 | Array Prototype Last
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Write code that enhances all arrays such that you can call
 * the "array.last()" method on any array and it will return the last element.
 * If there are no elements in the array, it should return "-1".
 *
 * You may assume the array is the output of "JSON.parse".
 *
 * URL: https://leetcode.com/problems/array-prototype-last/
 */

declare global {
	interface Array<T> {
		last(): T | -1;
	}
}
Array.prototype.last = function () {
	if (this.length == 0) return -1;
	return this[this.length - 1];
};

export {};
