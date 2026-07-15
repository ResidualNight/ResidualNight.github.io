"use client";

import { useEffect, useState, type CSSProperties } from "react";

const LOAD_DURATION = 1500;
const EXIT_DURATION = 240;

function cubicCoordinate(t: number, control1: number, control2: number) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * control1
    + 3 * inverse * t * t * control2
    + t * t * t;
}

function naturalEaseIn(time: number) {
  let lower = 0;
  let upper = 1;
  let parameter = time;

  for (let index = 0; index < 12; index += 1) {
    parameter = (lower + upper) / 2;
    const x = cubicCoordinate(parameter, 0.42, 1);
    if (x < time) lower = parameter;
    else upper = parameter;
  }

  return cubicCoordinate(parameter, 0, 1);
}

export function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    const root = document.documentElement;
    const deck = document.querySelector<HTMLElement>(".page-deck");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let exitTimer = 0;
    let startTime: number | null = null;

    root.classList.add("intro-loading");
    if (deck) deck.scrollTop = 0;

    const finish = () => {
      setProgress(100);
      setPhase("exiting");
      exitTimer = window.setTimeout(() => {
        root.classList.remove("intro-loading");
        setPhase("done");
      }, reducedMotion ? 80 : EXIT_DURATION);
    };

    if (reducedMotion) {
      finish();
    } else {
      const update = (time: number) => {
        if (startTime === null) startTime = time;
        const elapsed = Math.min((time - startTime) / LOAD_DURATION, 1);
        const eased = naturalEaseIn(elapsed);
        setProgress(Math.min(100, Math.floor(eased * 100)));

        if (elapsed < 1) {
          animationFrame = window.requestAnimationFrame(update);
        } else {
          finish();
        }
      };

      animationFrame = window.requestAnimationFrame(update);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimer);
      root.classList.remove("intro-loading");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`intro-loader${phase === "exiting" ? " is-exiting" : ""}`}
      style={{ "--loader-fill": `${progress / 2}%` } as CSSProperties}
      role="progressbar"
      aria-label="正在装载 reflex4 个人档案"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="intro-loader-frame" aria-hidden="true" />
      <span className="intro-loader-wordmark">reflex<span>4</span></span>
      <span className="intro-loader-edition">Independent archive / 2026</span>

      <div className="intro-loader-track" aria-hidden="true">
        <span className="intro-loader-bar from-left" />
        <span className="intro-loader-bar from-right" />
      </div>

      <div className="intro-loader-readout">
        <span>Loading archive</span>
        <strong>{String(progress).padStart(3, "0")}%</strong>
      </div>
    </div>
  );
}
