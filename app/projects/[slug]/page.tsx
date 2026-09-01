import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { ArknightsPetProjectPage } from "../ArknightsPetProject";
import { getProject, projects } from "../project-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} — reflex4`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);

  if (project.slug === "rss-reader-m5papercolor") {
    return <RssReaderProjectPage projectIndex={projectIndex} />;
  }

  if (project.slug === "arknights-prts-codex-pet") {
    return <ArknightsPetProjectPage projectIndex={projectIndex} projectCount={projects.length} />;
  }

  return (
    <main className="portfolio project-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="projects" activeProject={project.slug} />
        <div className="edition">
          <span>Selected Projects</span>
          <span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        </div>
      </header>

      <article className="project-sheet" aria-labelledby="project-title">
        <header className="project-sheet-header">
          <span>04 / Project File</span>
          <b>Coming soon</b>
        </header>

        <div className="project-sheet-body">
          <p className="project-code">{project.code}</p>
          <div className="project-title-row">
            <span aria-hidden="true">{String(projectIndex + 1).padStart(2, "0")}</span>
            <h1 id="project-title">{project.name}</h1>
          </div>
          <p className="project-description">{project.description}</p>

          <div className="project-status" aria-label="项目页面状态">
            <span>Status</span>
            <strong>内容整理中</strong>
            <p>这里已预留为项目详情页，后续将补充功能介绍、开发过程、截图与版本记录。</p>
          </div>
        </div>

        <nav className="project-switcher" aria-label="项目页面导航">
          <a href="/">← 返回首页</a>
          <div>
            {projects.map((item, index) => (
              <a
                className={item.slug === project.slug ? "is-current" : ""}
                href={`/projects/${item.slug}`}
                aria-current={item.slug === project.slug ? "page" : undefined}
                key={item.slug}
              >
                {String(index + 1).padStart(2, "0")}
              </a>
            ))}
          </div>
        </nav>
      </article>

      <footer className="project-footer">
        <span>reflex4 / Project Archive</span>
        <span>{project.code} · Working record</span>
        <a href="/blog">查看开发记录 ↗</a>
      </footer>
    </main>
  );
}

function ChapterHeading({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="rss-chapter-heading">
      <span className="rss-chapter-number">{number}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {children}
      </div>
    </header>
  );
}

function DeviceMockup({ detail = false }: { detail?: boolean }) {
  return (
    <div className="rss-device" aria-label={detail ? "新闻详情页占位图" : "RSS 列表页占位图"} role="img">
      <div className="rss-device-screen">
        <div className="rss-screen-meta">
          <span>{detail ? "ARTICLE / 03" : "LAST / 08M AGO"}</span>
          <span>84%</span>
        </div>
        <strong className="rss-screen-source">The Paper Daily</strong>
        <i className="rss-screen-rule" />
        {detail ? (
          <div className="rss-screen-detail">
            <h3>如何在喧闹的信息里，留下一次完整的阅读</h3>
            <p>摘要来自 RSS；离线时仍可打开。</p>
            <div className="rss-faux-qr"><span>QR<br />原文</span></div>
          </div>
        ) : (
          <ol className="rss-screen-list">
            <li>一块适合等待的屏幕</li>
            <li>重新选择你的信息源</li>
            <li>五条新闻，一次完整停留</li>
            <li>电子纸上的中文排版</li>
            <li>扫码后，回到原网站继续</li>
          </ol>
        )}
      </div>
      <div className="rss-device-key key-one">G1</div>
      <div className="rss-device-key key-nine">G9</div>
      <div className="rss-device-key key-ten">G10</div>
    </div>
  );
}

function MediaNote({ code, children }: { code: string; children: React.ReactNode }) {
  return (
    <figcaption className="rss-media-note">
      <span>{code}</span>
      <p>{children}</p>
    </figcaption>
  );
}

function RssReaderProjectPage({ projectIndex }: { projectIndex: number }) {
  return (
    <main className="portfolio rss-project-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead rss-masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="projects" activeProject="rss-reader-m5papercolor" />
        <div className="edition">
          <span>Project Feature</span>
          <span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        </div>
      </header>

      <article className="rss-story">
        <section className="rss-hero" aria-labelledby="rss-project-title">
          <div className="rss-hero-copy">
            <p className="rss-kicker">04.02 / E-INK RSS / WORKING PROTOTYPE</p>
            <h1 id="rss-project-title">PaperColor<br />RSS Reader</h1>
            <p className="rss-hero-lead">一台为慢阅读而做的 RSS 阅读器。</p>
            <p className="rss-hero-summary">
              把订阅源、原文链接与阅读节奏，放回你的手里。开机更新，离线阅读；
              五分钟无操作后休眠，半小时后再次醒来。
            </p>
            <nav className="rss-hero-actions" aria-label="项目内容导航">
              <a href="#reading">查看阅读体验 <span>↓</span></a>
              <a href="#engineering">了解实现 <span>↓</span></a>
            </nav>
          </div>
          <figure className="rss-hero-visual">
            <div className="rss-photo-slot rss-photo-slot-hero">
              <span className="rss-slot-label">PHOTO SLOT 01 / 4:5 PORTRAIT</span>
              <DeviceMockup />
            </div>
            <MediaNote code="TO BE REPLACED">待替换：设备竖屏放置于桌面的 RSS 列表页实拍。</MediaNote>
          </figure>
          <div className="rss-hero-strip" aria-hidden="true"><i /><i /></div>
        </section>

        <section className="rss-section rss-motive" id="motive">
          <ChapterHeading number="01" eyebrow="WHY IT EXISTS" title="从信息流，回到订阅" />
          <div className="rss-motive-grid">
            <article><span>01</span><h3>不是更多信息</h3><p>RSS 由你决定订阅什么。没有推荐流，也不需要不停下拉刷新。</p></article>
            <article><span>02</span><h3>电子纸适合等待</h3><p>新闻停留在屏幕上，不要求你马上回应；阅读结束后，设备自动休眠。</p></article>
            <article><span>03</span><h3>原文仍属于原网站</h3><p>设备展示标题、摘要与二维码。扫码之后，阅读回到 RSS 提供的原文链接。</p></article>
          </div>
        </section>

        <section className="rss-section rss-reading" id="reading">
          <ChapterHeading number="02" eyebrow="READING EXPERIENCE" title="五条新闻，一次完整的停留">
            <p>列表不追求“装下所有内容”，而是让五条信息都值得被完整看一眼。</p>
          </ChapterHeading>
          <div className="rss-reading-layout">
            <figure className="rss-reading-visual">
              <div className="rss-photo-slot rss-photo-slot-wide">
                <span className="rss-slot-label">PHOTO SLOT 02 / FRONT VIEW</span>
                <DeviceMockup />
              </div>
              <MediaNote code="540 × 590 SAFE AREA">待替换：可清晰辨认五条新闻的正面屏幕照。</MediaNote>
            </figure>
            <ol className="rss-reading-notes">
              <li><b>01</b><div><strong>一个源，一张列表</strong><p>每个 RSS 源单独成页，默认只展示前五条。</p></div></li>
              <li><b>02</b><div><strong>把空间留给标题</strong><p>每条最多三行，不用额外编号侵占阅读区。</p></div></li>
              <li><b>03</b><div><strong>像报纸一样有报头</strong><p>RSS 源名称放大，与红绿细线一起建立视觉中心。</p></div></li>
              <li><b>04</b><div><strong>状态是可见的</strong><p>顶部显示电量、缓存新鲜度与休眠后自动更新状态。</p></div></li>
            </ol>
          </div>
        </section>

        <section className="rss-section rss-controls" id="controls">
          <ChapterHeading number="03" eyebrow="PHYSICAL INTERACTION" title="不用每次按键，都刷新屏幕" />
          <div className="rss-control-layout">
            <figure className="rss-button-photo">
              <div className="rss-photo-slot rss-photo-slot-buttons">
                <span className="rss-slot-label">PHOTO SLOT 03 / 3:2 LANDSCAPE</span>
                <div className="rss-device-outline" aria-hidden="true"><span>G1</span><span>G9</span><span>G10</span></div>
              </div>
              <MediaNote code="HARDWARE LABELS">待替换：可清楚标注 G1、G9、G10 的横屏设备实拍。</MediaNote>
            </figure>
            <div className="rss-key-list">
              <article><b>G10</b><h3>选择第 1–5 条</h3><p>递增提示音，不刷新电子纸。</p></article>
              <article><b>G1</b><h3>打开 / 返回</h3><p>打开所选新闻；在详情页返回列表。</p></article>
              <article><b>G9</b><h3>切源 / 管理</h3><p>短按切换 RSS 源；长按两秒进入管理热点。</p></article>
              <p className="rss-control-note">十秒未继续选择，选择自动取消。电子纸只在真正需要改变内容时刷新。</p>
            </div>
          </div>
        </section>

        <section className="rss-section rss-handoff" id="article">
          <ChapterHeading number="04" eyebrow="ARTICLE HANDOFF" title="电子纸负责停留，手机负责继续" />
          <div className="rss-handoff-layout">
            <div className="rss-handoff-copy">
              <p className="rss-pullquote">“不把内容困在设备里。”</p>
              <ul>
                <li>详情页保留更大的 RSS 源名称和最多四行标题。</li>
                <li>若 RSS 自带摘要，只展示简短导读，不抓取外部网页。</li>
                <li>二维码指向条目提供的原文链接；搜索型源会标注“搜索链接”。</li>
                <li>内容来自 SD 快照，离线时仍可打开详情。</li>
              </ul>
            </div>
            <figure className="rss-detail-visual">
              <div className="rss-photo-slot rss-photo-slot-detail">
                <span className="rss-slot-label">PHOTO SLOT 04 / DETAIL + QR</span>
                <DeviceMockup detail />
              </div>
              <MediaNote code="TO BE REPLACED">待替换：长中文标题、摘要与原文二维码的详情页实拍。</MediaNote>
            </figure>
          </div>
        </section>

        <section className="rss-section rss-console" id="console">
          <ChapterHeading number="05" eyebrow="LOCAL CONSOLE" title="设备自己有一个小型控制台">
            <p>长按 G9 打开临时管理热点，再用手机浏览器完成设置。</p>
          </ChapterHeading>
          <div className="rss-console-layout">
            <figure className="rss-phone-visual">
              <div className="rss-phone" role="img" aria-label="手机管理页截图占位图">
                <div className="rss-phone-bar">PAPERCOLOR / LOCAL</div>
                <h3>订阅与网络</h3>
                <label>RSS SOURCE 01<span>https://example.com/feed.xml</span></label>
                <label>NETWORK MODE<span>Personal Wi-Fi / Hotspot</span></label>
                <div className="rss-phone-action">测试连接</div>
                <small>DEMO DATA / NO PRIVATE CREDENTIALS</small>
              </div>
              <MediaNote code="PNG / NATIVE RESOLUTION">待替换：不含真实凭据的手机管理页截图。</MediaNote>
            </figure>
            <div className="rss-console-index">
              <article><span>01</span><div><h3>订阅源</h3><p>保存或调整最多五个 HTTPS RSS 源。</p></div></article>
              <article><span>02</span><div><h3>联网方式</h3><p>选择 PEAP 企业 Wi-Fi，或 WPA2/WPA3 Personal 密码 Wi-Fi 与手机热点。</p></div></article>
              <article><span>03</span><div><h3>连接测试</h3><p>测试已保存的网络，也可单独测试某个订阅源。</p></div></article>
              <article><span>04</span><div><h3>microSD 与字体</h3><p>查看存储状态，并上传运行时 VLW 中文字体。</p></div></article>
              <details className="rss-security-note">
                <summary>开发中的安全限制</summary>
                <p>当前开发设备允许未加密 NVS 保存 Wi-Fi 凭据，且企业 Wi-Fi 的 RADIUS 服务器身份验证尚未完成，不应视为生产级安全方案。</p>
              </details>
            </div>
          </div>
        </section>

        <section className="rss-section rss-power" id="power">
          <ChapterHeading number="06" eyebrow="CACHE & LOW POWER" title="更新一次，然后安静等待" />
          <ol className="rss-timeline">
            <li><span>00</span><div><strong>开机 / 唤醒</strong><p>连接已保存网络，抓取 RSS。</p></div></li>
            <li><span>01</span><div><strong>原子写入</strong><p>快照以 .tmp → .bak → .bin 替换到 microSD。</p></div></li>
            <li><span>02</span><div><strong>离线阅读</strong><p>阅读、切换源，必要时扫码看原文。</p></div></li>
            <li><span>05m</span><div><strong>深度休眠</strong><p>关闭 Wi-Fi、RGB 与扬声器。</p></div></li>
            <li><span>30m</span><div><strong>定时醒来</strong><p>顺序刷新所有订阅源。</p></div></li>
          </ol>
          <p className="rss-cache-rule"><b>NETWORK FAILURE?</b> 网络临时失败时，保留上一份 SD 快照，不清空仍可阅读的旧新闻。</p>
        </section>

        <section className="rss-section rss-engineering" id="engineering">
          <ChapterHeading number="07" eyebrow="ENGINEERING FILE" title="从管理页，到一块电子纸" />
          <div className="rss-architecture" aria-label="系统架构流程">
            {[
              ["管理页", "LOCAL UI"], ["NVS 配置", "SETTINGS"], ["Wi-Fi", "PEAP / PERSONAL"],
              ["RSS 2.0", "HTTPS"], ["SD 快照", "ATOMIC CACHE"], ["电子纸 / QR", "READ / HANDOFF"],
            ].map(([label, meta], index) => <div key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{meta}</small></div>)}
          </div>
          <div className="rss-tech-grid">
            <dl>
              <div><dt>主控</dt><dd>ESP32-S3 / M5Stack PaperColor / 8 MiB PSRAM</dd></div>
              <div><dt>固件</dt><dd>ESP-IDF v5.5.1 / M5Unified / M5GFX</dd></div>
              <div><dt>内容</dt><dd>RSS 2.0 / HTTPS / 512 KiB 有界响应缓冲</dd></div>
              <div><dt>缓存</dt><dd>FAT32 microSD / 原子替换</dd></div>
            </dl>
            <dl>
              <div><dt>联网</dt><dd>PEAP/MSCHAPv2 / WPA2–WPA3 Personal</dd></div>
              <div><dt>字体</dt><dd>SD 卡运行时 VLW 中文字体</dd></div>
              <div><dt>显示</dt><dd>竖屏 / 540 × 590 px 安全可见区</dd></div>
              <div><dt>省电</dt><dd>5 分钟空闲深睡 / 30 分钟 RTC 刷新</dd></div>
            </dl>
          </div>
        </section>

        <section className="rss-section rss-roadmap" id="roadmap">
          <ChapterHeading number="08" eyebrow="STATUS / ROADMAP" title="这是一台正在被验证的设备" />
          <div className="rss-roadmap-grid">
            <article className="is-done"><span>DONE</span><h3>已完成</h3><ul><li>企业 Wi-Fi 真实设备 20/20 联网验证</li><li>本地管理页、RSS 保存与抓取</li><li>离线列表/详情、中文字体与原文二维码</li><li>实体按键、RGB 与扬声器反馈</li></ul></article>
            <article className="is-testing"><span>VERIFY</span><h3>正在验证</h3><ul><li>普通密码 Wi-Fi / 手机热点实机兼容性</li><li>深度休眠、按键唤醒和定时刷新完整周期</li><li>不同 RSS 源的二维码目标与长标题版式</li></ul></article>
            <article className="is-next"><span>NEXT</span><h3>下一步</h3><ul><li>Atom 与 RSS 条件请求</li><li>更多文章、列表分页与阅读历史</li><li>RSS 封面图下载、缩放与 SD 缓存</li><li>RADIUS CA 与服务器域名验证</li></ul></article>
          </div>
          <div className="rss-boundary">
            <span>CURRENT BOUNDARY</span>
            <p>当前只解析 RSS 2.0；不抓取全文网页，不宣称实时新闻或无限滚动。续航与耗电数字将在实测完成后公开。</p>
          </div>
        </section>
      </article>

      <footer className="rss-footer">
        <div><span>reflex4 / Project Archive</span><strong>PaperColor RSS Reader</strong></div>
        <nav aria-label="项目页底部导航"><a href="/">返回首页</a><a href="/blog">查看开发记录</a><a href="#rss-project-title">回到顶部 ↑</a></nav>
      </footer>
    </main>
  );
}
