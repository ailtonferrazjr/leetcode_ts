/*
 * 2722 | Join Two Arrays by ID
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Given two arrays "arr1" and "arr2", return a new array "joinedArray". All the
 * objects in each of the two inputs arrays will contain an "id" field that has
 * an integer value.
 * 
 * "joinedArray" is an array formed by merging "arr1" and "arr2" based on their
 * "id" key. The length of "joinedArray" should be the length of unique values
 * of "id". The returned array should be sorted in ascending order based on the
 * "id" key.
 * 
 * If a given "id" exists in one array but not the other, the single object with
 * that "id" should be included in the result array without modification.
 * 
 * If two objects share an "id", their properties should be merged into a
 * single object:
 * 
 * -> If a key only exists in one object, that single key-value pair should be
 * included in the object.
 -> If a key is included in both objects, the value
 * in the object from "arr2" should override the value from "arr1".
 *
 * URL: https://leetcode.com/problems/join-two-arrays-by-id/
*/

type JSONValue =
	| null
	| boolean
	| number
	| string
	| JSONValue[]
	| { [key: string]: JSONValue };
type ArrayType = { id: number } & Record<string, JSONValue>;

export function join(arr1: ArrayType[], arr2: ArrayType[]): ArrayType[] {
	const map = new Map<number, any>();

	for (const item of arr1) {
		map.set(item.id, item);
	}

	for (const item of arr2) {
		if (map.has(item.id)) {
			map.set(item.id, { ...map.get(item.id), ...item });
		} else {
			map.set(item.id, item);
		}
	}

	const res: any[] = [];
	for (const key of map.keys()) {
		res.push(map.get(key));
	}

	return res.sort((a, b) => a.id - b.id);
}

// Approach of Pointers

export function joinWithPointers(
	arr1: ArrayType[],
	arr2: ArrayType[],
): ArrayType[] {
	arr1.sort((a, b) => a.id - b.id);
	arr2.sort((a, b) => a.id - b.id);

	const joinedArr = [];
	let i = 0,
		j = 0;

	while (i < arr1.length && j < arr2.length) {
		if (arr1[i].id < arr2[j].id) {
			joinedArr.push(arr1[i]);
			i++;
		} else if (arr1[i].id > arr2[j].id) {
			joinedArr.push(arr2[j]);
			j++;
		} else {
			joinedArr.push({ ...arr1[i], ...arr2[j] });
			i++;
			j++;
		}
	}

	while (i < arr1.length) {
		joinedArr.push(arr1[i]);
		i++;
	}

	while (j < arr2.length) {
		joinedArr.push(arr2[j]);
		j++;
	}

	return joinedArr;
}
