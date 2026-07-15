// This is intentionally not named `page.tsx`: Motion Lab is source-only and
// must not become a public route or enter the production static export.
// Rename it back to `page.tsx` temporarily when the experiment needs to run.
import type { Metadata } from "next";
import { MotionLab } from "./MotionLab";
import motionLabImage from "./og-motion-lab.png";
import "./motion-lab.css";

export const metadata: Metadata = {
  title: "GSAP Motion Lab — reflex4",
  description:
    "一个可交互的 GSAP 动效实验室：现场体验补间、时间线、滚动触发、文本拆分、FLIP、拖拽与路径运动，并学习如何向 Codex 描述动效。",
  openGraph: {
    title: "GSAP Motion Lab — reflex4",
    description: "观察动效、复制提示词，再让 Codex 为你的页面实现同类体验。",
    images: [{ url: motionLabImage.src, width: 1536, height: 1024, alt: "GSAP Motion Lab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GSAP Motion Lab — reflex4",
    description: "一个可交互、可复制提示词的 GSAP 动效实验室。",
    images: [motionLabImage.src],
  },
};

export default function MotionLabPage() {
  return <MotionLab />;
}
