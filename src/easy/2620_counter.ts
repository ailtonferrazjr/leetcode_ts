/*
 * 2620 | Counter
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an integer "n", return a "counter" function. This "counter" function
 * initially returns "n" and then returns 1 more than the previous value every
 * subsequent time it is called ("n", "n + 1", "n + 2", etc).
 *
 * URL: https://leetcode.com/problems/counter/
 */

export const createCounter = (n: number) => {
	let count = n;
	return (): number => count++;
};
