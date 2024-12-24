import { promises as fs } from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { QuestionFetcher } from "./QuestionFetcher.js";
import { Difficulty, type Question } from "./types.js";

interface FilePaths {
	solution: string;
	test: string;
}

/**
 * Starts the prompt to collect problem name and difficulty from the user.
 * @returns {Promise<ProblemDetails>} The problem name and selected difficulty.
 */
async function startPrompt(): Promise<string> {
	try {
		const url = await input({
			message:
				"Please provide the Leetcode URL (e.g., 'https://leetcode.com/problems/find-the-number-of-winning-players/'):\n",
			validate: (input: string) =>
				input.trim().length > 0 || "Problem name cannot be empty.",
		});

		return url;
	} catch (error) {
		console.error(chalk.red("Error during input collection:"), error);
		throw error;
	}
}

/**
 * Parses the problem title to create a standardized file name.
 * @param {string} title - The original problem title.
 * @returns {string} The parsed title suitable for file naming.
 */
function parseTitle(question: Question): string {
	const title = question.title
		.replace(/\.\s*/, "_")
		.replace(/\s+/g, "_")
		.toLowerCase();
	return question.questionId + "_" + title;
}

/**
 * Generates the file paths for the solution and test files.
 * @param {string} title - The parsed title for file naming.
 * @param {Difficulty} difficulty - The selected difficulty level.
 * @returns {FilePaths} The paths for the solution and test files.
 */
function getFilePaths(title: string, difficulty: Difficulty): FilePaths {
	return {
		solution: path.join("src", difficulty.toLowerCase(), `${title}.ts`),
		test: path.join("tests", difficulty.toLowerCase(), `${title}.test.ts`),
	};
}

/**
 * Creates the solution and test files based on the provided details.
 * @param {string} problemName - The original problem name.
 * @param {Difficulty} difficulty - The selected difficulty level.
 */
async function createFiles(fetcher: QuestionFetcher): Promise<void> {
	try {
		// Parse the title of the problem
		const title = parseTitle(fetcher.question);
		const { solution, test } = getFilePaths(title, fetcher.question.difficulty);

		// Ensure directories exist
		await fs.mkdir(path.dirname(solution), { recursive: true });
		await fs.mkdir(path.dirname(test), { recursive: true });

		// Create the comments

		// Write to solution and test files
		await fs.writeFile(solution, fetcher.comments.questionComments);
		await fs.writeFile(test, fetcher.comments.testsComments);
	} catch (error) {
		console.error(chalk.red("Error creating files:"), error);
		throw error;
	}
}

/**
 * The main function orchestrating the script execution.
 */
async function main(): Promise<void> {
	try {
		// Start the prompt to collect problem name and difficulty
		const url = await startPrompt();

		// Then start the fetcher to return the problem data
		const fetcher: QuestionFetcher = await QuestionFetcher.create(url);

		// Create the files
		await createFiles(fetcher);

		// Log the successful creation of files
		console.log(chalk.green("Files created successfully!"));
	} catch (error) {
		console.error(chalk.red("An error occurred during the process."), error);
		process.exit(1);
	}
}

// Execute the main function
await main();
