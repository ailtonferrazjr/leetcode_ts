/*
 * 2676 | Throttle
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given a function "fn" and a time in milliseconds "t", return a throttled
 * version of that function.
 *
 * A throttled function is first called without delay and then, for a time
 * interval of "t" milliseconds, can't be executed but should store the latest
 * function arguments provided to call "fn" with them after the end of the
 * delay.
 *
 * For instance, "t = 50ms", and the function was called at "30ms", "40ms", and
 * "60ms".
 *
 * At "30ms", without delay, the throttled function "fn" should be called with
 * the arguments, and calling the throttled function "fn" should be blocked for
 * the following "t" milliseconds.
 *
 * At "40ms", the function should just save arguments.
 *
 * At "60ms", arguments should overwrite currently stored arguments from the
 * second call because the second and third calls are made before "80ms". Once
 * the delay has passed, the throttled function "fn" should be called with the
 * latest arguments provided during the delay period, and it should also create
 * another delay period of "80ms + t".
 *
 * The above diagram shows how throttle will transform events. Each rectangle
 * represents 100ms and the throttle time is 400ms. Each color represents a
 * different set of inputs.
 *
 * URL: https://leetcode.com/problems/throttle/
 */

type F = (...args: number[]) => void;

export function throttle(fn: F, t: number): F {
	let timeout: NodeJS.Timeout | null;
	let pendingArgs: number[] | null;

	function intervalFun() {
		if (!pendingArgs) {
			clearInterval(timeout!);
			timeout = null;
		} else {
			fn(...pendingArgs);
			pendingArgs = null;
		}
	}

	return function throttled(...args) {
		if (!timeout) {
			fn(...args);
			timeout = setInterval(intervalFun, t);
		} else {
			pendingArgs = args;
		}
	};
}
