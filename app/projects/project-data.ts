export const projects = [
  {
    slug: "macos-photo-manager",
    name: "MacOS 硬盘照片管理软件",
    code: "PHOTO DESK",
    status: "Coming soon",
    description: "面向 macOS 本地硬盘照片归档与浏览的桌面项目。详细功能与开发记录将在此补充。",
  },
  {
    slug: "rss-reader-m5papercolor",
    name: "RSS Reader for M5Papercolor",
    code: "E-INK RSS",
    status: "Case study",
    description: "基于 M5Stack PaperColor 的中文 RSS 阅读器：开机更新，离线阅读，在一块会安静等待的彩色电子纸上留下真正关心的信息源。",
  },
  {
    slug: "arknights-prts-codex-pet",
    name: "明日方舟 PRTS Codex 宠物生成器",
    code: "PET PIPELINE",
    status: "Case study",
    description: "一个将 PRTS 基建动画整理为可验证、可预览，并在明确验收后安装的 Codex Lite/v1 动态宠物 Skill。",
  },
] as const;

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
