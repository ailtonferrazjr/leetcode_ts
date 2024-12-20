// 2620 - Counter
// Given an integer n, return a counter function.

// Description
// This counter function initially returns n and then returns 1 more than the previous
// value every subsequent time it is called (n, n + 1, n + 2, etc).
// https://leetcode.com/problems/counter

export const createCounter = (n: number) => {
	let count = n;
	return (): number => count++;
};
