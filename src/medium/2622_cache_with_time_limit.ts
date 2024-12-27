/*
 * 2622 | Cache With Time Limit
 * Difficulty: Medium
 * ----------------
 *
 * Description:
 * Write a class that allows getting and setting key-value pairs, however a time
 * until expiration is associated with each key.
 *
 * The class has three public methods:
 *
 * "set(key, value, duration)": accepts an integer "key", an integer "value",
 * and a "duration" in milliseconds. Once the "duration" has elapsed, the key
 * should be inaccessible. The method should return "true" if the
 * same un-expired key already exists and "false" otherwise. Both the value and
 * duration should be overwritten if the key already exists.
 *
 * "get(key)": if an un-expired key exists, it should return the associated
 * value. Otherwise it should return "-1".
 *
 * "count()": returns the count of un-expired keys.
 *
 * URL: https://leetcode.com/problems/cache-with-time-limit/
 */

import type { Node } from "node_modules/domhandler/lib/node.js";

type CacheEntry = {
	value: number;
	timeout: NodeJS.Timeout;
};

export class TimeLimitedCache {
	cache: Map<number, CacheEntry>;
	constructor() {
		this.cache = new Map();
	}

	set(key: number, value: number, duration: number): boolean {
		const valueInCache = this.cache.get(key);
		if (valueInCache) {
			clearTimeout(valueInCache.timeout);
		}
		const timeout = setTimeout(() => {
			this.cache.delete(key);
		}, duration);

		this.cache.set(key, { value: value, timeout: timeout });
		return Boolean(valueInCache);
	}

	get(key: number): number {
		return this.cache.has(key) ? this.cache.get(key)!.value : -1;
	}

	count(): number {
		return this.cache.size;
	}
}

/**
 * const timeLimitedCache = new TimeLimitedCache()
 * timeLimitedCache.set(1, 42, 1000); // false
 * timeLimitedCache.get(1) // 42
 * timeLimitedCache.count() // 1
 */

/**
 * const timeLimitedCache = new TimeLimitedCache()
 * timeLimitedCache.set(1, 42, 1000); // false
 * timeLimitedCache.get(1) // 42
 * timeLimitedCache.count() // 1
 */
