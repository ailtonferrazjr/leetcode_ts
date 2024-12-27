/*
 * TESTS FILE
 * 2727 | Is Object Empty
 * Difficulty: Easy
 * ----------------
 *
 */

import { isEmpty } from "@easy/2727_is_object_empty.js";
import { type JSONValue, type Obj } from "@easy/2727_is_object_empty.js";

describe("2727 | Is Object Empty", () => {
	const sample = [
		{
			obj: { x: 5, y: 42 } as Obj,
			expected: false,
		},
		{
			obj: {} as Obj,
			expected: true,
		},
		{
			obj: [null, false, 0] as Obj,
			expected: false,
		},
	];

	test.each(sample)(
		"Testing object $obj, which isEmpty should return $expected",
		({ obj, expected }) => {
			const { approach1, approach2, approach3 } = isEmpty;
			expect(approach1(obj)).toEqual(expected);
			expect(approach2(obj)).toEqual(expected);
			expect(approach3(obj)).toEqual(expected);
		},
	);
});
