import type { Metadata } from "next";
import { SiteNav } from "./components/SiteNav";

export const metadata: Metadata = {
  title: "页面未收录 — reflex4",
  description: "这张页面不在 reflex4 的公开档案中。",
};

export default function NotFound() {
  return (
    <main className="portfolio not-found-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="not-found" />
        <div className="edition">
          <span>Uncatalogued Record</span>
          <span>Error File · 404</span>
        </div>
      </header>

      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-code" aria-hidden="true">
          <span>4</span>
          <i />
          <span>4</span>
        </div>

        <div className="not-found-copy">
          <p className="eyebrow">Error 404 / Record not found</p>
          <h1 id="not-found-title">这页没有<br />被收录。</h1>
          <p>
            你访问的地址可能已移动、被撤下，或从未存在于这份档案中。
            请回到公开目录，继续浏览已经整理好的内容。
          </p>
          <div className="not-found-actions" aria-label="可用去向">
            <a className="not-found-primary" href="/">
              <span>01</span>返回首页 <b aria-hidden="true">↗</b>
            </a>
            <a href="/blog">
              <span>02</span>查看博客 <b aria-hidden="true">→</b>
            </a>
          </div>
        </div>

        <aside className="not-found-docket" aria-label="错误档案信息">
          <span className="not-found-stamp">VOID / 未收录</span>
          <dl>
            <div><dt>Status</dt><dd>Missing</dd></div>
            <div><dt>Archive</dt><dd>Public</dd></div>
            <div><dt>Reference</dt><dd>R4—404</dd></div>
          </dl>
          <p>如地址来自旧书签，请从顶部目录重新进入。</p>
        </aside>
      </section>

      <footer className="not-found-footer">
        <span>reflex4 / Error Archive</span>
        <span>Nothing here is part of the public record</span>
        <a href="/photography">前往摄影档案 ↗</a>
      </footer>
    </main>
  );
}
