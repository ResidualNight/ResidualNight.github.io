"use client";

import { useState } from "react";
import { projects, type ProjectSlug } from "../projects/project-data";

type Section = "home" | "blog" | "photography";

const items: Array<{ id: Section; href: string; label: string; number: string }> = [
  { id: "home", href: "/", label: "首页", number: "01" },
  { id: "blog", href: "/blog", label: "博客", number: "02" },
  { id: "photography", href: "/photography", label: "摄影", number: "03" },
];

type SiteNavProps = {
  active: Section | "projects" | "motion" | "not-found";
  activeProject?: ProjectSlug;
};

export function SiteNav({ active, activeProject }: SiteNavProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <nav className="site-nav" aria-label="主导航">
      {items.map((item) => (
        <a
          className={`nav-link${active === item.id ? " is-active" : ""}`}
          href={item.href}
          aria-current={active === item.id ? "page" : undefined}
          key={item.id}
        >
          <span className="nav-number">{item.number}</span>
          <span>{item.label}</span>
        </a>
      ))}

      <details
        className="nav-projects"
        open={projectsOpen}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setProjectsOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setProjectsOpen(false);
        }}
        onToggle={(event) => setProjectsOpen(event.currentTarget.open)}
      >
        <summary
          className={`nav-link${active === "projects" ? " is-active" : ""}`}
          aria-current={active === "projects" ? "page" : undefined}
          onClick={(event) => {
            const isMouseClick =
              event.detail > 0 &&
              window.matchMedia("(hover: hover) and (pointer: fine)").matches;
            if (isMouseClick) event.preventDefault();
          }}
        >
          <span className="nav-number">04</span>
          <span>项目</span>
        </summary>
        <div className="project-menu" aria-label="项目入口">
          <header>
            <span>04 / Selected Projects</span>
            <b>项目目录</b>
          </header>
          {projects.map((project, index) => (
            <a
              className={`project-menu-item${activeProject === project.slug ? " is-active" : ""}`}
              href={`/projects/${project.slug}`}
              aria-current={activeProject === project.slug ? "page" : undefined}
              key={project.code}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.name}</strong>
              <small>{project.code} · {project.status}</small>
            </a>
          ))}
        </div>
      </details>
    </nav>
  );
}
