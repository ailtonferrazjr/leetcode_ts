/*
 * TESTS FILE
 * 2620 | Counter
 * Difficulty: Easy
 * ----------------
 *
*/


import { createCounter } from "@easy/2620_counter.js";

describe("2620 - Counter", () => {
    const testSamples = [
        { initial: 10, iterations: 3, expected: [10, 11, 12] },
        {
            initial: -2,
            iterations: 5,
            expected: [-2, -1, 0, 1, 2],
        },
    ];

    test.each(testSamples)(
        "starting from $initial and calling $iterations times should produce $expected",
        ({ initial, iterations, expected }) => {
            const counter = createCounter(initial);
            const results = [];

            for (let i = 0; i < iterations; i++) {
                results.push(counter());
            }

            expect(results).toEqual(expected);
        },
    );
});
