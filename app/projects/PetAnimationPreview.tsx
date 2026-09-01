"use client";

import { useState, useSyncExternalStore } from "react";

type PetAnimationPreviewProps = {
  animatedSrc: string;
  staticSrc: string;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function PetAnimationPreview({ animatedSrc, staticSrc }: PetAnimationPreviewProps) {
  const prefersReducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
  const [pausedOverride, setPausedOverride] = useState<boolean | null>(null);
  const paused = pausedOverride ?? prefersReducedMotion;

  return (
    <figure className="pet-media-figure pet-motion-figure">
      <div className="pet-media-image-wrap">
        <img
          src={paused ? staticSrc : animatedSrc}
          width="1800"
          height="740"
          alt={paused ? "Move 右移与逐帧镜像左移的八帧静态对比" : "Move 右移与逐帧镜像左移的并排循环动画"}
        />
        <button type="button" onClick={() => setPausedOverride(!paused)} aria-pressed={!paused}>
          {paused ? "播放方向对比" : "暂停方向对比"}
        </button>
      </div>
      <figcaption><b>MEDIA 03 / DIRECTION</b><span>同一段 Move 动画逐格水平镜像，帧序保持不变。</span></figcaption>
    </figure>
  );
}
