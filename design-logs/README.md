# 分页设计日志索引

这些日志是页面级的持久设计上下文。它们记录“页面现在是什么”、“哪些决策不能在后续丢失”和“最近发生了什么”。

| 页面 | 路由 | 日志 |
| --- | --- | --- |
| 首页 | `/` | [home.md](./home.md) |
| 博客 | `/blog` 与 `/blog/[slug]` | [blog.md](./blog.md) |
| 摄影 | `/photography` | [photography.md](./photography.md) |
| 项目 | `/projects/[slug]` | [projects.md](./projects.md) |
| 404 | 所有未匹配路由 | [not-found.md](./not-found.md) |

## 使用流程

1. 修改前：阅读 `DESIGN_SYSTEM.md` 和目标页日志。
2. 修改时：遵守日志中的“不可丢失的决策”。
3. 修改后：更新当前状态，追加一条变更记录，注明验收方式。
4. 共享变更：对所有视觉受影响页执行第 3 步。
