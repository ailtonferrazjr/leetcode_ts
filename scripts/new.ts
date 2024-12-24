/**
 * @fileoverview
 * This script provides a CLI workflow to create new LeetCode problem solutions
 * in a TypeScript project. It prompts the user for a LeetCode URL, fetches
 * the problem statement and other metadata, and automatically generates
 * both solution and test files in their respective directories.
 */

import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";
import { confirm, input } from "@inquirer/prompts";
import chalk from "chalk";
import { QuestionFetcher } from "../src/utils/fileCreator/QuestionFetcher.js";
import { Difficulty, type Question } from "../src/utils/fileCreator/types.js";

/**
 * Describes the paths for solution and test files to be generated.
 */
interface FilePaths {
	/** The path where the solution (.ts) file should be created. */
	solution: string;
	/** The path where the test (.test.ts) file should be created. */
	test: string;
}

/**
 * Prompts the user for a LeetCode URL using the CLI.
 *
 * @returns A Promise that resolves to the URL string entered by the user.
 * @throws Will throw an error if the prompt or validation fails.
 */
async function startPrompt(): Promise<string> {
	try {
		const url = await input({
			message:
				"Please provide the Leetcode URL (e.g., 'https://leetcode.com/problems/find-the-number-of-winning-players/'):\n",
			validate: (inputVal: string) =>
				inputVal.trim().length > 0 || "Problem name cannot be empty.",
		});

		return url;
	} catch (error) {
		console.error(chalk.red("Error during input collection:"), error);
		throw error;
	}
}

/**
 * Prompts the user to confirm whether they want to overwrite an existing
 * problem file.
 *
 * @param title - The title of the problem to display in the prompt.
 * @returns A Promise that resolves to a boolean indicating the user's choice.
 */
async function shouldOverwritePrompt(title: string): Promise<boolean> {
	try {
		return await confirm({
			message: `A file of the problem '${title}' is already present in the repository, should overwrite it?\n`,
		});
	} catch (error) {
		console.error(
			"There was an error on getting the confirmation to overwrite",
			error,
		);
		throw error;
	}
}

/**
 * Parses the LeetCode question title into a standardized filename.
 *
 * @param question - The `Question` object containing the original title and ID.
 * @returns A string representing the normalized filename (e.g., "1_two_sum").
 */
function parseTitle(question: Question): string {
	const title = question.title
		.replace(/\.\s*/, "_")
		.replace(/\s+/g, "_")
		.toLowerCase();
	return question.questionId + "_" + title;
}

/**
 * Generates the file paths for the solution and test files based on the
 * provided `title` and `difficulty`.
 *
 * @param title - The parsed title for file naming.
 * @param difficulty - The difficulty level (Easy, Medium, Hard).
 * @returns An object containing `solution` and `test` file paths.
 */
function getFilePaths(title: string, difficulty: Difficulty): FilePaths {
	return {
		solution: path.join("src", difficulty.toLowerCase(), `${title}.ts`),
		test: path.join("tests", difficulty.toLowerCase(), `${title}.test.ts`),
	};
}

/**
 * Creates the solution and test files for a given LeetCode problem by:
 * 1. Ensuring the directories exist.
 * 2. Writing the fetched question commentary and test stubs into
 *    the appropriate files.
 *
 * @param fetcher - An instance of `QuestionFetcher` containing the question metadata and file content.
 * @returns A Promise that resolves when the files have been created successfully.
 * @throws Will throw an error if file operations fail.
 */
async function createFiles(fetcher: QuestionFetcher): Promise<void> {
	try {
		// Parse the title of the problem
		const title = parseTitle(fetcher.question);
		const { solution, test } = getFilePaths(title, fetcher.question.difficulty);

		// Ensure directories exist
		await fsPromises.mkdir(path.dirname(solution), { recursive: true });
		await fsPromises.mkdir(path.dirname(test), { recursive: true });

		// Write to solution and test files
		await fsPromises.writeFile(solution, fetcher.comments.questionComments);
		await fsPromises.writeFile(test, fetcher.comments.testsComments);
	} catch (error) {
		console.error(chalk.red("Error creating files:"), error);
		throw error;
	}
}

/**
 * Checks if the current problem already exists in the repository
 * by verifying if the solution file is present.
 *
 * @param fetcher - An instance of `QuestionFetcher` with the parsed question data.
 * @returns A boolean indicating whether the solution file already exists.
 */
function isExistingProblem(fetcher: QuestionFetcher): boolean {
	const title = parseTitle(fetcher.question);
	const { solution } = getFilePaths(title, fetcher.question.difficulty);
	return fs.existsSync(solution);
}

/**
 * The main function orchestrating the script execution for adding a new LeetCode problem.
 *
 * Steps:
 * 1. Prompts the user for a LeetCode URL.
 * 2. Fetches the problem metadata (title, difficulty, etc.) via `QuestionFetcher`.
 * 3. Checks if a solution already exists. If so, prompts the user for overwrite permission.
 * 4. Creates (or overwrites) the solution and test files.
 *
 * @returns A Promise that resolves when the script completes.
 * @throws Will exit the process with status code 1 if any error occurs during the workflow.
 */
async function newProblem(): Promise<void> {
	try {
		// Start the prompt to collect the LeetCode URL
		const url = await startPrompt();

		// Fetch the problem data
		const fetcher: QuestionFetcher = await QuestionFetcher.create(url);

		// Check if it's an existing problem
		if (isExistingProblem(fetcher)) {
			const shouldOverwrite = await shouldOverwritePrompt(
				`${fetcher.question.questionId} | ${fetcher.question.title}`,
			);

			// If user does not want to overwrite, cancel the operation
			if (!shouldOverwrite) {
				console.log(chalk.yellow("Operation cancelled!"));
				return;
			}

			// Overwrite existing files
			await createFiles(fetcher);
			console.log(chalk.green("The files were overwritten successfully!"));
			return;
		}

		// Create files if no existing problem
		await createFiles(fetcher);
		console.log(chalk.green("Files created successfully!"));
	} catch (error) {
		console.error(chalk.red("An error occurred during the process."), error);
		process.exit(1);
	}
}

// Execute the main function to create a new problem
await newProblem();
