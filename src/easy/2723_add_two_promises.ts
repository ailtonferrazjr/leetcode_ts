/*
 * 2723 | Add Two Promises
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given two promises "promise1" and "promise2", return a new promise.
 * "promise1" and "promise2" will both resolve with a number. The returned
 * promise should resolve with the sum of the two numbers.
 *
 * URL: https://leetcode.com/problems/add-two-promises/
 */

export type P = Promise<number>;

export async function addTwoPromises(promise1: P, promise2: P): P {
	const promises = await Promise.all([promise1, promise2]);
	return promises[0] + promises[1];
}
