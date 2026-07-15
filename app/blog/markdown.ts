import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { calculateReadingTime, createArticleExcerpt } from "./content";
import type { BlogPost, BlogPostSummary } from "./types";

const postsDirectory = join(process.cwd(), "app", "blog", "posts");

function readMarkdownFiles(): Record<string, string> {
  return Object.fromEntries(
    readdirSync(postsDirectory)
      .filter((fileName) => fileName.endsWith(".md"))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => [
        `./posts/${fileName}`,
        readFileSync(join(postsDirectory, fileName), "utf8"),
      ]),
  );
}

const markdownFiles = readMarkdownFiles();

const allowedFrontmatterFields = new Set([
  "title",
  "date",
  "category",
  "tags",
  "draft",
  "publishAt",
  "featured",
  "excerpt",
  // Legacy fields remain accepted during HMR and content migration, but their
  // values are deliberately ignored in favor of the generated metadata below.
  "number",
  "readingTime",
]);

type ParsedPost = Omit<BlogPost, "number"> & {
  draft: boolean;
  publishTimestamp: number;
  sourcePath: string;
};

function parseFrontmatter(source: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, content: source };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (rawValue === "true" || rawValue === "false") {
      data[key] = rawValue === "true";
      continue;
    }

    try {
      data[key] = JSON.parse(rawValue);
    } catch {
      data[key] = rawValue;
    }
  }

  return { data, content: source.slice(match[0].length).trim() };
}

function parseCalendarDate(value: string, label: string, errors: string[]) {
  const match = value.match(/^(\d{4})[.-](\d{2})[.-](\d{2})$/u);
  if (!match) {
    errors.push(`${label} 必须使用 YYYY-MM-DD 或 YYYY.MM.DD 格式`);
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year
    || check.getUTCMonth() !== month - 1
    || check.getUTCDate() !== day
  ) {
    errors.push(`${label} 不是有效的日历日期`);
    return null;
  }

  const isoDate = `${yearText}-${monthText}-${dayText}`;
  return {
    displayDate: `${yearText}.${monthText}.${dayText}`,
    isoDate,
    timestamp: Date.parse(`${isoDate}T00:00:00+08:00`),
  };
}

function parsePublishTimestamp(
  value: unknown,
  fallbackTimestamp: number,
  label: string,
  errors: string[],
) {
  if (value === undefined) return fallbackTimestamp;
  if (typeof value !== "string") {
    errors.push(`${label} 必须是带时区的 ISO 日期时间`);
    return fallbackTimestamp;
  }

  const calendarDate = value.match(/^\d{4}[.-]\d{2}[.-]\d{2}$/u);
  if (calendarDate) {
    return parseCalendarDate(value, label, errors)?.timestamp ?? fallbackTimestamp;
  }

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/u.test(value)) {
    errors.push(`${label} 必须使用 ISO 8601 格式并包含时区，例如 2026-07-13T09:00:00+08:00`);
    return fallbackTimestamp;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    errors.push(`${label} 不是有效的发布时间`);
    return fallbackTimestamp;
  }
  return timestamp;
}

function readRequiredString(
  data: Record<string, unknown>,
  field: string,
  label: string,
  errors: string[],
) {
  const value = data[field];
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label} 必须是非空字符串`);
    return "";
  }
  return value.trim();
}

function parsePost(path: string, source: string): { post: ParsedPost; errors: string[] } {
  const { data, content } = parseFrontmatter(source);
  const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
  const errors: string[] = [];

  if (!source.startsWith("---")) errors.push("缺少 Frontmatter 区块");
  for (const key of Object.keys(data)) {
    if (!allowedFrontmatterFields.has(key)) errors.push(`包含未知字段 ${key}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) {
    errors.push("文件名必须是小写英文、数字和连字符组成的唯一 Slug");
  }

  const title = readRequiredString(data, "title", "title", errors);
  const rawDate = readRequiredString(data, "date", "date", errors);
  const category = readRequiredString(data, "category", "category", errors);
  const parsedDate = parseCalendarDate(rawDate, "date", errors);

  let tags: string[] = [];
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push("tags 必须是至少包含一个标签的数组");
  } else if (data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
    errors.push("tags 中的每一项都必须是非空字符串");
  } else {
    tags = data.tags.map((tag) => String(tag).trim());
    const normalizedTags = tags.map((tag) => tag.toLocaleLowerCase());
    if (new Set(normalizedTags).size !== normalizedTags.length) errors.push("tags 不能包含重复项");
  }

  for (const booleanField of ["draft", "featured"] as const) {
    if (data[booleanField] !== undefined && typeof data[booleanField] !== "boolean") {
      errors.push(`${booleanField} 必须是 true 或 false`);
    }
  }
  if (data.excerpt !== undefined && (typeof data.excerpt !== "string" || !data.excerpt.trim())) {
    errors.push("excerpt 必须是非空字符串，或删除该字段以自动生成");
  }
  if (!content) errors.push("正文不能为空");

  const fallbackTimestamp = parsedDate?.timestamp ?? 0;
  const publishTimestamp = parsePublishTimestamp(data.publishAt, fallbackTimestamp, "publishAt", errors);

  return {
    errors,
    post: {
      slug,
      title,
      excerpt: typeof data.excerpt === "string" ? data.excerpt.trim() : createArticleExcerpt(content),
      date: parsedDate?.displayDate ?? rawDate,
      category,
      readingTime: calculateReadingTime(content),
      tags,
      featured: data.featured === true,
      content,
      draft: data.draft === true,
      publishTimestamp,
      sourcePath: path,
    },
  };
}

function parseAndValidatePosts() {
  const parsed = Object.entries(markdownFiles).map(([path, source]) => parsePost(path, source));
  const errors = parsed.flatMap(({ post, errors: postErrors }) =>
    postErrors.map((error) => `${post.sourcePath}: ${error}`),
  );
  const slugs = new Set<string>();
  for (const { post } of parsed) {
    if (slugs.has(post.slug)) errors.push(`${post.sourcePath}: Slug ${post.slug} 与另一篇文章重复`);
    slugs.add(post.slug);
  }

  if (errors.length) {
    throw new Error(`博客内容校验失败：\n- ${errors.join("\n- ")}`);
  }
  return parsed.map(({ post }) => post);
}

const parsedPosts = parseAndValidatePosts();

function getPublishedPosts(now = new Date()): BlogPost[] {
  const published = parsedPosts
    .filter((post) => !post.draft && post.publishTimestamp <= now.getTime())
    .sort((a, b) => a.publishTimestamp - b.publishTimestamp || a.slug.localeCompare(b.slug));

  return published
    .map(({ draft: _draft, sourcePath: _sourcePath, ...post }, index) => ({
      post: {
        ...post,
        number: String(index + 1).padStart(3, "0"),
      },
      publishTimestamp: post.publishTimestamp,
    }))
    .sort((a, b) => b.publishTimestamp - a.publishTimestamp || b.post.slug.localeCompare(a.post.slug))
    .map(({ post: { publishTimestamp: _publishTimestamp, ...post } }) => post);
}

export function getAllPosts(): BlogPost[] {
  return getPublishedPosts();
}

export function getAllPostSummaries(): BlogPostSummary[] {
  return getPublishedPosts().map(({ content: _content, ...summary }) => summary);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function getPostNeighbors(slug: string): {
  previous?: BlogPostSummary;
  next?: BlogPostSummary;
} {
  const posts = getPublishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) return {};

  const toSummary = ({ content: _content, ...summary }: BlogPost) => summary;
  return {
    previous: posts[index - 1] ? toSummary(posts[index - 1]) : undefined,
    next: posts[index + 1] ? toSummary(posts[index + 1]) : undefined,
  };
}
