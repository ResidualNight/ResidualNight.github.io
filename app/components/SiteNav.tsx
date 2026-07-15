type Section = "home" | "blog" | "photography";

const items: Array<{ id: Section; href: string; label: string; number: string }> = [
  { id: "home", href: "/", label: "首页", number: "01" },
  { id: "blog", href: "/blog", label: "博客", number: "02" },
  { id: "photography", href: "/photography", label: "摄影", number: "03" },
];

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
    </nav>
  );
}
