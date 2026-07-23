# reflex4 个人网站：项目交接与续接上下文

> 最后核对日期：2026-07-23  
> 项目目录：`/Users/reflex4/Documents/个人网站`  
> 用途：在新建 Codex 对话后快速恢复项目目标、已确认决策、当前实现和上线进度。

## 1. 新对话的读取顺序

开始工作前依次读取：

1. `AGENTS.md`：项目级强制规则和验收方式。
2. 本文件 `PROJECT_HANDOFF.md`：跨对话总体状态。
3. `DESIGN_SYSTEM.md`：任何可见页面改动的唯一设计依据。
4. 对应页面日志：`design-logs/home.md`、`design-logs/blog.md` 或
   `design-logs/photography.md`。
5. 博客内容相关任务再读取 `app/blog/AUTHORING.md`。

不要只依赖本文件代替页面日志。本文件负责总体路线，页面日志负责最新细节。

## 2. 最终目标

完成个人网站从本地开发到中国境内服务上线的完整流程，并在上线稳定后开发一款
仅在这台 Mac 上运行的可视化内容管理与发布软件。

网站既是本科阶段的兴趣作品，也会作为求职附加作品集，需要体现个人履历、工程能力、
摄影、设计和音乐风格。

公开身份统一使用 `reflex4`。不得公开真实姓名、手机号、邮箱或简历中的其他私人信息。

## 3. 已确认的产品范围

### 三个核心公开页面

- 首页 `/`
  - 风格化个人介绍。
  - 全屏章节结构，鼠标滚轮只负责在章节之间切换。
  - 01 About：昵称和 brief。
  - 02 Research：科研经历、教育、项目和荣誉。
  - 03 Art & Sound：设计作品与原创音乐。
- 博客 `/blog` 与 `/blog/[slug]`
  - Markdown 文件作为唯一内容源。
  - 支持分类、Tag、全文搜索、文章详情和上下篇。
  - 当前更新方式是本地构建后上传，不需要线上后台。
- 摄影 `/photography`
  - 时间轴式照片组档案。
  - 缩略图与原图双资源。
  - 大图查看、组内切换、EXIF 展示预留。
  - 年份筛选和“年度照片”仍待实现。

### 明确暂缓的能力

- 公开的隐藏后台：暂缓。静态方案不需要线上管理入口，避免额外鉴权和攻击面。
- 本地可视化管理软件：网站成功上线后再开发。
- Motion Lab：仅保留为源码实验，不属于公开网站。

## 4. 用户偏好与协作规则

- 年度费用要适合本科生兴趣项目，流量预计不大。
- 需要付款时不要替用户直接下结论；先让用户提供厂商实际优惠和套餐截图，再比较。
- 域名已在阿里云购买，托管、存储、CDN 等优先使用中国境内服务网站。
- Docker Desktop 已安装并成功运行 `hello-world`；用户已授权为本项目管理本地开发容器。
  当前静态 Next.js 工作流不依赖 Docker，除非后续管理软件或工具链确有必要。
- 现有页面的小幅视觉细节调整完成后直接交给用户手动检查，不进行浏览器截图和重复视觉 QA。
- 新页面、新全屏章节、重大改版或新交互流程必须由代理完成一轮布局、响应式、交互、
  设计一致性、减少动效和构建自检。
- 用户曾明确要求：涉及视觉交互检查时说明需要他检查即可，不要为了这类检查浪费时间打开浏览器。
- 每次页面修改必须同步更新对应 `design-logs/*.md`。

## 5. 统一视觉方向

视觉语言已确定为“复古独立杂志 + 撞色印刷”，具体规则以 `DESIGN_SYSTEM.md` 为准。

核心色板：

| 角色 | 色值 |
| --- | --- |
| 纸张底色 | `#EEE4CF` |
| 深纸色 | `#DFD1B5` |
| 印刷墨黑 | `#24241F` |
| 编辑酒红 | `#7E2736` |
| 档案墨绿 | `#24463B` |
| 铁锈橙 | `#BB5D35` |

不得擅自加入霓虹色、现代 SaaS 卡片语言、圆角卡片墙或新的字体家族。顶级
Home / Blog / Photography 导航必须保持原生文档链接，不能改为客户端路由链接。

## 6. 当前技术架构

- Next.js `16.2.6`，App Router。
- React `19.2.6`，TypeScript。
- GSAP 用于动效。
- `react-markdown`、GFM、KaTeX 用于博客正文。
- Node.js 要求 `>=22.13.0`。
- 生产模式为纯静态导出：`next.config.ts` 中启用 `output: "export"`。
- `trailingSlash: true`，输出目录结构适合对象存储的 `index.html`。
- `images.unoptimized: true`，线上不依赖 Next.js 图片优化服务器。
- 构建脚本固定使用 `next build --webpack`。
- 最终发布目录为 `out/`，线上不需要 Node.js、API、数据库或容器。

旧的 Vinext、Vite、Cloudflare Worker、D1、Drizzle 和 Sites 托管配置已经移除，
不要无意恢复这些旧架构。

## 7. 静态改造完成情况

已完成：

- 首页、博客、摄影、404 和所有公开博客文章均可静态生成。
- Markdown 改为构建期通过文件系统读取。
- 博客全文索引在构建期生成，搜索在浏览器本地完成，不请求 API。
- 草稿和未到发布时间的文章不会进入公开列表、搜索和详情。
- 删除旧的博客搜索 API。
- `motion-lab` 的入口是 `app/motion-lab/page.experimental.tsx`，不是公开路由。
- Motion Lab 的 3.4 MB 分享图已移出 `public/`，不会被无意义复制到 `out/`。
- 自动测试会确认 `out/motion-lab/index.html` 和公开 Motion Lab 分享图不存在。

Motion Lab 若需临时运行，可将 `page.experimental.tsx` 改名为 `page.tsx`；正式构建前
必须恢复实验文件名。

最后一次验证结果：

- `npm test` 通过。
- `npm run lint` 通过。
- 静态构建共生成 13 个页面单元，包括三个核心页面、404 和 8 篇文章。
- 构建路由中不存在 `/motion-lab`。
- 没有按用户要求进行浏览器视觉检查。

## 8. 当前三个页面的状态

### 首页

- 三个全屏吸附章节已经完成第一版。
- 背景具有缓慢向上移动的纸张颗粒效果。
- 首次进入有 1.5 秒双向汇合加载过场。
- 顶部包含 Home / Blog / Photography。
- Art & Sound 有作品占位和一首《Lost in thought》音乐播放器。
- 后续主要工作是用真实视觉作品替换占位内容。

### 博客

- 已有文章归档、分类、Tag、搜索、详情和返回层级。
- 当前包含 8 个公开 Markdown 文件，其中包括综合语法测试文章。
- 写作和上传规则见 `app/blog/AUTHORING.md`。
- 新文章放入 `app/blog/posts/`，构建时自动进入公开索引。
- 当前搜索索引会随博客页面交给浏览器；文章数量达到数百篇或正文总体积明显增大时，
  再评估分页或拆分为单独静态 JSON。

### 摄影

- 页面优先使用 `archive.generated.json` 的真实照片组，数据为空时回退到照片组占位。
- 时间轴仅加载 `thumbnailSrc`，大图查看时才使用 `originalSrc`。
- 有相机、镜头、光圈、快门、ISO、焦距六项 EXIF 预留。
- 质量偏好保存在浏览器本机，默认使用压缩图。
- Lightroom JPG 本地压缩与导入脚本已通过首个三图真实照片组验证并接入页面；年份索引和年度照片功能尚未接入。

## 9. 已确认的照片处理方案

用户会先在 Lightroom 中完成风格化处理并导出 JPG，再交给当前脚本或未来的本地管理软件处理。
这样比让软件直接解析和渲染 Sony RAW 简单、稳定，也更容易保证 Lightroom 调色结果一致。

计划输出两级图片：

- 高清展示图：目标控制在 5 MB 以内，作为 `originalSrc`。
- 时间轴缩略图：目标控制在 1 MB 以内，作为 `thumbnailSrc`。

当前过渡工作流已实现为 `npm run photos:build`：读取本机 `photography-source/` 中按组整理的
Lightroom JPG，自动校正方向、生成 1600px 缩略图与 3840px 高清图、提取六项 EXIF，输出到
`public/photography/` 并更新 `app/photography/archive.generated.json`。源图目录被 Git 忽略；详细规则见
`app/photography/IMPORTING.md`。脚本生成的网页图片在 GitHub Pages 预览阶段仍会进入公开仓库，
作品数量明显增加前应迁往 OSS，避免 Git 历史持续膨胀。

未来本地管理软件可负责：

1. 批量导入 Lightroom JPG。
2. 读取并整理 EXIF。
3. 生成两级尺寸和压缩质量。
4. 生成摄影页需要的静态数据文件。
5. 执行静态构建。
6. 将新增内容和构建产物上传到对象存储。

照片数量较多时，网页本身仍可以保持静态；图片文件应放在对象存储/图床并通过 CDN
按需加载，不要把大量高清照片全部打进代码仓库或首屏请求。

## 10. 分阶段上线方向与成本原则

2026-07-14 已确认采用分阶段路线：先使用 GitHub Pages 进行公开效果预览，确认页面和访问体验后，
再决定何时迁移到阿里云中国内地服务。Git 是项目源码和版本历史的长期管理方式，GitHub Pages
只是一个部署目标；以后关闭 Pages 或迁移托管平台，不影响继续使用 Git 或 GitHub 仓库管理项目。

当前预览阶段：

```text
本地 Markdown / 照片数据
        ↓
Git 仓库
        ↓
GitHub Actions 静态构建
        ↓
GitHub Pages 效果预览
```

GitHub 预览配置（2026-07-15）：

- 公开源码与 Pages 仓库：`ResidualNight/ResidualNight.github.io`。
- 默认预览地址：`https://residualnight.github.io/`。
- 当前网站源码使用 `main` 分支，推送后由 `.github/workflows/deploy-pages.yml` 自动执行
  lint、静态构建测试并发布 `out/`。
- 初始源码提交为 `f8fab38`；GitHub Actions 首次部署已成功，Pages 状态为 `built`，
  公开地址已核对为新站内容。
- 被替换的旧 Pages 网站已完整镜像到私有仓库
  `ResidualNight/ResidualNight.github.io-archive-2026-07-15`；不要将该备份改为公开仓库。
- 公开仓库的旧 `master` 分支已在部署成功后删除，旧站只保留在私有归档中。
- 预览阶段不绑定 `reflex4.top`，域名保留给后续阿里云正式环境。

未来阿里云生产方向：

```text
Git 仓库
    ↓
Next.js 构建
    ↓
阿里云 ECS + Nginx
    ├── 首版继续托管静态 out/
    ├── 确有需求时运行 Next.js Node 服务和轻量 API
    └── 图片、音乐增多后接入 OSS，并按流量需要启用 CDN
```

阿里云备案要求长期关联中国内地服务器。当前候选是经济型 e ECS：2 vCPU、2 GiB 内存、
40 GiB ESSD Entry、3 Mbps 固定带宽，页面显示首年 99 元。购买前仍需确认中国内地地域、
公网 IPv4 和续费价格。服务器并不意味着必须立即放弃静态导出；首版继续静态部署更简单、
稳定且攻击面更小，动态能力只在出现评论、表单、登录、自动发布或共享数据等明确需求时增加。

成本原则：

- GitHub Pages 预览阶段的托管费为零，域名是否绑定到预览站另行决定。
- 阿里云生产阶段先使用 ECS 套餐内的固定带宽，不立即购买 OSS、CDN、数据库或额外磁盘。
- 真实摄影和音频资源明显增加后，再使用 OSS 按量付费；连续观察真实账单后再决定资源包或 CDN。
- 域名续费、ECS 续费和任何套餐均以账号结算页实际价格为准，不以首年促销价推断长期成本。

## 11. 当前上线阻塞信息

当前已确认：

- 正式域名为 `reflex4.top`，域名实名认证已成功。
- 用户当前先使用 GitHub Pages 进行效果预览，未来再考虑阿里云正式生产环境。
- 阿里云备案尚未完成；使用阿里云中国内地生产环境前需要购买或关联符合备案要求的服务器。
- 已找到首年 99 元的 2 vCPU / 2 GiB 经济型 e ECS 候选，含 40 GiB 系统盘和 3 Mbps 固定带宽。
- GitHub 账号为 `ResidualNight`，公开 Pages 仓库为 `ResidualNight/ResidualNight.github.io`。
- 旧 Pages 仓库历史已镜像至私有归档仓库
  `ResidualNight/ResidualNight.github.io-archive-2026-07-15`，镜像提交与原 `master` 一致。
- 当前源码隐私扫描未发现密钥、私人邮箱、电话号码、私钥或超大文件；提交身份使用公开昵称
  `reflex4` 和 GitHub noreply 邮箱。
- Git 初始基线、远程 `main`、Pages Actions 发布源和首次线上部署均已完成。

以下信息尚未确认：

- ECS 候选实例的最终中国内地地域、公网 IPv4 和第二年续费价格。
- 真实照片接入后的 OSS 容量、流量和 CDN 需求。

不要依据历史价格替用户购买；付款前让用户提供结算页和续费规则截图再确认。

## 12. 推荐的后续执行顺序

### 阶段 A：Git 基线与 GitHub Pages 预览

1. 已完成源码隐私与大文件扫描。
2. 已完整备份旧 Pages 仓库到私有归档仓库。
3. 已确定公开源码仓库、默认预览地址与 Actions 发布方式。
4. 已将当前源码建立 Git 初始基线并推送到 `main`。
5. 已将 Pages 发布源切换到 GitHub Actions，确认部署成功并删除旧 `master` 分支。
6. 下一步由用户手动检查首页吸附与音频、博客搜索/返回、摄影大图与质量切换，
   并请中国内地朋友反馈首次打开速度与资源加载情况。

### 阶段 B：正式上线前生产配置

1. 核对并设置全站正式 `metadataBase` / `NEXT_PUBLIC_SITE_URL`。
2. 检查标题、描述、favicon、分享图和 404。
3. 讨论是否增加 `robots.txt` 与 `sitemap.xml`。
   - 注意：当前 `design-logs/blog.md` 记录了“不开发额外 sitemap 管线”的旧决定。
   - 若上线 SEO 需要改变它，先与用户确认并同步更新日志，不要直接覆盖既有决策。
4. 再执行 `npm test` 与 `npm run lint`。

### 阶段 C：备案与阿里云 ECS

1. 用户提供 ECS 最终结算页和续费规则截图。
2. 确认中国内地地域、包年包月、公网 IPv4、固定公网带宽和续费成本后再购买。
3. 使用符合条件的 ECS 提交 ICP 备案。
4. 备案完成后配置 Linux、最小开放端口、Nginx、HTTPS、日志和备份。
5. 首版由 Nginx 直接托管静态 `out/`，不为了已有服务器而立即重写为动态站点。

### 阶段 D：阿里云首次发布与验收

1. 运行 `npm run build`。
2. 上传 `out/` 内的内容到 ECS 的发布目录，而不是上传 `out` 文件夹本身作为额外目录层。
3. 验证 `/`、`/blog/`、文章目录、`/photography/` 和不存在页面。
4. 手动检查首页吸附与音频、博客搜索/返回、摄影大图与质量切换。
5. 为 HTML、带 hash 的 `_next/static` 文件和照片分别制定 Nginx 缓存策略。
6. 记录第一次可回滚的发布版本。

### 阶段 E：OSS、CDN 与动态能力

1. 真实照片、音乐或下载流量明显增加后，再创建 OSS Bucket 并从按量付费开始。
2. 优先将媒体资源迁往 OSS；需要更高并发或更低分发成本时再启用 CDN。
3. 出现明确服务端需求时，再评估将 `output: "export"` 改为 Node.js/standalone 部署。
4. 2 GiB ECS 初期只运行 Nginx、一个 Node 进程和必要的轻量数据服务；不要堆叠数据库、
   Redis、管理面板和多套容器。

### 阶段 F：本地内容管理软件

上线稳定后再设计。首版只在 Mac 本地运行，不需要公开后台。优先能力：文章导入、照片处理、
EXIF、构建日志、发布预览、一键上传和失败回滚。

## 13. 常用命令

```bash
cd /Users/reflex4/Documents/个人网站

# 首次或依赖变化后
npm install

# 动态开发服务器
npm run dev

# 生成纯静态 out/
npm run build

# 用本机静态服务器预览 out/
npm start

# 完整静态构建与路由测试
npm test

# 代码规范检查
npm run lint
```

本地静态预览地址为 `http://localhost:3000/`。

## 14. 重要文件索引

| 文件/目录 | 作用 |
| --- | --- |
| `AGENTS.md` | 强制项目规则 |
| `DESIGN_SYSTEM.md` | 全局视觉与交互规范 |
| `design-logs/` | 每个页面的持久设计上下文 |
| `README.md` | 当前开发与构建命令 |
| `next.config.ts` | 静态导出配置 |
| `app/page.tsx` | 首页结构 |
| `app/globals.css` | 主要全站和页面样式 |
| `app/blog/posts/` | Markdown 内容源 |
| `app/blog/AUTHORING.md` | Markdown 作者规范 |
| `app/photography/` | 摄影页结构与交互 |
| `app/photography/IMPORTING.md` | Lightroom JPG 分组、压缩、检查与发布规则 |
| `scripts/process-photography.mjs` | 双规格图片压缩、EXIF 提取和摄影页数据生成 |
| `app/motion-lab/` | 不发布的实验源码 |
| `tests/static-export.test.mjs` | 静态发布防回归测试 |
| `out/` | 构建产物；上传源，通常不提交 Git |

## 15. 已知技术与仓库状态

- 最近一次 `npm install` 的依赖审计曾报告 1 个低危和 3 个中危问题；构建不受影响，
  上线前应查看具体依赖链，不要直接执行破坏性 `audit fix --force`。
- `out/` 当前约十几 MB，音乐文件是较大的现有资源之一；真实摄影接入后，照片应迁往 OSS。
- Git 已建立正常基线并关联公开仓库 `ResidualNight/ResidualNight.github.io` 的 `main` 分支；
  推送后由 GitHub Actions 自动构建与发布。
- Git 是长期源码管理工具，与 GitHub Pages、阿里云 ECS、OSS 或其他托管平台相互独立。
  即使未来关闭 GitHub Pages，仍应继续用 Git 管理分支、提交、回滚和发布版本。
- GitHub Pages 当前只作为效果预览目标；阿里云生产环境确定后可以保留、停用或改为预览分支。
- 定时文章只有在计划时间之后再次本地构建并上传，才会真正出现在静态网站。
- 不要把 `.next/` 当作发布目录，正式发布只使用 `out/`。

## 16. 新对话建议开场指令

可将下面这段直接发给新的 Codex 对话：

```text
请先完整阅读项目根目录的 AGENTS.md、PROJECT_HANDOFF.md 和 DESIGN_SYSTEM.md。
这是 reflex4 个人网站从开发到上线的延续任务。当前三个核心页面已经完成第一版并改造成
Next.js 纯静态导出，motion-lab 不参与发布。Git 基线与 GitHub Pages 效果预览已经建立；
未来阿里云路线为 ECS + Nginx，媒体增多后再接入 OSS/CDN，有明确需求后才增加动态服务。
请根据 PROJECT_HANDOFF.md 的“当前上线阻塞信息”与“推荐的后续执行顺序”继续，不要重复已完成的
静态改造。涉及页面修改时，还要完整阅读对应的 design-logs 页面日志并同步更新。小型视觉细节
交给我手动检查，新页面或新交互流程由你完成一轮自检。
```
