/**
 * @fileoverview
 * Utilities for updating the count of solutions in the project's README.md file.
 *
 * This script reads the number of files in the `src/easy`, `src/medium`,
 * and `src/hard` directories and updates the corresponding counters in
 * the README to reflect the number of solutions available for each
 * difficulty level.
 */

import fs from "node:fs";

/**
 * Represents the number of solutions categorized by difficulty.
 */
interface Counter {
	easy: number;
	medium: number;
	hard: number;
}

/**
 * The `SolutionsCounter` class is responsible for counting the number of
 * solution files across different difficulty levels (Easy, Medium, Hard),
 * and updating the README.md with the current totals.
 */
export class SolutionsCounter {
	/** Stores the current solution counts. */
	counter: Counter;

	/** Relative path to the directory containing Easy solutions. */
	easyFolder = "src/easy";

	/** Relative path to the directory containing Medium solutions. */
	mediumFolder = "src/medium";

	/** Relative path to the directory containing Hard solutions. */
	hardFolder = "src/hard";

	/**
	 * Constructs a new instance of `SolutionsCounter`.
	 * Immediately counts solutions in the specified directories
	 * and updates the README.md file.
	 */
	constructor() {
		this.counter = this.countAllSolutions();
		this.updateMarkdownFile(this.counter);
	}

	/**
	 * Reads the specified directory to count how many files it contains.
	 *
	 * @param folderPath - The path to the folder containing solution files.
	 * @returns The number of files in the directory.
	 */
	countFolderSolutions(folderPath: string): number {
		const files = fs.readdirSync(folderPath);
		return files.length;
	}

	/**
	 * Counts the total solutions for Easy, Medium, and Hard difficulty levels
	 * by reading each respective folder.
	 *
	 * @returns An object containing the counts of easy, medium, and hard solutions.
	 */
	countAllSolutions(): Counter {
		const easy = this.countFolderSolutions(this.easyFolder);
		const medium = this.countFolderSolutions(this.mediumFolder);
		const hard = this.countFolderSolutions(this.hardFolder);
		return { easy, medium, hard };
	}

	/**
	 * Updates the README.md file to reflect the current counts of
	 * Easy, Medium, and Hard solutions. It performs a simple string
	 * replacement using regex to find lines that match the pattern
	 * `- Easy: X`, `- Medium: Y`, and `- Hard: Z`.
	 *
	 * @param counter - An object containing the updated counts for easy, medium, and hard.
	 */
	updateMarkdownFile(counter: Counter): void {
		const markdown = fs
			.readFileSync("README.md", "utf-8")
			// Update the line that starts with `- Easy: `
			.replace(/^(\- Easy:\s*)\d+/m, `$1${counter.easy}`)
			// Update the line that starts with `- Medium: `
			.replace(/^(\- Medium:\s*)\d+/m, `$1${counter.medium}`)
			// Update the line that starts with `- Hard: `
			.replace(/^(\- Hard:\s*)\d+/m, `$1${counter.hard}`);

		fs.writeFileSync("README.md", markdown);
	}
}

/**
 * Instantiates the `SolutionsCounter` immediately upon import.
 * This ensures the README is automatically updated every time
 * this script is loaded.
 */
const _counter: SolutionsCounter = new SolutionsCounter();
