"use client";

import { replaceWithBlogParent } from "../navigation";

export function ArticleReturnButton() {
  return (
    <button
      className="article-return-button"
      type="button"
      onClick={replaceWithBlogParent}
      aria-label="返回之前的博客浏览页面"
      title="返回文章列表、分类或搜索"
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}
