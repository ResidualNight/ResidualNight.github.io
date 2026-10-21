export const projects = [
  {
    slug: "macos-photo-manager",
    category: "project",
    name: "MacOS 硬盘照片管理软件",
    code: "PHOTO DESK",
    status: "Coming soon",
    description: "面向 macOS 本地硬盘照片归档与浏览的桌面项目。详细功能与开发记录将在此补充。",
  },
  {
    slug: "rss-reader-m5papercolor",
    category: "project",
    name: "RSS Reader for M5Papercolor",
    code: "E-INK RSS",
    status: "Case study",
    description: "基于 M5Stack PaperColor 的中文 RSS 阅读器：开机更新，离线阅读，在一块会安静等待的彩色电子纸上留下真正关心的信息源。",
  },
  {
    slug: "arknights-prts-codex-pet",
    category: "tool",
    name: "明日方舟 PRTS Codex 宠物生成器",
    code: "PET PIPELINE",
    status: "Case study",
    description: "一个将 PRTS 基建动画整理为可验证、可预览，并在明确验收后安装的 Codex Lite/v1 动态宠物 Skill。",
  },
  {
    slug: "quadruped-inspection",
    category: "project",
    name: "四足机器人巡检系统",
    code: "QUADRUPED",
    status: "Engineering notes",
    description: "面向自主巡检的四足机器人实验平台，记录 reflex4 参与的硬件搭建、多源感知与团队定位导航工程的验证边界。",
  },
  {
    slug: "quotadock",
    category: "tool",
    name: "QuotaDock · Codex 额度显示器",
    code: "QUOTA DOCK",
    status: "开发预览",
    description: "一个原生 macOS Codex 额度显示器。把余量放在刘海旁或屏幕边缘，悬停看概况，点击看详情，也能查看重置提醒与本地趋势。",
  },
] as const;

export type ProjectSlug = (typeof projects)[number]["slug"];

export const menuProjects = projects.filter((project) => project.category === "project");
export const utilityProjects = projects.filter((project) => project.category === "tool");

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
