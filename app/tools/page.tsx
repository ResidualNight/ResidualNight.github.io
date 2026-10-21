import type { Metadata } from "next";
import { SiteNav } from "../components/SiteNav";
import { utilityProjects } from "../projects/project-data";
import styles from "./tools.module.css";

export const metadata: Metadata = {
  title: "实用工具 — reflex4",
  description: "reflex4 制作的小工具：明日方舟 Codex 宠物生成器与 QuotaDock 额度显示器。",
};

const introductions = {
  "arknights-prts-codex-pet": {
    title: <><span className={styles.phrase}>明日方舟</span><span className={styles.phrase}>宠物生成器</span></>,
    description: "把 PRTS 的基建动画做成 Codex 桌宠。选好干员与皮肤，整理动作，预览满意后再安装。",
    label: "CODEX SKILL / LITE V1",
  },
  quotadock: {
    title: "QuotaDock",
    description: "把 Codex 余量放在刘海旁或屏幕边缘。悬停看概况，点击看详情，也能查看重置提醒和本地趋势。",
    label: "MACOS 14+ / 开发预览",
  },
};

export default function ToolsPage() {
  return (
    <main className={`portfolio ${styles.page}`}>
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">reflex<span>4</span></a>
        <SiteNav active="tools" />
        <div className="edition"><span>Useful things</span><span>reflex4 / Utilities</span></div>
      </header>

      <section className={styles.directory} aria-labelledby="tools-title">
        <header className={styles.heading}>
          <p className={styles.eyebrow}>UTILITIES / 工具目录</p>
          <h1 id="tools-title">实用工具</h1>
          <p className={styles.intro}>一些自己做、也在用的小工具。</p>
        </header>
        <div className={styles.list}>
          {utilityProjects.map((project, index) => {
            const introduction = introductions[project.slug];
            return (
              <a className={styles.tool} href={`/projects/${project.slug}`} key={project.slug}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.copy}>
                  <p className={styles.eyebrow}>{introduction.label}</p>
                  <h2>{introduction.title}</h2>
                  <p className={styles.description}>{introduction.description}</p>
                </div>
                <span className={styles.action}>查看介绍 <span aria-hidden="true">↗</span></span>
              </a>
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}><span>reflex4 / Utilities</span><a href="/">返回首页 ↗</a></footer>
    </main>
  );
}
