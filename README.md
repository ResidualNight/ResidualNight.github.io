# reflex4 portfolio

跨对话的完整项目状态、已确认决策和上线续接步骤见
[`PROJECT_HANDOFF.md`](./PROJECT_HANDOFF.md)。

reflex4 的个人网站，包含全屏首页、Markdown 博客和摄影档案。项目使用
Next.js 的静态导出模式，生产构建只生成可上传至对象存储的 `out/` 目录，
线上不需要 Node.js、数据库或 API 服务器。

## Prerequisites

- Node.js `>=22.13.0`

## 本地开发

```bash
npm install
npm run dev
```

## 静态构建与预览

```bash
npm run build
npm start
```

然后访问 `http://localhost:3000/`。`npm start` 仅用于预览已经生成的 `out/`，
不会启动应用服务器。

生产发布时上传 `out/` 的内容，并将对象存储的默认首页设置为 `index.html`、
错误页设置为 `404.html`。目录末尾保留斜杠，以匹配 `blog/index.html` 和
`blog/<slug>/index.html` 的结构。

博客文章位于 `app/blog/posts/`。Markdown、分类、标签、全文搜索索引和文章
详情都在构建时生成；定时文章只有在下一次本地构建并发布后才会正式上线。

Motion Lab 的源码保留在 `app/motion-lab/`，但入口特意命名为
`page.experimental.tsx`，因此它不会成为公开路由或进入静态导出。需要继续实验时，
临时将它改名为 `page.tsx`；正式构建前必须恢复实验文件名。

## Useful Commands

- `npm run dev`：本地开发
- `npm run build`：生成纯静态 `out/`
- `npm start`：预览静态目录
- `npm test`：重新构建并检查所有核心静态路由
