/*
 * 2666 | Allow One Function Call
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given a function "fn", return a new function that is identical to the
 * original function except that it ensures "fn" is called at most once.
 *
 * -> The first time the returned function is called, it should return the same
 * result as fn.
 * -> Every subsequent time it is called, it should return undefined.
 *
 * URL: https://leetcode.com/problems/allow-one-function-call/
 */

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
export type OnceFn = (...args: JSONValue[]) => JSONValue | undefined;

export function once(fn: Function): OnceFn {
	let hasBeenCalled: boolean = false;
	return function (...args) {
		if (hasBeenCalled) return undefined;
		hasBeenCalled = true;
		return fn(...args);
	};
}
