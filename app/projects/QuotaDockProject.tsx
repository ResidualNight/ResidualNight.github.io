import type { ReactNode } from "react";
import { SiteNav } from "../components/SiteNav";
import styles from "./quotadock.module.css";

const repository = "https://github.com/ResidualNight/QuotaDock";
const assetRoot = "/projects/quotadock";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${children}（在新标签页打开）`}>{children}<span aria-hidden="true">↗</span></a>;
}

function Chapter({ number, label, title, children }: { number: string; label: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className={styles.chapter}>
      <span className={styles.number}>{number}</span>
      <div><p className={styles.eyebrow}>{label}</p><h2>{title}</h2>{children}</div>
    </header>
  );
}

function ProductImage({ name, alt, caption, width, height, priority = false }: {
  name: string; alt: string; caption: string; width: number; height: number; priority?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      <a className={styles.imageLink} href={`${assetRoot}/${name}.png`} target="_blank" rel="noopener noreferrer" aria-label={`${alt}，查看原图（在新标签页打开）`}>
        {/* Static assets preserve the complete demo artwork on every host. */}
        <img src={`${assetRoot}/${name}.webp`} width={width} height={height} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />
      </a>
      <figcaption><p>{caption}</p><a href={`${assetRoot}/${name}.png`} target="_blank" rel="noopener noreferrer" aria-label="查看原图（在新标签页打开）">查看原图 ↗</a></figcaption>
    </figure>
  );
}

export function QuotaDockProjectPage({ projectIndex, projectCount }: { projectIndex: number; projectCount: number }) {
  return (
    <main className={`portfolio ${styles.page}`}>
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />
      <a className={styles.skipLink} href="#top">跳至项目介绍</a>
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">reflex<span>4</span></a>
        <SiteNav active="projects" activeProject="quotadock" />
        <div className="edition"><span>Project Feature</span><span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}</span></div>
      </header>

      <article className={styles.story}>
        <section className={styles.hero} id="top" aria-labelledby="quotadock-title">
          <div className={styles.heroHeader}><p className={styles.eyebrow}>QUOTA DOCK / MACOS UTILITY</p><span className={styles.preview}>开发预览 · macOS 14+</span></div>
          <div className={styles.heroColumns}>
            <div><h1 id="quotadock-title">QuotaDock</h1><p className={styles.tagline}><span className={styles.phrase}>把 Codex 余量</span><span className={styles.phrase}>放在刘海旁，</span><br />一眼可见。</p></div>
            <div className={styles.heroIntro}><p>写代码时，偶尔想确认还剩多少额度、什么时候重置。QuotaDock 把这些信息放在桌面边缘，平时看一眼，需要时再展开。</p>
              <nav className={styles.actions} aria-label="项目入口"><ExternalLink href={repository}>查看 GitHub</ExternalLink><a href="#interaction">了解使用方式 <span aria-hidden="true">↓</span></a></nav>
            </div>
          </div>
          <ProductImage name="quotadock-banner" width={2172} height={724} alt="QuotaDock 产品示意：屏幕刘海右侧有显示 75 的蓝色圆环" caption="AI 生成的产品示意；75 为演示数值，非实机截图。" priority />
        </section>

        <nav className={styles.contents} aria-label="项目章节">
          {[["why", "起点"], ["interaction", "使用"], ["reset", "重置提醒"], ["engineering", "实现"], ["appearance", "外观"], ["status", "当前进展"]].map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
        </nav>

        <section className={`${styles.section} ${styles.motive}`} id="why">
          <Chapter number="01" label="起点" title="少一次切换，心里更有数。" />
          <p>使用 Codex 时，额度会影响接下来安排什么工作。我想把反复打开页面查询的过程省下来：让余量和重置时间留在视线边缘，抬眼就能看到，也不占用正在工作的窗口。</p>
        </section>

        <section className={styles.section} id="interaction">
          <Chapter number="02" label="使用" title={<><span className={styles.phrase}>平时看圆环，</span><span className={styles.phrase}>需要时再展开。</span></>}><p>带刘海的 MacBook 可以把圆环放在刘海左侧或右侧，圆弧和数字一起表示剩余比例。没有刘海的显示器则使用小胶囊，四个屏幕边缘都能停靠。</p></Chapter>
          <div className={styles.interactionLayout}>
            <ol className={styles.steps}>
              <li><span>01</span><div><h3>看一眼余量</h3><p>圆环或胶囊留在桌面边缘，位置和间距都可以调整。</p></div></li>
              <li><span>02</span><div><h3>悬停看概况</h3><p>鼠标移上去，就能看到当前余量和重置时间。</p></div></li>
              <li><span>03</span><div><h3>点击看详情</h3><p>展开周额度、五小时额度和同步状态，按 Esc 收起。</p></div></li>
            </ol>
            <ProductImage name="quotadock-ui-dark-demo" width={1892} height={1589} alt="普通胶囊、悬停概况与详情的深色历史演示界面" caption="历史普通胶囊演示，账户和数值均为示例；旧图标及部分布局与当前版本不同。" />
          </div>
          <p className={styles.note}>右键可以刷新、打开设置或退出；也可以用全局快捷键，在其他应用里呼出 QuotaDock。</p>
        </section>

        <section className={styles.section} id="reset">
          <div className={styles.split}>
            <div><Chapter number="03" label="重置提醒" title="离重置还有多久？" />
              <div className={styles.prose}><p>周额度快重置时，提示色会逐渐从黄变红。你可以按剩余额度设置提醒门槛，开启定时免打扰，或临时暂停提醒。</p><p>详情页会把周余量按距离重置的实际天数均摊，供你安排每天的使用节奏。它只是参考，不能换算成还能完成多少任务，五小时额度等限制仍然独立生效。</p><p>倒计时归零后，应用会重新同步。只有服务端确认进入新周期，才会提示重置完成。</p></div>
            </div>
            <ProductImage name="quotadock-reset-warning-demo" width={1512} height={1693} alt="距周额度重置 24、12、5、1 小时的四个预警色演示阶段" caption="历史演示：颜色表示周重置临近，76% 是演示余量，并非额度不足警报。" />
          </div>
        </section>

        <section className={styles.section} id="engineering">
          <Chapter number="04" label="实现" title={<><span className={styles.phrase}>界面可以简单，</span><span className={styles.phrase}>数字不能含糊。</span></>} />
          <div className={styles.editorialColumns}>
            <div><h3>不知道的，就留空</h3><p>缺失的额度显示为“—”，不会被算成 0%；到了预计重置时间，也不会直接把余量改成 100%。本地趋势只记录实际观察到的数据，不补造离线时段的消耗，也不换算成 token。</p></div>
            <div><h3>单独连接账户</h3><p>QuotaDock 使用独立的 Codex 数据目录和钥匙串存储，不读取或修改主 Codex 的登录凭证。它只请求账户与额度信息，不发起模型推理；趋势、偏好和提醒记录保存在本机。</p></div>
          </div>
          <div className={styles.technical}><span>实现方式</span><p>SwiftUI 绘制界面，AppKit 处理窗口与桌面交互，通过 Codex app-server 同步额度。项目以 Swift Package 组织，没有第三方 Swift 依赖；额度计算、停靠定位和提醒策略放在可独立测试的 QuotaCore 中。</p></div>
        </section>

        <section className={styles.section} id="appearance">
          <div className={styles.split}>
            <div><Chapter number="05" label="外观与习惯" title="放在顺手的位置。" />
              <div className={styles.prose}><p>深浅外观、字号、颜色、透明度和停靠位置，都可以按桌面习惯调整。登录后启动是可选项，需要时也可以设置全局快捷键。</p><p>本地趋势保留最近七天的观测。内置的使用建议可以分类浏览、收藏、隐藏或复制。</p><p>如果同时使用 NotchNook，可以手动留出间距；QuotaDock 独立运行，不会自动跟随它的展开宽度。</p></div>
            </div>
            <ProductImage name="quotadock-ui-light-demo" width={1892} height={1589} alt="浅色普通胶囊、概况与详情的历史演示界面" caption="浅色外观的历史演示，使用示例账户与数值；并非当前版本实机截图。" />
          </div>
        </section>

        <section className={`${styles.section} ${styles.release}`} id="status">
          <Chapter number="06" label="当前进展 / 2026.10.02" title="已经能用，还在继续打磨。"><p>当前为 0.2.0 / build 14 开发预览。</p></Chapter>
          <div className={styles.editorialColumns}>
            <div><h3>已经实现</h3><p>刘海圆环、边缘胶囊、额度同步、重置提醒、免打扰、本地趋势和使用建议。已有真实账户同步与部分桌面交互的验收记录。</p></div>
            <div><h3>仍在验证</h3><p>多显示器、全屏、睡眠跨越重置、重新登录后的自动启动，以及协议进程异常和长期运行的稳定性。</p></div>
          </div>
          <div className={styles.download}>
            <div><h3>试用开发预览</h3><p>预编译包面向 Apple Silicon，要求 macOS 14+ 和可用的 Codex CLI。目前使用 ad-hoc 签名，尚未完成 Developer ID 签名与 Apple 公证，首次打开可能被系统拦截；也可按仓库说明从源码构建。</p></div>
            <nav className={styles.actions} aria-label="下载与反馈"><ExternalLink href={`${repository}/releases/tag/v0.2.0-preview.14`}>查看开发预览</ExternalLink><ExternalLink href={`${repository}/issues`}>提交问题</ExternalLink></nav>
          </div>
          <p className={styles.disclaimer}>QuotaDock 是独立第三方工具，与 OpenAI、Apple 或 NotchNook 无隶属关系。</p>
        </section>
      </article>
      <footer className={styles.footer}><div><span>reflex4 / Project Archive</span><p>QuotaDock</p></div><nav aria-label="项目页底部导航"><a href="/tools">返回实用工具</a><a href="/projects/arknights-prts-codex-pet">下一个项目：Codex 桌宠 ↗</a><a href="#top">回到顶部 ↑</a></nav></footer>
    </main>
  );
}
