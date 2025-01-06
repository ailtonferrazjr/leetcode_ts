/*
 * 2628 | JSON Deep Equal
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given two values "o1" and "o2", return a boolean value indicating whether two
 * values, "o1" and "o2", are deeply equal.
 * 
 * For two values to be deeply equal, the following conditions must be met:
 * 
 * -> If both values are primitive types, they are deeply equal if they pass the
 * "===" equality check.
 -> If both values are arrays, they are deeply equal if
 * they have the same elements in the same order, and each element is also
 * deeply equal according to these conditions.
 -> If both values are objects,
 * they are deeply equal if they have the same keys, and the associated values
 * for each key are also deeply equal according to these conditions.
 * 
 * You may assume both values are the output of "JSON.parse". In other words,
 * they are valid JSON.
 * 
 * Please solve it without using lodash's "_.isEqual()" function
 *
 * URL: https://leetcode.com/problems/json-deep-equal/
*/

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };

export function areDeeplyEqual(o1: JSONValue, o2: JSONValue): boolean {
	if (o1 === o2) return true;
	if (o1 === null || o2 === null) return false;
	if (String(o1) !== String(o2)) return false;

	if (typeof o1 !== "object") {
		return o1 === o2;
	}

	if (Array.isArray(o1) && Array.isArray(o2)) {
		if (o1.length !== o2.length) return false;

		for (let i = 0; i < o1.length; i++) {
			if (!areDeeplyEqual(o1[i], o2[i])) return false;
		}
		return true;
	}

	if (!Array.isArray(o1) && !Array.isArray(o2)) {
		const obj1 = o1 as { [key: string]: JSONValue };
		const obj2 = o2 as { [key: string]: JSONValue };

		if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

		for (const key in obj1) {
			if (!areDeeplyEqual(obj1[key], obj2[key])) return false;
		}

		return true;
	}

	return false;
}
