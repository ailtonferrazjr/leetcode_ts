/*
 * 2703 | Return Length of Arguments Passed
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * argumentsLength
 *
 * URL: https://leetcode.com/problems/return-length-of-arguments-passed/
*/

export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };

export function argumentsLength(...args: JSONValue[]): number {
    return args.length;
};
