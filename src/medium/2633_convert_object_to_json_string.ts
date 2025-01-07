/*
 * 2633 | Convert Object to JSON String
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given a value, return a valid JSON string of that value. The value can be a
 * string, number, array, object, boolean, or null. The returned string should
 * not include extra spaces. The order of keys should be the same as the order
 * returned by "Object.keys()".
 *
 * Please solve it without using the built-in "JSON.stringify" method.
 *
 * URL: https://leetcode.com/problems/convert-object-to-json-string/
 */

import { json } from "stream/consumers";

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };

export function jsonStringify(object: JSONValue): string {
	// In case it's null or undefined
	if (object === null) return "null";

	// In case it's a string
	if (typeof object === "string") return `"${object}"`;

	// In case it's an array
	if (Array.isArray(object)) {
		const treated = object.map((o) => jsonStringify(o)).join(",");
		return `[${treated}]`;
	}

	// In case it's an object
	if (!Array.isArray(object) && typeof object === "object") {
		const keys = Object.keys(object as { [key: string]: JSONValue });
		const text = keys
			.map((k) => {
				return `"${k}":${jsonStringify(object![k])}`;
			})
			.join(",");
		return `{${text}}`;
	}

	// The default case;
	return String(object);
}
