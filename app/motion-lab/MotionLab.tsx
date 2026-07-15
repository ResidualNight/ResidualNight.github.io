"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { SiteNav } from "../components/SiteNav";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  MotionPathPlugin,
);

const promptCards = [
  {
    index: "01",
    title: "入场与缓动",
    tag: "CORE / STAGGER",
    prompt:
      "用 GSAP 为这个标题做杂志式入场：字符从下方 48px 上移并淡入，stagger 0.035 秒，power3.out；副标题晚 0.2 秒出现，并支持 prefers-reduced-motion。",
  },
  {
    index: "02",
    title: "滚动叙事",
    tag: "SCROLLTRIGGER",
    prompt:
      "用 GSAP ScrollTrigger 做一段滚动叙事：章节进入视口 72% 时逐项显现；进度线使用 scrub: 0.6 跟随滚动；不要同时使用 toggleActions；React 卸载时清理。",
  },
  {
    index: "03",
    title: "布局变形",
    tag: "FLIP",
    prompt:
      "用 GSAP Flip 制作筛选后的卡片重排：先 Flip.getState，再改变 DOM 状态，最后 Flip.from；持续 0.65 秒，power3.inOut，移动端也保持稳定。",
  },
  {
    index: "04",
    title: "拖拽与惯性",
    tag: "DRAGGABLE",
    prompt:
      "用 GSAP Draggable 做一张可拖动的档案标签：限制在容器内，支持鼠标与触摸；松手后回到原位，使用 elastic.out；不要影响页面滚动。",
  },
] as const;

function Furniture() {
  return (
    <>
      <div className="motion-paper-frame" aria-hidden="true" />
      <div className="motion-film-strip" aria-hidden="true" />
      <div className="motion-cursor" aria-hidden="true">
        R4
      </div>
    </>
  );
}

function CopyPrompt({ text }: { text: string }) {
  return (
    <button
      className="copy-prompt"
      type="button"
      onClick={() => void navigator.clipboard?.writeText(text)}
      aria-label="复制这段提示词"
    >
      COPY PROMPT
    </button>
  );
}

export function MotionLab() {
  const root = useRef<HTMLElement>(null);
  const introTimeline = useRef<gsap.core.Timeline | null>(null);
  const orbitTimeline = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (!root.current) return;

      const scroller = root.current;
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          canHover: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduceMotion, canHover } = context.conditions as {
            reduceMotion: boolean;
            canHover: boolean;
          };

          if (reduceMotion) {
            gsap.set(".motion-reveal, .motion-section", {
              autoAlpha: 1,
              clearProps: "transform",
            });
            return;
          }

          const split = SplitText.create(".motion-hero-title", {
            type: "words,chars",
            aria: "auto",
          });

          introTimeline.current = gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(split.chars, {
              yPercent: 115,
              autoAlpha: 0,
              rotation: 3,
              duration: 0.72,
              stagger: 0.028,
            })
            .from(
              ".motion-hero .motion-reveal",
              { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.08 },
              "-=0.35",
            );

          gsap.utils.toArray<HTMLElement>(".motion-section").forEach((section) => {
            const items = section.querySelectorAll(".section-reveal");
            gsap.from(items, {
              y: 44,
              autoAlpha: 0,
              duration: 0.72,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                scroller,
                start: "top 72%",
                toggleActions: "play none none reverse",
              },
            });
          });

          gsap.to(".motion-progress__bar", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".motion-lab__content",
              scroller,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });

          orbitTimeline.current = gsap
            .timeline({ repeat: -1, defaults: { ease: "none" } })
            .to(".path-token", {
              duration: 4.2,
              motionPath: {
                path: "M0,70 C90,-40 190,180 300,65 C380,-20 470,130 560,42",
                autoRotate: true,
              },
            });

          Draggable.create(".drag-ticket", {
            type: "x,y",
            bounds: ".drag-field",
            edgeResistance: 0.82,
            onRelease() {
              gsap.to(this.target, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: "elastic.out(1, 0.45)",
              });
            },
          });

          if (canHover) {
            const xTo = gsap.quickTo(".motion-cursor", "x", {
              duration: 0.35,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(".motion-cursor", "y", {
              duration: 0.35,
              ease: "power3.out",
            });
            const moveCursor = (event: PointerEvent) => {
              xTo(event.clientX + 14);
              yTo(event.clientY + 14);
            };
            scroller.addEventListener("pointermove", moveCursor);
            return () => scroller.removeEventListener("pointermove", moveCursor);
          }
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  const replayIntro = contextSafe(() => introTimeline.current?.restart());
  const toggleOrbit = contextSafe((event: React.MouseEvent<HTMLButtonElement>) => {
    const timeline = orbitTimeline.current;
    if (!timeline) return;
    if (timeline.paused()) {
      timeline.play();
      event.currentTarget.textContent = "PAUSE PATH";
    } else {
      timeline.pause();
      event.currentTarget.textContent = "PLAY PATH";
    }
  });
  const flipSpecimens = contextSafe(() => {
    const group = root.current?.querySelector(".flip-specimens");
    if (!group) return;
    const state = Flip.getState(group.children);
    group.classList.toggle("is-swapped");
    Flip.from(state, { duration: 0.65, ease: "power3.inOut", stagger: 0.04 });
  });

  return (
    <main className="motion-lab" ref={root} aria-label="GSAP 动效实验室">
      <Furniture />
      <div className="motion-progress" aria-hidden="true">
        <span className="motion-progress__bar" />
      </div>

      <div className="motion-lab__content">
        <header className="motion-masthead">
          <a className="wordmark" href="/" aria-label="reflex4 首页">
            reflex<span>4</span>
          </a>
          <SiteNav active="motion" />
          <div className="motion-edition">
            <span>GSAP FIELD NOTES</span>
            <span>LAB / 2026</span>
          </div>
        </header>

        <section className="motion-hero" id="top">
          <div className="motion-hero__copy">
            <p className="motion-kicker motion-reveal">Official skill showcase · 08 modules installed</p>
            <h1 className="motion-hero-title">MOTION<br />FIELD LAB</h1>
            <p className="motion-lede motion-reveal">
              不是一页动效清单，而是一份可以触摸、拖动、滚动和复演的实验记录。
              观察效果，再把旁边的提示词交给我。
            </p>
            <div className="motion-actions motion-reveal">
              <button type="button" onClick={replayIntro}>REPLAY INTRO</button>
              <a href="#specimens">VIEW SPECIMENS ↓</a>
            </div>
          </div>
          <aside className="motion-index motion-reveal" aria-label="实验目录">
            <div><span>01</span><b>Core Tweens</b><em>入场、缓动、交错</em></div>
            <div><span>02</span><b>Timeline</b><em>编排、标签、控制</em></div>
            <div><span>03</span><b>ScrollTrigger</b><em>触发、scrub、进度</em></div>
            <div><span>04</span><b>Plugins</b><em>Split / Flip / Drag / Path</em></div>
          </aside>
        </section>

        <section className="motion-section motion-specimens" id="specimens" aria-labelledby="specimens-title">
          <div className="section-heading section-reveal">
            <p>01 / LIVE SPECIMENS</p>
            <h2 id="specimens-title">四种能力，现场操作</h2>
            <span>SCROLL / CLICK / DRAG</span>
          </div>

          <div className="specimen-grid">
            <article className="specimen section-reveal timeline-specimen">
              <header><span>A</span><b>TIMELINE CONTROL</b></header>
              <div className="timeline-bars" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </div>
              <p>主时间线用位置参数协调标题、说明与按钮，而不是堆叠 delay。</p>
              <button type="button" onClick={replayIntro}>REPLAY HERO</button>
            </article>

            <article className="specimen section-reveal path-specimen">
              <header><span>B</span><b>MOTION PATH</b></header>
              <div className="path-stage" aria-hidden="true">
                <span className="path-guide" />
                <i className="path-token">R4 →</i>
              </div>
              <p>元素沿贝塞尔路径运动，并根据切线自动旋转。</p>
              <button type="button" onClick={toggleOrbit}>PAUSE PATH</button>
            </article>

            <article className="specimen section-reveal flip-specimen">
              <header><span>C</span><b>FLIP LAYOUT</b></header>
              <div className="flip-specimens" aria-label="可重排的印刷样张">
                <i>TYPE</i><i>GRID</i><i>INK</i><i>PACE</i>
              </div>
              <p>记录前后布局状态，再把位置变化转换成流畅过渡。</p>
              <button type="button" onClick={flipSpecimens}>REORDER</button>
            </article>

            <article className="specimen section-reveal drag-specimen">
              <header><span>D</span><b>DRAGGABLE</b></header>
              <div className="drag-field">
                <div className="drag-ticket" role="img" aria-label="可拖动的 R4 档案标签">
                  <b>R4</b><span>DRAG ME</span>
                </div>
              </div>
              <p>把标签拖到框内任意位置；松手后以弹性缓动归位。</p>
            </article>
          </div>
        </section>

        <section className="motion-section prompt-section" id="prompts" aria-labelledby="prompts-title">
          <div className="section-heading section-reveal">
            <p>02 / HOW TO ASK</p>
            <h2 id="prompts-title">这样描述，我就能生成</h2>
            <span>COPY / ADAPT / SEND</span>
          </div>
          <div className="prompt-grid">
            {promptCards.map((card) => (
              <article className="prompt-card section-reveal" key={card.index}>
                <header><span>{card.index}</span><b>{card.tag}</b></header>
                <h3>{card.title}</h3>
                <blockquote>“{card.prompt}”</blockquote>
                <CopyPrompt text={card.prompt} />
              </article>
            ))}
          </div>
        </section>

        <section className="motion-section motion-recipe" aria-labelledby="recipe-title">
          <div className="section-heading section-reveal">
            <p>03 / PROMPT RECIPE</p>
            <h2 id="recipe-title">一个好动效需求的 6 个坐标</h2>
            <span>INTENT BEFORE EFFECT</span>
          </div>
          <ol className="recipe-list">
            <li className="section-reveal"><span>01</span><b>目标</b><p>先说它为什么动：引导视线、解释关系、确认操作，还是制造情绪。</p></li>
            <li className="section-reveal"><span>02</span><b>触发</b><p>页面载入、进入视口、滚动进度、点击、拖拽或指针移动。</p></li>
            <li className="section-reveal"><span>03</span><b>对象</b><p>明确标题字符、整张卡片、路径上的图标，避免含糊的“这里”。</p></li>
            <li className="section-reveal"><span>04</span><b>轨迹</b><p>描述起点与终点：位移、缩放、旋转、透明度或布局状态。</p></li>
            <li className="section-reveal"><span>05</span><b>节奏</b><p>给持续时间、stagger、ease，或直接说“克制、迅速、带回弹”。</p></li>
            <li className="section-reveal"><span>06</span><b>边界</b><p>补充移动端、减少动效、可中断、React 清理与性能要求。</p></li>
          </ol>
          <div className="master-prompt section-reveal">
            <span>MASTER TEMPLATE</span>
            <p>“请用 GSAP 为 <b>[对象]</b> 制作 <b>[目标]</b> 动效；由 <b>[触发方式]</b> 启动，从 <b>[起点]</b> 到 <b>[终点]</b>，持续 <b>[时长]</b>，使用 <b>[缓动/节奏]</b>。技术栈是 <b>[React/Vue/原生]</b>，并处理 <b>[移动端/减少动效/清理/性能]</b>。”</p>
          </div>
        </section>

        <footer className="motion-footer">
          <p>GSAP SKILLS / CORE · TIMELINE · SCROLL · PLUGINS · REACT · FRAMEWORKS · UTILS · PERFORMANCE</p>
          <a href="#top">BACK TO TOP ↑</a>
        </footer>
      </div>
    </main>
  );
}
