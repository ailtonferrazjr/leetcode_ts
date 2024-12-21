import { promises as fs } from "fs";
import path from "path";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";

enum Difficulty {
	Easy = "easy",
	Medium = "medium",
	Hard = "hard",
}

interface ProblemDetails {
	problemName: string;
	difficulty: Difficulty;
}

interface FilePaths {
	solution: string;
	test: string;
}

/**
 * Starts the prompt to collect problem name and difficulty from the user.
 * @returns {Promise<ProblemDetails>} The problem name and selected difficulty.
 */
async function startPrompt(): Promise<ProblemDetails> {
	try {
		const problemName = await input({
			message:
				"Please provide the Leetcode problem name (e.g., '3238. Find the Number of Winning Players'):\n",
			validate: (input: string) =>
				input.trim().length > 0 || "Problem name cannot be empty.",
		});

		const difficulty = await select({
			message: "Please select the problem difficulty:",
			choices: [
				{ name: "Easy", value: Difficulty.Easy },
				{ name: "Medium", value: Difficulty.Medium },
				{ name: "Hard", value: Difficulty.Hard },
			],
		});

		return { problemName: problemName.trim(), difficulty };
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
function parseTitle(title: string): string {
	return title.replace(/\.\s*/, "_").replace(/\s+/g, "_").toLowerCase();
}

/**
 * Generates the file paths for the solution and test files.
 * @param {string} title - The parsed title for file naming.
 * @param {Difficulty} difficulty - The selected difficulty level.
 * @returns {FilePaths} The paths for the solution and test files.
 */
function getFilePaths(title: string, difficulty: Difficulty): FilePaths {
	return {
		solution: path.join("src", difficulty, `${title}.ts`),
		test: path.join("tests", difficulty, `${title}.test.ts`),
	};
}

/**
 * Creates the solution and test files based on the provided details.
 * @param {string} problemName - The original problem name.
 * @param {Difficulty} difficulty - The selected difficulty level.
 */
async function createFiles(
	problemName: string,
	difficulty: Difficulty,
): Promise<void> {
	try {
		const title = parseTitle(problemName);
		const { solution, test } = getFilePaths(title, difficulty);

		// Ensure directories exist
		await fs.mkdir(path.dirname(solution), { recursive: true });
		await fs.mkdir(path.dirname(test), { recursive: true });

		// Write to solution and test files
		await fs.writeFile(solution, `// ${problemName}\n\n`);
		await fs.writeFile(
			test,
			`// ${problemName}\n// Test cases will be added here.\n`,
		);
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
		const { problemName, difficulty } = await startPrompt();

		// Create the files
		await createFiles(problemName, difficulty);

		// Log the successful creation of files
		console.log(chalk.green("Files created successfully!"));
	} catch (error) {
		console.error(chalk.red("An error occurred during the process."), error);
		process.exit(1);
	}
}

// Execute the main function
await main();
