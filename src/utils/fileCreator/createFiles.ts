import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";
import { confirm, input } from "@inquirer/prompts";
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

async function shouldOverwritePrompt(title: string): Promise<boolean> {
	try {
		return await confirm({
			message: `A file of the problem '${title}' is already present in the repository, should overwrite it?\n`,
		});
	} catch (error) {
		console.error(
			`There was an error on getting the confirmation to overwrite`,
		);
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

function isExistingProblem(fetcher: QuestionFetcher): boolean {
	const title = parseTitle(fetcher.question);
	const { solution } = getFilePaths(title, fetcher.question.difficulty);
	return fs.existsSync(solution);
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

		// Check if it's an existing problem
		if (isExistingProblem(fetcher)) {
			const shouldOverwrite = await shouldOverwritePrompt(
				`${fetcher.question.questionId} | ${fetcher.question.title}`,
			);

			// In case the response is that we shouldn't overwrite
			if (!shouldOverwrite) {
				console.log(chalk.yellow(`Operation cancelled!`));
				return;
			}

			// Overwrite the files
			await createFiles(fetcher);
			console.log(chalk.green("The files were overwrite succesfully!"));
			return;
		}

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
