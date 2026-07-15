import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { BlogArchive } from "./BlogArchive";
import { getAllPosts } from "./markdown";
import { createBlogSearchIndex } from "./search";

export const metadata: Metadata = {
  title: "博客 — reflex4",
  description: "reflex4 的工程札记、观察随笔与创作记录。",
};

export default function BlogPage() {
  const fullPosts = getAllPosts();
  const posts = fullPosts.map(({ content: _content, ...summary }) => summary);
  const searchIndex = createBlogSearchIndex(fullPosts);

  return (
    <main className="portfolio blog-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="blog" />
        <div className="edition">
          <span>Writing Archive</span>
          <span>Issue 02 / 03 · 2026</span>
        </div>
      </header>

      <BlogArchive posts={posts} searchIndex={searchIndex} />

      <footer className="blog-footer">
        <span>reflex4 / Writing Archive</span>
        <span>{posts.length.toString().padStart(2, "0")} records · Continuously edited</span>
        <a href="/">返回首页 ↗</a>
      </footer>
    </main>
  );
}
