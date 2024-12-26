/*
 * 2637 | Promise Time Limit
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given an asynchronous function "fn" and a time "t" in milliseconds, return a
 * new time limited version of the input function. "fn" takes arguments provided
 * to the time limited function.
 * 
 * The time limited function should follow these rules:
 * 
 * -> If the "fn" completes within the time limit of "t" milliseconds, the time
 * limited function should resolve with the result.
 -> If the execution of the
 * "fn" exceeds the time limit, the time limited function should reject with the
 * string ""Time Limit Exceeded"".
 *
 * URL: https://leetcode.com/problems/promise-time-limit/
*/

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Fn = (...params: any[]) => Promise<any>;

export function timeLimit(fn: Fn, t: number): Fn {
	return async function (...args) {
		return new Promise((res, rej) => {
			setTimeout(() => {
				rej("Time Limit Exceeded");
			}, t);

			fn(...args)
				.then((v) => res(v))
				.catch((e) => rej(e));
		});
	};
}

export function timeLimitWithRace(fn: Fn, t: number): Fn {
	return async function (...args) {
		const timeoutPromise = new Promise((_, rej) => {
			setTimeout(() => {
				rej("Time Limit Exceeded");
			}, t);
		});

		const functionPromise = new Promise((res, rej) => {
			try {
				res(fn(...args));
			} catch (e) {
				rej(e);
			}
		});

		return Promise.race([timeoutPromise, functionPromise]);
	};
}
