import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { SiteNav } from "../../components/SiteNav";
import { ArticleReturnButton } from "./ArticleReturnButton";
import { BlogHierarchyLink } from "./BlogHierarchyLink";
import {
  getAllPostSummaries,
  getPostBySlug,
  getPostNeighbors,
} from "../markdown";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSummaries().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — reflex4`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { previous, next } = getPostNeighbors(slug);

  return (
    <main className="portfolio blog-page article-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />
      <ArticleReturnButton />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="blog" />
        <div className="edition">
          <span>Writing Archive</span>
          <span>Record No. {post.number}</span>
        </div>
      </header>

      <article className="article-shell">
        <header className="article-header">
          <a className="article-back" href="/blog">← 返回写作归档</a>
          <div className="article-kicker">
            <BlogHierarchyLink href={`/blog?category=${encodeURIComponent(post.category)}`}>
              {post.category}
            </BlogHierarchyLink>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="article-title-row">
            <span className="article-number" aria-hidden="true">{post.number}</span>
            <h1>{post.title}</h1>
          </div>
          <p className="article-excerpt">{post.excerpt}</p>
          <div className="article-tags" aria-label="文章标签">
            <span className="tag-label">Filed under</span>
            {post.tags.map((tag) => (
              <BlogHierarchyLink href={`/blog?tag=${encodeURIComponent(tag)}`} key={tag}>
                #{tag}
              </BlogHierarchyLink>
            ))}
          </div>
        </header>

        <div className="article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <nav className="article-pagination" aria-label="上一篇和下一篇">
          {previous ? (
            <a href={`/blog/${previous.slug}`} className="article-page-link previous">
              <span>← 上一篇 / {previous.number}</span>
              <strong>{previous.title}</strong>
            </a>
          ) : <span className="article-page-link is-empty">已经是最新一篇</span>}
          {next ? (
            <a href={`/blog/${next.slug}`} className="article-page-link next">
              <span>下一篇 / {next.number} →</span>
              <strong>{next.title}</strong>
            </a>
          ) : <span className="article-page-link is-empty next">已经是最后一篇</span>}
        </nav>
      </article>

      <footer className="blog-footer">
        <span>reflex4 / Writing Archive</span>
        <span>Markdown Edition · {post.number}</span>
        <a href="/blog">全部文章 ↗</a>
      </footer>
    </main>
  );
}
