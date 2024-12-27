/*
 * TESTS FILE
 * 2627 | Debounce
 * Difficulty: Medium
 * ----------------
 *
*/


import { debounce, type F } from "@medium/2627_debounce.js";

describe("2627 | Debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const samples = [
        {
            t: 50,
            fn: [{"t": 50, "inputs": [1]}, {"t": 75, "inputs": [2]}],
            expected: [{"t": 125, "inputs": [2]}]
        },
        {
            t: 20,
            fn: [{"t": 50, "inputs": [1]}, {"t": 100, "inputs": [2]}],
            expected: [{"t": 70, "inputs": [1]}, {"t": 120, "inputs": [2]}]
        },
        {
            t: 150,
            fn: [{"t": 50, "inputs": [1,2]}, {"t": 300, "inputs": [3,4]}, {"t": 300, "inputs": [5,6]}],
            expected: [{"t": 200, "inputs": [1,2]}, {"t": 450, "inputs": [5,6]}]
        }
    ];

    test.each(samples)(
        "Testing with t: $t and functions parameters: $fn",
        ({ t, fn, expected }) => {
            const calls: Array<{t: number, inputs: number[]}> = [];
            const start = Date.now();

            // Create the logging function that will track calls
            const log = (...inputs: number[]) => {
                calls.push({
                    t: Date.now() - start,
                    inputs
                });
            };

            // Create debounced version of our logging function
            const debouncedLog = debounce(log, t);

            // Schedule all function calls
            fn.forEach(call => {
                setTimeout(() => {
                    debouncedLog(...call.inputs);
                }, call.t);
            });

            // Advance the timer to complete all scheduled calls
            vi.advanceTimersByTime(Math.max(...fn.map(call => call.t)) + t);

            // Verify the calls match expected output
            expect(calls).toEqual(expected);
        }
    );

    test("should cancel previous call when called again within delay", () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn(1);
        vi.advanceTimersByTime(50);
        debouncedFn(2);
        vi.advanceTimersByTime(50);

        expect(mockFn).not.toHaveBeenCalledWith(1);
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(mockFn).toHaveBeenCalledWith(2);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("should maintain correct context and arguments", () => {
        const context = { value: 42 };
        const mockFn = vi.fn(function(this: typeof context, arg: number) {
            expect(this.value).toBe(42);
            expect(arg).toBe(123);
        });

        const debouncedFn = debounce(mockFn.bind(context), 100);
        debouncedFn(123);
        
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
