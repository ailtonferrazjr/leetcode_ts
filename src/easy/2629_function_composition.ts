// 2629. Function Composition

// Given an array of functions [f1, f2, f3, ..., fn], return a new function fn that is the function composition of the array of functions.

// The function composition of [f(x), g(x), h(x)] is fn(x) = f(g(h(x))).

// The function composition of an empty list of functions is the identity function f(x) = x.

// You may assume each function in the array accepts one integer as input and returns one integer as output.



// https://leetcode.com/problems/function-composition/


export type F = (x: number) => number;

export function compose(functions: F[]): F {
    
    return function(x: number): number {

        // In case there are no functions in the array;
        if (functions.length === 0) return x;

        for (let i = functions.length -1; i >= 0; i--) {
            x = functions[i](x)
        }
        return x;
    }
};

