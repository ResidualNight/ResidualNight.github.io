"use client";

import { useState } from "react";
import { menuProjects, utilityProjects, type ProjectSlug } from "../projects/project-data";

type Section = "home" | "blog" | "photography";

const items: Array<{ id: Section; href: string; label: string; number: string }> = [
  { id: "home", href: "/", label: "首页", number: "01" },
  { id: "blog", href: "/blog", label: "博客", number: "02" },
  { id: "photography", href: "/photography", label: "摄影", number: "03" },
];

type SiteNavProps = {
  active: Section | "projects" | "tools" | "motion" | "not-found";
  activeProject?: ProjectSlug;
};

export function SiteNav({ active, activeProject }: SiteNavProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const toolsActive = active === "tools" || utilityProjects.some((project) => project.slug === activeProject);
  const projectsActive = active === "projects" || active === "tools";

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
          className={`nav-link${projectsActive ? " is-active" : ""}`}
          aria-current={projectsActive ? "page" : undefined}
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
          {menuProjects.map((project, index) => (
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
          <a
            className={`project-menu-item${toolsActive ? " is-active" : ""}`}
            href="/tools"
            aria-current={active === "tools" ? "page" : toolsActive ? "location" : undefined}
          >
            <span>{String(menuProjects.length + 1).padStart(2, "0")}</span>
            <strong>实用工具</strong>
            <small>UTILITIES</small>
          </a>
        </div>
      </details>
    </nav>
  );
}
