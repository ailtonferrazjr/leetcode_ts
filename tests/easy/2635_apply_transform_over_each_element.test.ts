import { mapFunctions } from "@easy/2635_apply_transform_over_each_element.js";


describe('2635 - Apply Transform Over Each Element', () => {

    const plusone = (n: number) => n + 1;
    const plusI = (n: number, i: number) => n + i;
    const constant = (_n: number, _i: number) => 42;

    const testSample = [
        {
            arr: [1,2,3],
            output: [2,3,4],
            fn: plusone,
        },
        {
            arr: [1,2,3],
            output: [1,3,5],
            fn: plusI
        },
        {
            arr: [10,20,30],
            output: [42,42,42],
            fn: constant,
        }
    ];

    test.each(testSample)(
        "we will test function $fn, with array $arr, that should output $output",
        ({fn, arr, output}: {fn: (n: number, i: number) => number, arr: number[], output: number[]}) => {
            
            expect(mapFunctions.emptyArrayApproach(arr, fn)).toEqual(output);
            expect(mapFunctions.forInLoopApproach(arr, fn)).toEqual(output);
            expect(mapFunctions.pushValuesIntoArrayApproach(arr, fn)).toEqual(output);
            expect(mapFunctions.preAllocatedMemory(arr, fn)).toEqual(output);
            expect(mapFunctions.primitiveArray(arr, fn)).toEqual(new Int32Array(output));
            expect(mapFunctions.inMemoryAllocation(arr, fn)).toEqual(output);
        }
    )
})