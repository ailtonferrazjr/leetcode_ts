import * as cheerio from "cheerio";
import { gql, request } from "graphql-request";
import { queries } from "./query.js";

enum Difficulty {
	Easy = "Easy",
	Medium = "Medium",
	Hard = "Hard",
}
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
interface Question {
	title: string;
	description: string;
	examples: string[];
	constraints: string[];
	difficulty: Difficulty;
	titleSlug: string;
	questionId: string;
	questionUrl: string;
}
interface ParsedHTML {
	description: string;
	examples: string[];
	constraints: string[];
}

class QuestionFetcher {
	private endpoint: string = "https://leetcode.com/graphql";
	private url: string;
	private queries: { questionContentQuery: string; questionDataQuery: string } =
		queries;
	private initPromise: Promise<void> | null = null;

	question: Question | null = null;
	commentBlock: string | null = null;

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
	private async _initialize() {
		const { questionContent, questionData } = await this.getQuestionData(
			this.url,
		);
		this.question = this.parseQuestion(questionData, questionContent);
		this.commentBlock = QuestionCommentBlock.generate(this.question);
	}
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
        return `https://https://leetcode.com/problems/${this.parseUrl(url)}/`;
    }

	private parseUrl(url: string): string {
		// 'https://leetcode.com/problems/counter-ii/description/'
		return url.split("/problems/")[1].split("/")[0];
	}
	private parseContent(html: string): ParsedHTML {
		return QuestionParser.parseProblemHtml(html);
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
class QuestionParser {
	/**
	 * Parses LeetCode HTML content into a structured format
	 */
	static parseProblemHtml(html: string): ParsedHTML {
		const $ = cheerio.load(html);

		// Extract main problem description
		const description = $("p").first().text().trim();

		// Extract examples
		const examples: string[] = [];
		$("pre").each((_, element) => {
			examples.push($(element).text().trim());
		});

		// Extract constraints
		const constraints: string[] = [];
		// Find the constraints section by looking for the header text
		const constraintsHeader = $("p").filter((_, element) =>
			$(element).text().includes("Constraints:"),
		);

		// If we found the constraints section, get the following ul/li elements
		if (constraintsHeader.length) {
			constraintsHeader
				.next("ul")
				.find("li")
				.each((_, element) => {
					constraints.push($(element).text().trim());
				});
		}

		return {
			description,
			examples,
			constraints,
		};
	}
}
class QuestionCommentBlock {
	private static readonly COMMENT_WIDTH = 80;

	static generate(question: Question) {
		const lines: string[] = [];

		// Header
		lines.push("/*");
		lines.push(` * ${question.questionId} | ${question.title}`);
        lines.push(` * Difficulty: ${question.difficulty}`);
		lines.push(" * ----------------");
		lines.push(" *");

		// Description
		lines.push(" * Description:");
		this.wrapText(question.description).forEach((line) => {
			lines.push(` * ${line}`);
		});
		lines.push(" *");

        lines.push(` * URL: ${question.questionUrl}`)

		lines.push("*/");
		return lines.join("\n");
	}

	/**
	 * Wraps text to fit within comment width
	 */
	private static wrapText(text: string): string[] {
		const words = text.split(" ");
		const lines: string[] = [];
		let currentLine = "";

		words.forEach((word) => {
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

		return lines;
	}
}

export async function getCommentBlock(url: string): Promise<string> {

	try {
		const fetcher = await QuestionFetcher.create(url);
		const block = fetcher.commentBlock;

		if (!block) throw new Error(`Couldn't get the comment!`);
		return block;

	} catch (error) {
		console.error(`There was an error getting a comment block: ${error}`);
		throw error;
	}

}
