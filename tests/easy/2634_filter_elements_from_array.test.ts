/*
 * TESTS FILE
 * 2634 | Filter Elements from Array
 * Difficulty: Easy
 * ----------------
 *
*/

import {
    type Fn,
    filterElementsFromArray,
} from "@easy/2634_filter_elements_from_array.js";

describe("2634 - Filter Elements from Array", () => {
    const greaterThan10: Fn = (n: number) => n > 10;
    const firstIndex: Fn = (_n: number, i: number) => i === 0;
    const plusOne: Fn = (n: number) => Boolean(n + 1);

    const testSamples = [
        {
            arr: [0, 10, 20, 30],
            output: [20, 30],
            fn: greaterThan10,
        },
        {
            arr: [1, 2, 3],
            output: [1],
            fn: firstIndex,
        },
        {
            arr: [-2, -1, 0, 1, 2],
            output: [-2, 0, 1, 2],
            fn: plusOne,
        },
    ];

    test.each(testSamples)(
        "Testing $fn with array $arr, expecting result $output",
        ({
            arr,
            output,
            fn,
        }: {
            arr: number[];
            output: number[];
            fn: Fn;
        }) => {
            expect(filterElementsFromArray(arr, fn)).toEqual(output);
        },
    );
});
