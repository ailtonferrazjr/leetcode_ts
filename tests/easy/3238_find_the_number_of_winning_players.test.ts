/*
 * TESTS FILE
 * 3238 | Find the Number of Winning Players
 * Difficulty: Easy
 * ----------------
 *
 */

import { winningPlayerCount } from "@easy/3238_find_the_number_of_winning_players.js";

describe("winningPlayersCount", () => {
	const testsSamples = [
		{
			testNumber: 4,
			testArray: [
				[0, 0],
				[1, 0],
				[1, 0],
				[2, 1],
				[2, 1],
				[2, 0],
			],
			testResult: 2,
		},
		{
			testNumber: 5,
			testArray: [
				[1, 1],
				[1, 2],
				[1, 3],
				[1, 4],
			],
			testResult: 0,
		},
		{
			testNumber: 5,
			testArray: [
				[1, 1],
				[2, 4],
				[2, 4],
				[2, 4],
			],
			testResult: 1,
		},
	];
	testsSamples.forEach((it, index) => {
		test(`example ${index + 1}`, () => {
			expect(winningPlayerCount(it.testNumber, it.testArray)).toBe(
				it.testResult,
			);
		});
	});
});
