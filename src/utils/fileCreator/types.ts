enum Difficulty {
	Easy = "Easy",
	Medium = "Medium",
	Hard = "Hard",
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

export { Difficulty, type Question };
