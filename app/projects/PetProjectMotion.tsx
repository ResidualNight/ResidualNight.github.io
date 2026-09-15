"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PetProjectMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const scroller = root.current;
    if (!scroller) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = window.matchMedia("(max-width: 760px)").matches;
      const targets = scroller.querySelectorAll<HTMLElement>([
        ".pet-hero-copy > p", ".pet-hero-copy > h1", ".pet-preview-figure",
        ".pet-slice-workflow > header", ".pet-chapter-heading",
        ".pet-flow-content", ".pet-gate-grid > article > :not(header)",
        ".pet-media-figure", ".pet-specs", ".pet-case-metrics > article",
        ".pet-decision-grid > article", ".pet-boundary-columns > div",
        ".pet-link-card", ".pet-disclaimer",
      ].join(","));
      const reveals = Array.from(targets, (target) => {
        const flowCell = target.matches(".pet-flow-content") ? target.parentElement : null;
        const stepped = target.matches(".pet-case-metrics > article");
        const index = flowCell ? Array.from(flowCell.parentElement!.children).indexOf(flowCell) : stepped ? Array.from(target.parentElement!.children).indexOf(target) : 0;
        const tween = gsap.fromTo(target,
          { opacity: 0.25, y: compact ? 12 : 24 },
          {
            opacity: 1, y: 0, duration: 0.65, delay: index * 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: target, scroller,
              start: "top 96%", end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          },
        );
        // Keyboard navigation must reveal a focused control immediately.
        const revealFocus = () => tween.progress(1).pause();
        target.addEventListener("focusin", revealFocus);
        return () => target.removeEventListener("focusin", revealFocus);
      });
      let active = true;
      const refresh = () => { if (active) ScrollTrigger.refresh(); };
      scroller.addEventListener("load", refresh, true);
      void document.fonts.ready.then(refresh);
      return () => {
        active = false;
        scroller.removeEventListener("load", refresh, true);
        reveals.forEach((cleanup) => cleanup());
      };
    }, root);
    return () => media.revert();
  }, { scope: root });

  return <main ref={root} className="portfolio pet-project-page">{children}</main>;
}
