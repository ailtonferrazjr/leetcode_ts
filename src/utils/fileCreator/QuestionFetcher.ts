/**
 * @fileoverview
 * A set of classes and utilities to fetch, parse, and generate code comments for LeetCode problems using the LeetCode GraphQL API.
 *
 * Includes:
 * - `QuestionFetcher`: Main class to handle fetching and parsing question data
 * - `QuestionParser`: Helper class to parse HTML content into structured text
 * - `QuestionCommentBlock`: Helper class to generate standardized comment blocks for both problem and test files
 */

import * as cheerio from "cheerio";
import { type ChildNode, Element, Text } from "domhandler";
import { gql, request } from "graphql-request";
import { ElementType } from "htmlparser2";
import { queries } from "./query.js";
import { Difficulty, type Question } from "./types.js";
import dotenv from "dotenv";

// Import the 
dotenv.config();
const LEETCODE_SESSION = process.env.LEETCODE_SESSION || null;


/**
 * LeetCode's GraphQL response structure for general question data (title, difficulty, etc.).
 */
interface QuestionData {
	question: {
		questionId: string;
		questionFrontendId: string;
		title: string;
		titleSlug: string;
		isPaidOnly: boolean;
		difficulty: Difficulty;
		likes: number;
		dislikes: number;
	};
}

/**
 * LeetCode's GraphQL response structure for the question content (HTML description).
 */
interface QuestionContent {
	question: {
		content: string;
		[key: string]: string;
	};
}

/**
 * Represents parsed HTML content, separating the problem description, examples, and constraints.
 */
interface ParsedHTML {
	/** Text-based description of the problem (after HTML parsing). */
	description: string;

	/** An array of example code blocks or usage examples. */
	examples: string[];

	/** An array of constraints extracted from the problem statement. */
	constraints: string[];
}

/**
 * @class QuestionFetcher
 * @description A utility class that fetches and parses LeetCode question data through the GraphQL API.
 *
 * This class is responsible for:
 * - Fetching question content and metadata from LeetCode's GraphQL API
 * - Parsing the HTML content of questions
 * - Generating formatted comments for both questions and tests
 * - Managing the initialization state through promises
 *
 * @example
 * ```typescript
 * const fetcher = await QuestionFetcher.create('https://leetcode.com/problems/some-problem');
 * // Access parsed question data
 * console.log(fetcher.question);
 * // Access generated comments
 * console.log(fetcher.comments);
 * ```
 *
 * @property {string} endpoint - The LeetCode GraphQL API endpoint
 * @property {string} url - The URL of the LeetCode problem
 * @property {Object} queries - Contains GraphQL queries for fetching question content and data
 * @property {Promise<void> | null} initPromise - Promise that tracks initialization status
 * @property {Question} question - The parsed question data
 * @property {Object} comments - Contains generated comment blocks for questions and tests
 *
 * @throws {Error} Throws an error if unable to fetch question data from LeetCode API
 *
 * @remarks
 * - Uses a pseudo-singleton pattern with async initialization through a static `create` method
 * - Implements lazy loading through promise-based initialization
 * - Handles both question content and metadata through separate GraphQL queries
 * - Provides parsing utilities for LeetCode's HTML content format
 *
 * @see {@link Question} for the structure of parsed question data
 * @see {@link QuestionCommentBlock} for comment generation utilities
 * @see {@link QuestionParser} for HTML parsing utilities
 */
export class QuestionFetcher {
	/** The LeetCode GraphQL endpoint to which queries are sent. */
	private endpoint: string = "https://leetcode.com/graphql";
	/** The URL of the target LeetCode problem. */
	private url: string;
	/** Contains pre-defined GraphQL queries for question content and metadata. */
	private queries: { questionContentQuery: string; questionDataQuery: string } =
		queries;
	/** Tracks whether the `QuestionFetcher` has been initialized. */
	private initPromise: Promise<void> | null = null;

	/** The parsed LeetCode question data, including ID, title, description, etc. */
	public question!: Question;
	/** Comment blocks for both the question and its tests. */
	public comments!: { questionComments: string; testsComments: string };
	/** Error details from question data */
	public premiumProblem: boolean = false;

	/**
	 * Factory method to create and initialize a `QuestionFetcher`.
	 *
	 * @param url - The URL of the LeetCode problem (e.g., "https://leetcode.com/problems/two-sum/").
	 * @returns An initialized `QuestionFetcher` instance.
	 */
	static async create(url: string): Promise<QuestionFetcher> {
		const fetcher = new QuestionFetcher(url);
		await fetcher.init();
		return fetcher;
	}

	/**
	 * Private constructor to enforce usage of the `create` method for async initialization.
	 * @param url - The LeetCode problem URL.
	 */
	private constructor(url: string) {
		this.url = url;
		// Start initialization in the constructor, but it's also re-called in `create`
		// to ensure it only runs once.
		this.init();
	}

	/**
	 * Initiates the async initialization process. Uses a lazy-loaded promise to
	 * ensure `_initialize` only runs once.
	 *
	 * @returns A promise that resolves once initialization is complete.
	 */
	private async init(): Promise<void> {
		if (!this.initPromise) {
			this.initPromise = this._initialize();
		}
		return this.initPromise;
	}

	/**
	 * Performs the actual fetching/parsing of question data, then populates the
	 * `question` and `comments` fields on this instance.
	 *
	 * @private
	 */
	private async _initialize(): Promise<void> {

		const { questionContent, questionData } = await this.getQuestionData(
			this.url,
		);

		if (questionData.question.isPaidOnly && !questionContent.question.content) {
			throw new Error(`This is a premium problem and we don't have access to it!`);
		}

		this.question = this.parseQuestion(questionData, questionContent);
		this.comments = {
			questionComments: QuestionCommentBlock.question(this.question),
			testsComments: QuestionCommentBlock.tests(this.question),
		};
	}


	/**
	 * Fetches both the question content (HTML) and question data (metadata) from LeetCode.
	 *
	 * @param url - The LeetCode question URL.
	 * @returns An object containing the question content and question metadata.
	 * @private
	 */
	private async getQuestionData(
		url: string,
	): Promise<{ questionContent: QuestionContent; questionData: QuestionData }> {
		const titleSlug = this.parseUrl(url);

		const questionContent = (await this.queryQuestion(
			this.queries.questionContentQuery,
			titleSlug,
		)) as QuestionContent;

		const questionData = (await this.queryQuestion(
			this.queries.questionDataQuery,
			titleSlug,
		)) as QuestionData;

		return { questionContent, questionData };
	}

	/**
	 * Executes a GraphQL query against the LeetCode API.
	 *
	 * @param query - The GraphQL query string to execute.
	 * @param titleSlug - The title slug extracted from the LeetCode problem URL.
	 * @returns A Promise resolving to the requested `QuestionContent` or `QuestionData`.
	 * @throws {Error} If the query fails, includes the original error message.
	 * @private
	 */
	private async queryQuestion(
		query: string,
		titleSlug: string,
	): Promise<QuestionContent | QuestionData> {
		try {

			const document = gql`${query}`;

			// In case we have the LEETCODE_SESSION
			if (LEETCODE_SESSION) {
				const headers: Record<string, string> = {
					'Content-Type': 'application/json',
					'Cookie': `LEETCODE_SESSION=${LEETCODE_SESSION}`
				}
				return await request(this.endpoint, document, { titleSlug}, headers);
			}

			// In case we don't have the LEETCODE_SESSION
			return await request(this.endpoint, document, { titleSlug });

		} catch (error) {
			throw new Error(`Failed to fetch question data: ${error}`);
		}
	}

	/**
	 * Normalizes the input URL into a standard LeetCode problem URL.
	 *
	 * @param url - The original LeetCode problem URL.
	 * @returns The clean, normalized URL.
	 * @private
	 */
	private getCleanUrl(url: string): string {
		return `https://leetcode.com/problems/${this.parseUrl(url)}/`;
	}

	/**
	 * Extracts the title slug from a given LeetCode problem URL.
	 *
	 * @example
	 * // 'https://leetcode.com/problems/counter-ii/description/' -> 'counter-ii'
	 *
	 * @param url - The LeetCode problem URL.
	 * @returns The parsed slug (e.g., "counter-ii").
	 * @private
	 */
	private parseUrl(url: string): string {
		// 'https://leetcode.com/problems/counter-ii/description/'
		return url.split("/problems/")[1].split("/")[0];
	}

	/**
	 * Parses the raw HTML content from LeetCode into a structured `ParsedHTML` object.
	 *
	 * @param html - The raw HTML content to parse.
	 * @returns A `ParsedHTML` object containing description, examples, and constraints.
	 * @private
	 */
	private parseContent(html: string): ParsedHTML {
		const parsedHtml = QuestionParser.parseProblemHtml(html);
		return parsedHtml;
	}

	/**
	 * Combines the fetched metadata (`questionData`) with the parsed HTML content (`questionContent`)
	 * to form a unified `Question` object.
	 *
	 * @param questionData - Object containing question metadata (ID, title, difficulty, etc.).
	 * @param questionContent - Object containing HTML content from the question.
	 * @returns A fully populated `Question` instance.
	 * @private
	 */
	private parseQuestion(
		questionData: QuestionData,
		questionContent: QuestionContent,
	): Question {

		const { description, examples, constraints } = this.parseContent(
			questionContent.question.content,
		);

		const { title, titleSlug, questionFrontendId, difficulty } =
			questionData.question;

		return {
			title,
			titleSlug,
			questionId: questionFrontendId,
			description,
			examples,
			constraints,
			difficulty,
			questionUrl: this.getCleanUrl(this.url),
		};
}
}

/**
 * Parses LeetCode HTML content and extracts problem description, examples, and constraints.
 *
 * @class
 * @description Utility class containing a static method for parsing problem HTML
 * into a standardized structure.
 */
export class QuestionParser {
	/**
	 * Parses LeetCode HTML content into a `ParsedHTML` object containing `description`,
	 * `examples`, and `constraints`.
	 *
	 * @param html - The raw HTML content from a LeetCode problem page
	 * @returns {ParsedHTML} An object containing the parsed problem information
	 *
	 * @example
	 * const html = '<div>problem content...</div>';
	 * const parsed = QuestionParser.parseProblemHtml(html);
	 * console.log(parsed.description); // Problem description
	 * console.log(parsed.examples); // Array of examples
	 * console.log(parsed.constraints); // Array of constraints
	 */
	static parseProblemHtml(html: string): ParsedHTML {
		// 1) Load the entire HTML into $full (for examples & constraints)
		const $full = cheerio.load(html);

		// 2) Find the index of the first <strong class="example"> in the raw HTML
		const firstExampleIndex = html.indexOf('<strong class="example">');
		// If none is found, the entire HTML is considered the description
		let descHtml =
			firstExampleIndex > -1 ? html.slice(0, firstExampleIndex) : html;
		descHtml = descHtml.trim();

		// 3) Parse only that "description" chunk with another Cheerio instance
		const $desc = cheerio.load(descHtml);

		// 4) GLOBAL REPLACEMENTS on $desc to preserve your custom formatting
		// (A) Replace every <code>...</code> with "..."
		$desc("code").each((_, codeEl) => {
			const codeText = $desc(codeEl).text().trim();
			$desc(codeEl).replaceWith(`"${codeText}"`);
		});

		// (B) Replace every <pre> with "\n -> preText\n\n"
		$desc("pre").each((_, preEl) => {
			const preText = $desc(preEl).text().trim();
			const replacement = `\n -> ${preText}\n\n`;
			$desc(preEl).replaceWith(replacement);
		});

		// (C) Replace every <ul> with bullet lines
		$desc("ul").each((_, ulEl) => {
			const bulletLines: string[] = [];
			const $lis = $desc(ulEl).find("li");

			$lis.each((_index, li) => {
				const bulletText = $desc(li).text().trim();
				bulletLines.push(` -> ${bulletText}\n`);
			});

			const replacement = `\n${bulletLines.join("")}\n`;
			$desc(ulEl).replaceWith(replacement);
		});

		// (D) Convert the modified Cheerio object into text
		let description = $desc.root().text();

		// 5) Clean up extra newlines
		description = description.replace(/\r\n/g, "\n"); // unify line endings
		description = description.replace(/\n{3,}/g, "\n\n"); // collapse triple+ newlines to double
		description = description.trim();

		// 6) Extract examples from the *full* HTML
		const examples: string[] = [];
		$full("pre").each((_, el) => {
			examples.push($full(el).text().trim());
		});

		// 7) Extract constraints from the *full* HTML
		const constraints: string[] = [];
		const constraintsHeader = $full("p").filter((_, pEl) =>
			$full(pEl).text().includes("Constraints:"),
		);
		if (constraintsHeader.length) {
			constraintsHeader
				.next("ul")
				.find("li")
				.each((_, liEl) => {
					constraints.push($full(liEl).text().trim());
				});
		}

		// 8) Return final object
		return {
			description,
			examples,
			constraints,
		};
	}
}

/**
 * Class responsible for generating formatted comment blocks for LeetCode questions.
 *
 * @class QuestionCommentBlock
 * @description Provides static methods to generate standardized comments for both
 * question files and test files.
 */
class QuestionCommentBlock {
	/** Maximum width for generated comments. */
	private static readonly COMMENT_WIDTH = 80;

	/**
	 * Generates a formatted comment block for the main question file.
	 *
	 * @param {Question} question - Object containing LeetCode question data
	 * @returns {string} Formatted comment with question information
	 *
	 * @example
	 * const comment = QuestionCommentBlock.question(questionData);
	 * // Result (simplified):
	 * /*
	 *  * 123 | Two Sum
	 *  * Difficulty: Easy
	 *  * ----------------
	 *  * Description: Given an array of integers...
	 *  * URL: https://leetcode.com/problems/two-sum/
	 * ∕
	 */
	static question(question: Question): string {
		const lines: string[] = [];

		// Header
		const header = [
			"/*",
			` * ${question.questionId} | ${question.title}`,
			` * Difficulty: ${question.difficulty}`,
			" * ----------------",
			" *",
		];
		lines.push(...header);

		// Description
		lines.push(" * Description:");
		this.wrapText(question.description).forEach((line) => {
			lines.push(` * ${line}`);
		});
		lines.push(" *");

		lines.push(` * URL: ${question.questionUrl}`);
		lines.push("*/");
		return lines.join("\n");
	}

	/**
	 * Generates a formatted comment block for the test file.
	 *
	 * @param {Question} question - Object containing LeetCode question data
	 * @returns {string} Formatted comment with test file information
	 *
	 * @example
	 * const testComment = QuestionCommentBlock.tests(questionData);
	 * // Result (simplified):
	 * /*
	 *  * TESTS FILE
	 *  * 123 | Two Sum
	 *  * Difficulty: Easy
	 *  * ----------------
	 * ∕
	 */
	static tests(question: Question): string {
		const lines: string[] = [];

		const header = [
			"/*",
			` * TESTS FILE`,
			` * ${question.questionId} | ${question.title}`,
			` * Difficulty: ${question.difficulty}`,
			" * ----------------",
			" *",
		];
		lines.push(...header);

		lines.push("*/");
		return lines.join("\n");
	}

	/**
	 * Utility method to wrap text content within the specified comment width.
	 *
	 * @param {string} text - The text content to be wrapped
	 * @returns {string[]} Array of wrapped text lines
	 *
	 * @private
	 * @description Splits text into lines that fit within `COMMENT_WIDTH`,
	 * preserving paragraph structure and handling word wrapping appropriately.
	 */
	private static wrapText(text: string): string[] {
		const lines: string[] = [];
		const paragraphs = text.split("\n\n");

		paragraphs.forEach((paragraph) => {
			const words = paragraph.trim().split(" ");
			let currentLine = "";

			words.forEach((word) => {
				if (word === "\n") {
					lines.push(currentLine);
					currentLine = "";
					return;
				}
				// Check if adding another word will exceed the line width
				if (currentLine.length + word.length + 1 <= this.COMMENT_WIDTH - 3) {
					currentLine += (currentLine.length === 0 ? "" : " ") + word;
				} else {
					lines.push(currentLine);
					currentLine = word;
				}
			});

			if (currentLine.length > 0) {
				lines.push(currentLine);
			}

			// Add empty line after each paragraph
			lines.push("");
		});

		// Remove the trailing empty line if present
		if (lines[lines.length - 1] === "") {
			lines.pop();
		}

		return lines;
	}
}
