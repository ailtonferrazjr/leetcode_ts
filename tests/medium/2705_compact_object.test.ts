/*
 * TESTS FILE
 * 2705 | Compact Object
 * Difficulty: Medium
 * ----------------
 *
 */

import exp from "constants";
import { compactObject } from "@medium/2705_compact_object.js";

describe("2705 | Compact Object", () => {
	const sample = [
		{
			obj: [null, 0, false, 1],
			expected: [1],
		},
		{
			obj: { a: null, b: [false, 1] },
			expected: { b: [1] },
		},
		{
			obj: [null, 0, 5, [0], [false, 16]],
			expected: [5, [], [16]],
		},
	];

	test.each(sample)(
		"Testing obj $obj, to return $expected",
		({ obj, expected }) => {
			expect(compactObject(obj)).toEqual(expected);
		},
	);
});
