/*
 * TESTS FILE
 * 2694 | Event Emitter
 * Difficulty: Medium
 * ----------------
 *
 */

import { type Callback, EventEmitter } from "@medium/2694_event_emitter.js";

describe("2694 | Event Emitter", () => {
	// Helper function to convert string callbacks to functions
	const createCallbackFromString = (callbackStr: string): Callback => {
		if (callbackStr.includes("(...args)")) {
			return (...args: any[]) => args.join(",");
		}
		if (callbackStr.includes("cb1(...args)")) {
			return (...args: any[]) => args.join(",");
		}
		if (callbackStr.includes("x =>")) {
			// Handle arrow functions that add numbers
			const num = parseInt(callbackStr.match(/\+ (\d+)/)?.[1] || "0");
			return (x: number) => x + num;
		}
		// Handle specific return values
		const returnMatch = callbackStr.match(/return (\d+)/);
		if (returnMatch) {
			const value = parseInt(returnMatch[1]);
			return () => value;
		}
		// Default case
		return () => 6;
	};

	const sample = [
		{
			actions: ["EventEmitter", "emit", "subscribe", "subscribe", "emit"],
			values: [
				[],
				["firstEvent"],
				["firstEvent", "function cb1() { return 5; }"],
				["firstEvent", "function cb1() { return 6; }"],
				["firstEvent"],
			],
			expected: [
				[],
				["emitted", []],
				["subscribed"],
				["subscribed"],
				["emitted", [5, 6]],
			],
		},
		{
			actions: ["EventEmitter", "subscribe", "emit", "emit"],
			values: [
				[],
				["firstEvent", "function cb1(...args) { return args.join(','); }"],
				["firstEvent", [1, 2, 3]],
				["firstEvent", [3, 4, 6]],
			],
			expected: [
				[],
				["subscribed"],
				["emitted", ["1,2,3"]],
				["emitted", ["3,4,6"]],
			],
		},
		{
			actions: ["EventEmitter", "subscribe", "emit", "unsubscribe", "emit"],
			values: [
				[],
				["firstEvent", "(...args) => args.join(',')"],
				["firstEvent", [1, 2, 3]],
				[0],
				["firstEvent", [4, 5, 6]],
			],
			expected: [
				[],
				["subscribed"],
				["emitted", ["1,2,3"]],
				["unsubscribed", 0],
				["emitted", []],
			],
		},
		{
			actions: [
				"EventEmitter",
				"subscribe",
				"subscribe",
				"unsubscribe",
				"emit",
			],
			values: [
				[],
				["firstEvent", "x => x + 1"],
				["firstEvent", "x => x + 2"],
				[0],
				["firstEvent", [5]],
			],
			expected: [
				[],
				["subscribed"],
				["subscribed"],
				["unsubscribed", 0],
				["emitted", [7]],
			],
		},
	];

	test.each(sample)(
		"Testing the actions $actions",
		({ actions, values, expected }) => {
			const eventer = new EventEmitter();
			const result: any[] = [];
			const subscriptions: any[] = [];

			actions.forEach((action, index) => {
				switch (action) {
					case "EventEmitter":
						result.push([]);
						break;

					case "emit": {
						const emitEventName = values[index][0] as string;
						const emitArgs = (values[index][1] as any[]) || [];
						const emitResult = eventer.emit(emitEventName, emitArgs);
						result.push(["emitted", emitResult]);
						break;
					}

					case "subscribe": {
						const subEventName = values[index][0] as string;
						const callbackStr = values[index][1] as string;
						const callback = createCallbackFromString(callbackStr);
						const subscription = eventer.subscribe(subEventName, callback);
						subscriptions.push(subscription);
						result.push(["subscribed"]);
						break;
					}

					case "unsubscribe": {
						const subIndex = values[index][0] as number;
						subscriptions[subIndex].unsubscribe();
						result.push(["unsubscribed", subIndex]);
						break;
					}
				}
			});

			expect(result).toEqual(expected);
		},
	);

	// Additional test cases for specific functionality
	test("should handle multiple subscriptions and unsubscriptions correctly", () => {
		const emitter = new EventEmitter();
		const results: number[] = [];

		const callback1 = (x: number) => results.push(x + 1);
		const callback2 = (x: number) => results.push(x + 2);

		const sub1 = emitter.subscribe("test", callback1);
		const sub2 = emitter.subscribe("test", callback2);

		emitter.emit("test", [1]);
		expect(results).toEqual([2, 3]);

		sub1.unsubscribe();
		results.length = 0;

		emitter.emit("test", [1]);
		expect(results).toEqual([3]);

		sub2.unsubscribe();
		results.length = 0;

		emitter.emit("test", [1]);
		expect(results).toEqual([]);
	});

	test("should handle events with no subscribers", () => {
		const emitter = new EventEmitter();
		expect(emitter.emit("nonexistent")).toEqual([]);
	});

	test("should maintain subscription order", () => {
		const emitter = new EventEmitter();
		const results: number[] = [];

		const callbacks = [
			() => results.push(1),
			() => results.push(2),
			() => results.push(3),
		];

		callbacks.forEach((cb) => emitter.subscribe("ordered", cb));
		emitter.emit("ordered");

		expect(results).toEqual([1, 2, 3]);
	});
});
