import { SiteNav } from "../components/SiteNav";
import { PetAnimationPreview } from "./PetAnimationPreview";

type ArknightsPetProjectPageProps = {
  projectIndex: number;
  projectCount: number;
};

function PetChapter({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="pet-chapter-heading">
      <span>{number}</span>
      <div><p>{eyebrow}</p><h2>{title}</h2>{children}</div>
    </header>
  );
}

function PetMediaFigure({ code, src, alt, note, width, height, className = "" }: { code: string; src: string; alt: string; note: string; width: number; height: number; className?: string }) {
  return (
    <figure className={`pet-media-figure ${className}`.trim()}>
      <div className="pet-media-image-wrap"><img src={src} alt={alt} width={width} height={height} loading="lazy" /></div>
      <figcaption><b>{code}</b><span>{note}</span></figcaption>
    </figure>
  );
}

export function ArknightsPetProjectPage({ projectIndex, projectCount }: ArknightsPetProjectPageProps) {
  return (
    <main className="portfolio pet-project-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead pet-masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">reflex<span>4</span></a>
        <SiteNav active="projects" activeProject="arknights-prts-codex-pet" />
        <div className="edition">
          <span>Project Feature</span>
          <span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projectCount).padStart(2, "0")}</span>
        </div>
      </header>

      <article className="pet-story">
        <section className="pet-hero" aria-labelledby="pet-project-title">
          <div className="pet-hero-copy">
            <p className="pet-kicker">04.03 / CODEX SKILL / LITE V1</p>
            <h1 id="pet-project-title">把 PRTS 基建动画<br />变成 Codex 桌面宠物</h1>
            <p className="pet-hero-lead">从皮肤确认、透明帧处理，到九状态预览与验收安装。</p>
            <p className="pet-hero-summary">用户只需提供干员名与皮肤，Skill 即可把已有 PRTS 基建动画整理为符合 Codex Lite/v1 规格的透明精灵图宠物。</p>
            <nav className="pet-hero-actions" aria-label="项目内容导航">
              <a href="#workflow">查看工作流 <span>↓</span></a>
              <a href="https://github.com/ResidualNight/ark-codex-pet-lite" target="_blank" rel="noreferrer">查看 GitHub <span>↗</span></a>
              <a href="#case-study">查看生成效果 <span>↓</span></a>
            </nav>
          </div>

          <figure className="pet-preview-figure">
            <div className="pet-preview-toolbar"><span>NINE-STATE PREVIEW</span><span>CEOBE / DEFAULT</span></div>
            <img className="pet-preview-main" src="/projects/arknights-prts-codex-pet/nine-state-preview.png" alt="刻俄柏默认皮肤的九状态离线验收页，包含方向提醒、播放速度和状态来源标识" width="1800" height="1530" />
            <img className="pet-preview-controls-image" src="/projects/arknights-prts-codex-pet/preview-controls.png" alt="九状态预览页的播放暂停与速度控制局部" width="1120" height="71" />
            <figcaption><b>MEDIA 01 / ANIMATION REVIEW</b><span>九状态同时预览；方向、来源与降级状态保持可见。</span></figcaption>
          </figure>
        </section>

        <section className="pet-slice-workflow" id="workflow">
          <header><span>01</span><div><p>REPRODUCIBLE PIPELINE</p><h2>把易出错的手工步骤，<br />整理成一条可复现工作流</h2></div></header>
          <div className="pet-flowline" aria-label="PRTS 宠物生成流程">
            {[
              ["PRTS", "皮肤确认"], ["WebM", "动画导出"], ["Frames", "透明帧"],
              ["Atlas", "8 × 9 图集"], ["Preview", "九状态预览"], ["Approval", "验收安装"],
            ].map(([label, note], index) => <div key={label}><i>{String(index + 1).padStart(2, "0")}</i><strong>{label}</strong><small>{note}</small></div>)}
          </div>
        </section>

        <section className="pet-section pet-core" id="why">
          <PetChapter
            number="02–04"
            eyebrow="THREE ENGINEERING GATES"
            title={<>每一次自动处理，<br />都必须通过一道门</>}
          >
            <p>这条管线不把“问题、步骤、功能”分开陈列。它把风险放回发生的位置：先确认来源，再建立可靠图集，最后把安装权交还给用户。</p>
          </PetChapter>

          <div className="pet-gate-grid" id="features">
            <article>
              <header><span>GATE 01 / CONFIRM</span><b>来源确认</b></header>
              <h3>先确认处理的是谁</h3>
              <p className="pet-gate-risk">风险：动作集合不统一，页面还可能静默回退到默认皮肤。</p>
              <ol><li><b>01</b><span>接收干员名与可选皮肤</span></li><li><b>02</b><span>两次独立探测并确认结果一致</span></li><li><b>03</b><span>只重试缺失或损坏的来源动作</span></li></ol>
              <footer><span>STABLE PROBE</span><span>PARTIAL RETRY</span></footer>
            </article>
            <article>
              <header><span>GATE 02 / BUILD</span><b>图集建立</b></header>
              <h3>让每一帧进入正确位置</h3>
              <p className="pet-gate-risk">风险：透明噪声、基线抖动、裁切和错误方向都会在运行时被放大。</p>
              <ol><li><b>04</b><span>解码透明帧并清理低 Alpha 噪声</span></li><li><b>05</b><span>共享缩放、脚底基线与防裁切</span></li><li><b>06</b><span>抽帧并映射到九种 Codex 状态</span></li></ol>
              <footer><span>ALPHA CLEANUP</span><span>STATE MAPPING</span></footer>
            </article>
            <article>
              <header><span>GATE 03 / APPROVE</span><b>验收安装</b></header>
              <h3>把最后决定留给用户</h3>
              <p className="pet-gate-risk">风险：结构校验通过，不代表角色大小、节奏和降级状态已经合格。</p>
              <ol><li><b>07</b><span>组装 1536 × 1872 的 PNG / WebP</span></li><li><b>08</b><span>独立验证透明格、裁切与移动方向</span></li><li><b>09</b><span>九状态预览；明确批准后原子安装</span></li></ol>
              <footer><span>OFFLINE PREVIEW</span><span>APPROVAL GATE</span></footer>
            </article>
          </div>
          <p className="pet-gate-summary"><b>PRTS</b><span>→</span><b>CONFIRM</b><span>→</span><b>BUILD</b><span>→</span><b>VERIFY</b><span>→</span><b>APPROVAL</b><span>→</span><b>CODEX PET</b></p>
        </section>

        <section className="pet-section pet-technical" id="technical">
          <PetChapter number="05" eyebrow="TECHNICAL DEEP DIVE" title="一个固定图集，九种运行状态，多份可追溯报告" />
          <div className="pet-technical-layout">
            <PetMediaFigure code="MEDIA 02 / VALIDATED ATLAS" src="/projects/arknights-prts-codex-pet/final-atlas-checkerboard.jpg" alt="刻俄柏最终 8 列乘 9 行精灵图的棋盘格展示版本" width={1800} height={2250} note="棋盘格只帮助阅读透明区域；网页不提供运行时透明原图下载。" className="pet-atlas-figure" />
            <div className="pet-specs">
              <dl>
                <div><dt>输出</dt><dd>RGBA PNG / WebP</dd></div><div><dt>画布</dt><dd>1536 × 1872 px</dd></div>
                <div><dt>结构</dt><dd>8 列 × 9 行</dd></div><div><dt>单元格</dt><dd>192 × 208 px</dd></div>
                <div><dt>语言</dt><dd>Python 3.10+</dd></div><div><dt>自动化</dt><dd>Playwright + Chromium</dd></div>
                <div><dt>图像</dt><dd>Pillow</dd></div><div><dt>可选恢复</dt><dd>FFmpeg + Spine WebGL runtime</dd></div>
              </dl>
              <div className="pet-report-stack"><span>MANIFEST</span><span>DECODE REPORT</span><span>ATLAS REPORT</span><span>VALIDATION REPORT</span></div>
            </div>
          </div>
          <div className="pet-script-list" aria-label="核心脚本">
            {[
              ["prts_skin_probe.py", "干员与皮肤探测"], ["prts_export.py", "动画导出与局部重试"],
              ["decode_webm.py", "透明帧解码与标准化"], ["build_lite_atlas.py", "状态映射与图集生成"],
              ["validate_lite_atlas.py", "独立图集校验"], ["build_preview_page.py", "离线动态验收页"],
              ["install_local_pet.py", "带门控与备份的安装器"],
            ].map(([name, role]) => <div key={name}><code>{name}</code><span>{role}</span></div>)}
          </div>
        </section>

        <section className="pet-section pet-case" id="case-study">
          <PetChapter number="06" eyebrow="CASE STUDY / CEOBE" title="刻俄柏：从默认皮肤到九状态宠物">
            <p>此案例记录现有产物报告，而不是实时 CI 状态。历史离线回归数据截至 2026-08-12。</p>
          </PetChapter>
          <div className="pet-case-metrics">
            <article><strong>57</strong><span>必需非空单元</span></article><article><strong>15</strong><span>未使用透明单元</span></article>
            <article><strong>0</strong><span>边缘接触单元</span></article><article><strong>2.09</strong><span>MiB WebP 示例</span></article>
            <article><strong>30/30</strong><span>历史离线回归通过</span></article>
          </div>
          <div className="pet-case-media">
            <PetAnimationPreview animatedSrc="/projects/arknights-prts-codex-pet/move-left-right-loop.gif" staticSrc="/projects/arknights-prts-codex-pet/move-left-right-comparison.jpg" />
            <PetMediaFigure code="MEDIA 04 / TUNING" src="/projects/arknights-prts-codex-pet/tuning-before-after-comparison.jpg" alt="刻俄柏初始版、1.3 倍调校版和状态改映射版的并排对比" width={2100} height={1040} note="同一干员与皮肤，只比较缩放、镜像与状态来源选择。" className="pet-tuning-figure" />
          </div>
          <div className="pet-case-notes"><span>DEFAULT SKIN</span><span>INTERACT / MOVE / RELAX / SIT / SLEEP</span><span>FAILED → SLEEP</span><span>PNG + WEBP VALIDATED</span></div>
        </section>

        <section className="pet-section pet-decisions" id="decisions">
          <PetChapter number="07" eyebrow="ENGINEERING DECISIONS" title="可靠性来自明确的边界" />
          <div className="pet-decision-grid">
            <article><span>LITE / V1</span><h3>先把固定规格做扎实</h3><p>首版不冒充完整 v2 宠物格式；九状态足以验证这条资产处理管线。</p></article>
            <article><span>HUMAN APPROVAL</span><h3>自动化不替用户验收</h3><p>角色观感和安装决定都保留给用户；没有明确批准，工具不会写入本地宠物目录。</p></article>
            <article><span>CODE ONLY</span><h3>仓库不分发游戏资产</h3><p>公开仓库只包含原创代码与文档，不提交 WebM、Spine、解码帧、图集或成品宠物包。</p></article>
          </div>
        </section>

        <section className="pet-section pet-boundaries" id="limitations">
          <PetChapter number="08" eyebrow="LIMITATIONS / NEXT" title={<>它是一条个人工具管线，<br />不是角色素材库</>} />
          <div className="pet-boundary-columns">
            <div><h3>当前边界</h3><ul><li>不是独立 Windows / macOS 桌宠应用。</li><li>不补绘、不重画、不生成新的角色动作。</li><li>缺失动作会降级复用，并在报告与预览中标出。</li><li>PRTS 页面结构变化时，导出选择器可能需要更新。</li></ul></div>
            <div><h3>继续完善</h3><ul><li>增加更多干员与皮肤的兼容性案例。</li><li>建立实时 CI 与选择器诊断。</li><li>丰富状态、缩放与映射对比体验。</li><li>在规格允许时单独评估更高阶格式。</li></ul></div>
          </div>
        </section>

        <section className="pet-section pet-links" id="links">
          <PetChapter number="09" eyebrow="LINKS / DISCLAIMER" title={<>代码开放，<br />第三方资产权利不随之转移</>} />
          <div className="pet-links-layout">
            <div className="pet-link-card"><span>GITHUB / MIT</span><h3>ark-codex-pet-lite</h3><p>MIT License 仅覆盖项目原创代码与文档。</p><a href="https://github.com/ResidualNight/ark-codex-pet-lite" target="_blank" rel="noreferrer">查看 GitHub 仓库 ↗</a></div>
            <div className="pet-disclaimer"><p>本项目为非官方个人项目，与鹰角网络、PRTS 或 OpenAI 均无隶属、合作或背书关系。</p><p>《明日方舟》及相关角色、图像、动画和商标归各自权利人所有。项目只应在用户有权访问和处理源素材时使用，生成宠物以个人使用为主。</p></div>
          </div>
        </section>
      </article>

      <div className="ceobe-deskpet" aria-hidden="true">
        <span className="ceobe-deskpet-sprite" />
      </div>

      <footer className="pet-footer"><div><span>reflex4 / Project Archive</span><strong>Arknights PRTS Pet Builder for Codex</strong></div><nav aria-label="项目页底部导航"><a href="/">返回首页</a><a href="/blog">查看开发记录</a><a href="#pet-project-title">回到顶部 ↑</a></nav></footer>
    </main>
  );
}
