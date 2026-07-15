export type BlogPostSummary = {
  slug: string;
  number: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export type BlogSearchField =
  | "title"
  | "category"
  | "tag"
  | "excerpt"
  | "body";

export type BlogSearchResult = {
  post: BlogPostSummary;
  score: number;
  matchedFields: BlogSearchField[];
  snippet: string;
};

export type BlogSearchResponse = {
  query: string;
  terms: string[];
  results: BlogSearchResult[];
};
