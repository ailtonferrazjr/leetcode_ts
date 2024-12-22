import { gql, request } from 'graphql-request'
import {queries} from "./query.js";

const url = 'https://leetcode.com/graphql';

enum Difficulty {
	Easy = "Easy",
	Medium = "Medium",
	Hard = "Hard",
}
interface QuestionData {
    questionId: string;
    questionFrontendId: string;
    title: string;
    titleSlug: string;
    isPaidOnly: boolean,
    difficulty: Difficulty,
    likes: number,
    dislikes: number
}
interface QuestionContent {
    content: string;
    [key: string]: string;
}

export class QuestionFetcher {
    endpoint: string = 'https://leetcode.com/graphql';
    url: string;
    queries: { questionContentQuery: string; questionDataQuery: string; } = queries;
    questionContent: string | null = null;
    questionData: QuestionData | null = null;
    isInitialized: boolean = false;
    private initPromise: Promise<void> | null = null;

    static async create(url: string): Promise<QuestionFetcher> {
        const fetcher = new QuestionFetcher(url);
        await fetcher.init();
        return fetcher;
    }

    constructor(url: string) {
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
        const { questionContent, questionData } = await this.getQuestionData(this.url);
        this.questionContent = questionContent.content;
        this.questionData = questionData;
        this.isInitialized = true;
    }
    
    async getQuestionData(url: string): Promise<{questionContent: QuestionContent; questionData: QuestionData}> {
        const titleSlug = this.parseUrl(url);
        const questionContent = await this.queryQuestion(this.queries.questionContentQuery, titleSlug) as QuestionContent;
        const questionData = await this.queryQuestion(this.queries.questionDataQuery, titleSlug) as QuestionData;
        return { questionContent, questionData};
    }

    async queryQuestion(query: string, titleSlug: string): Promise<QuestionContent|QuestionData> {
        try {
        const document = gql`${query}`;
        return await request(url, document, {
            titleSlug: titleSlug
        })
    } catch (error) {
        throw new Error(`Failed to fetch question data: ${error}`);
    }
    }

    parseUrl(url: string): string {
       // 'https://leetcode.com/problems/counter-ii/description/'
       return url.split("/problems/")[1].split("/")[0]
    }
}



