const DEFAULT_EXCERPT_LENGTH = 108;

export function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/u, "")
    .replace(/```[^\n]*\n([\s\S]*?)```/gu, "$1")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/<[^>]+>/gu, " ")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+[.)])\s+/gmu, "")
    .replace(/\$\$?/gu, "")
    .replace(/[\\*_~]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function truncateExcerpt(text: string, maximumLength: number) {
  const characters = Array.from(text);
  if (characters.length <= maximumLength) return text;

  const candidate = characters.slice(0, maximumLength + 1).join("");
  const punctuationFloor = Math.floor(maximumLength * 0.62);
  const punctuationMatches = [...candidate.matchAll(/[。！？；.!?;]/gu)];
  const finalPunctuation = punctuationMatches.at(-1);
  const cutAt = finalPunctuation && finalPunctuation.index! >= punctuationFloor
    ? finalPunctuation.index! + finalPunctuation[0].length
    : maximumLength;

  return `${Array.from(candidate).slice(0, cutAt).join("").trim()}…`;
}

export function createArticleExcerpt(markdown: string, maximumLength = DEFAULT_EXCERPT_LENGTH) {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/gu, " ");
  const paragraphs = withoutCodeBlocks.split(/\r?\n\s*\r?\n/gu);

  for (const block of paragraphs) {
    const trimmed = block.trim();
    if (!trimmed || /^(?:#{1,6}\s|[-+*]\s|\d+[.)]\s|>|\|)/u.test(trimmed)) continue;
    const plainText = markdownToPlainText(trimmed);
    if (plainText) return truncateExcerpt(plainText, maximumLength);
  }

  return truncateExcerpt(markdownToPlainText(markdown), maximumLength);
}

export function calculateReadingTime(markdown: string) {
  const plainText = markdownToPlainText(markdown);
  const hanCharacters = plainText.match(/\p{Script=Han}/gu)?.length ?? 0;
  const nonHanWords = plainText
    .replace(/\p{Script=Han}/gu, " ")
    .match(/[\p{Letter}\p{Number}_+-]+/gu)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil(hanCharacters / 300 + nonHanWords / 200));
  return `${minutes} MIN`;
}
