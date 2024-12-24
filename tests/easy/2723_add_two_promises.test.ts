/*
 * TESTS FILE
 * 2723 | Add Two Promises
 * Difficulty: Easy
 * ----------------
 *
 */

import { type P, addTwoPromises } from "@easy/2723_add_two_promises.js";

describe("2723 | Add Two Promises", () => {
	const testSamples = [
		{
			promise1: new Promise((resolve) => setTimeout(() => resolve(2), 20)) as P,
			promise2: new Promise((resolve) => setTimeout(() => resolve(5), 60)) as P,
			expected: 7,
		},
		{
			promise1: new Promise((resolve) =>
				setTimeout(() => resolve(10), 50),
			) as P,
			promise2: new Promise((resolve) =>
				setTimeout(() => resolve(-12), 30),
			) as P,
			expected: -2,
		},
	];

	test.each(testSamples)(
		"Testing $promise1 and $promise2 sum and expecting result: $expected",
		async ({
			promise1,
			promise2,
			expected,
		}: { promise1: P; promise2: P; expected: number }) => {
			expect(await addTwoPromises(promise1, promise2)).toEqual(expected);
		},
	);
});
