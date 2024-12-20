// 2665 - Counter II

// Write a function createCounter. It should accept an initial integer init. 
// It should return an object with three functions.

// The three functions are:
// increment() increases the current value by 1 and then returns it.
// decrement() reduces the current value by 1 and then returns it.
// reset() sets the current value to init and then returns it.

// https://leetcode.com/problems/counter-ii/

export type Counter = {
    increment: () => number,
    decrement: () => number,
    reset: () => number
};

export function createCounter(init: number): Counter {

    let currentCounter = init;

    return {
        increment: () => {
            return ++currentCounter;
        },
        decrement: () => {
            return --currentCounter;
        },
        reset: () => {
            currentCounter = init;
            return currentCounter;
        }
    }
};