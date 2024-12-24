import * as cheerio from "cheerio";
import { type ChildNode, Element, Text } from "domhandler";
import { gql, request } from "graphql-request";
import { ElementType } from "htmlparser2";
import { queries } from "./query.js";
import { Difficulty, type Question } from "./types.js";

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
interface QuestionContent {
	question: { content: string; [key: string]: string };
}
interface ParsedHTML {
	description: string;
	examples: string[];
	constraints: string[];
}

/**
 * @class QuestionFetcher
 * @description A utility class that fetches and parses LeetCode question data through GraphQL API.
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
 * - Uses singleton pattern with async initialization through static create method
 * - Implements lazy loading through promise-based initialization
 * - Handles both question content and metadata through separate GraphQL queries
 * - Provides parsing utilities for LeetCode's HTML content format
 *
 * @see {@link Question} for the structure of parsed question data
 * @see {@link QuestionCommentBlock} for comment generation utilities
 * @see {@link QuestionParser} for HTML parsing utilities
 */
export class QuestionFetcher {
	private endpoint: string = "https://leetcode.com/graphql";
	private url: string;
	private queries: { questionContentQuery: string; questionDataQuery: string } =
		queries;
	private initPromise: Promise<void> | null = null;

	public question!: Question;
	public comments!: { questionComments: string; testsComments: string };

	static async create(url: string): Promise<QuestionFetcher> {
		const fetcher = new QuestionFetcher(url);
		await fetcher.init();
		return fetcher;
	}
	private constructor(url: string) {
		this.url = url;
		this.init();
	}
	private async init() {
		if (!this.initPromise) {
			this.initPromise = this._initialize();
		}
		return this.initPromise;
	}
	/**
	 * Initializes the QuestionFetcher instance by fetching and parsing question data.
	 * @private
	 */
	private async _initialize() {
		const { questionContent, questionData } = await this.getQuestionData(
			this.url,
		);
		this.question = this.parseQuestion(questionData, questionContent);
		this.comments = {
			questionComments: QuestionCommentBlock.question(this.question),
			testsComments: QuestionCommentBlock.tests(this.question),
		};
	}
	/**
	 * Fetches both content and metadata for a LeetCode question.
	 * @param {string} url - The LeetCode question URL
	 * @returns {Promise<{questionContent: QuestionContent; questionData: QuestionData}>}
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
	 * @param {string} query - The GraphQL query to execute
	 * @param {string} titleSlug - The question's title slug
	 * @returns {Promise<QuestionContent | QuestionData>}
	 * @throws {Error} If the query fails
	 * @private
	 */
	private async queryQuestion(
		query: string,
		titleSlug: string,
	): Promise<QuestionContent | QuestionData> {
		try {
			const document = gql`${query}`;
			return await request(this.endpoint, document, {
				titleSlug: titleSlug,
			});
		} catch (error) {
			throw new Error(`Failed to fetch question data: ${error}`);
		}
	}
	private getCleanUrl(url: string): string {
		return `https://leetcode.com/problems/${this.parseUrl(url)}/`;
	}

	private parseUrl(url: string): string {
		// 'https://leetcode.com/problems/counter-ii/description/'
		return url.split("/problems/")[1].split("/")[0];
	}
	private parseContent(html: string): ParsedHTML {
		const parsedHtml = QuestionParser.parseProblemHtml(html);
		return parsedHtml;
	}
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
			title: title,
			titleSlug: titleSlug,
			questionId: questionFrontendId,
			description: description,
			examples: examples,
			constraints: constraints,
			difficulty: difficulty,
			questionUrl: this.getCleanUrl(this.url),
		};
	}
}
/**
 * Parses LeetCode HTML content and extracts problem description, examples, and constraints.
 *
 * @static
 * @param {string} html - The HTML content from a LeetCode problem page
 * @returns {ParsedHTML} An object containing the parsed problem information
 * @property {string} description - The problem description text
 * @property {string[]} examples - Array of example test cases
 * @property {string[]} constraints - Array of problem constraints
 *
 * @example
 * const html = '<div>problem content...</div>';
 * const parsed = QuestionParser.parseProblemHtml(html);
 * console.log(parsed.description); // Problem description
 * console.log(parsed.examples); // Array of examples
 * console.log(parsed.constraints); // Array of constraints
 */
export class QuestionParser {
	/**
	 * Parses LeetCode HTML content into a structured format
	 */
	static parseProblemHtml(html: string): ParsedHTML {
		// 1) Load the entire HTML into $full (for examples & constraints)
		const $full = cheerio.load(html);

		// 2) Find the index of the first <strong class="example"> in the raw HTML
		const firstExampleIndex = html.indexOf('<strong class="example">');
		// If none is found, the entire HTML is the description
		let descHtml =
			firstExampleIndex > -1 ? html.slice(0, firstExampleIndex) : html;
		descHtml = descHtml.trim();

		// 3) Parse only that "description" chunk with another Cheerio instance
		const $desc = cheerio.load(descHtml);

		// 4) GLOBAL REPLACEMENTS on $desc to preserve your custom formatting
		//
		// (A) Replace every <code>...</code> with "..."
		$desc("code").each((_, codeEl) => {
			const codeText = $desc(codeEl).text().trim();
			// Replace <code>...</code> with "someCode"
			$desc(codeEl).replaceWith(`"${codeText}"`);
		});

		// (B) Replace every <pre> with "\n -> preText\n\n"
		$desc("pre").each((_, preEl) => {
			const preText = $desc(preEl).text().trim();
			// We insert a short marker with leading/trailing newlines
			const replacement = `\n -> ${preText}\n\n`;
			$desc(preEl).replaceWith(replacement);
		});

		// (C) Replace every <ul> with bullet lines
		$desc("ul").each((_, ulEl) => {
			const bulletLines: string[] = [];
			const $lis = $desc(ulEl).find("li");
			// Build lines like:
			//   -> bullet 1
			//   -> bullet 2
			// with blank lines around
			$lis.each((_index, li) => {
				const bulletText = $desc(li).text().trim();
				bulletLines.push(` -> ${bulletText}\n`);
			});
			// Insert newlines before & after
			const replacement = `\n${bulletLines.join("")}\n`;
			$desc(ulEl).replaceWith(replacement);
		});

		// (D) Now we can get pure text from $desc
		// This includes all the replaced strings for <pre> / <ul> / <code>
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
	/** Maximum width for generated comments */
	private static readonly COMMENT_WIDTH = 80;

	/**
	 * Generates a formatted comment block for the main question file.
	 *
	 * @param {Question} question - Object containing LeetCode question data
	 * @returns {string} Formatted comment with question information
	 *
	 * @example
	 * const comment = QuestionCommentBlock.question(questionData);
	 * // Result:
	 * /*
	 *  * 123 | Two Sum
	 *  * Difficulty: Easy
	 *  * ----------------
	 *  * Description: Given an array of integers...
	 *  * URL: https://leetcode.com/problems/two-sum/
	 * ∕/
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
	 * // Result:
	 * /*
	 *  * TESTS FILE
	 *  * 123 | Two Sum
	 *  * Difficulty: Easy
	 *  * ----------------
	 * ∕/
	 */
	static tests(question: Question): string {
		const lines: string[] = [];

		// Header
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
	 * @description Splits text into lines that fit within COMMENT_WIDTH,
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

			// Add empty line between paragraphs
			lines.push("");
		});

		// Remove last empty line
		if (lines[lines.length - 1] === "") {
			lines.pop();
		}

		return lines;
	}
}
