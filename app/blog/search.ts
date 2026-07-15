import { markdownToPlainText } from "./content";
import type {
  BlogPost,
  BlogPostSummary,
  BlogSearchField,
  BlogSearchResponse,
  BlogSearchResult,
} from "./types";

const MAX_QUERY_LENGTH = 120;
const MAX_TERMS = 8;
const DEFAULT_RESULT_LIMIT = 30;
const MAX_RESULT_LIMIT = 50;

export type BlogSearchDocument = {
  post: BlogPostSummary;
  plainBody: string;
  normalized: Record<BlogSearchField, string>;
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function toSummary(post: BlogPost): BlogPostSummary {
  const { content: _content, ...summary } = post;
  return summary;
}

function createSearchDocument(post: BlogPost): BlogSearchDocument {
  const plainBody = markdownToPlainText(post.content);

  return {
    post: toSummary(post),
    plainBody,
    normalized: {
      title: normalize(post.title),
      category: normalize(post.category),
      tag: normalize(post.tags.join(" ")),
      excerpt: normalize(post.excerpt),
      body: normalize(plainBody),
    },
  };
}

// The index is derived from every Markdown file discovered by markdown.ts. Adding a
// future article therefore updates search without maintaining a second data source.
function parseTerms(query: string) {
  const safeQuery = query.slice(0, MAX_QUERY_LENGTH).normalize("NFKC").trim();
  const terms: string[] = [];
  const matcher = /"([^"]+)"|'([^']+)'|(\S+)/gu;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(safeQuery)) && terms.length < MAX_TERMS) {
    const term = normalize(match[1] ?? match[2] ?? match[3] ?? "");
    if (term && !terms.includes(term)) terms.push(term);
  }

  return { safeQuery, terms };
}

function occurrenceCount(haystack: string, needle: string) {
  if (!needle) return 0;
  let count = 0;
  let cursor = 0;

  while (count < 5) {
    const index = haystack.indexOf(needle, cursor);
    if (index === -1) break;
    count += 1;
    cursor = index + needle.length;
  }

  return count;
}

function scoreDocument(document: BlogSearchDocument, terms: string[], normalizedQuery: string) {
  const fields = document.normalized;
  const searchableText = Object.values(fields).join(" ");
  if (!terms.every((term) => searchableText.includes(term))) return null;

  const matchedFields = new Set<BlogSearchField>();
  let score = 0;

  if (fields.title === normalizedQuery) score += 140;
  else if (fields.title.startsWith(normalizedQuery)) score += 80;

  for (const term of terms) {
    const weights: Array<[BlogSearchField, number]> = [
      ["title", 42],
      ["tag", 34],
      ["category", 26],
      ["excerpt", 14],
      ["body", 5],
    ];

    for (const [field, weight] of weights) {
      const occurrences = occurrenceCount(fields[field], term);
      if (!occurrences) continue;
      matchedFields.add(field);
      score += weight + Math.min(occurrences - 1, 4) * Math.max(1, weight * 0.12);
    }

    if (document.post.tags.some((tag) => normalize(tag) === term)) score += 32;
    if (fields.category === term) score += 22;
  }

  return { score, matchedFields: [...matchedFields] };
}

function createSnippet(document: BlogSearchDocument, terms: string[]) {
  const body = document.plainBody;
  const normalizedBody = document.normalized.body;
  let firstMatch = -1;

  for (const term of terms) {
    const index = normalizedBody.indexOf(term);
    if (index !== -1 && (firstMatch === -1 || index < firstMatch)) firstMatch = index;
  }

  if (firstMatch === -1) return document.post.excerpt;

  const radius = 88;
  const start = Math.max(0, firstMatch - radius);
  const end = Math.min(body.length, firstMatch + radius);
  const snippet = body.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${snippet}${end < body.length ? "…" : ""}`;
}

export function createBlogSearchIndex(posts: BlogPost[]): BlogSearchDocument[] {
  return posts.map(createSearchDocument);
}

export function searchBlogPosts(
  index: BlogSearchDocument[],
  rawQuery: string,
  requestedLimit = DEFAULT_RESULT_LIMIT,
): BlogSearchResponse {
  const { safeQuery, terms } = parseTerms(rawQuery);
  const normalizedQuery = normalize(safeQuery);
  const limit = Math.min(Math.max(Math.trunc(requestedLimit) || DEFAULT_RESULT_LIMIT, 1), MAX_RESULT_LIMIT);

  if (!terms.length) return { query: safeQuery, terms, results: [] };

  const results = index
    .map((document): BlogSearchResult | null => {
      const match = scoreDocument(document, terms, normalizedQuery);
      if (!match) return null;
      return {
        post: document.post,
        score: Math.round(match.score * 100) / 100,
        matchedFields: match.matchedFields,
        snippet: createSnippet(document, terms),
      };
    })
    .filter((result): result is BlogSearchResult => result !== null)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit);

  return { query: safeQuery, terms, results };
}
