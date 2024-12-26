/*
 * TESTS FILE
 * 2622 | Cache With Time Limit
 * Difficulty: Medium
 * ----------------
 *
*/

import { TimeLimitedCache } from "@medium/2622_cache_with_time_limit.js";

describe("2622 | Cache With Time Limit", () => {


    const samples = [
        {
            actions: ["TimeLimitedCache", "set", "get", "count", "get"],
            values: [[], [1, 42, 100], [1], [], [1]],
            timeDelays: [0, 0, 50, 50, 150],
            expected: [null, false, 42, 1, -1]
        },
        {
            actions: ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"],
            values: [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []],
            timeDelays: [0, 0, 40, 50, 120, 200, 250],
            expected: [null,false,true,50,50,-1,0]
        }
    ]


    test.each(samples)(
        "Testing action, expecting $expected",
        async ({
            actions,
            values,
            timeDelays,
            expected
        }) => {
            const results: (number | boolean | null)[] = [];
            const cacheManager: TimeLimitedCache = new TimeLimitedCache();
            
            const actionPromises = actions.map((action, index) => {
                return new Promise<number | boolean | null>( resolve => {

                setTimeout( () => {

                    if (action == "TimeLimitedCache") {
                        resolve(null)
                    } else if (action == "set") {
                        const currentValues = values[index];
                        resolve(cacheManager.set(currentValues[0],currentValues[1],currentValues[2]));
                    } else if (action == "get") {
                        resolve(cacheManager.get(values[index][0]));
                    } else if (action == "count") {
                        resolve(cacheManager.count());
                    }

                }, timeDelays[index]);
                })
            })

            for (const promise of actionPromises) {
                results.push(await promise);
            }
            

            expect(results).toEqual(expected);

        }
    )

})