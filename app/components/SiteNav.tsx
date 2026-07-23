type Section = "home" | "blog" | "photography";

const items: Array<{ id: Section; href: string; label: string; number: string }> = [
  { id: "home", href: "/", label: "首页", number: "01" },
  { id: "blog", href: "/blog", label: "博客", number: "02" },
  { id: "photography", href: "/photography", label: "摄影", number: "03" },
];

const projects = [
  {
    name: "MacOS 硬盘照片管理软件",
    code: "PHOTO DESK",
  },
  {
    name: "RSS Reader for M5Papercolor",
    code: "E-INK RSS",
  },
] as const;

export function SiteNav({ active }: { active: Section | "motion" | "not-found" }) {
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

      <details className="nav-projects">
        <summary className="nav-link">
          <span className="nav-number">04</span>
          <span>项目</span>
        </summary>
        <div className="project-menu" aria-label="项目入口">
          <header>
            <span>04 / Selected Projects</span>
            <b>入口预留</b>
          </header>
          {projects.map((project, index) => (
            <span className="project-menu-item" aria-disabled="true" key={project.code}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.name}</strong>
              <small>{project.code} · Coming soon</small>
            </span>
          ))}
        </div>
      </details>
    </nav>
  );
}
