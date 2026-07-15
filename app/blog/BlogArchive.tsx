"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearBlogNavigationStack,
  pushCurrentBlogLocation,
  replaceWithBlogParent,
} from "./navigation";
import type {
  BlogPostSummary as Post,
  BlogSearchField,
  BlogSearchResult,
} from "./types";
import { searchBlogPosts, type BlogSearchDocument } from "./search";

type View = "list" | "categories" | "search";

const views: Array<{ id: View; number: string; label: string }> = [
  { id: "list", number: "01", label: "文章列表" },
  { id: "categories", number: "02", label: "分类索引" },
  { id: "search", number: "03", label: "搜索" },
];

const searchFieldLabels: Record<BlogSearchField, string> = {
  title: "标题",
  category: "分类",
  tag: "Tag",
  excerpt: "摘要",
  body: "正文",
};

export function BlogArchive({
  posts,
  searchIndex,
}: {
  posts: Post[];
  searchIndex: BlogSearchDocument[];
}) {
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [hasRestoredState, setHasRestoredState] = useState(false);
  const [searchResults, setSearchResults] = useState<BlogSearchResult[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [searchRetry, setSearchRetry] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const recordCount = posts.length.toString().padStart(2, "0");

  const selectView = useCallback((nextView: View) => {
    if (nextView === view && !selectedCategory && !selectedTag) return;

    if (nextView === "list") clearBlogNavigationStack();
    else pushCurrentBlogLocation();

    setView(nextView);
    setSelectedCategory("");
    setSelectedTag("");
    if (nextView !== "search") setQuery("");
    if (nextView === "search") {
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [selectedCategory, selectedTag, view]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedView = params.get("view");
    const category = params.get("category") ?? "";
    const tag = params.get("tag") ?? "";

    if (!savedView && !category && !tag && !params.get("q")) {
      clearBlogNavigationStack();
    }

    if (category && posts.some((post) => post.category === category)) {
      setSelectedCategory(category);
      setView("list");
    } else if (tag && posts.some((post) => post.tags.includes(tag))) {
      setSelectedTag(tag);
      setView("list");
    } else if (savedView && views.some((item) => item.id === savedView)) {
      setView(savedView as View);
    }
    setQuery(params.get("q") ?? "");
    setHasRestoredState(true);
  }, [posts]);

  useEffect(() => {
    if (!hasRestoredState) return;

    const url = new URL(window.location.href);
    if (view === "list") url.searchParams.delete("view");
    else url.searchParams.set("view", view);

    if (view === "search" && query.trim()) url.searchParams.set("q", query);
    else url.searchParams.delete("q");

    if (selectedCategory) url.searchParams.set("category", selectedCategory);
    else url.searchParams.delete("category");

    if (selectedTag) url.searchParams.set("tag", selectedTag);
    else url.searchParams.delete("tag");

    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [hasRestoredState, query, selectedCategory, selectedTag, view]);

  useEffect(() => {
    if (!hasRestoredState || view !== "search") return;
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setSearchTerms([]);
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");
    setSearchResults([]);
    const timer = window.setTimeout(() => {
      try {
        const payload = searchBlogPosts(searchIndex, trimmedQuery);
        setSearchResults(payload.results);
        setSearchTerms(payload.terms);
        setSearchStatus("success");
      } catch {
        setSearchStatus("error");
      }
    }, 240);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasRestoredState, query, searchIndex, searchRetry, view]);

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.matches("input, textarea, select, [contenteditable='true']");

      if (event.key === "/" && !isEditing) {
        event.preventDefault();
        if (view !== "search") selectView("search");
        else searchRef.current?.focus();
      }

      if (event.key === "Escape" && view === "search" && document.activeElement === searchRef.current) {
        setQuery("");
      }
    }

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, [selectView, view]);

  const archivePosts = useMemo(
    () => posts.filter((post) => {
      if (selectedCategory && post.category !== selectedCategory) return false;
      if (selectedTag && !post.tags.includes(selectedTag)) return false;
      return true;
    }),
    [posts, selectedCategory, selectedTag],
  );

  const categories = useMemo(
    () =>
      Array.from(new Set(posts.map((post) => post.category))).map((category) => ({
        name: category,
        posts: posts.filter((post) => post.category === category),
      })),
    [posts],
  );

  function returnFromArchiveContext() {
    replaceWithBlogParent();
  }

  return (
    <>
      {(view !== "list" || selectedCategory || selectedTag) && (
        <button
          className="article-return-button"
          type="button"
          onClick={returnFromArchiveContext}
          aria-label="返回之前的博客页面"
          title="返回之前的页面"
        >
          <span aria-hidden="true">←</span>
        </button>
      )}
      <nav className="blog-floating-nav" aria-label="博客浏览方式">
        <div className="blog-view-tabs" role="tablist" aria-label="切换博客视图">
          {views.map((item) => (
            <button
              className={`blog-view-tab${view === item.id ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={view === item.id}
              aria-controls={`blog-${item.id}-panel`}
              onClick={() => selectView(item.id)}
              key={item.id}
            >
              <span>{item.number}</span>
              {item.label}
            </button>
          ))}
        </div>
        <p className="blog-nav-note">
          {view === "list" && `LATEST RECORDS / ${recordCount}`}
          {view === "categories" && "INDEXED BY SUBJECT"}
          {view === "search" && "SEARCH THE ARCHIVE"}
        </p>
      </nav>

      <header className="blog-intro">
        <div>
          <p className="eyebrow">Notes / Essays / Field Records</p>
          <h1>写作<br />归档</h1>
        </div>
        <p className="blog-deck">
          这里收集工程实践、智能感知、摄影与声音实验。
          文章尚未全部完成，但每一条记录都会保留问题发生时的温度。
        </p>
        <span className="blog-issue-mark" aria-hidden="true">R4<br />/{recordCount}</span>
      </header>

      {view === "list" && (
        <section
          className="blog-panel blog-list-panel"
          id="blog-list-panel"
          role="tabpanel"
          aria-label="博客列表"
        >
          <header className="blog-section-head">
            <span>
              {selectedCategory || selectedTag
                ? `${archivePosts.length.toString().padStart(2, "0")} Filtered Records`
                : `Archive No. ${posts.at(-1)?.number}—${posts[0]?.number}`}
            </span>
            <span>{selectedCategory || selectedTag ? "筛选结果" : "按发布日期排列 ↓"}</span>
          </header>
          {(selectedCategory || selectedTag) && (
            <div className="blog-filter-summary" aria-live="polite">
              <div>
                <span>{selectedCategory ? "Category / 分类" : "Tag / 标签"}</span>
                <h2>{selectedCategory || `#${selectedTag}`}</h2>
              </div>
              <a href="/blog" onClick={clearBlogNavigationStack}>清除筛选 ×</a>
            </div>
          )}
          <div className="post-list">
            {archivePosts.map((post) => <PostRow post={post} key={post.number} />)}
          </div>
        </section>
      )}

      {view === "categories" && (
        <section
          className="blog-panel category-panel"
          id="blog-categories-panel"
          role="tabpanel"
          aria-label="博客分类"
        >
          <header className="blog-section-head">
            <span>Subject Index</span>
            <span>{categories.length.toString().padStart(2, "0")} 个主题</span>
          </header>
          <div className="category-grid">
            {categories.map((category, index) => (
              <article className="category-card" key={category.name}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{category.posts.length.toString().padStart(2, "0")} RECORD</b>
                </header>
                <h2>
                  <a
                    className="category-filter-link"
                    href={`/blog?category=${encodeURIComponent(category.name)}`}
                    onClick={pushCurrentBlogLocation}
                  >
                    {category.name}<span aria-hidden="true">→</span>
                  </a>
                </h2>
                <ul>
                  {category.posts.map((post) => (
                    <li key={post.number}>
                      <span>{post.number}</span>
                      <a href={`/blog/${post.slug}`} onClick={pushCurrentBlogLocation}>
                        {post.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "search" && (
        <section
          className="blog-panel search-panel"
          id="blog-search-panel"
          role="tabpanel"
          aria-label="搜索博客"
        >
          <form className="archive-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="blog-search">在写作归档中搜索</label>
            <div className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                ref={searchRef}
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、正文、分类或 Tag…"
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")}>
                  清除
                </button>
              )}
            </div>
            <p className={`search-feedback is-${searchStatus}`} aria-live="polite">
              {!query.trim() && "输入多个关键词可缩小范围，按 / 可随时开始搜索。"}
              {query.trim() && searchStatus === "loading" && "正在检索文章全文…"}
              {query.trim() && searchStatus === "success" && `找到 ${searchResults.length} 条相关记录`}
              {query.trim() && searchStatus === "error" && (
                <>搜索暂时不可用。<button type="button" onClick={() => setSearchRetry((value) => value + 1)}>重新尝试</button></>
              )}
            </p>
          </form>
          <div className="post-list search-results">
            {!query.trim() && posts.map((post) => <PostRow post={post} key={post.number} />)}
            {query.trim() && searchStatus === "success" && searchResults.map((result) => (
              <PostRow post={result.post} searchResult={result} searchTerms={searchTerms} key={result.post.number} />
            ))}
            {query.trim() && searchStatus === "loading" && (
              <div className="search-loading" role="status">
                <span>READING THE ARCHIVE</span>
                <i aria-hidden="true" />
              </div>
            )}
            {query.trim() && searchStatus === "success" && searchResults.length === 0 && (
              <div className="empty-search">
                <span>NO MATCH / 00</span>
                <h2>档案中暂时没有这条记录。</h2>
                <p>尝试减少关键词、检查拼写，或搜索文章正文中的术语。</p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function PostRow({
  post,
  searchResult,
  searchTerms = [],
}: {
  post: Post;
  searchResult?: BlogSearchResult;
  searchTerms?: string[];
}) {
  return (
    <article className={`post-row${post.featured ? " is-featured" : ""}`}>
      <div className="post-number" aria-hidden="true">{post.number}</div>
      <div className="post-copy">
        <div className="post-meta">
          <span>{post.date}</span>
          <a
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            onClick={pushCurrentBlogLocation}
          >
            {post.category}
          </a>
          <span>{post.readingTime}</span>
        </div>
        <h2>
          <a href={`/blog/${post.slug}`} onClick={pushCurrentBlogLocation}>
            <HighlightedText text={post.title} terms={searchTerms} />
          </a>
        </h2>
        <p><HighlightedText text={searchResult?.snippet ?? post.excerpt} terms={searchTerms} /></p>
        {searchResult && (
          <div className="search-match-fields" aria-label="关键词命中位置">
            {searchResult.matchedFields.map((field) => (
              <span key={field}>{searchFieldLabels[field]}命中</span>
            ))}
          </div>
        )}
        <div className="post-tags" aria-label="文章标签">
          {post.tags.map((tag) => (
            <a
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              onClick={pushCurrentBlogLocation}
              key={tag}
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
      <a
        className="post-status"
        href={`/blog/${post.slug}`}
        onClick={pushCurrentBlogLocation}
        aria-label={`阅读：${post.title}`}
      >
        <b>阅读全文</b>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  const usableTerms = terms.filter(Boolean).sort((a, b) => b.length - a.length);
  if (!usableTerms.length) return <>{text}</>;

  const escapedTerms = usableTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"));
  const splitter = new RegExp(`(${escapedTerms.join("|")})`, "giu");
  const exactMatch = new RegExp(`^(?:${escapedTerms.join("|")})$`, "iu");

  return (
    <>
      {text.split(splitter).map((part, index) => (
        exactMatch.test(part)
          ? <mark key={`${part}-${index}`}>{part}</mark>
          : part
      ))}
    </>
  );
}
