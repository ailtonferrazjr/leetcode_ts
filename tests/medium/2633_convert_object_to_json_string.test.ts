/*
 * TESTS FILE
 * 2633 | Convert Object to JSON String
 * Difficulty: Medium
 * ----------------
 *
 */

import {
	type JSONValue,
	jsonStringify,
} from "@medium/2633_convert_object_to_json_string.js";

describe("2633 | Convert Object to JSON String", () => {
	const sample: { obj: JSONValue; expected: string }[] = [
		{
			obj: { y: 1, x: 2 },
			expected: '{"y":1,"x":2}',
		},
		{
			obj: { a: "str", b: -12, c: true, d: null },
			expected: '{"a":"str","b":-12,"c":true,"d":null}',
		},
		{
			obj: { key: { a: 1, b: [{}, null, "Hello"] } },
			expected: '{"key":{"a":1,"b":[{},null,"Hello"]}}',
		},
		{
			obj: true,
			expected: "true",
		},
	];

	test.each(sample)(
		"Testing the obj $obj, to return $expected",
		({ obj, expected }) => {
			expect(jsonStringify(obj)).toBe(expected);
		},
	);
});
