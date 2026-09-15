import { SiteNav } from "../components/SiteNav";
import { PetAnimationPreview } from "./PetAnimationPreview";
import { PetProjectMotion } from "./PetProjectMotion";

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
    <PetProjectMotion>
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
            <h1 id="pet-project-title">把 PRTS <span className="pet-phrase">基建动画</span><br />变成 Codex <span className="pet-phrase">桌面宠物</span></h1>
            <p className="pet-hero-lead">让基建里的小人，也能出现在桌面上。</p>
            <p className="pet-hero-summary">这是一个给 Codex 用的 Skill。指定干员和皮肤后，它会从 PRTS 导出基建动画，处理透明背景，整理成 Lite/v1 桌宠。安装前可以先预览动作，看看大小和节奏是否合适。</p>
            <nav className="pet-hero-actions" aria-label="项目内容导航">
              <a href="#workflow">查看工作流 <span>↓</span></a>
              <a href="https://github.com/ResidualNight/ark-codex-pet-lite" target="_blank" rel="noreferrer">查看 GitHub <span>↗</span></a>
              <a href="#case-study">查看生成效果 <span>↓</span></a>
            </nav>
          </div>

          <figure className="pet-preview-figure">
            <div className="pet-preview-toolbar"><span>NINE-STATE PREVIEW</span><span>CEOBE / DEFAULT</span></div>
            <img className="pet-preview-main" src="/projects/arknights-prts-codex-pet/nine-state-preview.png" alt="刻俄柏默认皮肤的九状态离线验收页，包含方向提醒、播放速度和状态来源标识" width="1800" height="1530" />
            <figcaption><b>MEDIA 01 / ANIMATION REVIEW</b><span>九状态预览页截图。每个动作下方都注明了来源。</span></figcaption>
          </figure>
        </section>

        <section className="pet-slice-workflow" id="workflow">
          <header><span>01</span><div><p>HOW IT WORKS</p><h2>从一段基建动画，<br />到可以安装的桌宠</h2></div></header>
          <div className="pet-flowline" aria-label="PRTS 宠物生成流程">
            {[
              ["PRTS", "皮肤确认"], ["WebM", "动画导出"], ["Frames", "透明帧"],
              ["Atlas", "8 × 9 图集"], ["Preview", "九状态预览"], ["Approval", "验收安装"],
            ].map(([label, note], index) => <div key={label}><div className="pet-flow-content"><i>{String(index + 1).padStart(2, "0")}</i><strong>{label}</strong><small>{note}</small></div></div>)}
          </div>
        </section>

        <section className="pet-section pet-core" id="why">
          <PetChapter
            number="02–04"
            eyebrow="PROCESS NOTES"
            title={<>制作桌宠时，<br />有哪些细节要处理？</>}
          >
            <p>不同皮肤的动作不一定齐全，导出的动画也不能直接交给 Codex 使用。这里主要处理三件事：确认素材、整理画面，再检查实际播放效果。</p>
          </PetChapter>

          <div className="pet-gate-grid" id="features">
            <article>
              <header><span>01 / SOURCE</span><b>确认皮肤</b></header>
              <h3>选中的皮肤，<br />真的加载了吗？</h3>
              <p className="pet-gate-risk">PRTS 有时会退回默认皮肤，页面却没有明显提示。下载前需要再次核对，避免做完才发现选错了。</p>
              <ol><li><b>01</b><span>接收干员名与可选皮肤</span></li><li><b>02</b><span>两次独立探测并确认结果一致</span></li><li><b>03</b><span>只重试缺失或损坏的来源动作</span></li></ol>
              <footer><span>STABLE PROBE</span><span>PARTIAL RETRY</span></footer>
            </article>
            <article>
              <header><span>02 / FRAMES</span><b>整理动画</b></header>
              <h3>统一大小，<br />对齐脚底位置</h3>
              <p className="pet-gate-risk">每段动画的画面范围不同。分别缩放会让角色在切换动作时突然变大或变小，脚底的位置也可能跟着跳动。</p>
              <ol><li><b>04</b><span>拆出透明帧，清理边缘杂点</span></li><li><b>05</b><span>统一缩放和脚底位置，留足动作空间</span></li><li><b>06</b><span>抽取帧，分配给九种 Codex 状态</span></li></ol>
              <footer><span>ALPHA CLEANUP</span><span>STATE MAPPING</span></footer>
            </article>
            <article>
              <header><span>03 / PREVIEW</span><b>预览与安装</b></header>
              <h3>先看它动起来，<br />再决定安装</h3>
              <p className="pet-gate-risk">尺寸和格式可以用脚本检查，动作是否自然还得看一遍。预览页能同时播放九种状态，也会标出借用了其他动作的状态。</p>
              <ol><li><b>07</b><span>生成 1536 × 1872 的 PNG / WebP</span></li><li><b>08</b><span>检查空白帧、画面裁切和行走方向</span></li><li><b>09</b><span>打开预览，确认后备份并安装</span></li></ol>
              <footer><span>OFFLINE PREVIEW</span><span>APPROVAL GATE</span></footer>
            </article>
          </div>
          <p className="pet-gate-summary"><b>PRTS</b><span>→</span><b>CONFIRM</b><span>→</span><b>BUILD</b><span>→</span><b>VERIFY</b><span>→</span><b>APPROVAL</b><span>→</span><b>CODEX PET</b></p>
        </section>

        <section className="pet-section pet-technical" id="technical">
          <PetChapter number="05" eyebrow="FILES & TOOLS" title={<>九种状态，<br />装进一张精灵图</>} />
          <div className="pet-technical-layout">
            <PetMediaFigure code="MEDIA 02 / VALIDATED ATLAS" src="/projects/arknights-prts-codex-pet/final-atlas-checkerboard.jpg" alt="刻俄柏最终 8 列乘 9 行精灵图的棋盘格展示版本" width={1800} height={2250} note="每一行对应一种状态，每一格是一帧。棋盘格是展示用的背景，实际文件保留透明通道。" className="pet-atlas-figure" />
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
              ["install_local_pet.py", "确认安装并备份旧版本"],
            ].map(([name, role]) => <div key={name}><code>{name}</code><span>{role}</span></div>)}
          </div>
        </section>

        <section className="pet-section pet-case" id="case-study">
          <PetChapter number="06" eyebrow="CASE STUDY / CEOBE" title="刻俄柏做出来是什么样？">
            <p>下面用默认皮肤展示行走方向和几次调校的差别。数字来自这份成品的检查报告，其中 30 项离线回归测试记录于 2026-08-12。</p>
          </PetChapter>
          <div className="pet-case-metrics">
            <article><strong>57</strong><span>有画面的帧格</span></article><article><strong>15</strong><span>留空的透明帧格</span></article>
            <article><strong>0</strong><span>角色触碰边缘的帧格</span></article><article><strong>2.09</strong><span>MiB WebP 文件大小</span></article>
            <article><strong>30/30</strong><span>历史离线回归通过</span></article>
          </div>
          <div className="pet-case-media">
            <PetAnimationPreview animatedSrc="/projects/arknights-prts-codex-pet/move-left-right-loop.gif" staticSrc="/projects/arknights-prts-codex-pet/move-left-right-comparison.jpg" />
            <PetMediaFigure code="MEDIA 04 / TUNING" src="/projects/arknights-prts-codex-pet/tuning-before-after-comparison.jpg" alt="刻俄柏初始版、1.3 倍调校版和状态改映射版的并排对比" width={2100} height={1040} note="同一干员与皮肤，只比较缩放、镜像与状态来源选择。" className="pet-tuning-figure" />
          </div>
          <div className="pet-case-notes"><span>DEFAULT SKIN</span><span>INTERACT / MOVE / RELAX / SIT / SLEEP</span><span>FAILED → SLEEP</span><span>PNG + WEBP VALIDATED</span></div>
        </section>

        <section className="pet-section pet-decisions" id="decisions">
          <PetChapter number="07" eyebrow="PROJECT NOTES" title="这一版的几个取舍" />
          <div className="pet-decision-grid">
            <article><span>LITE / V1</span><h3>先支持 Lite/v1</h3><p>当前按八列九行的固定规格生成桌宠。更高阶的 v2 格式还没有实现，需要另行适配。</p></article>
            <article><span>INSTALLATION</span><h3>安装前停下来确认</h3><p>大小和动作节奏各有偏好，所以生成后先给出预览。用户明确同意后，才会写入本地宠物目录。</p></article>
            <article><span>CODE ONLY</span><h3>开源处理工具</h3><p>仓库提供代码和使用说明。游戏动画、模型文件和生成的宠物包不随代码一起分发。</p></article>
          </div>
        </section>

        <section className="pet-section pet-boundaries" id="limitations">
          <PetChapter number="08" eyebrow="LIMITATIONS / NEXT" title={<>目前的限制，<br />和后面想补的东西</>} />
          <div className="pet-boundary-columns">
            <div><h3>使用前要知道</h3><ul><li>生成的宠物需要在 Codex 中使用，不能作为独立桌宠应用运行。</li><li>动作来自已有基建动画，工具不会补画新动作。</li><li>某个动作缺失时会借用其他动作，预览页会注明。</li><li>PRTS 改版后，下载脚本可能需要跟着调整。</li></ul></div>
            <div><h3>后续计划</h3><ul><li>用更多干员和皮肤测试兼容性。</li><li>把现有回归测试接入持续集成，方便及时发现下载问题。</li><li>让不同尺寸和动作配置的效果更容易比较。</li><li>研究其他宠物格式的适配方式。</li></ul></div>
          </div>
        </section>

        <section className="pet-section pet-links" id="links">
          <PetChapter number="09" eyebrow="SOURCE & CREDITS" title={<>源码与<span className="pet-phrase">使用说明，</span><br />以及<span className="pet-phrase">素材出处</span></>} />
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
    </PetProjectMotion>
  );
}
