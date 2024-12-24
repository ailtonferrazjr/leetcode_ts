/*
 * 2635 | Apply Transform Over Each Element in Array
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given an integer array "arr" and a mapping function "fn", return a new array
 * with a transformation applied to each element.
 * 
 * The returned array should be created such that "returnedArray[i] = fn(arr[i],
 * i)".
 * 
 * Please solve it without the built-in "Array.map" method.
 *
 * URL: https://https://leetcode.com/problems/apply-transform-over-each-element-in-array/
*/

export const mapFunctions = {
	emptyArrayApproach,
	forInLoopApproach,
	pushValuesIntoArrayApproach,
	preAllocatedMemory,
	primitiveArray,
	inMemoryAllocation,
};

// Approach 1 - Write values into an initially empty or partially empty array, with a for loop
// ~250ms for 5M elements

function emptyArrayApproach(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	const newArray: number[] = [];
	for (let i: number = 0; i < arr.length; i++) {
		newArray[i] = fn(arr[i], i);
	}
	return newArray;
}

// Approach 2 - Use For ... in loop, where we are only iterating over indices that are actually populated
// ~1000ms for 5M elements
function forInLoopApproach(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	const newArray: number[] = new Array(arr.length);

	for (const i in arr) {
		newArray[i] = fn(arr[i], Number(i));
	}

	return newArray;
}

// Approach 3 - Push values into an array
// Since appending a new item to a JS array have a O(1) time, we can use push to append an element to the end of it, one by one.
// ~200ms for 5M elements
function pushValuesIntoArrayApproach(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	const newArray: number[] = [];
	for (let i = 0; i < arr.length; i++) {
		newArray.push(fn(arr[i], i));
	}
	return newArray;
}

// Approach 4 - Pre-allocated memory to array
// In this case we are already setting the newArray as a defined size array, so we can reduce memory allocation
// We still use the approach of for loop
// ~40m for 5M elements

function preAllocatedMemory(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	const newArray = new Array(arr.length);
	for (let i = 0; i < arr.length; i++) {
		newArray[i] = fn(arr[i], i);
	}
	return newArray;
}

// Approach 5 - 32 bit integer array
// Here we will use the builint class for using an array of 32 bit, with unmutable size and with a single type
// This consumes few memory because doens't need to handle increases of size and different data types in the array
// ~20m for 5M elements

function primitiveArray(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	const newArray = new Int32Array(arr.length);
	for (let i = 0; i < arr.length; i++) {
		newArray[i] = fn(arr[i], i);
	}
	return newArray as unknown as number[];
}

// Approach 6 - In Memory Allocation
// This one is risky and efficient at the same time, since we are simply overwritting the given array, by transforming their items.
// ~10m for 5M elements

function inMemoryAllocation(
	arr: number[],
	fn: (n: number, i: number) => number,
): number[] {
	for (let i = 0; i < arr.length; i++) {
		arr[i] = fn(arr[i], i);
	}
	return arr;
}
