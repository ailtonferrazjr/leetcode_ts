/*
 * TESTS FILE
 * 2623 | Memoize
 * Difficulty: Medium
 * ----------------
 *
 */

import { type Fn, memoize } from "@medium/2623_memoize.js";

// Unwrapped versions that do the actual recursion/logic
function sumUnwrapped(a: number, b: number): number {
	return a + b;
}

function fibUnwrapped(n: number): number {
	if (n <= 1) return 1;
	return fibUnwrapped(n - 1) + fibUnwrapped(n - 2);
}

function factorialUnwrapped(n: number): number {
	if (n <= 1) return 1;
	return n * factorialUnwrapped(n - 1);
}

/**
 * Creates a top-level wrapped function that increments callCount once per call,
 * and then internally calls the unwrapped function (so we do not count recursive calls).
 */
function getFunctionWithCounter(fnName: string) {
	let callCount = 0; // track how many times the top-level function is called

	const wrappedSum = (a: number, b: number) => {
		callCount++; // only increments on top-level call
		return sumUnwrapped(a, b); // recursion does not apply here
	};

	const wrappedFib = (n: number) => {
		callCount++; // only increments on top-level call
		return fibUnwrapped(n); // recursion calls unwrapped version
	};

	const wrappedFactorial = (n: number) => {
		callCount++; // only increments on top-level call
		return factorialUnwrapped(n); // recursion calls unwrapped version
	};

	switch (fnName) {
		case "sum":
			return { fn: wrappedSum as Fn, getCount: () => callCount };
		case "fib":
			return { fn: wrappedFib as Fn, getCount: () => callCount };
		case "factorial":
			return { fn: wrappedFactorial as Fn, getCount: () => callCount };
		default:
			throw new Error(`Unknown function name: ${fnName}`);
	}
}

const testSamples = [
	{
		fnName: "sum",
		actions: ["call", "call", "getCallCount", "call", "getCallCount"],
		values: [[2, 2], [2, 2], [], [1, 2], []],
		expected: [4, 4, 1, 3, 2],
	},
	{
		fnName: "factorial",
		actions: ["call", "call", "call", "getCallCount", "call", "getCallCount"],
		values: [[2], [3], [2], [], [3], []],
		expected: [2, 6, 2, 2, 6, 2],
	},
	{
		fnName: "fib",
		actions: ["call", "getCallCount"],
		values: [[5], []],
		expected: [8, 1],
	},
];

describe("2623 | Memoize", () => {
	test.each(testSamples)(
		"memoized '$fnName'()",
		({ fnName, actions, values, expected }) => {
			// 1) Get the top-level function that increments callCount once per call
			const { fn, getCount } = getFunctionWithCounter(fnName);

			// 2) Memoize the *top-level* function
			const memoizedFn = memoize(fn);

			const results: number[] = [];

			// 3) Perform each action in the scenario
			for (let i = 0; i < actions.length; i++) {
				const action = actions[i];
				const args = values[i];

				if (action === "call") {
					// call the memoized function with the given arguments
					const val = memoizedFn(...args);
					results.push(val);
				} else if (action === "getCallCount") {
					// get the callCount so far
					results.push(getCount());
				}
			}

			// 4) Compare actual results with expected
			expect(results).toStrictEqual(expected);
		},
	);
});
