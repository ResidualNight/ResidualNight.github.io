const NAVIGATION_STACK_KEY = "reflex4:blog-navigation-stack";
const FALLBACK_URL = "/blog";

function readStack(): string[] {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(NAVIGATION_STACK_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  try {
    window.sessionStorage.setItem(NAVIGATION_STACK_KEY, JSON.stringify(stack.slice(-20)));
  } catch {
    // Navigation must still work when storage is blocked or its quota is full.
  }
}

export function currentBlogLocation(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export function pushCurrentBlogLocation() {
  const current = currentBlogLocation();
  const stack = readStack();
  if (stack.at(-1) !== current) stack.push(current);
  writeStack(stack);
}

export function popBlogParent(): string {
  const stack = readStack();
  const parent = stack.pop() ?? FALLBACK_URL;
  writeStack(stack);
  return /^\/blog(?:\/[^?]+|\?|$)/.test(parent) ? parent : FALLBACK_URL;
}

export function replaceWithBlogParent() {
  window.location.replace(popBlogParent());
}

export function clearBlogNavigationStack() {
  try {
    window.sessionStorage.removeItem(NAVIGATION_STACK_KEY);
  } catch {
    // Treat an unavailable store as an already-empty navigation stack.
  }
}
