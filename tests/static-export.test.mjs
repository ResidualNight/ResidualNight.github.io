import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const outRoot = new URL("../out/", import.meta.url);

async function readOutput(path) {
  return readFile(new URL(path, outRoot), "utf8");
}

function readFrontmatterScalar(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, "mu"));
  if (!match) return undefined;
  try {
    return JSON.parse(match[1]);
  } catch {
    return match[1];
  }
}

function isPublishedSource(source, now = Date.now()) {
  if (readFrontmatterScalar(source, "draft") === true) return false;
  const value = readFrontmatterScalar(source, "publishAt")
    ?? readFrontmatterScalar(source, "date");
  if (typeof value !== "string") return false;
  const timestamp = /^\d{4}[.-]\d{2}[.-]\d{2}$/u.test(value)
    ? Date.parse(`${value.replaceAll(".", "-")}T00:00:00+08:00`)
    : Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= now;
}

async function collectHtmlFiles(directory = outRoot, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(new URL(`${entry.name}/`, directory), relativePath));
    } else if (entry.name.endsWith(".html")) {
      files.push(relativePath);
    }
  }
  return files;
}

test("exports the core pages, project pages, and a static error page", async () => {
  await Promise.all([
    access(new URL("index.html", outRoot)),
    access(new URL("blog/index.html", outRoot)),
    access(new URL("photography/index.html", outRoot)),
    access(new URL("projects/macos-photo-manager/index.html", outRoot)),
    access(new URL("projects/rss-reader-m5papercolor/index.html", outRoot)),
    access(new URL("projects/arknights-prts-codex-pet/index.html", outRoot)),
    access(new URL("projects/quadruped-inspection/index.html", outRoot)),
    access(new URL("projects/arknights-prts-codex-pet/ceobe-walk-right-strip.png", outRoot)),
    access(new URL("404.html", outRoot)),
  ]);

  const [home, blog, photography, photoManager, rssReader, arknightsPet] = await Promise.all([
    readOutput("index.html"),
    readOutput("blog/index.html"),
    readOutput("photography/index.html"),
    readOutput("projects/macos-photo-manager/index.html"),
    readOutput("projects/rss-reader-m5papercolor/index.html"),
    readOutput("projects/arknights-prts-codex-pet/index.html"),
  ]);

  assert.match(home, /reflex4/);
  assert.match(home, /MacOS 硬盘照片管理软件/);
  assert.match(home, /RSS Reader for M5Papercolor/);
  assert.match(blog, /Writing Archive/);
  assert.match(photography, /Light \/ Time \/ Observation/);
  assert.match(photoManager, /MacOS 硬盘照片管理软件/);
  assert.match(photoManager, /内容整理中/);
  assert.match(rssReader, /RSS Reader for M5Papercolor/);
  assert.match(rssReader, /先从五条新闻看起/);
  for (const name of ["desktop", "list", "buttons"]) {
    assert.match(rssReader, new RegExp(`/projects/rss-reader/${name}-1600\\.webp`));
    await access(new URL(`projects/rss-reader/${name}-800.webp`, outRoot));
    await access(new URL(`projects/rss-reader/${name}-1600.webp`, outRoot));
  }
  assert.doesNotMatch(rssReader, /PHOTO SLOT 0[123]/);
  assert.match(rssReader, /背面视角/);
  assert.match(rssReader, /PHOTO SLOT 04/);
  const petHeading = arknightsPet.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/u)?.[1];
  assert.ok(petHeading, "pet project must have a main heading");
  assert.match(petHeading.replace(/<[^>]*>/gu, ""), /把 PRTS 基建动画/);
  assert.match(arknightsPet, /1536 × 1872/);
  assert.match(arknightsPet, /非官方个人项目/);
  assert.match(arknightsPet, /nine-state-preview\.png/);
  assert.match(arknightsPet, /final-atlas-checkerboard\.jpg/);
  assert.match(arknightsPet, /move-left-right-loop\.gif/);
  assert.match(arknightsPet, /ceobe-deskpet/);
  assert.doesNotMatch(blog, /\/api\/blog\/search/);
});

test("exports every currently published Markdown article as a directory index", async () => {
  const postFiles = (await readdir(new URL("../app/blog/posts/", import.meta.url)))
    .filter((fileName) => fileName.endsWith(".md"));
  const exportedArticles = (await readdir(new URL("blog/", outRoot), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== "_next")
    .map((entry) => entry.name);

  for (const fileName of postFiles) {
    const source = await readFile(new URL(`../app/blog/posts/${fileName}`, import.meta.url), "utf8");
    if (!isPublishedSource(source)) continue;

    const slug = fileName.replace(/\.md$/u, "");
    assert.ok(exportedArticles.includes(slug), `missing static article: ${slug}`);
    const html = await readOutput(`blog/${slug}/index.html`);
    assert.match(html, /article-shell/);
  }
});

test("every root-relative HTML link and asset resolves inside the static export", async () => {
  const htmlFiles = await collectHtmlFiles();
  const missing = [];

  for (const htmlPath of htmlFiles) {
    const html = await readOutput(htmlPath);
    const references = html.matchAll(/\b(?:href|src)="(\/[^"]*)"/gu);
    for (const [, rawReference] of references) {
      const pathname = decodeURIComponent(new URL(rawReference, "https://reflex4.invalid").pathname);
      const relativePath = pathname.replace(/^\/+/, "");
      const target = relativePath === ""
        ? new URL("index.html", outRoot)
        : path.posix.extname(relativePath)
          ? new URL(relativePath, outRoot)
          : new URL(`${relativePath.replace(/\/$/u, "")}/index.html`, outRoot);
      try {
        await access(target);
      } catch {
        missing.push(`${htmlPath}: ${rawReference}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("contains browser assets but no deployable server runtime", async () => {
  await access(new URL("_next/static/", outRoot));
  await assert.rejects(access(new URL("server/", outRoot)));
  await assert.rejects(
    access(new URL("motion-lab/index.html", outRoot)),
    undefined,
    "Motion Lab is an internal experiment and must not be published",
  );
  await assert.rejects(access(new URL("og-motion-lab.png", outRoot)));

  const nextConfig = await readFile(new URL("next.config.ts", projectRoot), "utf8");
  assert.match(nextConfig, /output:\s*["']export["']/);
  assert.match(nextConfig, /trailingSlash:\s*true/);
});

test("utility projects are reached through the tools directory instead of the main menu", async () => {
  const utilitySlugs = ["arknights-prts-codex-pet", "quotadock"];
  const tools = await readOutput("tools/index.html");
  for (const slug of utilitySlugs) {
    assert.match(tools, new RegExp(`href="/projects/${slug}"`));
    const detail = await readOutput(`projects/${slug}/index.html`);
    assert.match(detail, /href="\/tools">返回实用工具<\/a>/);
    assert.match(detail, /href="\/tools" aria-current="location"/);
  }
  for (const page of ["index.html", "blog/index.html", "photography/index.html", "tools/index.html", ...utilitySlugs.map((slug) => `projects/${slug}/index.html`)]) {
    const html = await readOutput(page);
    const menus = [...html.matchAll(/<nav\b[^>]*aria-label="主导航"[\s\S]*?<\/nav>/gu)];
    assert.ok(menus.length, `missing main navigation: ${page}`);
    for (const [menu] of menus) {
      const destinations = [...menu.matchAll(/href="([^"]+)"/gu)].map((match) => match[1]);
      assert.equal(destinations.at(-1), "/tools");
      for (const slug of utilitySlugs) assert.ok(!destinations.includes(`/projects/${slug}`));
    }
  }
});

test("inspection archive has working chapter anchors and no unapproved source assets", async () => {
  const html = await readOutput("projects/quadruped-inspection/index.html");
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/gu)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/\bhref="#([^"]+)"/gu)) {
    assert.ok(ids.has(target), `missing inspection anchor: ${target}`);
  }
  assert.match(html, /reflex4 · 硬件搭建/);
  assert.match(html, /完整任务链路仍需联调验证/);
  assert.match(html, /非设备实拍/);
  assert.match(html, /不是实测轨迹/);
  assert.doesNotMatch(html, /(?:href|src)="[^"]*\.(?:pdf|bag|pcd)(?:[?#"][^"]*)?/iu);
  assert.doesNotMatch(html, /\/Users\/|mailto:|tel:/u);
  const nav = html.match(/<nav\b[^>]*aria-label="主导航"[\s\S]*?<\/nav>/u)?.[0];
  assert.ok(nav);
  assert.match(nav, /href="\/projects\/quadruped-inspection" aria-current="page"/u);
});
