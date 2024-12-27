/*
 * 2727 | Is Object Empty
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an object or an array, return if it is empty.
 * 
 * -> An empty object contains no key-value pairs.
 -> An empty array contains
 * no elements.
 * 
 * You may assume the object or array is the output of "JSON.parse".
 *
 * URL: https://leetcode.com/problems/is-object-empty/
*/

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
export type Obj = Record<string, JSONValue> | JSONValue[];

export const isEmpty = {
	approach1: isEmptyApproachOne,
	approach2: isEmptyApproachTwo,
	approach3: isEmptyApproachThree,
};

// Approach with a for loop to see if it enters or not in the loop
function isEmptyApproachOne(obj: Obj): boolean {
	for (const _ in obj) {
		return false;
	}
	return true;
}

// Approach with transforming it in a string and then checkign it's length
function isEmptyApproachTwo(obj: Obj): boolean {
	return JSON.stringify(obj).length == 2;
}

// Approach with Object.keys method
function isEmptyApproachThree(obj: Obj): boolean {
	return Object.keys(obj).length === 0;
}
