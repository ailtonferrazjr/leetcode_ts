/*
 * 2725 | Interval Cancellation
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given a function "fn", an array of arguments "args", and an interval time
 * "t", return a cancel function "cancelFn".
 *
 * After a delay of "cancelTimeMs", the returned cancel function "cancelFn" will
 * be invoked.
 *
 * -> setTimeout(cancelFn, cancelTimeMs)
 *
 * The function "fn" should be called with "args" immediately and then called
 * again every "t" milliseconds until "cancelFn" is called at "cancelTimeMs" ms.
 *
 * URL: https://leetcode.com/problems/interval-cancellation/
 */

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
export type Fn = (...args: JSONValue[]) => void;

export function cancellableWithRecursion(
	fn: Fn,
	args: JSONValue[],
	t: number,
): Function {
	let isCancelled: boolean = false;

	fn(...args);

	const startInterval = (): void => {
		setTimeout(() => {
			if (isCancelled) return;
			fn(...args);
			startInterval();
		}, t);
	};

	startInterval();

	return function cancelFn() {
		isCancelled = true;
	};
}

export function cancellable(fn: Fn, args: JSONValue[], t: number) {
	fn(...args);

	const timeoutId = setInterval(() => {
		fn(...args);
	}, t);

	const cancelInterval = () => {
		clearInterval(timeoutId);
	};
	return cancelInterval;
}
