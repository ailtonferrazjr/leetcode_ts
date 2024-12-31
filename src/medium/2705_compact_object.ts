/*
 * 2705 | Compact Object
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given an object or array "obj", return a compact object.
 *
 * A compact object is the same as the original object, except with keys
 * containing falsy values removed. This operation applies to the object and any
 * nested objects. Arrays are considered objects where the indices are keys. A
 * value is considered falsy when "Boolean(value)" returns "false".
 *
 * You may assume the "obj" is the output of "JSON.parse". In other words, it is
 * valid JSON.
 *
 * URL: https://leetcode.com/problems/compact-object/
 */

type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
type Obj = Record<string, JSONValue> | Array<JSONValue>;

export function compactObject(obj: Obj): Obj {
	const keys = Object.keys(obj);
	const values = Object.values(obj);
	const result: Record<string, JSONValue> = {};

	keys.forEach((i, index) => {
		const value = values[index];
		if (value) {
			result[i] = typeof value === "object" ? compactObject(value) : value;
		}
	});

	return Array.isArray(obj) ? Object.values(result) : result;
}
