/*
 * TESTS FILE
 * 2703 | Return Length of Arguments Passed
 * Difficulty: Easy
 * ----------------
 *
*/

import { argumentsLength, type JSONValue } from "@easy/2703_return_length_of_arguments_passed.js";

describe('2703 | Return Length of Arguments Passed', () => {

    const testSamples = [
        {args: [5],
            output: 1
        },
        {args: [{}, null, "3"],
    output: 3}
    ]

    test.each(testSamples)(
        "Running the args $args, that should output the length of $output",
        ({args, output}: {args: JSONValue[]; output: number}) => {
            expect(argumentsLength(...args)).toEqual(output);
        }
    )

})