/**
 * @fileoverview
 * This script initializes a LeetCode TypeScript Solutions repository by
 * optionally removing existing solutions (src/tests), and then updating the
 * solution counters in the project's README.md file.
 */

import fs from "fs";
import path from "path";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { SolutionsCounter } from "./counter.js";

/**
 * Removes all existing solution files and test files
 * for Easy, Medium, and Hard directories, effectively
 * letting the user start from a blank repository.
 *
 * @remarks
 * - Uses `fs.rmSync()` with `{ recursive: true, force: true }`
 *   to remove directories and their contents without prompting.
 * - Re-creates the directories so the folder structure remains intact.
 */
function removeAllSolutions(): void {
	// Adjust paths as necessary
	const solutionPaths = [
		path.join("src", "easy"),
		path.join("src", "medium"),
		path.join("src", "hard"),
		path.join("tests", "easy"),
		path.join("tests", "medium"),
		path.join("tests", "hard"),
	];

	for (const dirPath of solutionPaths) {
		if (fs.existsSync(dirPath)) {
			fs.rmSync(dirPath, { recursive: true, force: true });
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}
}

/**
 * Initializes the LeetCode TypeScript Solutions Repository by managing existing solutions.
 *
 * This function:
 * 1. Prompts the user to decide whether to remove existing solutions and start fresh.
 * 2. If the user confirms:
 *    - Removes all solution/test files (Easy/Medium/Hard).
 *    - Resets README counters to zero via a `SolutionsCounter`.
 * 3. Otherwise:
 *    - Keeps existing solutions.
 *    - Still updates the README counters to reflect the current number of solutions.
 *
 * @async
 * @function
 * @returns {Promise<void>} A Promise that resolves when the initialization process is complete.
 *
 * @throws {Error} May throw errors if file operations (removing solutions or updating counters) fail.
 *
 * @example
 * // Typical usage in an npm script:
 * // "init": "node scripts/init.js"
 */
async function main(): Promise<void> {
	console.log(
		chalk.blue(
			"Initializing the LeetCode TypeScript Solutions Repository...\n",
		),
	);

	// Ask the user whether they want to remove existing solutions
	const removeSolutionsAnswer = await confirm({
		message: "Do you want to remove all existing solutions and start fresh?\n",
		default: false,
	});

	if (removeSolutionsAnswer) {
		removeAllSolutions();
		console.log(
			chalk.green(
				"All existing solutions have been removed. You can now start fresh!",
			),
		);
		new SolutionsCounter();
		console.log(chalk.green("README.me counters have been reset to 0!"));
	} else {
		console.log(
			chalk.yellow("Keeping the existing solutions. Enjoy exploring!"),
		);
		new SolutionsCounter();
	}
}

// Execute the main function and handle errors
main().catch((error) => {
	console.error(chalk.red("Error during initialization:"), error);
	process.exit(1);
});
