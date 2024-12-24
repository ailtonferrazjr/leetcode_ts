/*
 * TESTS FILE
 * 2629 | Function Composition
 * Difficulty: Easy
 * ----------------
 *
*/

import { type F, compose } from "@easy/2629_function_composition.js";

interface Sample {
    input: number;
    functions: F[];
    expected: number;
}

describe(" 2629. Function Composition", () => {
    const testSamples: Sample[] = [
        {
            input: 4,
            functions: [
                (x: number): number => x + 1,
                (x: number): number => x * x,
                (x: number): number => 2 * x,
            ],
            expected: 65,
        },
        {
            input: 1,
            functions: [
                (x: number): number => 10 * x,
                (x: number): number => 10 * x,
                (x: number): number => 10 * x,
            ],
            expected: 1000,
        },
        {
            input: 42,
            functions: [],
            expected: 42,
        },
    ];

    test.each(testSamples)(
        "Testing with input $input, with the functions $functions, that should output $expected",
        ({
            input,
            functions,
            expected,
        }: { input: number; functions: F[]; expected: number }) => {
            expect(compose(functions)(input)).toEqual(expected);
        },
    );
});
