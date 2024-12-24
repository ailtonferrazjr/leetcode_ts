/*
 * 2621 | Sleep
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * Given a positive integer "millis", write an asynchronous function that sleeps
 * for "millis" milliseconds. It can resolve any value.
 *
 * URL: https://leetcode.com/problems/sleep/
 */

export async function sleep(millis: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, millis);
	});
}
