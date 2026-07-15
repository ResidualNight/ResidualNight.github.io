import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { PhotographyArchive } from "./PhotographyArchive";

export const metadata: Metadata = {
  title: "摄影档案 — reflex4",
  description: "沿拍摄日期浏览 reflex4 的摄影作品组，并进入大图查看器逐张观看。",
};

export default function PhotographyPage() {
  return (
    <main className="portfolio photography-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="photography" />
        <div className="edition">
          <span>Photographic Archive</span>
          <span>Issue 03 / 03 · 2026</span>
        </div>
      </header>

      <PhotographyArchive />
    </main>
  );
}
