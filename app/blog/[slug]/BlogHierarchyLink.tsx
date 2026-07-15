"use client";

import type { ReactNode } from "react";
import { pushCurrentBlogLocation } from "../navigation";

export function BlogHierarchyLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} onClick={pushCurrentBlogLocation}>
      {children}
    </a>
  );
}
