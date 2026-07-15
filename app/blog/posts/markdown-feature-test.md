---
title: "Markdown 排版与公式渲染测试"
date: "2026.07.13"
category: "系统测试"
tags: ["MARKDOWN", "LATEX", "CODE", "TEST"]
featured: true
---

这是一篇专门用于检查博客渲染能力的文章。它不是正式内容，而是一张持续可用的**排版试纸**：以后调整正文样式或升级 Markdown 依赖时，可以用它快速发现变化。

## 01 / 文本与多级标题

普通正文应该保持稳定的阅读节奏。这里同时测试 **粗体文字**、*斜体文字*、***粗斜体组合***、~~删除线~~，以及行内代码 `const archive = "reflex4"`。

文字中也可以插入[站内博客链接](/blog)和[外部链接](https://commonmark.org/)。当一句话需要手动换行时，可以在行末保留两个空格。  
这一行应当紧接上一行显示。

### 三级标题：局部章节

三级标题适合组织同一主题下的不同观察。标题层级应清晰，但不能抢过文章主标题。

#### 四级标题：补充说明

四级标题用于更小范围的说明。正文中的转义字符也应正常出现：\*不是斜体\*、\#不是标题。

## 02 / 引用与分隔线

> 好的工具不会替代判断，它只会让判断留下更清楚的痕迹。
>
> 引用块可以包含多个段落，并继续保持纸张档案的视觉语言。

下面是一条水平分隔线。

---

分隔线之后的正文应该重新建立节奏，而不是与上一段粘连。

## 03 / 列表与任务状态

无序列表：

- Markdown 内容源
  - Frontmatter 元数据
  - 正文内容
- React 渲染层
  - GFM 扩展
  - KaTeX 公式
- 页面导航层

有序列表：

1. 新建 `.md` 文件；
2. 填写标题、日期、分类与标签；
3. 编写正文并检查渲染；
4. 构建网站。

任务列表：

- [x] 标题与标签
- [x] Markdown 正文
- [x] 行内与块级公式
- [ ] 后续接入内容管理系统

## 04 / 代码

行内代码适合短命令，例如 `npm run build`。多行代码使用围栏代码块：

```typescript
type BlogPost = {
  slug: string;
  title: string;
  tags: string[];
};

export function findPost(posts: BlogPost[], slug: string) {
  return posts.find((post) => post.slug === slug);
}
```

也可以展示终端或配置内容：

```bash
npm install react-markdown remark-gfm
npm run build
```

## 05 / LaTeX 数学公式

行内公式应该与文字基线自然对齐，例如欧拉恒等式 $e^{i\pi}+1=0$，以及信号的离散采样值 $x[n]$。

独立公式块适合展示较长表达式。离散傅里叶变换定义为：

$$
X[k] = \sum_{n=0}^{N-1} x[n] e^{-i 2\pi kn/N}
$$

高斯分布的概率密度函数为：

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}}
\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

矩阵与分段函数也应该正常排版：

$$
\mathbf{R} =
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix},\qquad
g(x)=
\begin{cases}
x^2, & x \ge 0 \\
-x, & x < 0
\end{cases}
$$

## 06 / 表格

| 特性 | Markdown 写法 | 当前状态 |
| :--- | :---: | ---: |
| 粗体与强调 | `**text**` / `*text*` | 已支持 |
| 代码块 | 三个反引号 | 已支持 |
| GFM 表格 | 竖线与分隔行 | 已支持 |
| LaTeX | `$...$` / `$$...$$` | 已支持 |

## 07 / 图片

下面使用站内已有素材测试 Markdown 图片、替代文本和自适应宽度：

![机器狗多源融合定位项目线框示意](/robot-dog-wireframe.png)

图片之后的正文不应被浮动布局影响。替代文本会在图片无法加载时提供语义说明。

## 08 / 最终检查

如果你能看到清晰的标题层级、强调文本、勾选框、横向可滚动的代码与表格、排版后的数学公式和完整图片，那么常用 Markdown 功能已经接通。
