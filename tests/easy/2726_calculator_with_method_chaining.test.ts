/*
 * TESTS FILE
 * 2726 | Calculator with Method Chaining
 * Difficulty: Easy
 * ----------------
 *
 */

import { Calculator } from "@easy/2726_calculator_with_method_chaining.js";

describe("2726 | Calculator with Method Chaining", () => {
	const samples = [
		{
			actions: ["Calculator", "add", "subtract", "getResult"],
			values: [10, 5, 7],
			output: 8,
		},
		{
			actions: ["Calculator", "multiply", "power", "getResult"],
			values: [2, 5, 2],
			output: 100,
		},
		{
			actions: ["Calculator", "divide", "getResult"],
			values: [20, 0],
			output: "Division by zero is not allowed",
		},
	];

	test.each(samples)(
		"Testing the following actions: $actions, with the values: $values, that should output: $output",
		({ actions, values, output }) => {
			try {
				let calc: Calculator = new Calculator(values[0]);

				for (let i = 1; i < actions.length; i++) {
					if (actions[i] === "Calculator") {
						calc = new Calculator(values[i]);
						continue;
					}

					(calc[actions[i] as keyof Calculator] as Function).call(
						calc,
						values[i],
					);
				}

				expect(calc.getResult()).toBe(output);
			} catch (e) {
				expect(e).toBe(output);
			}
		},
	);
});
