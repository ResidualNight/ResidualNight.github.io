import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { ArknightsPetProjectPage } from "../ArknightsPetProject";
import { QuadrupedInspectionProjectPage } from "../QuadrupedInspectionProject";
import { QuotaDockProjectPage } from "../QuotaDockProject";
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

  if (project.slug === "quotadock") {
    return <QuotaDockProjectPage projectIndex={projectIndex} projectCount={projects.length} />;
  }

  if (project.slug === "quadruped-inspection") {
    return <QuadrupedInspectionProjectPage projectIndex={projectIndex} projectCount={projects.length} />;
  }

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
            <h3>一台中文 RSS 阅读器的制作记录</h3>
            <p>摘要来自 RSS；离线时仍可打开。</p>
            <div className="rss-faux-qr"><span>二维码<br />示意</span></div>
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

function ReaderPhoto({ name, alt, priority = false }: { name: "desktop" | "list" | "buttons"; alt: string; priority?: boolean }) {
  return (
    <div className={`rss-photo-frame rss-photo-frame--${name}`}>
      {/* Responsive, pre-exported assets also work on static hosting. */}
      <img
        src={`/projects/rss-reader/${name}-1600.webp`}
        srcSet={`/projects/rss-reader/${name}-800.webp 800w, /projects/rss-reader/${name}-1600.webp 1600w`}
        sizes="(max-width: 760px) 90vw, 45vw"
        width={1600}
        height={2133}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </div>
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
            <p className="rss-hero-lead">在电子纸上，看看自己订阅的新闻。</p>
            <p className="rss-hero-summary">
              这是一个基于 M5Stack PaperColor 的中文 RSS 阅读器。
              它把订阅源里的标题和摘要存到 SD 卡上，用实体按键翻看，遇到感兴趣的文章，再拿手机扫码读原文。
            </p>
            <nav className="rss-hero-actions" aria-label="项目内容导航">
              <a href="#reading">查看阅读体验 <span>↓</span></a>
              <a href="#engineering">了解实现 <span>↓</span></a>
              <a
                href="https://github.com/ResidualNight/rss-reader-for-m5stack-papercolor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="查看 GitHub 仓库（在新标签页打开）"
              >
                GitHub 仓库 <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
          <figure className="rss-hero-visual">
            <ReaderPhoto name="desktop" alt="彩色光影落在桌面上，PaperColor 显示着 RSS 新闻列表。" priority />
            <MediaNote code="桌面一角">把订阅的新闻留在桌面上，有空时看一眼。</MediaNote>
          </figure>
          <div className="rss-hero-strip" aria-hidden="true"><i /><i /></div>
        </section>

        <section className="rss-section rss-motive" id="motive">
          <ChapterHeading number="01" eyebrow="起点" title="为什么把 RSS 放到电子纸上">
            <p>这个项目想尝试一种简单的阅读方式：选好几个关心的信息源，把更新留在桌面上的一块屏幕里，有空时看一眼。</p>
          </ChapterHeading>
          <div className="rss-motive-grid">
            <article><span>01</span><h3>自己选择信息源</h3><p>把常读的网站加入订阅，设备就按这些来源更新。打开列表时，看到的是自己选过的内容。</p></article>
            <article><span>02</span><h3>放在桌面上慢慢看</h3><p>电子纸在休眠时仍能保留画面。读到一半放下，屏幕上的新闻还在那里。</p></article>
            <article><span>03</span><h3>感兴趣了再读原文</h3><p>先在设备上看标题和摘要，再决定要不要继续。每篇文章都保留了 RSS 提供的链接。</p></article>
          </div>
        </section>

        <section className="rss-section rss-reading" id="reading">
          <ChapterHeading number="02" eyebrow="阅读" title="先从五条新闻看起">
            <p>每个订阅源有一张列表，显示前五条新闻。标题最多排三行，遇到中文长标题，也尽量留出足够的阅读空间。</p>
          </ChapterHeading>
          <div className="rss-reading-layout">
            <figure className="rss-reading-visual">
              <ReaderPhoto name="list" alt="PaperColor 正面实拍：爱范儿订阅源下的五条中文新闻，顶部显示电量与更新状态。" />
              <MediaNote code="列表页">同一个来源的五条新闻。拍摄时，上次更新时间还显示为 UNKNOWN。</MediaNote>
            </figure>
            <ol className="rss-reading-notes">
              <li><b>01</b><div><strong>按来源分开阅读</strong><p>按下切换键就能换到下一个订阅源，不会把不同来源混在一张列表里。</p></div></li>
              <li><b>02</b><div><strong>让中文标题读得清楚</strong><p>中文字体从 SD 卡加载；列表省去新闻编号，把空间留给文字。</p></div></li>
              <li><b>03</b><div><strong>一眼认出正在读什么</strong><p>来源名称放在顶部，下面用红绿细线分隔，像一张小报纸的报头。</p></div></li>
              <li><b>04</b><div><strong>知道上次更新的时间</strong><p>顶部还会显示电量、距上次更新的时间，以及休眠后的自动更新提示。</p></div></li>
            </ol>
          </div>
        </section>

        <section className="rss-section rss-controls" id="controls">
          <ChapterHeading number="03" eyebrow="操作" title="用三个按键完成阅读">
            <p>电子纸刷新需要时间，所以选择新闻时先用提示音反馈，确认打开后才更新画面。切换来源和返回列表也由按键完成。</p>
          </ChapterHeading>
          <div className="rss-control-layout">
            <figure className="rss-button-photo">
              <ReaderPhoto name="buttons" alt="设备背面上半部，印有顶部 G1、右侧 G9 和 G10 的按键标识。" />
              <MediaNote code="背面视角">机身背面标出了三个按键：顶部 G1，右侧从上到下是 G9、G10。这里的左右以照片为准。</MediaNote>
            </figure>
            <div className="rss-key-list">
              <article><b>G10</b><h3>选一条新闻</h3><p>连续按下，在五条新闻间循环选择，并用递增的提示音反馈。</p></article>
              <article><b>G1</b><h3>打开或返回</h3><p>选好后按下打开详情，再按一次回到列表。</p></article>
              <article><b>G9</b><h3>切换订阅源</h3><p>短按查看下一个来源；长按两秒打开管理热点。</p></article>
              <p className="rss-control-note">如果选到一半停下来，十秒后会取消选择。下次可以重新开始。</p>
            </div>
          </div>
        </section>

        <section className="rss-section rss-handoff" id="article">
          <ChapterHeading number="04" eyebrow="原文" title="想接着读，就用手机扫一扫" />
          <div className="rss-handoff-layout">
            <div className="rss-handoff-copy">
              <p className="rss-pullquote">从标题和摘要，读到完整文章。</p>
              <div className="rss-prose">
                <p>打开一条新闻后，详情页会显示来源、标题和 RSS 自带的摘要。标题最多排四行，方便看清较长的中文标题。</p>
                <p>想继续阅读时，用手机扫描下方的二维码，就能打开条目里的链接。如果订阅源给的是搜索链接，页面也会注明。</p>
                <p>标题和摘要已经存在 SD 卡里，设备离线时仍可查看；完整网页则交给手机打开。</p>
              </div>
            </div>
            <figure className="rss-detail-visual">
              <div className="rss-photo-slot rss-photo-slot-detail">
                <span className="rss-slot-label">PHOTO SLOT 04 / 详情页示意</span>
                <DeviceMockup detail />
              </div>
              <MediaNote code="详情页">这里将展示真实的标题、摘要与原文二维码。当前图案不可扫描。</MediaNote>
            </figure>
          </div>
        </section>

        <section className="rss-section rss-console" id="console">
          <ChapterHeading number="05" eyebrow="设置" title="在手机上设置网络和订阅">
            <p>长按 G9 后，设备会开启一个临时热点。手机连上它，就可以在浏览器里修改设置，不用在电子纸上逐个输入文字。</p>
          </ChapterHeading>
          <div className="rss-console-layout">
            <figure className="rss-phone-visual">
              <div className="rss-phone" role="img" aria-label="手机管理页截图占位图">
                <div className="rss-phone-bar">PAPERCOLOR / LOCAL</div>
                <h3>订阅与网络</h3>
                <label>RSS SOURCE 01<span>https://example.com/feed.xml</span></label>
                <label>NETWORK MODE<span>Personal Wi-Fi / Hotspot</span></label>
                <div className="rss-phone-action">测试连接</div>
                <small>管理页示意 · 使用演示数据</small>
              </div>
              <MediaNote code="管理页">真实管理页截图稍后补充。</MediaNote>
            </figure>
            <div className="rss-console-index">
              <article><span>01</span><div><h3>添加常读的网站</h3><p>填入 RSS 地址，最多保存五个 HTTPS 订阅源，以后也可以在这里替换。</p></div></article>
              <article><span>02</span><div><h3>选择连接的网络</h3><p>可以配置企业 Wi-Fi，也可以填写普通 Wi-Fi 或手机热点的名称和密码。后两者的实机兼容性仍待验证。</p></div></article>
              <article><span>03</span><div><h3>检查能否正常更新</h3><p>保存后可以测试网络连接，或单独抓取一个订阅源，确认配置是否有效。</p></div></article>
              <article><span>04</span><div><h3>准备中文字体</h3><p>管理页可以查看 SD 卡状态，并把中文字体上传到卡里，供设备显示标题和正文。</p></div></article>
              <details className="rss-security-note">
                <summary>关于网络凭据的保存</summary>
                <p>目前这台开发设备会把 Wi-Fi 凭据保存在未加密的 NVS 存储区中。企业 Wi-Fi 的服务器证书与域名校验也还没有完成，因此暂不适合用于对凭据安全要求较高的环境。</p>
              </details>
            </div>
          </div>
        </section>

        <section className="rss-section rss-power" id="power">
          <ChapterHeading number="06" eyebrow="缓存与休眠" title="新闻存下来，断网后也能看">
            <p>每次更新后，设备会把内容保存到 SD 卡。下面是固件设定的工作流程；休眠、按键唤醒和定时更新的完整周期仍在验证中。</p>
          </ChapterHeading>
          <ol className="rss-timeline">
            <li><span>00</span><div><strong>获取更新</strong><p>开机尝试联网；定时唤醒时依次更新订阅源。</p></div></li>
            <li><span>01</span><div><strong>保存新闻</strong><p>先写好新内容，再替换旧缓存。</p></div></li>
            <li><span>02</span><div><strong>离线阅读</strong><p>阅读、切换源，必要时扫码看原文。</p></div></li>
            <li><span>05m</span><div><strong>暂时休眠</strong><p>五分钟没有操作，就关闭 Wi-Fi、指示灯与扬声器。</p></div></li>
            <li><span>30m</span><div><strong>再次更新</strong><p>休眠三十分钟后，定时唤醒并刷新订阅。</p></div></li>
          </ol>
          <p className="rss-cache-rule"><b>更新失败时</b> 上一次保存的新闻会继续保留，不会因为一次断网就变成空白列表。</p>
        </section>

        <section className="rss-section rss-engineering" id="engineering">
          <ChapterHeading number="07" eyebrow="实现" title="这些功能是怎样连起来的">
            <p>手机管理页负责保存配置，ESP32-S3 负责联网和解析 RSS，SD 卡保存新闻与字体。阅读时，设备从缓存中取出内容，再绘制到电子纸上。</p>
          </ChapterHeading>
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
          <ChapterHeading number="08" eyebrow="进展" title="接下来还要做什么">
            <p>基本的阅读功能已经做出来了，接下来需要继续检查不同网络下的使用情况，以及休眠后能否稳定恢复。下面分别列出已有结果、待验证的部分和后续计划。</p>
          </ChapterHeading>
          <div className="rss-roadmap-grid">
            <article className="is-done"><span>DONE</span><h3>已完成</h3><ul><li>企业 Wi-Fi 真实设备 20/20 联网验证</li><li>本地管理页、RSS 保存与抓取</li><li>离线列表/详情、中文字体与原文二维码</li><li>实体按键、RGB 与扬声器反馈</li></ul></article>
            <article className="is-testing"><span>VERIFY</span><h3>正在验证</h3><ul><li>普通密码 Wi-Fi / 手机热点实机兼容性</li><li>深度休眠、按键唤醒和定时刷新完整周期</li><li>不同 RSS 源的二维码目标与长标题版式</li></ul></article>
            <article className="is-next"><span>NEXT</span><h3>下一步</h3><ul><li>Atom 与 RSS 条件请求</li><li>更多文章、列表分页与阅读历史</li><li>RSS 封面图下载、缩放与 SD 缓存</li><li>RADIUS CA 与服务器域名验证</li></ul></article>
          </div>
          <div className="rss-boundary">
            <span>目前的范围</span>
            <p>目前支持 RSS 2.0，详情页只显示订阅源提供的摘要。Atom、图片和更多文章的缓存还在后续计划中。续航与耗电尚未完成实测，暂时没有可以公开的数字。</p>
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
