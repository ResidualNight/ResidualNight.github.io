import { SiteNav } from "./components/SiteNav";
import { AudioPlayer } from "./components/AudioPlayer";
import { IntroLoader } from "./components/IntroLoader";

const honors = [
  ["2026", "北航“冯如杯”竞赛主赛道本科生制作组二等奖"],
  ["2026", "大学生创新创业校级项目"],
  ["2026", "北航“冯如杯”产业赛道、红旅赛道三等奖"],
  ["2025", "美国大学生数学建模竞赛 H 奖"],
  ["2025", "蓝桥杯北京赛区程序设计二等奖"],
  ["2025", "百度之星初赛人才专项赛道银奖"],
  ["2025", "全国大学生科学仪器创新大赛提名奖"],
] as const;

function PageFurniture() {
  return (
    <>
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />
    </>
  );
}

export default function Home() {
  return (
    <>
      <IntroLoader />
      <main className="page-deck" aria-label="reflex4 个人主页">
      <section className="portfolio page-panel" id="home">
        <PageFurniture />

        <header className="masthead">
          <a className="wordmark" href="/" aria-label="reflex4 首页">
            reflex<span>4</span>
          </a>
          <SiteNav active="home" />
          <div className="edition" aria-label="页面进度">
            <span>Independent Portfolio</span>
            <span>Issue 01 / 03 · 2026</span>
          </div>
        </header>

        <div className="cover" aria-labelledby="cover-title">
          <div className="cover-primary">
            <p className="eyebrow">Engineer / Observer / Maker</p>
            <div className="title-wrap">
              <span className="title-shadow" aria-hidden="true">
                reflex4
              </span>
              <h1 id="cover-title">reflex4</h1>
              <span className="cover-logo-depth" aria-hidden="true">
                <img src="/reflex4-logo/reflex4-mark.svg" alt="" />
              </span>
            </div>

            <div className="identity">
              <span className="issue-mark" aria-hidden="true">
                04
              </span>
              <p>
                <strong>北航电子科学与技术本科生</strong>
                <span>Embedded Systems · Perception · Creative Code</span>
              </p>
            </div>
          </div>

          <aside className="cover-note" aria-label="个人简介">
            <p className="note-index">A brief self-portrait</p>
            <h2>
              在电路与现实之间，
              <br />
              寻找可被<em>感知</em>的秩序。
            </h2>
            <p className="brief">
              我是 reflex4，一名在工程、观察与创作之间游走的学生。
              我关注电子电路、信号处理与智能感知，也用摄影、设计和声音保存对世界的私人理解。
            </p>
            <span className="stamp">Built with curiosity</span>
          </aside>
        </div>

        <footer className="cover-footer">
          <p>北京 / Beihang University</p>
          <div className="chapter-list" aria-label="网站章节">
            <span className="active">01 About</span>
            <span>02 Research</span>
            <span>03 Art &amp; Sound</span>
          </div>
          <a className="scroll-cue" href="#research">
            <span>Next: Research</span>
            <b aria-hidden="true">↓</b>
          </a>
        </footer>
      </section>

      <section className="portfolio page-panel resume-panel" id="research">
        <PageFurniture />

        <header className="masthead">
          <a className="wordmark" href="/" aria-label="reflex4 首页">
            reflex<span>4</span>
          </a>
          <SiteNav active="home" />
          <div className="edition" aria-label="页面进度">
            <span>Curriculum Archive</span>
            <span>Issue 02 / 03 · 2026</span>
          </div>
        </header>

        <div className="resume-content" aria-labelledby="resume-title">
          <div className="resume-intro">
            <p className="eyebrow">02 / Curriculum Vitae</p>
            <h2 id="resume-title">履历<br />档案</h2>
            <p>
              从电子科学出发，将理论、系统和现实问题放在同一张工作台上。
            </p>
            <span className="resume-seal">R4 / CV</span>
          </div>

          <div className="resume-grid">
            <article className="resume-block education-block">
              <span className="education-watermark" aria-hidden="true" />
              <header className="block-head">
                <span>01 / Education</span>
                <b>2024—NOW</b>
              </header>
              <h3>教育背景</h3>
              <div className="entry-main">
                <strong>北京航空航天大学</strong>
                <span>电子科学与技术 · 本科</span>
              </div>
              <p>GPA 3.3 / 4.0</p>
              <p className="entry-detail">
                电子电路 · 电磁场理论 · 信号与系统 · 数字电路与系统
              </p>
            </article>

            <article className="resume-block project-block">
              <header className="block-head">
                <span>02 / Selected Project</span>
                <b>2025.05—NOW</b>
              </header>
              <div className="project-title-row">
                <span className="project-mark">R4</span>
                <div>
                  <h3>机器狗多源融合定位与识别</h3>
                  <p>团队核心成员</p>
                </div>
              </div>
              <ul className="project-points">
                <li>搭建 LiDAR、RGB-D 与 IMU 多模态融合框架，完成外参标定与时间同步。</li>
                <li>优化 SLAM、三维点云与分层路径规划，支持复杂地形下的自主导航。</li>
              </ul>
              <div className="tags compact-tags">
                <span>LiDAR</span><span>RGB-D</span><span>IMU</span><span>SLAM</span>
              </div>
              <div className="robot-dog-visual" aria-hidden="true">
                <img
                  className="robot-dog-layer robot-dog-base"
                  src="/robot-dog-wireframe.png"
                  alt=""
                />
                <img
                  className="robot-dog-layer robot-dog-accent"
                  src="/robot-dog-wireframe.png"
                  alt=""
                />
              </div>
            </article>

            <article className="resume-block honors-block">
              <header className="block-head">
                <span>03 / Honors</span>
                <b>{String(honors.length).padStart(2, "0")} RECORDS</b>
              </header>
              <h3>个人荣誉</h3>
              <ol className="honor-list">
                {honors.map(([year, title], index) => (
                  <li key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{year}</b>
                    <p>{title}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="resume-block evaluation-block">
              <header className="block-head">
                <span>04 / Evaluate</span>
                <b>SELF NOTE</b>
              </header>
              <h3>个人评价</h3>
              <p>
                具备扎实的数模电路与信号处理基础，能将前沿算法转化为可落地的工程方案。逻辑严谨，自学与技术迁移能力强，善于在团队中解决问题。
              </p>
              <div className="quality-tags" aria-label="个人特质">
                <span>跨学科</span><span>工程落地</span><span>自主学习</span><span>团队协作</span>
              </div>
            </article>
          </div>
        </div>

        <footer className="cover-footer">
          <a className="back-cue" href="#home">↑ Back: About</a>
          <div className="chapter-list" aria-label="网站章节">
            <span>01 About</span>
            <span className="active">02 Research</span>
            <span>03 Art &amp; Sound</span>
          </div>
          <a className="scroll-cue" href="#art-sound" aria-label="下一页将介绍艺术与音乐">
            <span>Next: Art &amp; Sound</span>
            <b aria-hidden="true">↓</b>
          </a>
        </footer>
      </section>

      <section className="portfolio page-panel artsound-panel" id="art-sound">
        <PageFurniture />

        <header className="masthead">
          <a className="wordmark" href="/" aria-label="reflex4 首页">
            reflex<span>4</span>
          </a>
          <SiteNav active="home" />
          <div className="edition" aria-label="页面进度">
            <span>Private Editions</span>
            <span>Issue 03 / 03 · 2026</span>
          </div>
        </header>

        <div className="artsound-content">
          <section className="visual-works" aria-labelledby="visual-works-title">
            <header className="artsound-section-head">
              <div>
                <p className="eyebrow">03 / Visual Archive</p>
                <h2 id="visual-works-title">视觉作品</h2>
              </div>
              <p>平面设计 · 视觉实验 · 影像档案</p>
            </header>

            <div className="visual-work-grid">
              <figure className="visual-work visual-work-featured">
                <div className="visual-placeholder poster-r4" role="img" aria-label="待替换的平面设计作品">
                  <span>R4</span>
                  <b>FORM<br />FOLLOWS<br />CURIOSITY</b>
                </div>
                <figcaption><span>001 / Graphic</span><b>平面设计</b></figcaption>
              </figure>

              <figure className="visual-work">
                <div className="visual-placeholder poster-lines" role="img" aria-label="待替换的视觉实验作品">
                  <span>FIELD<br />STUDY</span>
                </div>
                <figcaption><span>002 / Experiment</span><b>视觉实验</b></figcaption>
              </figure>

              <figure className="visual-work">
                <div className="visual-placeholder poster-frame" role="img" aria-label="待替换的影像作品">
                  <span>PRIVATE<br />FRAME</span>
                  <i aria-hidden="true" />
                </div>
                <figcaption><span>003 / Image</span><b>影像档案</b></figcaption>
              </figure>
            </div>
          </section>

          <section className="sound-works" aria-labelledby="sound-works-title">
            <header className="sound-label">
              <p className="eyebrow">04 / Sound Archive</p>
              <h2 id="sound-works-title">Sound</h2>
              <span>ORIGINAL MUSIC / 001</span>
            </header>
            <AudioPlayer />
          </section>
        </div>

        <footer className="cover-footer">
          <a className="back-cue" href="#research">↑ Back: Research</a>
          <div className="chapter-list" aria-label="网站章节">
            <span>01 About</span>
            <span>02 Research</span>
            <span className="active">03 Art &amp; Sound</span>
          </div>
          <a className="scroll-cue" href="#home">
            <span>Return: About</span>
            <b aria-hidden="true">↑</b>
          </a>
        </footer>
      </section>
      </main>
    </>
  );
}
