/*
 * 2695 | Array Wrapper
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Create a class "ArrayWrapper" that accepts an array of integers in its
 * constructor. This class should have two features:
 * 
 * -> When two instances of this class are added together with the "+" operator,
 * the resulting value is the sum of all the elements in both arrays.
 -> When
 * the "String()" function is called on the instance, it will return a comma
 * separated string surrounded by brackets. For example, "[1,2,3]".
 *
 * URL: https://leetcode.com/problems/array-wrapper/
*/

export class ArrayWrapper {
    arr: number[];
    constructor(nums: number[]) {
        this.arr = nums;
    }
    
    valueOf(): number {
        return this.arr.reduce((acc, it) => acc + it,0);
    }
    
    toString(): string {
        return `[${this.arr}]`
    }
};
