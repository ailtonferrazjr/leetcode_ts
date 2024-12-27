import "@medium/2631_group_by.js";

describe("2631 | Group By", () => {
	// Type definitions for better clarity

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	type TestFunction1 = (item: Record<string, any>) => string;
	type TestFunction2 = (list: number[]) => string;
	type TestFunction3 = (n: number) => string;

	const functionOne: TestFunction1 = (item) => item.id;
	const functionTwo: TestFunction2 = (list) => String(list[0]);
	const functionThree: TestFunction3 = (n) => String(n > 5);

	const sample = [
		{
			fn: functionOne,
			array: [{ id: "1" }, { id: "1" }, { id: "2" }],
			expected: { "1": [{ id: "1" }, { id: "1" }], "2": [{ id: "2" }] },
			description: "should group objects by id",
		},
		{
			fn: functionTwo,
			array: [
				[1, 2, 3],
				[1, 3, 5],
				[1, 5, 9],
			],
			expected: {
				"1": [
					[1, 2, 3],
					[1, 3, 5],
					[1, 5, 9],
				],
			},
			description: "should group arrays by first element",
		},
		{
			fn: functionThree,
			array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			expected: { false: [1, 2, 3, 4, 5], true: [6, 7, 8, 9, 10] },
			description: "should group numbers by whether they're greater than 5",
		},
	];

	test.each(sample)("$description", ({ fn, array, expected }) => {
		const result = array.groupBy(
			fn as (item: (typeof array)[number]) => string,
		);
		expect(result).toEqual(expected);
	});

	// Additional edge cases
	test("should handle empty array", () => {
		const emptyArray: number[] = [];
		const result = emptyArray.groupBy(String);
		expect(result).toEqual({});
	});

	test("should handle array with single item", () => {
		const singleItemArray = [1];
		const result = singleItemArray.groupBy(String);
		expect(result).toEqual({ "1": [1] });
	});

	test("should maintain order of items within groups", () => {
		const array = [1, 11, 2, 22, 3, 33];
		const result = array.groupBy((n) => String(n > 10));
		expect(result).toEqual({
			false: [1, 2, 3],
			true: [11, 22, 33],
		});
	});

	test("should handle complex objects", () => {
		const array = [
			{ id: "a", value: 1 },
			{ id: "b", value: 2 },
			{ id: "a", value: 3 },
		];
		const result = array.groupBy((item) => item.id);
		expect(result).toEqual({
			a: [
				{ id: "a", value: 1 },
				{ id: "a", value: 3 },
			],
			b: [{ id: "b", value: 2 }],
		});
	});

	test("should handle null and undefined values", () => {
		const array = [null, undefined, null];
		const result = array.groupBy((item) => String(item));
		expect(result).toEqual({
			null: [null, null],
			undefined: [undefined],
		});
	});
});
