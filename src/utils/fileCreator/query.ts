const questionContentQuery = `query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
      mysqlSchemas
    }
  }`;

const questionDataQuery = `query questionTitle($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    isPaidOnly
    difficulty
    likes
    dislikes
  }
}
`;

export const queries = {
	questionContentQuery,
	questionDataQuery,
};
