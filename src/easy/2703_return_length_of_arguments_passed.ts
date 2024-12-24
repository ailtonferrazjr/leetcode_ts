/*
 * 2703 | Return Length of Arguments Passed
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Write a function "argumentsLength" that returns the count of arguments passed
 * to it.
 *
 * URL: https://leetcode.com/problems/return-length-of-arguments-passed/
 */

export type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };

export function argumentsLength(...args: JSONValue[]): number {
	return args.length;
}
