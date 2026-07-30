export const projects = [
  {
    slug: "macos-photo-manager",
    name: "MacOS 硬盘照片管理软件",
    code: "PHOTO DESK",
    description: "面向 macOS 本地硬盘照片归档与浏览的桌面项目。详细功能与开发记录将在此补充。",
  },
  {
    slug: "rss-reader-m5papercolor",
    name: "RSS Reader for M5Papercolor",
    code: "E-INK RSS",
    description: "面向 M5Papercolor 彩色墨水屏的 RSS 阅读项目。详细功能与开发记录将在此补充。",
  },
] as const;

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
