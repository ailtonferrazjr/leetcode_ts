/*
 * TESTS FILE
 * 2665 | Counter II
 * Difficulty: Easy
 * ----------------
 *
 */

import { type Counter, createCounter } from "@easy/2665_counter_ii.js";

describe("2665 - Counter II Tests", () => {
	const testSamples = [
		{
			init: 5,
			sequence: ["increment", "reset", "decrement"] as (keyof Counter)[],
			result: [6, 5, 4],
		},
		{
			init: 0,
			sequence: [
				"increment",
				"increment",
				"decrement",
				"reset",
				"reset",
			] as (keyof Counter)[],
			result: [1, 2, 1, 0, 0],
		},
	];

	test.each(testSamples)(
		"starting from $init, running the sequence $sequence to produce result $result",
		({
			init,
			sequence,
			result,
		}: { init: number; sequence: (keyof Counter)[]; result: number[] }) => {
			const counter = createCounter(init);
			const results: number[] = [];
			sequence.forEach((element) => {
				results.push(counter[element]());
			});
			expect(results).toEqual(result);
		},
	);
});
