/*
 * TESTS FILE
 * 2666 | Allow One Function Call
 * Difficulty: Easy
 * ----------------
 *
*/

import { once, type JSONValue, type OnceFn } from "@easy/2666_allow_one_function_call.js";

describe('2666 | Allow One Function Call', () => {
    const fnOne = ((a: number, b: number, c: number) => a + b + c) as OnceFn;
    const fnTwo = ((a: number, b: number, c: number) => a * b * c) as OnceFn;
    
  const testSamples = [
    {
      fn: fnOne,
      calls: [[1,2,3],[2,3,6]],
      // This suggests we expect the function to be called once and return 6 the first time
      output: [{ "calls": 1, "value": 6 }]
    },
    {
      fn: fnTwo,
      calls: [[5,7,4],[2,3,6],[4,6,8]],
      // We expect the function to be called once and return 140 the first time
      output: [{ "calls": 1, "value": 140 }]
    }
  ];

  test.each(testSamples)(
    "Testing once-wrapped fn with calls %j expecting output %j",
    ({
      fn,
      calls,
      output,
    }: {
      fn: OnceFn;
      calls: number[][];
      output: { [key: string]: number }[];
    }) => {

      // Wrap the function with "once"
      const onceFn = once(fn);

      // The first call should match the expected 'value'
      const firstCallResult = onceFn(...calls[0]);
      expect(firstCallResult).toBe(output[0].value);

      // All subsequent calls should return undefined
      for (let i = 1; i < calls.length; i++) {
        const result = onceFn(...calls[i]);
        expect(result).toBeUndefined();
      }
    }
  );
});
