import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "../../components/SiteNav";
import { getProject, projects } from "../project-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name} — reflex4`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);

  return (
    <main className="portfolio project-page">
      <div className="paper-frame" aria-hidden="true" />
      <div className="film-strip" aria-hidden="true" />

      <header className="masthead">
        <a className="wordmark" href="/" aria-label="reflex4 首页">
          reflex<span>4</span>
        </a>
        <SiteNav active="projects" activeProject={project.slug} />
        <div className="edition">
          <span>Selected Projects</span>
          <span>File {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        </div>
      </header>

      <article className="project-sheet" aria-labelledby="project-title">
        <header className="project-sheet-header">
          <span>04 / Project File</span>
          <b>Coming soon</b>
        </header>

        <div className="project-sheet-body">
          <p className="project-code">{project.code}</p>
          <div className="project-title-row">
            <span aria-hidden="true">{String(projectIndex + 1).padStart(2, "0")}</span>
            <h1 id="project-title">{project.name}</h1>
          </div>
          <p className="project-description">{project.description}</p>

          <div className="project-status" aria-label="项目页面状态">
            <span>Status</span>
            <strong>内容整理中</strong>
            <p>这里已预留为项目详情页，后续将补充功能介绍、开发过程、截图与版本记录。</p>
          </div>
        </div>

        <nav className="project-switcher" aria-label="项目页面导航">
          <a href="/">← 返回首页</a>
          <div>
            {projects.map((item, index) => (
              <a
                className={item.slug === project.slug ? "is-current" : ""}
                href={`/projects/${item.slug}`}
                aria-current={item.slug === project.slug ? "page" : undefined}
                key={item.slug}
              >
                {String(index + 1).padStart(2, "0")}
              </a>
            ))}
          </div>
        </nav>
      </article>

      <footer className="project-footer">
        <span>reflex4 / Project Archive</span>
        <span>{project.code} · Working record</span>
        <a href="/blog">查看开发记录 ↗</a>
      </footer>
    </main>
  );
}
